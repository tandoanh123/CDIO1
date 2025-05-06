const db = require("../config/db/connect");

const AccountModel = function () {};

// [GET] Lấy chi tiết lịch sử thuê gia sư
AccountModel.getDetail = ({ id, page }, callback) => {
  const limit = 10; // Số giao dịch mỗi trang
  const offset = (page - 1) * limit;

  // Truy vấn tổng số giao dịch
  const countSql = `
        SELECT COUNT(*) as total
        FROM rental_history
        WHERE au_user_id = ?
    `;
  db.query(countSql, [id], (err, countResult) => {
    if (err) {
      return callback(err, null, null, null, page, limit);
    }

    const totalRow = countResult[0].total;
    const totalPage = Math.ceil(totalRow / limit);

    // Truy vấn danh sách giao dịch với phân trang
    const sql = `
            SELECT 
                rh.rental_id,
                rh.rental_date,
                rh.price_before_discount,
                rh.rental_price,
                rh.rental_duration,
                rh.rental_status,
                rh.is_paid,
                t.tutor_name,
                t.hourly_rate,
                ts.start_datetime,
                ts.end_datetime,
                CONCAT(au.au_user_first_name, ' ', au.au_user_last_name) AS customer_name
            FROM rental_history rh
            JOIN tutor t ON rh.tutor_id = t.tutor_id
            JOIN tutor_schedule ts ON rh.schedule_id = ts.schedule_id
            JOIN authuser au ON rh.au_user_id = au.au_user_id
            WHERE rh.au_user_id = ?
            ORDER BY rh.rental_date DESC
            LIMIT ? OFFSET ?
        `;
    const params = [id, limit, offset];

    db.query(sql, params, (err, results) => {
      if (err) {
        return callback(err, null, null, null, page, limit);
      }

      // Ánh xạ dữ liệu để khớp với room-in-hs.ejs
      const rentalDetails = results.map((result) => ({
        room_id: result.rental_id, // Giả định room_id là rental_id
        acco_name: result.tutor_name, // Dùng tên gia sư thay cho tên nơi ở
        book_datetime: result.rental_date,
        book_start_datetime: result.start_datetime,
        book_end_datetime: result.end_datetime,
        book_customer_name: result.customer_name,
        book_is_paid_mean: result.is_paid ? "Đã thanh toán" : "Chưa thanh toán",
        book_status_mean:
          result.rental_status === "completed"
            ? "Đã hoàn thành"
            : result.rental_status === "pending"
            ? "Đang chờ"
            : "Đã hủy",
        book_cost_before_currency: result.price_before_discount,
        book_cost_after_currency: result.rental_price,
        book_status: result.rental_status === "completed" ? 1 : 0, // 1: Đã hoàn thành, 0: Chưa hoàn thành
        book_id: result.rental_id,
      }));

      callback(null, rentalDetails, totalRow, totalPage, page, limit);
    });
  });
};

// [POST] Thêm thẻ ngân hàng
AccountModel.addBank = (
  { bank_name, bank_num, bank_branch, bank_name_pers, id },
  callback
) => {
  const sql = `
        INSERT INTO bankcard
        (bank_name,
         bank_branch,
         bank_num,
         bank_name_pers,
         au_user_id)
        VALUES (?, ?, ?, ?, ?)
    `;
  const params = [bank_name, bank_branch, bank_num, bank_name_pers, id];

  db.query(sql, params, (err, result) => {
    callback(err, result);
  });
};

// [POST] Thêm thẻ tín dụng
AccountModel.addDebit = (
  {
    debit_num,
    debit_end_date,
    debit_CCV,
    debit_name,
    debit_address,
    debit_postal,
    id,
  },
  callback
) => {
  const sql = `
        INSERT INTO debitcard
        (debit_num,
         debit_end_date,
         debit_CCV,
         debit_name,
         debit_address,
         debit_postal,
         au_user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  const params = [
    debit_num,
    debit_end_date,
    debit_CCV,
    debit_name,
    debit_address,
    debit_postal,
    id,
  ];

  db.query(sql, params, (err, result) => {
    callback(err, result);
  });
};

// [POST] Xóa thẻ ngân hàng
AccountModel.delBank = ({ id, bank_id }, callback) => {
  const sql = `
        UPDATE bankcard
        SET au_user_id = NULL
        WHERE bank_id = ? AND au_user_id = ?
    `;
  const params = [bank_id, id];

  db.query(sql, params, (err, result) => {
    callback(err, result);
  });
};

// [POST] Xóa thẻ tín dụng
AccountModel.delDebit = ({ id, debit_id }, callback) => {
  const sql = `
        UPDATE debitcard
        SET au_user_id = NULL
        WHERE debit_id = ? AND au_user_id = ?
    `;
  const params = [debit_id, id];

  db.query(sql, params, (err, result) => {
    callback(err, result);
  });
};

// [POST] Thêm đánh giá
AccountModel.addRating = (
  { room_id, rating_datetime, rating_point, rating_context, id },
  callback
) => {
  const sql = `
        INSERT INTO rating
        (room_id,
         rating_datetime,
         rating_point,
         rating_context,
         au_user_id)
        VALUES (?, ?, ?, ?, ?)
    `;
  const params = [room_id, rating_datetime, rating_point, rating_context, id];

  db.query(sql, params, (err, result) => {
    callback(err, result);
  });
};

module.exports = AccountModel;
