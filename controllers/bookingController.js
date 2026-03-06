import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import Vehicle from "../models/Vehicle.js";



/* CUSTOMER: Show booking form */
export const showBookingForm = async (req, res) => {
  const service = await Service.findById(req.params.serviceId);

  const vehicles = await Vehicle.find({
    userId: req.user._id   // ✅ MATCHES SCHEMA
  });

  res.render("customer/book-service", {
    service,
    vehicles
  });
};






export const createBooking = async (req, res) => {
  const { serviceId, vehicleId, bookingDate, bookingTime } = req.body;

  const service = await Service.findById(serviceId);

  await Booking.create({
    customer: req.user._id,
    service: serviceId,
    vehicle: vehicleId,
    bookingDate,
    bookingTime,
    baseAmount: service.price,   // ✅ AUTO STORE PRICE
    status: "Pending",
    paymentStatus: "Unpaid",
    billGenerated: false
  });

  res.redirect("/dashboard");
};
/* ADMIN: View all bookings */
export const adminBookingsPage = async (req, res) => {
  const bookings = await Booking.find()
    .populate("customer")
    .populate("vehicle")
    .populate("service")
    .sort({ createdAt: -1 });

  res.render("admin/dashboard", {
    page: "bookings",
    bookings
  });
};

/* ADMIN: Update booking status */
export const updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;

  await Booking.findByIdAndUpdate(bookingId, { status });

  res.redirect("/admin/bookings");
};

export const customerBookingsPage=async(req,res)=>{
  
  const bookings = await Booking.find({
  customer: req.user._id
})
.populate("service")
.populate("vehicle")
.sort({ createdAt: -1 });


  res.render("customer/my-bookings",{bookings});

};

export const cancelBooking=async(req,res)=>{
  const {bookingId}=req.body;
  await Booking.findByIdAndUpdate(bookingId,{
    status:"Cancelled"
  });
  res.redirect("/my-bookings")
};

export const adminDashboardPage=async(req,res)=>{
  const totalBookings=await Booking.countDocuments();
  const pendingBookings=await Booking.countDocuments({
    status:"Pending"
  });
  const completedBookings=await Booking.countDocuments({
    status:"Delivered"
  });

 
  const monthlyData = await Booking.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },  // ✅ FIX HERE
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);
  const months=Array(12).fill(0);
  monthlyData.forEach(item=>{
    months[item._id-1]=item.count;
  });


  res.render("admin/dashboard",{
    page:"dashboard",
    totalBookings,
    pendingBookings,
    completedBookings,
    monthlyBookings:months
  });
};

export const deleteBooking=async(req,res)=>{
  try{
    const {id}=req.params;
    await Booking.findByIdAndDelete(id);
    res.redirect("/admin/bookings");
  }catch (error) {
    console.log(error);
    res.redirect("/admin/bookings");
  }
}

export const customerDashboard=async(req,res)=>{
  try{
    const userId=req.session.user._id;

    const bookings=await Booking.find({customer:userId});
    const monthlyData=new Array(12).fill(0);
    bookings.forEach(b=>{
      const month=new Date(b.createdAt).getMonth();
      monthlyData[month]++;
    });
    const totalBookings=bookings.length;
    const completed=bookings.filter(b=>b.status==="Delivered").length;
    const pending=bookings.filter(b=>b.status==="Pending").length;

    //const totalSpent=bookings.filter(b=>b.status==="Paid").reduce((sum,b)=>sum+(b.totalAmount||0),0);
    const totalSpent = bookings
  .filter(b => b.paymentStatus === "Paid")
  .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    res.render("customer/dashboard",{
      monthlyData,
      totalBookings,
      completed,
      pending,
      totalSpent
    })
  }catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
