import express from "express";
import {
  eventsPage,
  addEvent,
  deleteEvent
} from "../controllers/eventController.js";

import uploadEvent from "../middleware/uploadEvent.js";

const router = express.Router();

router.get("/admin/events", eventsPage);
router.post("/admin/events/add", uploadEvent.single("image"), addEvent);
router.get("/admin/events/delete/:id", deleteEvent);

export default router;