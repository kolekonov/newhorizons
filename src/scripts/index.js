document.addEventListener("DOMContentLoaded", () => {
  MicroModal.init();


  const swiper = new Swiper(".swiper", {
    direction: "vertical",
    // loop: true,
    autoplay: {
      delay: 2000,
    },
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });
});
