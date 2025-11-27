const baseUrl = window.location.origin;   // Recommended

document.getElementById("saveBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const text = document.getElementById("content").value;   // FIXED

  if (!username) return alert("Please enter a username");

  try {
    const response = await fetch(baseUrl + "/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, text })   // CORRECT
    });

    const result = await response.json();
    alert(result.message || "Saved Successfully ✔");
  } catch (error) {
    console.error(error);
    alert("Network Error ❌");
  }
});

document.getElementById("loadBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Please enter a username");

  try {
    const response = await fetch(baseUrl + "/load/" + encodeURIComponent(username));
    const result = await response.json();

    document.getElementById("content").value = result.text || "";   // CORRECT
    
  } catch (error) {
    console.error(error);
    alert("Network Error ❌");
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

toggleEye.addEventListener("click", () => {
  if (usernameInput.type === "password") {
    usernameInput.type = "text";
    toggleEye.textContent = "🔒"; // change icon when visible
  } else {
    usernameInput.type = "password";
    toggleEye.textContent = "👁️";
  }
});
