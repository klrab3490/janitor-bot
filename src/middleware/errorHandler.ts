import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  logger.error("Unhandled API error", { error: err });
  res.status(500).json({ error: "internal_server_error" });
}
