

export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user; // ✅ VERY IMPORTANT
    next();
  } else {
    res.redirect("/login");
  }
};


export const isAdmin = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.send("Access Denied");
  }
  next();
};
