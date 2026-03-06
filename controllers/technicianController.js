import Technician from "../models/technician.js";

export const technicianPage = async (req, res) => {
  const technicians = await Technician.find();
  res.render("admin/dashboard", {
    page: "technicians",
    technicians
  });
};

// export const addTechnician = async (req, res) => {
//   await Technician.create(req.body);
//   res.redirect("/admin/technicians");
// };

export const addTechnician = async (req, res) => {
  try {
    const { name, phone, specialization, experience } = req.body;

    const newTech = new Technician({
      name,
      phone,
      specialization,
      experience,
      profileImage: req.file ? req.file.filename : "default.png"
    });

    await newTech.save();

    res.redirect("/admin/technicians");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/technicians");
  }
};

export const deleteTechnician = async (req, res) => {
  await Technician.findByIdAndDelete(req.params.id);
  res.redirect("/admin/technicians");
};


export const updateTechnicianStatus = async (req, res) => {
  await Technician.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.redirect("/admin/technicians");
};