import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
    return;
  }

  // Error genérico del servidor si no es un AppError
  console.error("Unexpected Error:", err);
  res.status(500).json({
    ok: false,
    message: "Internal server error"
  });
};