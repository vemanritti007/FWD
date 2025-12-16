const API_BASE = "http://localhost:5000/api";
const userId = localStorage.getItem("userId");

if (!userId) {
    alert("Please login again");
    window.location.href = "login.html";
}

/* ===========================
   LOAD PROFILE FROM BACKEND
=========================== */
window.onload = async () => {
    try {
        const res = await fetch(`${API_BASE}/users/${userId}`);
        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to load profile");
            return;
        }

        document.getElementById("fullName").value = data.name || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("username").value = data.username || "";

        document.querySelector(".profile-name").innerText =
            data.name || "User Name";

        document.querySelector(".email").innerHTML =
            `<i class="fa-solid fa-envelope"></i> ${data.email || "email@example.com"}`;

        if (data.profilePhoto) {
            document.querySelector(".profile-picture").src = data.profilePhoto;
        }
    } catch (err) {
        console.error(err);
        alert("Server error while loading profile");
    }
};

/* ===========================
   SAVE PROFILE TO BACKEND
=========================== */
async function saveProfile() {
    const userId = localStorage.getItem("userId");

    const body = {
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        username: document.getElementById("username").value.trim()
    };

    const imgSrc = document.querySelector(".profile-picture").src;

    // send photo ONLY if user changed it
    if (imgSrc && imgSrc.startsWith("data:image")) {
        body.profilePhoto = imgSrc;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Profile update failed");
            return;
        }

        alert("Profile updated successfully!");
    } catch (err) {
        console.error(err);
        alert("Server error while saving profile");
    }
}


/* ===========================
   PROFILE PHOTO HANDLING
=========================== */
const photoInput = document.getElementById("photoInput");
const profilePicture = document.querySelector(".profile-picture");

photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        profilePicture.src = e.target.result;
        alert("Photo updated. Click SAVE to store it.");
    };
    reader.readAsDataURL(file);
});
