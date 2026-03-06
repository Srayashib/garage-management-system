import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },

  bookingDate: {
    type: Date,
    required: true
  },

  bookingTime: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "In Service", "Ready", "Delivered"],
    default: "Pending"
  },
  baseAmount:Number,
  extraCharges:{
    type:Number,
    default:0,
  },
  tax:{
    type:Number,
    default:0,
  },
  totalAmount:Number,
  billGenerated: {
  type: Boolean,
  default: false
  },


  paymentStatus:{
    type:String,
    enum:["Unpaid","Paid"],
    default:"Unpaid"
  },
  razorpayPaymentId:String,
  technician: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Technician"
},
invoiceNumber: String,
invoiceDate: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Booking", bookingSchema);
