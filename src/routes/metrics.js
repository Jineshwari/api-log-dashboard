import { Router } from "express";
import ParsedLog from "../models/ParsedLog.js";
import Anomaly from "../models/Anomaly.js";

const router = Router();

router.get("/summary", async (req, res) => {
  const match = {};
  if (req.query.from || req.query.to) match.timestamp = {};
  if (req.query.from) match.timestamp.$gte = req.query.from;
  if (req.query.to) match.timestamp.$lte = req.query.to;

  const [byService, errors, latency, anomalyCounts] = await Promise.all([
    ParsedLog.aggregate([
      { $match: match },
      { $group: { _id: "$service_name", count: { $sum: 1 }, avgRt: { $avg: "$response_time_ms" } } },
      { $sort: { count: -1 } }
    ]),
    ParsedLog.aggregate([
      { $match: { ...match, status_code: { $gte: 400 } } },
      { $group: { _id: "$service_name", errorCount: { $sum: 1 } } },
      { $sort: { errorCount: -1 } }
    ]),
    ParsedLog.aggregate([
      { $match: match },
      { 
        $group: { 
          _id: { 
            $dateTrunc: { 
              date: { $toDate: "$timestamp" },  // FIX HERE ✅
              unit: "hour" 
            }
          },
          rt: { $avg: "$response_time_ms" }
        }
      },
      { $sort: { "_id": 1 } }
    ]),
    Anomaly.aggregate([
      { $group: { _id: "$anomaly_type", count: { $sum: 1 } } }
    ])
  ]);

  res.json({ byService, errors, latency, anomalyCounts });
});

export default router;
