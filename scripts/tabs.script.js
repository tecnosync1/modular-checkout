document.addEventListener("DOMContentLoaded", () => {
  // elements
  const btnTabs = document.querySelectorAll(".btn__tab[role='tab']");
  const boxTabs = document.querySelectorAll('.tab__content[role="tabpanel"]');

  btnTabs.forEach((tab) => {
    // events
    tab.addEventListener("click", (ev, idx) => {
      // const tabIndex = JSON.parse(tab.getAttribute("tabindex").toString()) || 0;
      const isSelected = JSON.parse(tab.getAttribute("aria-selected").toString()) || false;
      const order = JSON.parse(tab.getAttribute("data-order").toString()) || 0;

      if (!isSelected) {
        // button
        tab.setAttribute("tabindex", 0);
        tab.setAttribute("aria-selected", true);
        tab.classList.replace("inactive", "active");
        // box
        boxTabs[order].setAttribute("tabindex", 0);
        boxTabs[order].setAttribute("data-state", "active");

        const position = Math.max(1 - order, 0);
        btnTabs[position].setAttribute("tabindex", -1);
        btnTabs[position].setAttribute("aria-selected", false);
        btnTabs[position].classList.replace("active", "inactive");
        // box
        boxTabs[position].setAttribute("tabindex", -1);
        boxTabs[position].setAttribute("data-state", "inactive");
      }
    });
  });
});
