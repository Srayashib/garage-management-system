import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);