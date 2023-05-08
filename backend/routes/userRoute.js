const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  loginStatus,
  logoutUser,
  getUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserReport,
  deleteUser,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const parser = require("../utils/cloudinary.config");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loggedin", loginStatus);
router.get("/logout", logoutUser);
router.get("/getuser", protect, getUser);
router.patch("/updateuser", protect, parser.single("photo"), updateUser);
router.patch("/changepass", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.post("/report", protect, getUserReport);
router.delete("/deleteuser", protect, deleteUser);

module.exports = router;
