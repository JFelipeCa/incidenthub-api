import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const validateTime = (req: Request, _res: Response, next: NextFunction): void => {
  const body = req.body ?? {};
  const { estimatedMinutes, priority } = body;

  if (typeof estimatedMinutes !== "number" || isNaN(estimatedMinutes) || estimatedMinutes <= 0 || estimatedMinutes > 480) {
    throw new AppError(400, "Estimated minutes must be a positive number greater than 0 and at most 480");
  }

  // Regla Reto 4: Incidentes críticos no pueden superar los 60 minutos
  if (priority === "CRITICAL" && estimatedMinutes > 60) {
    throw new AppError(400, "Critical incidents cannot have an estimated time exceeding 60 minutes");
  }

  next();
};