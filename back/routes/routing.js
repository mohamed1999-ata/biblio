const authController = require("../app/controllers/auth/authController");
const forgotPassword = require("../app/controllers/auth/forgetPasswordController");
const facebook = require("../app/controllers/auth/facebookController");

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/sign-up", authController.signup);
router.post("/verify-email", authController.verifyEmailExist);
router.post("/sign-in", authController.login);
router.post("/forgot-password", forgotPassword.forget);
router.post("/reset/:token", forgotPassword.updatePasswordViaEmail);
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email", session: false })
);

module.exports = router;
