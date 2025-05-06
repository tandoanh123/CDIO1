/**
 * @file This file contains the AuthUser model which is responsible for handling database operations related to user authentication.
 * @name AuthUser Model
 * @requires ../config/db/connect
 * @exports AuthUser
 */
const db = require("../config/db/connect");
const bcrypt = require("bcryptjs");

function AuthUser() {}

AuthUser.insertUser = async function (
  { au_user_last_name, au_user_first_name, au_user_email, au_user_pass },
  callback
) {
  const insertUser = "INSERT INTO authuser SET ?";

  let hashedPassword = await bcrypt.hash(au_user_pass, 8);

  db.query(
    insertUser,
    {
      au_user_last_name: au_user_last_name,
      au_user_first_name: au_user_first_name,
      au_user_email: au_user_email,
      au_user_pass: hashedPassword,
    },
    (error, results) => {
      if (error) throw error;
      callback(error, results);
    }
  );
};

AuthUser.findByEmail = ({ email }, callback) => {
  const sql = `
        SELECT *
        FROM AUTHUSER
        WHERE au_user_email = ?`;

  db.query(sql, [email], (err, result) => {
    callback(err, result);
  });
};

AuthUser.checkAccount = ({ email, password }, callback) => {
  const sql = `
        SELECT au_user_email
        FROM AUTHUSER
        WHERE au_user_email = ?
            AND au_user_password = ?`;
  db.query(sql, [email, password], (err, result) => {
    callback(err, result);
  });
};

AuthUser.getInfoById = ({ id }, callback) => {
  const sql = `
        SELECT *
        FROM VIEW_AUTHUSER
        WHERE au_user_id = ?`;
  db.query(sql, [id], (err, result) => {
    callback(err, result);
  });
};

AuthUser.putInfoById = (
  { id, first_name, last_name, birthday, sex },
  callback
) => {
  const sql = `
        UPDATE AUTHUSER 
        SET au_user_first_name = ?,
            au_user_last_name = ?,
            au_user_birthday = ?,
            au_user_sex = ?
        WHERE au_user_id = ?;`;
  const values = [first_name, last_name, birthday, sex, id];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

AuthUser.findByPassword = async ({ email, password }, callback) => {
  const hashedPass = await bcrypt.hash(password, 8);
  const sql = `
        UPDATE AUTHUSER
        SET au_user_pass = ?
        WHERE au_user_email = ?;`;
  const values = [hashedPass, email];
  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

module.exports = AuthUser;
