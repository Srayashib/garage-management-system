import express from "express";
import Contact from "../models/Contact.js";
import Event from "../models/Event.js";
import Comment from "../models/Comment.js";
import Service from "../models/Service.js";
import Technician from "../models/technician.js";
import { subscribeNewsletter,adminSubscribersPage,deleteSubscriber } from "../controllers/newsletterController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {

  const services = await Service.find({ isActive: true }).limit(6);
  const events = await Event.find().sort({ createdAt: -1 }).limit(3);
  const technicians = await Technician.find().limit(4);

 res.render("pages/home", {
    services,
    events,
    technicians,
    currentRoute: "/"
  });

});

router.get("/about", (req, res) => {
    //res.render("pages/about");
    res.render("pages/about", { currentRoute: "/about" });
});

router.get("/contact", (req, res) => {
    
    
    res.render("pages/contact", {
        success: req.query.success,
        error: req.query.error,
        currentRoute: "/contact"
    });
});


router.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        await Contact.create({ name, email, message });

        res.redirect("/contact?success=true");
    } catch (error) {
        console.log(error);
        res.redirect("/contact?error=true");
    }
});

// Events Page
router.get("/events-news", async (req, res) => {
    const events = await Event.find().sort({ createdAt: -1 });

    const mainBlogs = events.slice(0, 3);     // 3 main blogs
    const sidebarBlogs = events.slice(3, 5);  // next 2 blogs

    
    res.render("pages/events", {
    mainBlogs,
    sidebarBlogs,
    currentRoute: "/events-news"
});
});

// Event Details Page
router.get("/events-details/:id", async (req, res) => {
    const event = await Event.findById(req.params.id);

    const related = await Event.find({
        _id: { $ne: req.params.id }
    }).limit(3);

    const comments = await Comment.find({
        eventId: req.params.id
    }).sort({ createdAt: -1 }).limit(3);

    
    res.render("pages/event-details", {
    event,
    related,
    comments,
    success: req.query.success,
    currentRoute: "/events-news"
});
});
router.post("/add-comment/:id", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        await Comment.create({
            eventId: req.params.id,
            name,
            email,
            message
        });

        res.redirect(`/events-details/${req.params.id}?success=true`);
    } catch (err) {
        console.log(err);
        res.redirect(`/events-details/${req.params.id}`);
    }
});

router.get("/service", async (req, res) => {

  const services = await Service.find({ isActive: true })
    .sort({ createdAt: -1 });

//   res.render("pages/service", { services });
res.render("pages/service", { 
    services,
    currentRoute: "/service"
});

});


router.get("/admin/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.render("admin/dashboard", {
      page: "contacts",
      contacts
    });

  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
});


router.get("/admin/contacts/delete/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect("/admin/contacts");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/contacts");
  }
});

router.post("/subscribe", subscribeNewsletter);
router.get("/admin/subscribers", isAuthenticated, adminSubscribersPage);
router.get("/admin/subscribers/delete/:id", isAuthenticated, deleteSubscriber);
export default router;