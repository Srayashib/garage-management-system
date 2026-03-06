import bcrypt from "bcrypt";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "customer"
  });

  await user.save();
  res.redirect("/login");
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send("Invalid credentials");
  }

  // req.session.user = {
  //   id: user._id,
  //   role: user.role
  // };
  req.session.user = {
  _id: user._id,       // ✅ REQUIRED
  name: user.name,
  role: user.role,
  email: user.email
};


  res.redirect("/dashboard");
};
export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
