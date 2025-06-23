// Global JavaScript functions
console.log("MedSync loaded successfully");

// Form validation helper
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input[required]");

  for (let input of inputs) {
    if (!input.value.trim()) {
      input.focus();
      return false;
    }
  }
  return true;
}

// Show loading state on form submission
document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Please wait...";

        // Re-enable after 5 seconds in case of error
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent =
            submitButton.dataset.originalText || "Submit";
        }, 5000);
      }
    });
  });
});
