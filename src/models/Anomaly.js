import mongoose from "mongoose";

const anomalySchema = new mongoose.Schema(
  {
    timestamp: Date,
    endpoint: String,
    anomaly_type: String,
    severity: String,
    score: Number,
    reason: String,
    raw_log: Object,
    resolved: Boolean,
    detected_at: Date,
  },
  { strict: false }
);

// ✅ USE YOUR TEAM’S COLLECTION NAME
export default mongoose.model("Anomaly", anomalySchema, "anomalies");
