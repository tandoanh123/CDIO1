// Hàm chọn radio và cập nhật bộ lọc
function selectRadio(radioId) {
  document.getElementById(radioId).checked = true;
  filterResults();
}

// Hàm thu thập các bộ lọc đã chọn
function getFilterValues() {
  const price = Array.from(
    document.querySelectorAll('input[name="price"]:checked')
  ).map((el) => el.value);
  const experience = Array.from(
    document.querySelectorAll('input[name="experience"]:checked')
  ).map((el) => el.value);
  const rating = Array.from(
    document.querySelectorAll('input[name="rating"]:checked')
  ).map((el) => el.value);
  const sort =
    document.querySelector('input[name="sort"]:checked')?.value || "";

  // Lấy các tham số tìm kiếm ban đầu từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const location = urlParams.get("location") || "";
  const start_time = urlParams.get("start_time") || "";
  const end_time = urlParams.get("end_time") || "";
  const gender = urlParams.get("gender") || "Other";

  return {
    price,
    experience,
    rating,
    sort,
    location,
    start_time,
    end_time,
    gender,
  };
}

// Hàm gửi yêu cầu lọc và cập nhật kết quả
function filterResults() {
  const filters = getFilterValues();
  console.log("Filters sent:", filters);
  $.ajax({
    url: "/search/filter",
    method: "GET",
    data: filters,
    success: function (response) {
      console.log("Response received:", response);
      const filterSortDiv = document.getElementById("filter-sort");
      filterSortDiv.innerHTML = "";

      if (response.data && response.data.length > 0) {
        response.data.forEach((tutor) => {
          const tutorCard = `
            <div class="tutor-card">
              <div class="tutor-card__image">
                <img src="/imgs/tutor1/${tutor.tutor_img_url}" alt="${
            tutor.tutor_name
          }" />
              </div>
              <div class="tutor-card__info">
                <h3>${tutor.tutor_name}</h3>
                <p><strong>Giới tính:</strong> ${
                  tutor.gender === "M"
                    ? "Nam"
                    : tutor.gender === "F"
                    ? "Nữ"
                    : "Khác"
                }</p>
                <p><strong>Giá mỗi giờ:</strong> ${
                  tutor.hourly_rate_formatted
                }</p>
                <p><strong>Kinh nghiệm:</strong> ${
                  tutor.experience_years
                } năm</p>
                <p><strong>Đánh giá:</strong> ${tutor.tutor_avg_rating.toFixed(
                  1
                )}/10</p>
                <p><strong>Khu vực:</strong> ${tutor.city_name}, ${
            tutor.prov_name
          }</p>
                <a href="/search/${
                  tutor.tutor_id
                }" class="btn btn-primary">Xem chi tiết</a>
              </div>
            </div>
          `;
          filterSortDiv.innerHTML += tutorCard;
        });
      } else {
        filterSortDiv.innerHTML = "<p>Không tìm thấy gia sư phù hợp.</p>";
      }
    },
    error: function (xhr, status, error) {
      console.error("Error filtering results:", status, error);
      const filterSortDiv = document.getElementById("filter-sort");
      filterSortDiv.innerHTML = "<p>Lỗi khi tải kết quả. Vui lòng thử lại.</p>";
    },
  });
}

// Gắn sự kiện cho các checkbox và radio
document
  .querySelectorAll(
    'input[name="price"], input[name="experience"], input[name="rating"], input[name="sort"]'
  )
  .forEach((input) => {
    input.addEventListener("change", filterResults);
  });

// Gọi hàm lọc khi tải trang để hiển thị kết quả ban đầu
document.addEventListener("DOMContentLoaded", filterResults);
