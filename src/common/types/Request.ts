declare global {
  namespace Express {
    interface Request {
      user?: any;
      decoded?: any;
    }
  }
}

export {};
