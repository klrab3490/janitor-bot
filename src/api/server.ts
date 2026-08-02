import express from "express";
import type { Container } from "../container";
import { createApiRouter } from "./routes";
import { errorHandler } from "../middleware/errorHandler";
import { env } from "../config/env";
import { logger } from "../logger";

export function startApiServer(container: Container): void {
  const app = express();
  app.use(express.json());
  app.use("/api", createApiRouter(container));
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    logger.info("API server listening", { port: env.PORT });
  });
}
