import "dotenv/config";
import express from "express";
import session from "express-session";
//import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

import vehicleRoutes from "./routes/vehicleRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js"; 
import { adminDashboardPage , customerDashboard} from "./controllers/bookingController.js";
import technicianRoutes from "./routes/technicianRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";


// dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(authRoutes);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get("/dashboard", isAuthenticated, async (req, res) => {
  const role = req.session.user.role;

  if (role === "admin") {
    return adminDashboardPage(req, res);
  } else {
    return customerDashboard(req, res);   // ✅ FIXED
  }
});

// ✅ REGISTER ALL ROUTES
app.use(vehicleRoutes);
app.use(serviceRoutes);
app.use(bookingRoutes);
app.use(billingRoutes);
app.use(paymentRoutes);
app.use(invoiceRoutes);
app.use(technicianRoutes);
app.use(pageRoutes);
app.use(eventRoutes);
app.use((req, res) => {
  res.status(404).render("pages/home");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
