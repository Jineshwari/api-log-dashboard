import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

import anomaliesRouter from "./routes/anomalies.js";
import logsRouter from "./routes/logs.js";
import metricsRouter from "./routes/metrics.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.use("/api/anomalies", anomaliesRouter);
app.use("/api/logs", logsRouter);
app.use("/api/metrics", metricsRouter);

const { MONGO_URI, PORT = 4000 } = process.env;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Mongo connected");
    app.listen(PORT, () => console.log(`🚀 API at http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ Mongo error:", err));
