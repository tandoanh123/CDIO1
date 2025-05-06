const express = require("express");
const router = express.Router();

// import middleware
const authMiddleware = require("../middlewares/auth.middleware");

// import controller
const AccountController = require("../controllers/AccountController.js");

router.get(
  "/information",
  authMiddleware.isLoggedIn,
  AccountController.accountInformation
);
router.post(
  "/information",
  authMiddleware.isLoggedIn,
  AccountController.putChangeInfo
);

router.get(
  "/history",
  authMiddleware.isLoggedIn,
  AccountController.getRentalHistory
);

router.get(
  "/change-password",
  authMiddleware.isLoggedIn,
  AccountController.changePass
);

module.exports = router;
