import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  if (token === "instructor-token") {
    req.user = { role: "admin" };
    return next();
  }

  if (token === "technician-token") {
    req.user = { role: "technician" };
    return next();
  }

  throw new AppError(401, "Unauthorized");
};