const db = require("../config/db/connect");
const index = require("../models/index.model");
const Search = require("../models/search.model");

class SearchController {
  // [GET] /search/results
  find(req, res) {
    console.log("Search params:", req.query);
    Search.find(req, res, function (err, res, result) {
      console.log("Search result:", result);
      if (err) {
        res
          .status(500)
          .json({ statusCode: 500, message: "Lỗi truy cập cơ sở dữ liệu" });
        throw err;
      }

      if (result.length > 0) {
        let tutorIds = result.map((obj) => obj.tutor_id).join(",");
        let sql = `
          SELECT DISTINCT
            T.tutor_id,
            T.tutor_name,
            T.gender,
            T.experience_years,
            T.tutor_avg_rating,
            T.tutor_img_url,
            T.hourly_rate,
            P.prov_name,
            C.city_name
          FROM tutor AS T
          INNER JOIN province AS P ON T.prov_id = P.prov_id
          INNER JOIN city AS C ON T.city_id = C.city_id
          WHERE T.tutor_id IN (${tutorIds})
        `;

        db.query(sql, (err, result1) => {
          if (err) {
            res.status(500).json({ message: "Lỗi truy cập cơ sở dữ liệu" });
            throw err;
          }

          console.log("Final result:", result1);

          result1.forEach((tutor) => {
            tutor.hourly_rate_formatted = index.toCurrency(
              Number(tutor.hourly_rate)
            );
          });

          res.status(200).render("./pages/search/results", {
            message: "Đã tìm thấy gia sư",
            user: req.session.user,
            totalPage: Math.ceil(result1.length / 10),
            data: result1,
          });
        });
      } else {
        console.log("No tutors found");
        res.status(200).render("./pages/search/results", {
          message: "Không tìm thấy gia sư",
          user: req.session.user,
          totalPage: 1,
          data: [],
        });
      }
    });
  }

  // [GET] /search/filter
  filterSortResult(req, res) {
    const {
      experience,
      rating,
      price,
      sort,
      location,
      start_time,
      end_time,
      gender,
    } = req.query;

    Search.find(req, res, function (err, res, result) {
      if (err) {
        res.status(500).json({ message: "Lỗi truy cập cơ sở dữ liệu" });
        throw err;
      }

      if (result.length > 0) {
        let tutorIds = result.map((obj) => obj.tutor_id).join(",");
        let sql = `
          SELECT DISTINCT
            T.tutor_id,
            T.tutor_name,
            T.gender,
            T.experience_years,
            T.tutor_avg_rating,
            T.tutor_img_url,
            T.hourly_rate,
            P.prov_name,
            C.city_name
          FROM tutor AS T
          INNER JOIN province AS P ON T.prov_id = P.prov_id
          INNER JOIN city AS C ON T.city_id = C.city_id
          WHERE T.tutor_id IN (${tutorIds})
        `;

        if (experience) {
          const experienceFilters = [];
          if (experience.includes("Dưới 1 năm"))
            experienceFilters.push(`T.experience_years < 1`);
          if (experience.includes("1-3 năm"))
            experienceFilters.push(`T.experience_years BETWEEN 1 AND 3`);
          if (experience.includes("3-5 năm"))
            experienceFilters.push(`T.experience_years BETWEEN 3 AND 5`);
          if (experience.includes("Trên 5 năm"))
            experienceFilters.push(`T.experience_years > 5`);
          if (experienceFilters.length > 0)
            sql += ` AND (${experienceFilters.join(" OR ")})`;
        }

        if (rating) {
          const ratingFilters = [];
          if (rating.includes("4+"))
            ratingFilters.push(`T.tutor_avg_rating >= 4`);
          if (rating.includes("3+"))
            ratingFilters.push(`T.tutor_avg_rating BETWEEN 3 AND 3.99`);
          if (rating.includes("2+"))
            ratingFilters.push(`T.tutor_avg_rating BETWEEN 2 AND 2.99`);
          if (rating.includes("Dưới 2"))
            ratingFilters.push(`T.tutor_avg_rating < 2`);
          if (ratingFilters.length > 0)
            sql += ` AND (${ratingFilters.join(" OR ")})`;
        }

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
          if (priceFilters.length > 0)
            sql += ` AND (${priceFilters.join(" OR ")})`;
        }

        if (sort) {
          if (sort === "Kinh nghiệm cao đến thấp")
            sql += ` ORDER BY T.experience_years DESC`;
          if (sort === "Kinh nghiệm thấp đến cao")
            sql += ` ORDER BY T.experience_years ASC`;
          if (sort === "Đánh giá cao đến thấp")
            sql += ` ORDER BY T.tutor_avg_rating DESC`;
          if (sort === "Đánh giá thấp đến cao")
            sql += ` ORDER BY T.tutor_avg_rating ASC`;
          if (sort === "Giá cao đến thấp")
            sql += ` ORDER BY T.hourly_rate DESC`;
          if (sort === "Giá thấp đến cao") sql += ` ORDER BY T.hourly_rate ASC`;
        }

        db.query(sql, (err, result1) => {
          if (err) {
            res.status(500).json({ message: "Lỗi truy cập cơ sở dữ liệu" });
            throw err;
          }

          result1.forEach((tutor) => {
            tutor.hourly_rate_formatted = index.toCurrency(
              Number(tutor.hourly_rate)
            );
          });

          res.status(200).json({
            message:
              result1.length > 0
                ? "Đã tìm thấy gia sư"
                : "Không tìm thấy gia sư",
            data: result1,
          });
        });
      } else {
        res.status(200).json({ message: "Không tìm thấy gia sư", data: [] });
      }
    });
  }

  // [POST] /hint_search
  hintSearch(req, res) {
    const { searchKey } = req.body;
    Search.hintSearch(searchKey, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Lỗi truy cập cơ sở dữ liệu" });
        throw err;
      }
      res.status(200).json({ result });
    });
  }

  // [POST] /tutorDetails
  async getTutorDetails(req, res) {
    const tutor_id = req.body.tutor_id;

    const sql = `
      SELECT
        T.tutor_id,
        T.tutor_name,
        T.gender,
        T.experience_years,
        T.tutor_avg_rating,
        T.tutor_img_url,
        T.hourly_rate,
        P.prov_name,
        C.city_name
      FROM tutor AS T
      INNER JOIN province AS P ON T.prov_id = P.prov_id
      INNER JOIN city AS C ON T.city_id = C.city_id
      WHERE T.tutor_id = ?
    `;

    db.query(sql, [tutor_id], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Lỗi truy cập cơ sở dữ liệu" });
        throw err;
      }

      if (result.length > 0) {
        result[0].hourly_rate_formatted = index.toCurrency(
          Number(result[0].hourly_rate)
        );
        res.status(200).json({ tutorDetails: result[0] });
      } else {
        res.status(404).json({ message: "Không tìm thấy gia sư" });
      }
    });
  }

  // [GET] /search/:tutor_id
  tutorDetail(req, res) {
    const tutor_id = req.params.tutor_id;

    const sqlTutor = `
      SELECT
        T.tutor_id,
        T.tutor_name,
        T.gender,
        T.experience_years,
        T.tutor_avg_rating,
        T.tutor_img_url,
        T.hourly_rate,
        P.prov_name,
        C.city_name
      FROM tutor AS T
      INNER JOIN province AS P ON T.prov_id = P.prov_id
      INNER JOIN city AS C ON T.city_id = C.city_id
      WHERE T.tutor_id = ?
    `;

    const sqlSchedule = `
      SELECT
        schedule_id,
        start_datetime,
        end_datetime
      FROM tutor_schedule
      WHERE tutor_id = ? AND is_available = TRUE
    `;

    db.query(sqlTutor, [tutor_id], (err, tutorResult) => {
      if (err || !tutorResult[0]) {
        res.redirect("/error404");
        return;
      }

      tutorResult[0].hourly_rate_formatted = index.toCurrency(
        Number(tutorResult[0].hourly_rate)
      );

      db.query(sqlSchedule, [tutor_id], (err, scheduleResult) => {
        if (err) {
          res.redirect("/error404");
          return;
        }

        res.status(200).render("./pages/search/tutor_detail", {
          message: "Lấy thông tin gia sư thành công",
          user: req.session.user,
          tutorDetail: tutorResult[0],
          tutorSchedule: scheduleResult,
        });
      });
    });
  }

  // [POST] /search/:tutor_id/request
  submitRequest(req, res) {
    const { tutor_id, start_time, end_time, hourly_rate } = req.body;

    req.session.tutor = {
      id: parseInt(tutor_id),
      start_time,
      end_time,
      hourly_rate: parseFloat(hourly_rate),
    };

    res.redirect("/request/information");
  }
}

module.exports = new SearchController();
