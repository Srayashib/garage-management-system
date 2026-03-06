import express from "express";
import { createPayment,paymentSuccess } from "../controllers/paymentController.js";
import {isAuthenticated } from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/pay/:bookingId", isAuthenticated, createPayment);
router.post("/pay/success", isAuthenticated, paymentSuccess);


export default router;