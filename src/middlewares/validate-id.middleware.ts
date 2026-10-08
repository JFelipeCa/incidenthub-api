import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const validateId = (req: Request, _res: Response, next: NextFunction): void => {
  const { id } = req.params;
  const numId = Number(id);

  if (!id || !/^\d+$/.test(id) || numId <= 0) {
    throw new AppError(400, "Invalid incident id");
  }

  next();
};