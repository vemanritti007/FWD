// signup_page_script.js
async function signupUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmpassword").value.trim();

  const errorMsg = document.getElementById("errorMsg");
  errorMsg.innerText = "";

  if (!name || !email || !username || !password || !confirmPassword) {
    errorMsg.innerText = "Please fill all fields!";
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.innerText = "Passwords do not match!";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.innerText = data.message || "Signup failed";
      return;
    }

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  } catch (err) {
    errorMsg.innerText = "Server error. Try again later.";
  }
}
