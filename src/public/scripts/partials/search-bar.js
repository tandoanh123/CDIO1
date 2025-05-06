$(document).ready(function () {
  var submitButton = $(".button--submit");
  var dateRangeInput = $("#dateRange");

  // Khởi tạo date range picker
  dateRangeInput.daterangepicker({
    autoUpdateInput: false,
    minDate: moment(),
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 30,
    locale: {
      format: "DD/MM/YYYY HH:mm", // Định dạng hiển thị
      separator: " - ",
      applyLabel: "Áp dụng",
      cancelLabel: "Hủy",
      fromLabel: "Từ",
      toLabel: "Đến",
      customRangeLabel: "Tùy chỉnh",
      daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      monthNames: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      firstDay: 1,
    },
  });

  dateRangeInput.on("apply.daterangepicker", function (ev, picker) {
    $(this).val(
      picker.startDate.format("DD/MM/YYYY HH:mm") +
        " - " +
        picker.endDate.format("DD/MM/YYYY HH:mm")
    );
    $('[name="start_time"]').val(
      picker.startDate.format("YYYY-MM-DD HH:mm:ss")
    );
    $('[name="end_time"]').val(picker.endDate.format("YYYY-MM-DD HH:mm:ss"));
  });

  dateRangeInput.on("cancel.daterangepicker", function (ev, picker) {
    $(this).val("");
    $('[name="start_time"]').val("");
    $('[name="end_time"]').val("");
  });

  submitButton.on("click", function (event) {
    event.preventDefault();

    const startTime = $('[name="start_time"]').val().trim();
    const endTime = $('[name="end_time"]').val().trim();
    const location = $('[name="location"]').val().trim();
    const gender = $('[name="gender"]').val() || "Other";

    if (!startTime || !endTime || !location) {
      alert("Vui lòng nhập đầy đủ địa điểm và khoảng thời gian.");
      return;
    }

    const queryString = `location=${encodeURIComponent(
      location
    )}&start_time=${encodeURIComponent(
      startTime
    )}&end_time=${encodeURIComponent(endTime)}&gender=${encodeURIComponent(
      gender
    )}`;
    window.location.href = `/search/results?${queryString}`;
  });
});
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
