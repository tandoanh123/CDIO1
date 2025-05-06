const authRouter = require("./authRouter");
const adminRouter = require("./adminRouter");
const accountRouter = require("./accountRouter");
const siteRouter = require("./siteRouter");
const searchRouter = require("./searchRouter");

const route = (app) => {
  app.use("/auth", authRouter);
  app.use("/account", accountRouter);
  app.use("/search", searchRouter);
  app.use("/admin", adminRouter);
  app.use("/", siteRouter);

  // Định nghĩa route cho /error404
  app.get("/error404", (req, res) => {
    res.status(404).render("error404", { message: "Không tìm thấy trang này" });
  });

  // Middleware xử lý lỗi 404
  app.use((req, res) => {
    res.status(404).redirect("/error404");
  });
};

module.exports = route;
