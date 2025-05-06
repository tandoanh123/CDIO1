var swiperContainer = document.querySelector(".house-slider"); // Tìm phần tử đầu tiên có lớp 'house-slider'

// Kiểm tra sự tồn tại của phần tử
if (swiperContainer) {
  // Nếu phần tử tồn tại
  // Khởi tạo Swiper
  var swiper = new Swiper(".house-slider", {
    // Tạo một instance mới của Swiper cho phần tử 'house-slider'
    spaceBetween: 30, // Đặt khoảng cách giữa các slide là 30 pixel
    centeredSlides: true, // Căn giữa slide hiện tại trong view
    autoplay: {
      // Bật tính năng tự động phát
      delay: 3500, // Thời gian giữa các slide là 7500 milliseconds (7.5 giây)
      disableOnInteraction: false, // Tiếp tục autoplay khi người dùng tương tác
    },
    pagination: {
      // Cấu hình cho phần hiển thị phân trang
      el: ".swiper-pagination", // Chỉ định phần tử cho phân trang
      clickable: true, // Cho phép nhấp vào các điểm phân trang
    },
    loop: true, // Cho phép slider quay vòng
  });
}

const toptutorSwiper = new Swiper(".toptutor-slider", {
  loop: true,
  pagination: {
    el: ".toptutor-slider .swiper-pagination",
    clickable: true,
  },
  slidesPerView: 4,

  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
});
