import express, { Request, Response, NextFunction } from "express";
import oidcRoutes from "./routes/oidc";
import { ApiError } from "./shared/classes";
import cors from "cors";

const app = express();
// app.use(cors());
app.use(express.json());

// Routers defined
app.use("/api/v1/oidc", oidcRoutes);

// Catch-all for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.originalUrl}`,
    },
  });
});

// Global error middleware
app.use(
  (err: Error | ApiError, _: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;

    res.status(statusCode).json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });

    next(err);
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Odin Gateway API service running on port ${PORT}`);
});
