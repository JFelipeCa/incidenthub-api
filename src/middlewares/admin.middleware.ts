import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const adminMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    throw new AppError(403, "Forbidden: admin only");
  }

  next();
};