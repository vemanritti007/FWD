let selectedDate = "";
const userId = localStorage.getItem("userId");

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

/* ======================
   NORMAL TASKS
====================== */
async function addTask() {
    if (!selectedDate) {
        alert("Please select a date first");
        return;
    }

    const taskText = document.getElementById("taskText").value.trim();
    if (!taskText) return;

    await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            date: selectedDate,
            text: taskText,
            priority: false
        })
    });

    document.getElementById("taskText").value = "";
    loadTasksForDate();
}

async function loadTasksForDate() {
    if (!selectedDate) return;

    const res = await fetch(`${API_BASE}/tasks/${userId}/${selectedDate}`);
    const tasks = await res.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.filter(t => !t.priority).forEach(task => {
        const li = document.createElement("li");
        li.innerText = task.text;

        li.onclick = async () => {
            await fetch(`${API_BASE}/tasks/${task._id}`, { method: "DELETE" });
            loadTasksForDate();
            loadPriorityTasksForDate();
        };

        taskList.appendChild(li);
    });
}

/* ======================
   PRIORITY TASKS
====================== */
async function addPriorityTask() {
    if (!selectedDate) {
        alert("Please select a date first");
        return;
    }

    const taskText = document.getElementById("priorityText").value.trim();
    if (!taskText) return;

    await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            date: selectedDate,
            text: taskText,
            priority: true
        })
    });

    document.getElementById("priorityText").value = "";
    loadPriorityTasksForDate();
}

async function loadPriorityTasksForDate() {
    if (!selectedDate) return;

    const res = await fetch(`${API_BASE}/tasks/${userId}/${selectedDate}`);
    const tasks = await res.json();

    const list = document.getElementById("priorityList");
    list.innerHTML = "";

    tasks.filter(t => t.priority).forEach(task => {
        const li = document.createElement("li");
        li.innerText = "⚠️ " + task.text;
        li.style.color = "red";
        li.style.fontWeight = "700";

        li.onclick = async () => {
            await fetch(`${API_BASE}/tasks/${task._id}`, { method: "DELETE" });
            loadTasksForDate();
            loadPriorityTasksForDate();
        };

        list.appendChild(li);
    });
}

/* ======================
   NOTES (LOCAL)
====================== */
function saveNotes() {
    const notes = document.getElementById("notesArea").value;
    localStorage.setItem(`notes-${userId}`, notes);
    alert("Notes saved successfully!");
}

/* ======================
   USER PROFILE
====================== */
function loadUserProfile() {
    const username = localStorage.getItem("username");
    const profilePic = localStorage.getItem("profilePic");

    const nameEl = document.getElementById("username");
    const picEl = document.getElementById("profilePic");

    nameEl.innerText = username || "User";
    picEl.src = profilePic || "pictures/user.png";
}

/* ======================
   PAGE LOAD
====================== */
window.onload = () => {
    const saved = localStorage.getItem(`notes-${userId}`);
    if (saved) document.getElementById("notesArea").value = saved;

    loadUserProfile();
    generateCalendar();
    activateSidebar();
};

/* ======================
   CALENDAR
====================== */
function generateCalendar() {
    const calendar = document.getElementById("calendar");
    const date = new Date();

    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = date.toLocaleString("default", { month: "long" });

    calendar.innerHTML = `<h3>${monthName} ${year}</h3>`;

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(d => {
        const h = document.createElement("div");
        h.className = "calendar-header";
        h.innerText = d;
        grid.appendChild(h);
    });

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));

    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.innerText = day;

        const fullDate = `${year}-${monthIndex + 1}-${day}`;
        cell.onclick = () => selectDate(fullDate, cell);

        grid.appendChild(cell);
    }

    calendar.appendChild(grid);
}

function selectDate(date, element) {
    selectedDate = date;
    document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("active"));
    element.classList.add("active");

    loadTasksForDate();
    loadPriorityTasksForDate();
}

/* ======================
   UI
====================== */
function activateSidebar() {
    document.querySelectorAll(".menu-list li").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".menu-list li").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });
}

function logoutUser() {
    localStorage.clear();
    window.location.href = "first_page.html";
}
