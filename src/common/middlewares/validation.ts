import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  headers?: Joi.ObjectSchema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schemaKeys: (keyof ValidationSchema)[] = ['body', 'query', 'params', 'headers'];
    
    const schemaValidation: Record<string, any> = {};
    const reqObject: Record<string, any> = {};

    // Dynamically pick the keys defined in the schema
    schemaKeys.forEach(key => {
      if (schema[key]) {
        schemaValidation[key] = schema[key];
        reqObject[key] = req[key];
      }
    });

    // Validate the whole object at once. 
    // abortEarly: true makes sure we get only the FIRST error.
    const { value, error } = Joi.object(schemaValidation).validate(reqObject, { abortEarly: true });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message.replace(/"/g, "")) // Strip the Joi double quotes
        .join(", ");
        
      // Send the response immediately, bypassing the global error handler
      return res.status(400).json({ 
        message: errorMessage 
      });
    }

    // Assign the validated (and potentially default-casted) values back to the request object
    Object.keys(value).forEach(key => {
      if (req[key as keyof Request] && typeof req[key as keyof Request] === 'object') {
        Object.assign(req[key as keyof Request], value[key]);
      } else {
        (req as any)[key] = value[key];
      }
    });
    next();
  };
};
