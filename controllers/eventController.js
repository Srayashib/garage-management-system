import Event from "../models/Event.js";

/* SHOW EVENTS PAGE */
export const eventsPage = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.render("admin/dashboard", {
      page: "events",
      events
    });

  } catch (error) {
    console.log(error);
    res.redirect("/dashboard");
  }
};

/* ADD EVENT */
export const addEvent = async (req, res) => {
  try {
    const { title, shortDescription, fullDescription, date } = req.body;

    await Event.create({
      title,
      shortDescription,
      fullDescription,
      date,
      image: "/uploads/events/" + req.file.filename
    });

    res.redirect("/admin/events");

  } catch (error) {
    console.log(error);
    res.redirect("/admin/events");
  }
};

/* DELETE EVENT */
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect("/admin/events");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/events");
  }
};