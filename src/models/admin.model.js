const db = require("../config/db/connect");
const bcrypt = require("bcryptjs");

function adminModel() {}

// Đăng nhập admin
adminModel.login = (req, callback) => {
  const { admin_login, admin_password } = req.body;
  const adminLogin = "SELECT * FROM admin WHERE admin_nickname = ?";
  db.query(adminLogin, [admin_login], async (err, admin) => {
    if (err) callback(1, 0, 0, 0);
    if (!admin[0]) {
      callback(0, 1, 0, 0);
    } else if (await bcrypt.compare(admin_password, admin[0].admin_pass)) {
      req.session.admin = {
        id: admin[0].admin_id,
        name: admin[0].admin_nickname,
      };
      callback(0, 0, 0, 1);
    } else {
      callback(0, 0, 1, 0);
    }
  });
};

// Lấy danh sách gia sư
adminModel.getTutors = function (callback) {
  const query = `
    SELECT t.*, p.prov_name, c.city_name 
    FROM tutor t
    LEFT JOIN province p ON t.prov_id = p.prov_id
    LEFT JOIN city c ON t.city_id = c.city_id
  `;
  db.query(query, (err, tutors) => {
    if (err) throw err;
    callback(tutors);
  });
};

// Thêm gia sư mới
adminModel.addTutor = function (tutorData, callback) {
  const {
    tutor_name,
    gender,
    experience_years,
    tutor_avg_rating,
    tutor_img_url,
    hourly_rate,
    prov_id,
    city_id,
  } = tutorData;
  const query = `
    INSERT INTO tutor (tutor_name, gender, experience_years, tutor_avg_rating, tutor_img_url, hourly_rate, prov_id, city_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [
      tutor_name,
      gender,
      experience_years,
      tutor_avg_rating || 0,
      tutor_img_url || "",
      hourly_rate,
      prov_id,
      city_id,
    ],
    (err, result) => {
      if (err) return callback(err);
      callback(null);
    }
  );
};

// Cập nhật thông tin gia sư
adminModel.updateTutor = function (tutorData, callback) {
  const {
    tutor_id,
    tutor_name,
    gender,
    experience_years,
    tutor_avg_rating,
    tutor_img_url,
    hourly_rate,
    prov_id,
    city_id,
  } = tutorData;
  const query = `
    UPDATE tutor 
    SET tutor_name = ?, gender = ?, experience_years = ?, tutor_avg_rating = ?, tutor_img_url = ?, hourly_rate = ?, prov_id = ?, city_id = ?
    WHERE tutor_id = ?
  `;
  db.query(
    query,
    [
      tutor_name,
      gender,
      experience_years,
      tutor_avg_rating,
      tutor_img_url,
      hourly_rate,
      prov_id,
      city_id,
      tutor_id,
    ],
    (err, result) => {
      if (err) return callback(err);
      callback(null);
    }
  );
};

// Xóa gia sư
adminModel.deleteTutor = function (tutor_id, callback) {
  const query = "DELETE FROM tutor WHERE tutor_id = ?";
  db.query(query, [tutor_id], (err, result) => {
    if (err) return callback(err);
    callback(null);
  });
};

// Lấy lịch trình của tất cả gia sư
adminModel.getTutorSchedules = function (callback) {
  const query = `
    SELECT ts.*, t.tutor_name,
           DATE_FORMAT(ts.start_datetime, '%d/%m/%Y %H:%i') AS start_time_format,
           DATE_FORMAT(ts.end_datetime, '%d/%m/%Y %H:%i') AS end_time_format
    FROM tutor_schedule ts
    JOIN tutor t ON ts.tutor_id = t.tutor_id
    ORDER BY ts.start_datetime
  `;
  db.query(query, (err, schedules) => {
    if (err) throw err;
    callback(schedules);
  });
};

// Thêm khung giờ mới vào lịch trình gia sư
adminModel.addSchedule = function (scheduleData, callback) {
  const { tutor_id, start_datetime, end_datetime, is_available } = scheduleData;
  const query = `
    INSERT INTO tutor_schedule (tutor_id, start_datetime, end_datetime, is_available)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    query,
    [tutor_id, start_datetime, end_datetime, is_available || 1],
    (err, result) => {
      if (err) return callback(err);
      callback(null);
    }
  );
};

// Cập nhật lịch trình gia sư
adminModel.updateSchedule = function (scheduleData, callback) {
  const { schedule_id, start_datetime, end_datetime, is_available } =
    scheduleData;
  const query = `
    UPDATE tutor_schedule 
    SET start_datetime = ?, end_datetime = ?, is_available = ? 
    WHERE schedule_id = ?
  `;
  db.query(
    query,
    [start_datetime, end_datetime, is_available, schedule_id],
    (err, result) => {
      if (err) return callback(err);
      callback(null);
    }
  );
};

// Xóa khung giờ khỏi lịch trình gia sư
adminModel.deleteSchedule = function (schedule_id, callback) {
  const query = "DELETE FROM tutor_schedule WHERE schedule_id = ?";
  db.query(query, [schedule_id], (err, result) => {
    if (err) return callback(err);
    callback(null);
  });
};

// Lấy tổng số gia sư
adminModel.getTotalTutors = function (callback) {
  const getTotalTutors = "SELECT COUNT(*) AS 'count_tutors' FROM tutor";
  db.query(getTotalTutors, (err, result) => {
    if (err) throw err;
    callback(parseInt(result[0].count_tutors));
  });
};

module.exports = adminModel;
