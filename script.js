(function () {
  const menuBtn = document.querySelector("[data-menu-btn]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", () => {
      const open = panel.getAttribute("data-open") === "true";
      panel.setAttribute("data-open", String(!open));
      panel.style.display = open ? "none" : "block";
      menuBtn.setAttribute("aria-expanded", String(!open));
    });
  }

  // Send quote request to WhatsApp (no backend required)
  const form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const service = document.getElementById("service").value;
      const location = document.getElementById("location").value.trim();
      const date = document.getElementById("date").value.trim();
      const message = document.getElementById("message").value.trim();

      const text =
`Hi KEL, I need a quote.

Name: ${name}
My Phone: ${phone}
Service: ${service}
Location: ${location}
Date/Period: ${date || "-"}

Details:
${message}`;

      const waNumber = "27768641645"; // KEL WhatsApp number (SA format)
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

      window.open(waUrl, "_blank", "noopener");
    });
  }
})();
