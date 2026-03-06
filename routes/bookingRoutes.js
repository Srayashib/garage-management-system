import express from "express";
import {
  showBookingForm,
  createBooking,
  adminBookingsPage,
  updateBookingStatus,
  customerBookingsPage,
  cancelBooking,
  deleteBooking
} from "../controllers/bookingController.js";

import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* CUSTOMER */
router.get("/book/:serviceId", isAuthenticated, showBookingForm);
router.post("/book", isAuthenticated, createBooking);

/* ADMIN */
router.get("/admin/bookings", isAuthenticated, isAdmin, adminBookingsPage);
router.post("/admin/bookings/update", isAuthenticated, isAdmin, updateBookingStatus);
router.get("/my-bookings",isAuthenticated,customerBookingsPage)
router.post("/cancel-booking", isAuthenticated, cancelBooking);
router.post(
  "/admin/bookings/delete/:id",
  isAuthenticated,
  deleteBooking
);

export default router;
