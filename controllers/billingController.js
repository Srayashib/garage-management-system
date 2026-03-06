// import Booking from "../models/Booking.js";

// export const generateBill=async(req,res)=>{
//     const {bookingId, baseAmount, extraCharges, tax } = req.body;

//     const taxAmount=(baseAmount*tax)/100;
//     const total=Number(baseAmount)+Number(extraCharges)+taxAmount;

//     await Booking.findByIdAndUpdate(bookingId,{
//         baseAmount,
//         extraCharges,
//         tax,
//         totalAmount:total,
//         billGenerated: true 

//     });
//     res.redirect("/admin/bookings");
// };



import Booking from "../models/Booking.js";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";


export const billingPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const totalBookings = await Booking.countDocuments({
      status: { $in: ["Ready", "Delivered"] }
    });

    const totalPages = Math.ceil(totalBookings / limit);

    const bookings = await Booking.find({
      status: { $in: ["Ready", "Delivered"] }
    })
      .populate("customer")
      .populate("service")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.render("admin/dashboard", {
      page: "billing",
      bookings,
      currentPage: page,
      totalPages
    });

  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
};

/* GENERATE BILL */
export const generateBill = async (req, res) => {
  const { bookingId, baseAmount, extraCharges, tax } = req.body;

  const subtotal = Number(baseAmount) + Number(extraCharges);
  const taxAmount = subtotal * (Number(tax) / 100);
  const total = subtotal + taxAmount;

  const invoiceNumber = "INV-" + Date.now();

  await Booking.findByIdAndUpdate(bookingId, {
    baseAmount,
    extraCharges,
    tax,
    totalAmount: total,
    billGenerated: true,
    invoiceNumber,
    invoiceDate: new Date()
  });

  res.redirect("/admin/billing");
};

/* MARK AS PAID */
export const markAsPaid = async (req, res) => {
  const { bookingId } = req.body;

  await Booking.findByIdAndUpdate(bookingId, {
    paymentStatus: "Paid"
  });

  res.redirect("/admin/billing");
};





export const downloadInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer")
      .populate("service")
      .populate("vehicle");

    if (!booking) return res.redirect("/admin/billing");

    const doc = new PDFDocument({ size: "A4", margin: 0 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${booking.invoiceNumber}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    /* ===== Background Card ===== */
    doc.roundedRect(30, 30, 535, 780, 15)
      .fillAndStroke("#f4f6f9", "#dddddd");

    /* ===== Logo ===== */
    doc.image("public/images/logo.jpeg", 60, 60, { width: 60 });

    /* ===== Header ===== */
    doc.fillColor("#1f3c88")
      .fontSize(22)
      .text("Garage Service Center", 140, 65);

    doc.fillColor("gray")
      .fontSize(12)
      .text("Service & Repair Experts", 140, 90);

    doc.fillColor("#1f3c88")
      .fontSize(28)
      .text("INVOICE", 420, 75);

    doc.moveTo(60, 120).lineTo(550, 120).strokeColor("#cccccc").stroke();

    const invoiceDate = booking.invoiceDate
      ? new Date(booking.invoiceDate).toDateString()
      : new Date().toDateString();

    /* ===== Invoice Info ===== */
    doc.fillColor("black").fontSize(12);

    doc.text("Invoice Number:", 60, 140);
    doc.text(booking.invoiceNumber, 180, 140);

    doc.text("Invoice Date:", 340, 140);
    doc.text(invoiceDate, 440, 140);

    doc.text("Customer:", 60, 165);
    doc.text(booking.customer.name, 180, 165);

    doc.text("Vehicle:", 340, 165);
    doc.text(
      `${booking.vehicle.brand} - ${booking.vehicle.carNumber}`,
      440,
      165
    );

    /* ===== Table Header ===== */
    doc.roundedRect(60, 210, 490, 35, 6)
      .fillAndStroke("#2d5f9a", "#2d5f9a");

    doc.fillColor("white")
      .fontSize(12)
      .text("DESCRIPTION", 80, 222)
      .text("AMOUNT (₹)", 420, 222);

    /* ===== Table Rows ===== */
    let y = 245;

    const taxAmount =
      booking.totalAmount -
      (booking.baseAmount + booking.extraCharges);

    const rows = [
      ["Base Service Charge", booking.baseAmount],
      ["Extra Charges", booking.extraCharges],
      [`Tax (${booking.tax}%)`, taxAmount],
    ];

    doc.fillColor("black");

    rows.forEach((row) => {
      doc.rect(60, y, 490, 35).stroke("#e0e0e0");

      doc.text(row[0], 80, y + 10);
      doc.text("₹" + row[1], 420, y + 10);

      y += 35;
    });

    /* ===== Total Row ===== */
    doc.rect(60, y, 490, 40)
      .fillAndStroke("#e6f0ff", "#d0e3ff");

    doc.fillColor("black")
      .fontSize(13)
      .text("Total (inclusive of GST)", 80, y + 12)
      .text("₹" + booking.totalAmount, 420, y + 12);

    /* ===== Payment Box ===== */
    doc.roundedRect(60, y + 70, 320, 70, 8)
      .strokeColor("#4caf50")
      .stroke();

    doc.fillColor("#2e7d32")
      .fontSize(12)
      .text("Payment Status: " + booking.paymentStatus, 80, y + 85);

    doc.fillColor("black")
      .text("Payment ID: " + (booking.paymentId || "N/A"), 80, y + 105);

    /* ===== QR Code ===== */
    const qrData = `Invoice: ${booking.invoiceNumber}
Amount: ₹${booking.totalAmount}
Garage Service`;

    const qrImage = await QRCode.toDataURL(qrData);
    const qrBuffer = Buffer.from(
      qrImage.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    doc.image(qrBuffer, 420, y + 70, { width: 100 });

    doc.fontSize(10)
      .fillColor("black")
      .text("SCAN TO PAY", 435, y + 55);

    /* ===== PAID Watermark ===== */
    if (booking.paymentStatus === "Paid") {
      doc.rotate(-40, { origin: [300, 400] })
        .fontSize(100)
        .fillColor("#4caf50")
        .opacity(0.2)
        .text("PAID", 150, 350)
        .opacity(1)
        .rotate(40);
    }

    /* ===== Signature ===== */
    doc.image("public/images/signature.jpeg", 380, 720, { width: 120 });

    doc.fontSize(11)
      .fillColor("black")
      .text("Authorized Signature", 380, 760);

    /* ===== Footer ===== */
    doc.moveTo(60, 790).lineTo(550, 790).stroke("#cccccc");

    doc.fontSize(10)
      .fillColor("gray")
      .text("Garage Service Center | 1234 Auto Lane - India", 160, 800);

    doc.end();
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.redirect("/admin/billing");
    }
  }
};