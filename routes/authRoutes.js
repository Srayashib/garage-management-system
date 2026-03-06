import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
