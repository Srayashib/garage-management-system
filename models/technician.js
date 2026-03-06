import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    enum: ["Engine", "Electrical", "AC", "General"],
    required: true
  },

  experience: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Available", "Busy", "On Leave"],
    default: "Available"
  },
  profileImage: {
    type: String,
    default: "default.png"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Technician", technicianSchema);