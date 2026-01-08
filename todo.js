document.addEventListener("DOMContentLoaded", () => {

  /* Helpers */

  function normalizeDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getTodayTasks(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(
      t => normalizeDate(t.date)?.getTime() === today.getTime()
    );
  }

  function getTomorrowTasks(tasks) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tasks.filter(
      t => normalizeDate(t.date)?.getTime() === tomorrow.getTime()
    );
  }

  function getFutureTasks(tasks) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tasks.filter(t => normalizeDate(t.date) > tomorrow);
  }

  /* LOAD TASKS */

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  /*SORT BY TIME*/

  function sortByTime(list) {
    const toMinutes = (time) => {
      if (!time) return Infinity;
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    return [...list].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  }

  /*renderDynamicToday*/
 function renderDynamicToday(list) {
  const container = document.getElementById("todayTasks");
  if (!container) return;

  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        No tasks created.<br />
        Create a task to view here.
      </div>
    `;
    return;
  }

  const sortedList = sortByTime(list);
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];

  container.innerHTML = sortedList.map((t) => {

    const realIndex = stored.findIndex(
      x => x.title === t.title && x.date === t.date
    );

    const projectClass = t.project
      ? t.project.toLowerCase()
      : "general";

    return `
      <div class="task task-row" data-index="${realIndex}" data-type="dynamic">

        <div class="task-left">
          <input type="checkbox">
          <div>
            <p class="task-title">${t.title}</p>
            <div class="task-meta">
              <span class="time">
                <i class="fa-solid fa-clock"></i> ${t.time || "No time"}
              </span>
              <span class="label ${projectClass}">
                ${t.project || "General"}
              </span>
            </div>
          </div>
        </div>

        <div class="change">
          <div class="edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>

          <div class="update">
            <i class="fa-solid fa-caret-down"></i>
          </div>

          <ul class="dropdown">
            <li><i class="fa-solid fa-check"></i> Complete</li>
            <li><i class="fa-solid fa-spinner"></i> In Progress</li>
            <li><i class="fa-solid fa-clock"></i> Pending</li>
          </ul>

          <div class="delete">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>

      </div>
    `;
  }).join("");
}


  /*Dropdown*/

  document.addEventListener("click", e => {

    document.querySelectorAll(".dropdown")
      .forEach(d => d.classList.remove("show"));

    const updateBtn = e.target.closest(".update");

    if (updateBtn) {
      const dropdown = updateBtn.nextElementSibling;
      dropdown.classList.toggle("show");
      e.stopPropagation();
    }
  });

  /*progress bar*/

  function updateProgressBar() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "complete").length;

    const percent = total === 0
      ? 0
      : Math.round((completed / total) * 100);

    const fill = document.querySelector(".progress-fill");
    const label = document.querySelector(".progress-percent");

    if (fill) fill.style.width = percent + "%";
    if (label) label.textContent = percent + "%";
  }

  /* status change */

  document.addEventListener("click", e => {
    const statusItem = e.target.closest(".dropdown li");
    if (!statusItem) return;

    const row = statusItem.closest(".task-row");
    if (!row) return;

    const realindex = Number(row.dataset.index);

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const todayTasks = getTodayTasks(stored);
    const task = todayTasks[index];
    if (!task) return;

    const realIndex = stored.findIndex(
      t => t.title === task.title && t.date === task.date
    );

    if (realIndex === -1) return;

    const text = statusItem.textContent.toLowerCase();

    if (text.includes("complete")) stored[realIndex].status = "complete";
    if (text.includes("progress")) stored[realIndex].status = "progress";
    if (text.includes("pending")) stored[realIndex].status = "pending";

    localStorage.setItem("tasks", JSON.stringify(stored));

    updateProgressBar();
    renderDynamicToday(getTodayTasks(stored));
  });

  /*filter tasks by status*/

  function filterTasksByStatus(status) {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const todayTasks = getTodayTasks(stored);

    let filtered;

    if (status === "all") {
      filtered = todayTasks;
    } else {
      filtered = todayTasks.filter(t => t.status === status);
    }

    renderDynamicToday(filtered);
  }

  document.getElementById("nav-complete")
    ?.addEventListener("click", () => filterTasksByStatus("complete"));

  document.getElementById("nav-progress")
    ?.addEventListener("click", () => filterTasksByStatus("progress"));

  document.getElementById("nav-pending")
    ?.addEventListener("click", () => filterTasksByStatus("pending"));

  /*Search*/

  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();

      const stored = JSON.parse(localStorage.getItem("tasks")) || [];
      const todayTasks = getTodayTasks(stored);

      if (!query) {
        renderDynamicToday(todayTasks);
        return;
      }

      const filtered = todayTasks.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.project && t.project.toLowerCase().includes(query)) ||
        (t.status && t.status.toLowerCase().includes(query))
      );

      renderDynamicToday(filtered);
    });
  }

  /* date helpers */

  function normalizeDateLocal(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function isTomorrowLocal(dateStr) {
    const d = normalizeDateLocal(dateStr);

    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(0, 0, 0, 0);

    return d.getTime() === t.getTime();
  }

  function isThisWeekLocal(dateStr) {
    if (isTomorrowLocal(dateStr)) return false;

    const d = normalizeDateLocal(dateStr);
    const now = new Date();

    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return d >= start && d < end;
  }

  function getDayName(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "long" });
  }

  /*RENDER UPCOMING*/

  function renderUpcoming() {
    const container = document.getElementById("upcomingTasks");
    if (!container) return;

    container.innerHTML = "";

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];

    if (!stored.length) {
      container.innerHTML = `
        <div class="empty-state">
          No upcoming tasks.<br />
          Create a task to view here.
        </div>
      `;
      return;
    }

    const tomorrowTasks = stored.filter(t => isTomorrowLocal(t.date));
    const weekTasks = stored.filter(
      t => !isTomorrowLocal(t.date) && isThisWeekLocal(t.date)
    );

    if (tomorrowTasks.length) {
      container.innerHTML += `
        <div class="up-card">
          <h4>TOMORROW</h4>
          ${tomorrowTasks.map(t => `
            <div class="up-item">
              <div class="up-icon blue">
                <i class="fa-solid fa-calendar"></i>
              </div>
              <div class="up-text">
                <p class="title">${t.title}</p>
                <span class="sub">${t.project}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (weekTasks.length) {
      container.innerHTML += `
        <div class="up-card">
          <h4>THIS WEEK</h4>
          ${weekTasks.map(t => `
            <div class="up-item">
              <div class="up-icon green">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <div class="up-text">
                <p class="title">${t.title}</p>
                <span class="sub">
                  ${getDayName(t.date)} • ${t.project}
                </span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  /*TODAY DATE*/

  function setTodayDate() {
    const todayEl = document.getElementById("todayDate");
    if (!todayEl) return;

    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    todayEl.textContent = formatted;
  }

  setTodayDate();

  /* PRIORITY */

  let selectedPriority = "Med";

  document.querySelectorAll(".priority button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".priority button")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      selectedPriority = btn.textContent.trim();
    });
  });

  /*CREATE TASK*/

  const taskForm = document.querySelector(".task-form");

  if (taskForm) {
    taskForm.addEventListener("submit", e => {
      e.preventDefault();

      const newTask = {
        title: taskForm.querySelector('input[type="text"]').value,
        date: taskForm.querySelector('input[type="date"]').value,
        time: taskForm.querySelector('input[type="time"]').value,
        project: taskForm.querySelector("select").value,
        priority: selectedPriority,
        status: "incomplete"
      };

      const stored = JSON.parse(localStorage.getItem("tasks")) || [];
      stored.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(stored));

      alert("Task saved");

      setTimeout(() => {
        window.location.href = "Home.html";
      }, 1000);

      taskForm.reset();
    });
  }


  

  /*Initial render*/
  renderDynamicToday(getTodayTasks(tasks));
  renderUpcoming();

});

/*add task*/
const addTaskBtn = document.querySelector(".add-task");

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", () => {
    window.location.href = "create.html";
  });
}
