import express from "express";
import Anomaly from "../models/Anomaly.js";

const router = express.Router();

// TEST ROUTE (CHECK ROUTER LOADED)
router.get("/test", (req, res) => {
  res.send("✅ anomalies router is working");
});

// MAIN: GET ALL ANOMALIES
router.get("/", async (req, res) => {
  try {
    const anomalies = await Anomaly.find()
      .sort({ detected_at: -1 })
      .limit(1000);
    res.json(anomalies);
  } catch (err) {
    console.error("Anomaly fetch error:", err);
    res.status(500).json({ message: "Server error fetching anomalies" });
  }
});

export default router;
