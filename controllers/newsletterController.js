import Newsletter from "../models/Newsletter.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.redirect("/?subscribed=exists");
    }

    await Newsletter.create({ email });

    res.redirect("/?subscribed=success");

  } catch (error) {
    console.log(error);
    res.redirect("/?subscribed=error");
  }
};

export const adminSubscribersPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // subscribers per page
    const skip = (page - 1) * limit;

    const total = await Newsletter.countDocuments();

    const subscribers = await Newsletter.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("admin/dashboard", {
      page: "subscribers",
      subscribers,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.log(error);
    res.redirect("/dashboard");
  }
};
export const deleteSubscriber = async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.redirect("/admin/subscribers");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/subscribers");
  }
};