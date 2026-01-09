document.addEventListener("DOMContentLoaded", () => {

  /* Helpers */
  /*Convert date string to date object*/
  function normalizeDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }
  /*manually convert date string to date object*/
  function normalizeDateStrict(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  /*helper to get today's date*/
  function getTodayTasks(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(t => {
      const d = normalizeDateStrict(t.date);
      if (!d) return false;
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
  }

  /*helper to get tomorrow's date*/
  function getTomorrowTasks(tasks) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tasks.filter(
      t => normalizeDate(t.date)?.getTime() === tomorrow.getTime()
    );
  }
  /*helper to get future date*/
  function getFutureTasks(tasks) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tasks.filter(t => normalizeDate(t.date) > tomorrow);
  }
  /* LOAD TASKS */

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  /*SORT BY TIME*/

  function sortByTime(list) {  //sort tasks by time
    const toMinutes = (time) => {
      if (!time) return Infinity;
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m; // convert to minutes
    };

    return [...list].sort((a, b) => toMinutes(a.time) - toMinutes(b.time)); //make a copy of the list and sort it
  }


  function updateTodayTaskCount() { //calculate today's task count
    const el = document.querySelector(".task-count");
    if (!el) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || []; //read saved tasks

    const today = new Date();//get today date
    today.setHours(0, 0, 0, 0);

    let count = 0;

    tasks.forEach(t => {
      if (!t.date) return; //skip tasks without a date

      const d = new Date(t.date + "T00:00:00");
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === today.getTime() && t.status !== "complete") { //check if task is today and not complete
        count++;//if not complete, increment count
      }
    });

    el.textContent = count;
  }
  // updateTodayTaskCount();



  /*renderDynamicToday*/
  function renderDynamicToday(list) {//render today's tasks
    const container = document.getElementById("todayTasks");
    if (!container) return;

    container.innerHTML = "";//clear old tasks

    if (!list.length) {
      container.innerHTML = `
      <div class="empty-state">
        No tasks created.<br />
        Create a task to view here.
      </div>
    `;
      return;
    }

    const sortedList = sortByTime(list);//sort tasks by time
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];

    container.innerHTML = sortedList.map((t) => {

      const realIndex = stored.findIndex(
        x => x.title === t.title && x.date === t.date //list  passed filter and sort tasks
      );

      const projectClass = t.project
        ? t.project.toLowerCase()
        : "general";

      return `
      <div class="task task-row" data-index="${realIndex}" data-type="dynamic">

        <div class="task-left">
          <input type="checkbox" ${t.status === "complete" ? "checked" : ""}>

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
            <li><i class="fa-solid fa-spinner"></i> Progress</li>
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

  function updateProgressBar(initial = false) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const todayTasks = getTodayTasks(tasks);

    const total = todayTasks.length;//count total tasks
    const completed = todayTasks.filter(t => t.status === "complete").length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);//calculate percentage(1/5=20%)

    const fill = document.querySelector(".progress-fill");//get progress bar
    const label = document.querySelector(".progress-percent");//text show percentage

    if (!fill || !label) return;

    if (initial) fill.style.transition = "none";

    fill.style.width = percent + "%";
    label.textContent = percent + "%";

    if (initial) {
      requestAnimationFrame(() => {
        fill.style.transition = "width 0.3s ease";
      });
    }
  }




  /* status change */

  document.addEventListener("click", e => {
    const statusItem = e.target.closest(".dropdown li");
    if (!statusItem) return;

    const row = statusItem.closest(".task-row");
    if (!row) return;


    const realIndex = Number(row.dataset.index);

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!stored[realIndex]) return;

    const text = statusItem.textContent.toLowerCase().trim();
    if (text.includes("complete")) {
      stored[realIndex].status = "complete";
    } else if (text.includes("progress")) {
      stored[realIndex].status = "progress";
    } else if (text.includes("pending")) {
      stored[realIndex].status = "pending";
    }

    localStorage.setItem("tasks", JSON.stringify(stored));

    renderDynamicToday(getTodayTasks(stored));
    renderUpcoming();
    updateProgressBar(true);
    updateTodayTaskCount();
  });


  /*filter tasks by status*/

  function filterTasksByStatus(status) {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const todayTasks = getTodayTasks(stored);

    let filtered;

    if (status === "all") {
      filtered = todayTasks;
      // console.log(filtered);
    } else {
      filtered = todayTasks.filter(t => t.status === status);
      console.log(filtered);
    }

    renderDynamicToday(filtered);
  }
  document.getElementById("nav-complete1")
    ?.addEventListener("click", () => filterTasksByStatus("complete"));

  document.getElementById("nav-progress1")
    ?.addEventListener("click", () => filterTasksByStatus("progress"));

  document.getElementById("nav-pending1")
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

  // MODAL
  const taskModal = document.getElementById("taskModal");
  const closeModal = document.getElementById("closeModal");
  const cancelModal = document.getElementById("cancelModal");
  const addTaskBtn = document.querySelector(".add-task");
  const newListBtn = document.querySelector(".new-list");
  let editIndex = null; // track edit mode

  function openModal() {
    taskModal.classList.add("active");
  }

  function closeTaskModal() {
    taskModal.classList.remove("active");
    taskForm.reset();
    editIndex = null;
  }




  // Open modal
  addTaskBtn?.addEventListener("click", openModal);
  newListBtn?.addEventListener("click", openModal);

  // Close modal
  closeModal?.addEventListener("click", closeTaskModal);
  cancelModal?.addEventListener("click", closeTaskModal);

  // Close on outside click
  taskModal?.addEventListener("click", e => {
    if (e.target === taskModal) closeTaskModal();
  });

  // CHECKBOX update instead of click
  document.addEventListener("change", e => {
    const checkbox = e.target;

    if (!checkbox.matches('.task-row input[type="checkbox"]')) return;

    const row = checkbox.closest(".task-row");
    if (!row) return;

    const index = Number(row.dataset.index);

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!stored[index]) return;

    // Update status based on checkbox
    stored[index].status = checkbox.checked ? "complete" : "pending";

    localStorage.setItem("tasks", JSON.stringify(stored));

    // Update UI
    updateProgressBar();
    updateTodayTaskCount();
  });

  // EDIT TASK (OPEN MODAL WITH DATA)
  document.addEventListener("click", e => {
    const editBtn = e.target.closest(".edit");
    if (!editBtn) return;

    e.preventDefault(); //  important if inside <a>

    const row = editBtn.closest(".task-row") || editBtn.closest(".up-item");
    if (!row) return;

    const index = Number(row.dataset.index);
    if (Number.isNaN(index)) return;

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = stored[index];
    if (!task) return;

    const taskForm = document.querySelector(".task-form");
    if (!taskForm) return;

    editIndex = index;

    // Fill form
    taskForm.querySelector('input[type="text"]').value = task.title || "";
    taskForm.querySelector('input[type="date"]').value = task.date || "";
    taskForm.querySelector('input[type="time"]').value = task.time || "";
    taskForm.querySelector("select").value = task.project || "";

    // Priority
    selectedPriority = task.priority || "Med";
    document.querySelectorAll(".priority button").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.textContent.trim() === selectedPriority
      );
    });


    document.getElementById("modal-title").textContent = "Edit Task";
    document.getElementById("modal-subtitle").textContent =
      "Update the details below.";
    document.getElementById("submit-btn").innerHTML =
      '<i class="fa-solid fa-pen"></i> Update Task';

    openModal();
  });



  // DELETE TASK
  document.addEventListener("click", e => {
    const deleteBtn = e.target.closest(".delete");
    if (!deleteBtn) return;

    const row =
      deleteBtn.closest(".task-row") ||
      deleteBtn.closest(".up-item");

    const index = Number(row.dataset.index);

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];

    if (!stored[index]) return;

    if (!confirm("Delete this task?")) return;

    stored.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(stored));

    renderDynamicToday(getTodayTasks(stored));
    renderUpcoming();
    updateProgressBar();
  });



  /* date helpers */

  function normalizeDateLocal(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0); // 🔴 normalize time
    return d;
  }

  function isTomorrowLocal(dateStr) {
    const d = normalizeDateLocal(dateStr);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return d.getTime() === tomorrow.getTime();
  }

  function isThisWeekLocal(dateStr) {
    const d = normalizeDateLocal(dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ❌ exclude today and tomorrow
    if (d <= today || isTomorrowLocal(dateStr)) return false;

    // Week start = Monday
    const start = new Date(today);
    const day = start.getDay() || 7; // Sunday = 7
    start.setDate(start.getDate() - day + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    end.setHours(0, 0, 0, 0);

    return d >= start && d < end;
  }

  function getDayName(dateStr) {
    const d = normalizeDateLocal(dateStr);
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

    const tomorrowTasks = stored
      .map((t, i) => ({ ...t, _index: i }))
      .filter(t => isTomorrowLocal(t.date));

    const weekTasks = stored
      .map((t, i) => ({ ...t, _index: i }))
      .filter(t => !isTomorrowLocal(t.date) && isThisWeekLocal(t.date));


    if (tomorrowTasks.length) {
      container.innerHTML += `
        <div class="up-card">
          <h4>TOMORROW</h4>
          ${tomorrowTasks.map(t => `
            <div class="up-item" data-index="${t._index}">
              <div class="up-icon blue">
                <i class="fa-solid fa-calendar"></i>
              </div>
              
              <div class="up-text">
                <p class="title">${t.title}</p>
                <span class="sub">${t.project}</span>
              </div>
              <div class="change">
               <div class="edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>
          <div class="delete">
            <i class="fa-solid fa-trash"></i>
          </div>
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
            <div class="up-item" data-index="${t._index}">
              <div class="up-icon green">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <div class="up-text">
                <p class="title">${t.title}</p>
                <span class="sub">
                  ${getDayName(t.date)} • ${t.project}
                </span>
              </div>
              <div class="change">
               <div class="edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>
          <div class="delete">
            <i class="fa-solid fa-trash"></i>
          </div>
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

  if (taskForm && !taskForm.dataset.bound) {
    taskForm.dataset.bound = "true";

    taskForm.addEventListener("submit", e => {
      e.preventDefault();

      const stored = JSON.parse(localStorage.getItem("tasks")) || [];

      const newTask = {
        title: taskForm.querySelector('input[type="text"]').value,
        date: taskForm.querySelector('input[type="date"]').value,
        time: taskForm.querySelector('input[type="time"]').value,
        project: taskForm.querySelector("select").value,
        priority: selectedPriority,
        status: editIndex !== null
          ? stored[editIndex].status   // keep old status
          : "pending"
      };

      if (editIndex !== null) {
        // UPDATE existing task
        stored[editIndex] = newTask;
      } else {
        // CREATE new task
        stored.push(newTask);
      }

      localStorage.setItem("tasks", JSON.stringify(stored));

      editIndex = null;
      closeTaskModal(); // make sure this exists

      alert("Task saved");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

      taskForm.reset();
    });
  }






  /*Initial render*/
  function loadPageContext() {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get("status");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Update active nav state
    document.querySelectorAll(".menu a").forEach(a => a.classList.remove("active"));
    if (statusParam === "complete") {
      document.getElementById("nav-complete")?.classList.add("active");
    } else if (statusParam === "progress") {
      document.getElementById("nav-progress")?.classList.add("active");
    } else if (statusParam === "pending") {
      document.getElementById("nav-pending")?.classList.add("active");
    } else {
      document.getElementById("nav-all")?.classList.add("active");
    }

    if (statusParam) {
      // We are on a status page (all tasks of that status)
      const pageTitle = document.getElementById("pageTitle");
      if (pageTitle) {
        const titles = {
          "complete": "Completed Tasks",
          "progress": "In Progress",
          "pending": "Pending Tasks"
        };
        pageTitle.textContent = titles[statusParam] || "Tasks";
      }

      // Filter ALL tasks by status (not just today)
      const filtered = tasks.filter(t => t.status === statusParam);
      renderDynamicToday(filtered); // reusing this function as it renders the list

      // Hide upcoming section on status pages as we show a simple list
      const upcoming = document.querySelector(".upcoming");
      if (upcoming) upcoming.style.display = "none";

    } else {
      // Dashboard / Home (Today's tasks)
      renderDynamicToday(getTodayTasks(tasks));
      renderUpcoming();
    }

    updateProgressBar(true);
    updateTodayTaskCount();
  }

  loadPageContext();


});

/*add task*/
const addTaskBtn = document.querySelector(".add-task");
const modal = document.getElementById("taskModal");

if (addTaskBtn && modal) {
  addTaskBtn.addEventListener("click", () => {
    modal.classList.add("show");
  });
}
document.getElementById("closeModal")?.addEventListener("click", () => {
  modal.classList.remove("show");
});

document.getElementById("cancelModal")?.addEventListener("click", () => {
  modal.classList.remove("show");
});

const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

menuToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay?.classList.toggle("show");
});

overlay?.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});