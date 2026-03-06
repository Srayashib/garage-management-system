import express from "express";
import { billingPage,generateBill,markAsPaid,downloadInvoice } from "../controllers/billingController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
//import { getBillingPage } from "../controllers/billingController.js";
const router = express.Router();

router.get("/admin/billing",isAuthenticated,billingPage);
router.post("/admin/billing/update",isAuthenticated,generateBill);
router.post("/admin/billing/pay",isAuthenticated,markAsPaid);
router.get("/invoice/:id", downloadInvoice);
//router.get("/billing", getBillingPage);
export default router;
