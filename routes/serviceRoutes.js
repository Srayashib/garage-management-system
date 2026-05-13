import express from "express";
import {
  adminServicesPage,
  addService,
  toggleService,
  customerServicesPage,
  editServicePage,
  updateService,
  deleteService,
  
} from "../controllers/serviceController.js";
import uploadService from "../middleware/uploadService.js";


import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADMIN */
router.get("/admin/services", isAuthenticated, adminServicesPage);
router.post(
  "/admin/services/add",
  isAuthenticated,
  uploadService.single("image"),
  addService
);

router.get("/admin/services/toggle/:id", isAuthenticated, toggleService);
router.get("/admin/services/edit/:id", isAuthenticated, editServicePage);

router.post(
  "/admin/services/update/:id",
  isAuthenticated,
  uploadService.single("image"),
  updateService
);

router.post("/admin/services/delete/:id", isAuthenticated, deleteService);


/* CUSTOMER */
router.get("/dashboard/services", isAuthenticated, customerServicesPage);


export default router;
