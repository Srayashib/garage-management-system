import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {technicianPage,
  addTechnician,
  deleteTechnician,
  updateTechnicianStatus
} from "../controllers/technicianController.js";
const router=express.Router();

router.get("/admin/technicians", isAuthenticated, technicianPage);
router.post("/admin/technicians/add", isAuthenticated, upload.single("profileImage"),addTechnician);
router.post("/admin/technicians/delete/:id", isAuthenticated, deleteTechnician);
router.post("/admin/technicians/status/:id",isAuthenticated,updateTechnicianStatus);

export default router;