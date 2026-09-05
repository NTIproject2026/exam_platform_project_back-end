import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";

export function validate(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return res.status(400).json({ status: 400, errors });
    }

    req.body = value;
    next();
  };
}