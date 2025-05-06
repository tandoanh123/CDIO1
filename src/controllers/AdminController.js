const adminModel = require("../models/admin.model");

class AdminController {
  // [GET] /admin/login
  login(req, res) {
    res.render("./pages/admin/login", { error: null });
  }

  // [POST] /admin/login
  loginPost(req, res) {
    adminModel.login(req, function (err, noFoundName, notMatchPass, success) {
      if (err) {
        return res.render("./pages/admin/login", { error: "Lỗi hệ thống!" });
      }
      if (noFoundName) {
        return res.render("./pages/admin/login", {
          error: "Tên đăng nhập không tồn tại!",
        });
      }
      if (notMatchPass) {
        return res.render("./pages/admin/login", {
          error: "Mật khẩu không chính xác!",
        });
      }
      if (success) {
        // Đảm bảo session được lưu trước khi redirect
        req.session.admin = { username: req.body.admin_login }; // Lưu thông tin admin vào session
        req.session.save((err) => {
          if (err) {
            console.error("Lỗi khi lưu session:", err);
            return res.render("./pages/admin/login", {
              error: "Lỗi hệ thống!",
            });
          }
          console.log("Session saved, redirecting to /admin/");
          res.redirect("/admin/");
        });
      }
    });
  }

  // [GET] /admin/logout
  logout(req, res) {
    delete req.session.admin;
    return res.redirect("/admin/login");
  }

  // [GET] /admin/dashboard
  dashboard(req, res) {
    adminModel.getTotalTutors(function (totalTutors) {
      res.status(200).render("./pages/admin/dashboard", {
        user: req.session.admin,
        totalTutors,
      });
    });
  }

  // [GET] /admin/tutors
  tutors(req, res) {
    adminModel.getTutors(function (tutors) {
      res.render("pages/admin/tutors", { user: req.session.admin, tutors });
    });
  }

  // [POST] /admin/add-tutor
  addTutor(req, res) {
    adminModel.addTutor(req.body, function (err) {
      if (err) return res.status(500).json({ message: "Lỗi khi thêm gia sư" });
      res.status(200).json({ message: "Thêm gia sư thành công" });
    });
  }

  // [POST] /admin/update-tutor
  updateTutor(req, res) {
    adminModel.updateTutor(req.body, function (err) {
      if (err)
        return res.status(500).json({ message: "Lỗi khi cập nhật gia sư" });
      res.status(200).json({ message: "Cập nhật gia sư thành công" });
    });
  }

  // [POST] /admin/delete-tutor
  deleteTutor(req, res) {
    adminModel.deleteTutor(req.body.tutor_id, function (err) {
      if (err) return res.status(500).json({ message: "Lỗi khi xóa gia sư" });
      res.status(200).json({ message: "Xóa gia sư thành công" });
    });
  }

  // [GET] /admin/tutor-schedule
  tutorSchedule(req, res) {
    adminModel.getTutors(function (tutors) {
      adminModel.getTutorSchedules(function (schedules) {
        res.render("pages/admin/tutor-schedule", {
          user: req.session.admin,
          tutors,
          schedules,
        });
      });
    });
  }

  // [POST] /admin/add-schedule
  addSchedule(req, res) {
    adminModel.addSchedule(req.body, function (err) {
      if (err)
        return res.status(500).json({ message: "Lỗi khi thêm lịch trình" });
      res.status(200).json({ message: "Thêm lịch trình thành công" });
    });
  }

  // [POST] /admin/update-schedule
  updateSchedule(req, res) {
    adminModel.updateSchedule(req.body, function (err) {
      if (err)
        return res.status(500).json({ message: "Lỗi khi cập nhật lịch trình" });
      res.status(200).json({ message: "Cập nhật lịch trình thành công" });
    });
  }

  // [POST] /admin/delete-schedule
  deleteSchedule(req, res) {
    const { schedule_id } = req.body;
    adminModel.deleteSchedule(schedule_id, function (err) {
      if (err)
        return res.status(500).json({ message: "Lỗi khi xóa lịch trình" });
      res.status(200).json({ message: "Xóa lịch trình thành công" });
    });
  }
}

module.exports = new AdminController();
