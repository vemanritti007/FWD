// login_page_script.js
async function loginUser() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Invalid credentials");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);

    alert("Login successful!");
    window.location.href = "main_page.html";
  } catch (err) {
    alert("Server error. Try again later.");
  }
}
