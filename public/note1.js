const baseUrl = window.location.origin;   // Recommended

document.getElementById("saveBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const text = document.getElementById("content").value;

  if (!username) return showAlert("Please enter a username");

  try {
    const response = await fetch(baseUrl + "/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, text })
    });

    const result = await response.json();
    showAlert(result.message || "Saved Successfully ✔");
  } catch (error) {
    console.error(error);
    showAlert("Network Error ❌");
  }
});

document.getElementById("loadBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  if (!username) return showAlert("Please enter a username");

  try {
    const response = await fetch(baseUrl + "/load/" + encodeURIComponent(username));

    // 🔥 Alert ONLY if user not found
    if (response.status === 404) {
      const data = await response.json();
      showAlert(data.message || "User not found ❌");
      return;
    }

    // ⚠ Any other server error
    if (!response.ok) {
      showAlert("Server Error ❌");
      return;
    }

    // ✅ SUCCESS (NO ALERT)
    const result = await response.json();
    document.getElementById("content").value = result.text || "";

  } catch (error) {
    console.error(error);
    showAlert("Network Error ❌");
  }
});


function toggleTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    document.body.style.background = "linear-gradient(135deg, #000428, #023e73ff)";
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.style.background = "linear-gradient(135deg, #1d2671, #c33764)";
    themeToggle.textContent = "🌙 Dark Mode";
  }
}

const usernameInput = document.getElementById("username");
const toggleEye = document.getElementById("toggleEye");
const eyeIcon = toggleEye.querySelector("i");

toggleEye.addEventListener("click", () => {
  if (usernameInput.type === "password") {
    usernameInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    usernameInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
});


function showAlert(message) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.textContent = message;
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2000);
}
