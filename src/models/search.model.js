const db = require("../config/db/connect");

function Search() {}

Search.find = function (req, res, callback) {
  const {
    location = "",
    start_time: startTime,
    end_time: endTime,
    gender = "Other",
    price,
  } = req.query;

  const locationSearch = location
    .replace(/Thành phố\s*/i, "")
    .replace(/Tỉnh\s*/i, "")
    .trim();
  req.session.search = {
    location,
    start_time: startTime,
    end_time: endTime,
    gender,
    price,
  };

  let sql = `
    SELECT DISTINCT T.tutor_id, T.tutor_name, T.gender, T.hourly_rate
    FROM tutor AS T
    INNER JOIN tutor_schedule AS SCH ON T.tutor_id = SCH.tutor_id
    INNER JOIN (
      SELECT prov_id FROM province WHERE prov_name LIKE ?
      UNION
      SELECT prov_id FROM city WHERE city_name LIKE ?
    ) AS LOC ON T.prov_id = LOC.prov_id
    WHERE SCH.is_available = TRUE
      AND (? <= SCH.end_datetime AND ? >= SCH.start_datetime)
      AND T.gender = ?
  `;

  const params = [
    `%${locationSearch}%`,
    `%${locationSearch}%`,
    startTime,
    endTime,
    gender,
  ];

  if (price) {
    const priceFilters = [];
    if (price.includes("Dưới VND 200.000"))
      priceFilters.push(`T.hourly_rate < 200000`);
    if (price.includes("VND 200.000 - VND 500.000"))
      priceFilters.push(`T.hourly_rate BETWEEN 200000 AND 500000`);
    if (price.includes("VND 500.000 - VND 1.000.000"))
      priceFilters.push(`T.hourly_rate BETWEEN 500000 AND 1000000`);
    if (price.includes("Trên VND 1.000.000"))
      priceFilters.push(`T.hourly_rate > 1000000`);
    if (priceFilters.length > 0) {
      sql += ` AND (${priceFilters.join(" OR ")})`;
    }
  }

  db.query(sql, params, (err, result) => {
    console.log("SQL Query Result:", result);
    callback(err, res, result);
  });
};

Search.hintSearch = (searchKey, callback) => {
  let sql = `SELECT prov_name, city_name FROM province, city`;
  let sql2 = `SELECT prov_name, city_name FROM province, city`;
  let searchKeyArray = searchKey.split(" ");

  if (searchKey) {
    sql += ` WHERE LOWER(prov_name) LIKE '%${searchKeyArray[0]}%'
                 OR LOWER(city_name) LIKE '%${searchKeyArray[0]}%'`;
    searchKeyArray.forEach((key) => {
      sql += ` OR LOWER(prov_name) LIKE '%${key}%'
                     OR LOWER(city_name) LIKE '%${key}%'`;
    });
  }

  db.query(sql, (err, result) => {
    if (result[0]) {
      callback(err, result);
    } else {
      db.query(sql2, (err, result2) => {
        callback(err, result2);
      });
    }
  });
};

module.exports = Search;
