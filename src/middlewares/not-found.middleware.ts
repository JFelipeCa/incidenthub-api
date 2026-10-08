import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const notFoundMiddleware = (req: Request, _res: Response, _next: NextFunction): void => {
  throw new AppError(404, "Route not found");
};