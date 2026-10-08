import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { IncidentPriority } from "../models/incident.model";

const VALID_PRIORITIES: IncidentPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const validatePriority = (req: Request, _res: Response, next: NextFunction): void => {
  const body = req.body ?? {};
  const { priority } = body;

  if (!VALID_PRIORITIES.includes(priority)) {
    throw new AppError(400, "Invalid priority. Must be LOW, MEDIUM, HIGH, or CRITICAL");
  }

  next();
};