import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const validateId = (req: Request, _res: Response, next: NextFunction): void => {
  const id = String(req.params.id);
  const numId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(numId) || numId <= 0) {
    throw new AppError(400, "Invalid incident id");
  }

  next();
};