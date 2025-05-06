const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const adminMiddleware = require("../middlewares/admin.middleware");

router.get("/login", adminMiddleware.checkAuthAdmin, AdminController.login);
router.post(
  "/login",
  adminMiddleware.checkAuthAdmin,
  AdminController.loginPost
);
router.get("/logout", adminMiddleware.checkAuthAdmin, AdminController.logout);

router.get("/", adminMiddleware.isLoggedInAdmin, AdminController.dashboard);
router.get(
  "/dashboard",
  adminMiddleware.isLoggedInAdmin,
  AdminController.dashboard
);

router.get("/tutors", adminMiddleware.isLoggedInAdmin, AdminController.tutors);
router.post(
  "/add-tutor",
  adminMiddleware.isLoggedInAdmin,
  AdminController.addTutor
);
router.post(
  "/update-tutor",
  adminMiddleware.isLoggedInAdmin,
  AdminController.updateTutor
);
router.post(
  "/delete-tutor",
  adminMiddleware.isLoggedInAdmin,
  AdminController.deleteTutor
);

router.get(
  "/tutor-schedule",
  adminMiddleware.isLoggedInAdmin,
  AdminController.tutorSchedule
);
router.post(
  "/add-schedule",
  adminMiddleware.isLoggedInAdmin,
  AdminController.addSchedule
);
router.post(
  "/update-schedule",
  adminMiddleware.isLoggedInAdmin,
  AdminController.updateSchedule
);
router.post(
  "/delete-schedule",
  adminMiddleware.isLoggedInAdmin,
  AdminController.deleteSchedule
);

module.exports = router;
