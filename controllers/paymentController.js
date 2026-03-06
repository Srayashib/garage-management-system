import Razorpay from "razorpay";
import Booking from "../models/Booking.js";

const razorpay=new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const createPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.redirect("/my-bookings");
    }

    // 🔥 FIX: force integer
    const amountInPaise = Math.round(Number(booking.totalAmount) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).send("Invalid payment amount");
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: booking._id.toString()
    });

    res.render("customer/pay", {
      user: req.session.user,
      booking,
      order,
      razorpayKey: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).send("Payment page error");
  }
};


export const paymentSuccess=async(req,res)=>{
    const { bookingId, razorpay_payment_id } = req.body;
    await Booking.findByIdAndUpdate(bookingId, {
    paymentStatus: "Paid",
    razorpayPaymentId: razorpay_payment_id,
    status: "Delivered"
  });

  res.redirect("/my-bookings");
};