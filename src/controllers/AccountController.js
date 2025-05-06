const authuser = require("../models/authuser.model");
const accountHistory = require("../models/account.model");

class AccountController {
  // [GET] /account/information
  accountInformation(req, res) {
    console.log("User ID in accountInformation:", req.session.user?.id); // Log ID người dùng
    authuser.getInfoById(
      {
        id: req.session.user?.id,
      },
      (err, result) => {
        if (err) {
          console.error("Error in getInfoById:", err);
          res.status(500).render("error", { error: "Lỗi server" });
          return;
        }

        console.log("Result from getInfoById:", result); // Log kết quả truy vấn
        if (result.length === 0) {
          console.log("No user found with ID:", req.session.user?.id);
          res
            .status(404)
            .render("pages/site/error404", {
              message:
                "Không tìm thấy người dùng với ID " + req.session.user?.id,
            });
          return;
        }

        const data = {
          first_name: result[0].au_user_first_name,
          last_name: result[0].au_user_last_name,
          email: result[0].au_user_email,
          birthday: result[0].au_user_birthday,
          sex: result[0].au_user_sex,
          avatar: result[0].au_user_avt_url,
        };
        res.status(200).render("./pages/account/information", {
          message: "Lấy thông tin tài khoản thành công",
          user: req.session.user,
          data,
        });
      }
    );
  }

  // [POST] /account/information
  putChangeInfo(req, res) {
    const id = req.session.user?.id;
    let { first_name, last_name, birthday, sex } = req.body;

    birthday = birthday.split("-").join("");
    sex = sex == "null" ? null : sex;

    authuser.putInfoById(
      {
        id,
        first_name,
        last_name,
        birthday,
        sex,
      },
      (err, result) => {
        if (err) {
          console.error("Error in putInfoById:", err);
          res.status(500).render("error", { error: "Lỗi server" });
          return;
        }

        authuser.getInfoById({ id }, (err, result) => {
          if (err) {
            console.error("Error in getInfoById:", err);
            res.status(500).render("error", { error: "Lỗi server" });
            return;
          }

          req.session.user = {
            id: result[0].au_user_id,
            first_name: result[0].au_user_first_name,
            last_name: result[0].au_user_last_name,
            email: result[0].au_user_email,
            avatar: result[0].au_user_avt_url,
          };
          res.redirect("/account/information");
        });
      }
    );
  }

  // [GET] /account/history
  getRentalHistory(req, res) {
    const id = req.session.user?.id;
    const page = req.query.page ? req.query.page : 1;

    accountHistory.getDetail(
      { id, page },
      (err, rentalDetails, totalRow, totalPage, page, limit) => {
        if (err) {
          console.error("Error in getDetail:", err);
          res.status(200).render("./pages/account/history", {
            user: req.session.user,
            rentalDetails: [],
            totalRow: 0,
            totalPage: 1,
            page: 1,
            limit: 10,
          });
          return;
        }

        res.status(200).render("./pages/account/history", {
          user: req.session.user,
          rentalDetails: rentalDetails || [],
          totalRow: totalRow || 0,
          totalPage: totalPage || 1,
          page: page || 1,
          limit: limit || 10,
        });
      }
    );
  }

  // [GET] /account/change-password
  changePass(req, res) {
    res.status(200).render("./pages/account/change-password", {
      user: req.session.user,
    });
  }
}

module.exports = new AccountController();
