


import Vehicle from "../models/Vehicle.js";

/* Show add vehicle page */
export const showAddVehicle = (req, res) => {
  res.render("vehicles/add-vehicle");
};

/* Add vehicle */
export const addVehicle = async (req, res) => {
  try {
    const { carNumber, brand, model, fuelType, year } = req.body;

    await Vehicle.create({
      userId: req.session.user._id,
      carNumber,
      brand,
      model,
      fuelType,
      year,
      photo: req.file ? req.file.filename : null
    });

    res.redirect("/vehicles");
  } catch (error) {
    console.error(error);
    res.send("Error adding vehicle");
  }
};

/* Vehicle list */
export const listVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({
    userId: req.session.user._id
  });

  res.render("vehicles/vehicle-list", { vehicles });
};

/* ✅ SHOW EDIT PAGE */
export const showEditVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  res.render("vehicles/edit-vehicle", { vehicle });
};

/* ✅ UPDATE VEHICLE */
export const updateVehicle = async (req, res) => {
  const { carNumber, brand, model, fuelType, year } = req.body;

  const updateData = {
    carNumber,
    brand,
    model,
    fuelType,
    year
  };

  if (req.file) {
    updateData.photo = req.file.filename;
  }

  await Vehicle.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/vehicles");
};

/* ✅ DELETE VEHICLE */
export const deleteVehicle = async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.redirect("/vehicles");
};
