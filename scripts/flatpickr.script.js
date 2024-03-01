const currentYear = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", function (ev) {
  flatpickr("#arrival-date", {
    dateFormat: "d-m-Y",
    minDate: "today",
    maxDate: `31.12.${currentYear}`,
    disableMobile: true,
    onReady: function (_, _, fp) {
      fp.calendarContainer.classList.add("bg_white", "shadow_2xl", "rounded_base");
    },
  });

  flatpickr("#arrival-time", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    // minTime: "16:00",
    // maxTime: "22:30"
    disableMobile: true,
  });

  flatpickr("#return-date", {
    dateFormat: "d-m-Y",
    minDate: "today",
    maxDate: `31.12.${currentYear}`,
    disableMobile: "true",
    onReady: function (_, _, fp) {
      fp.calendarContainer.classList.add("bg_white", "shadow_2xl", "rounded_base");
    },
  });

  flatpickr("#return-time", {
    // minDate: "today",
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    // minTime: "16:00",
    // maxTime: "22:30"
    disableMobile: true,
  });
});
