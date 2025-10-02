import mongoose from "mongoose";

const AIResponseSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Activity" },
  eventType: { type: String, required: true },
  response: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ["success", "error"], default: "success" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AIResponse || mongoose.model("AIResponse", AIResponseSchema, "airesponse");
