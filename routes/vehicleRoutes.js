// import express from "express";
// import {
//   showAddVehicle,
//   addVehicle,
//   listVehicles
// } from "../controllers/vehicleController.js";
// import { isAuthenticated } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/vehicles", isAuthenticated, listVehicles);
// router.get("/vehicles/add", isAuthenticated, showAddVehicle);
// router.post("/vehicles/add", isAuthenticated, addVehicle);

// export default router;


// import express from "express";
// import {
//   showAddVehicle,
//   addVehicle,
//   listVehicles
// } from "../controllers/vehiclecontroller.js";

// import { isAuthenticated } from "../middleware/authMiddleware.js";
// import uploadVehicle from "../middleware/uploadVehicle.js";

// const router = express.Router();

// router.get("/vehicles", isAuthenticated, listVehicles);
// router.get("/vehicles/add", isAuthenticated, showAddVehicle);

// // ✅ ADD MULTER HERE
// router.post("/vehicles/add", isAuthenticated, uploadVehicle.single("photo"), addVehicle);

// export default router;


import express from "express";
import {
  showAddVehicle,
  addVehicle,
  listVehicles,
  showEditVehicle,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehiclecontroller.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";
import uploadVehicle from "../middleware/uploadVehicle.js";

const router = express.Router();

router.get("/vehicles", isAuthenticated, listVehicles);
router.get("/vehicles/add", isAuthenticated, showAddVehicle);
router.post("/vehicles/add", isAuthenticated, uploadVehicle.single("photo"), addVehicle);

/* ✅ EDIT */
router.get("/vehicles/edit/:id", isAuthenticated, showEditVehicle);
router.post("/vehicles/edit/:id", isAuthenticated, uploadVehicle.single("photo"), updateVehicle);

/* ✅ DELETE */
router.post("/vehicles/delete/:id", isAuthenticated, deleteVehicle);

export default router;
