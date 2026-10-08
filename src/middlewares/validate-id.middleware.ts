import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const validateId = (req: Request, _res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !/^\d+$/.test(id) || Number(id) <= 0) {
    throw new AppError(400, "Invalid incident id");
  }

  next();
};