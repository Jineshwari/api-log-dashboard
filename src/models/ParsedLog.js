import mongoose from "mongoose";

const parsedLogSchema = new mongoose.Schema({}, { strict: false });

// ✅ Prevent OverwriteModelError
export default mongoose.models.ParsedLog || mongoose.model("ParsedLog", parsedLogSchema, "parsedlogs");
