import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const appDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.resolve(appDir, "../../jany-dzialki/dist/public");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use("/api", router);

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || !["GET", "HEAD"].includes(req.method)) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

export default app;
