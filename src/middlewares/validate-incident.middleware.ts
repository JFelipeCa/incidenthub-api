import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const validateIncident = (req: Request, _res: Response, next: NextFunction): void => {
  const body = req.body ?? {};
  const { title, description, location, priority, estimatedMinutes, reporter } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new AppError(400, "Title is required and must be a non-empty string");
  }

  if (!description || typeof description !== "string" || description.trim() === "") {
    throw new AppError(400, "Description is required and must be a non-empty string");
  }

  if (!location || typeof location !== "string" || location.trim() === "") {
    throw new AppError(400, "Location is required and must be a non-empty string");
  }

  if (req.method === "POST") {
    if (!reporter || typeof reporter !== "string" || reporter.trim() === "") {
      throw new AppError(400, "Reporter is required and must be a non-empty string");
    }
  }

  if (priority === undefined || priority === null) {
    throw new AppError(400, "Priority is required");
  }

  if (estimatedMinutes === undefined || estimatedMinutes === null) {
    throw new AppError(400, "Estimated minutes is required");
  }

  next();
};