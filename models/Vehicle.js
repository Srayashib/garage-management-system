

import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    carNumber: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "CNG"],
      required: true
    },
    year: {
      type: Number,
      required: true
    },

    // ✅ NEW FIELD
    photo: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
