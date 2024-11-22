const toggleButton = document.getElementById("mode-toggle");
const body = document.body;

// Set dark mode as default
body.classList.add("dark-mode");

// Update button text on load
toggleButton.textContent = "Light";

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  toggleButton.textContent = body.classList.contains("dark-mode")
    ? "Light"
    : "Dark";
});
