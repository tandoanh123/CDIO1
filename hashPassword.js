const bcrypt = require("bcryptjs");

const password = "password123"; // Mật khẩu bạn muốn
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log(hash); // Chuỗi hash này sẽ được lưu vào CSDL
});
[];
