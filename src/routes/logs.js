import { Router } from "express";
import ParsedLog from "../models/ParsedLog.js";
import { detectAndSave } from "../services/detector.js";

const router = Router();

// POST /logs/ingest  -> body: { ...one log... } OR { items: [ ...many logs... ] }
router.post("/ingest", async (req, res) => {
  try {
    if (Array.isArray(req.body?.items)) {
      const docs = await ParsedLog.insertMany(req.body.items, { ordered: false });
      for (const log of req.body.items) await detectAndSave(log);
      return res.json({ ok: true, inserted: docs.length });
    }
    const doc = await ParsedLog.create(req.body);
    await detectAndSave(req.body);
    res.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /logs?service=...&status=...&from=...&to=...
router.get("/", async (req, res) => {
  const q = {};
  if (req.query.service) q.service_name = req.query.service;
  if (req.query.status) q.status_code = Number(req.query.status);
  if (req.query.from || req.query.to) q.timestamp = {};
  if (req.query.from) q.timestamp.$gte = new Date(req.query.from);
  if (req.query.to) q.timestamp.$lte = new Date(req.query.to);

  const limit = Math.min(Number(req.query.limit || 200), 2000);
  const items = await ParsedLog.find(q).sort({ timestamp: -1 }).limit(limit);
  res.json(items);
});

export default router;
