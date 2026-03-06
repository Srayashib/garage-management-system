import express from "express";
import Booking from "../models/Booking.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router=express.Router();
router.get("/invoice/:id",isAuthenticated,async(req,res)=>{
    const booking=await Booking.findById(req.params.id).populate("service").populate("vehicle");
    res.render("customer/invoice",{booking});
});

export default router;