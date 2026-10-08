import { Request, Response, NextFunction } from "express";

export const requestInfoMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  req.requestInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
  };
  next();
};