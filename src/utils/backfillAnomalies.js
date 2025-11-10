import "dotenv/config";
import mongoose from "mongoose";
import ParsedLog from "../models/ParsedLog.js";
import { detectAndSave } from "../services/detector.js";

const { MONGO_URI } = process.env;

// HOW MANY LOGS TO PROCESS (small so we don't fill storage)
const LIMIT = 3000;

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Get the most recent logs first (by timestamp desc)
  // If timestamp is string, we sort by _id (ObjectId) which roughly follows time
  const logs = await ParsedLog
    .find({}, null, { lean: true })
    .sort({ _id: -1 })  // newest first
    .limit(LIMIT);

  console.log(`Processing latest ${logs.length} logs...`);

  let i = 0;
  for (const log of logs) {
    await detectAndSave(log);
    i++;
    if (i % 1000 === 0) console.log(`Processed: ${i}/${logs.length}`);
  }

  console.log("🎉 Done! Anomalies inserted for a small sample.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
