import Service from "../models/Service.js";

/* ADMIN: Show services */
export const adminServicesPage = async (req, res) => {
  const services = await Service.find();

  res.render("admin/dashboard", {
    page: "services",   // ✅ IMPORTANT
    services            // ✅ REQUIRED for partial
  });
};



/* ADMIN: Add service */
export const addService = async (req, res) => {
  const { name, price } = req.body;
  await Service.create({ name, price,
     image: req.file ? req.file.filename : null
   });
  res.redirect("/admin/services");
};

/* ADMIN: Toggle enable/disable */
export const toggleService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  service.isActive = !service.isActive;
  await service.save();
  res.redirect("/admin/services");
};

/* CUSTOMER: View active services */
export const customerServicesPage = async (req, res) => {
  const services = await Service.find({ isActive: true });
  res.render("customer/services", { services });
};

/* ADMIN: Edit service page */
/* ADMIN: Edit service page */
export const editServicePage = async (req, res) => {
  const services = await Service.find();
  const editService = await Service.findById(req.params.id);

  res.render("admin/dashboard", {
    page: "services",
    services,
    editService   // 👈 send to EJS
  });
};



/* ADMIN: Update service */
export const updateService = async (req, res) => {
  const { name, price } = req.body;

  const updateData = { name, price };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  await Service.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/admin/services");
};


/* ADMIN: Delete service */
export const deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.redirect("/admin/services");
};
