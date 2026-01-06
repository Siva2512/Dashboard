document.addEventListener("DOMContentLoaded", () => {

  /*static tasks*/
  const staticTodayTasks = [
    {
      title: "Review Q3 Financial Reports",
      time: "2:00 PM",
      label: "Work",
      timeClass: "time-work"
    },
    {
      title: "Call Dentist",
      time: "5:00 PM",
      label: "Personal",
      timeClass: "time-personal"
    },
    {
      title: "Email Marketing Team",
      time: "5:30 PM",
      label: "Work",
      timeClass: "time-last"
    }
  ];

 function renderStaticToday() {
  const container = document.getElementById("todayTasks");
  if (!container) return;

  container.innerHTML += staticTodayTasks.map((t, index) => `
    <div class="task task-row" data-index="${index}">

      <!-- LEFT CONTENT -->
      <div class="task-left">
        <input type="checkbox">
        <div>
          <p class="task-title">${t.title}</p>
          <div class="task-meta">
            <span class="time ${t.timeClass}">
              <i class="fa-solid fa-clock"></i> ${t.time}
            </span>
            <span class="label ${t.label.toLowerCase()}">${t.label}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT ICONS -->
      <div class="change">
        <div class="edit" title="Edit">
          <i class="fa-solid fa-pen-to-square"></i>
        </div>
        <div class="update" title="Expand">
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="delete" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </div>
      </div>

    </div>
  `).join("");
}


  /* helpers */
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
    return tasks.filter(t => normalizeDate(t.date)?.getTime() === today.getTime());
  }

  function getTomorrowTasks(tasks) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tasks.filter(t => normalizeDate(t.date)?.getTime() === tomorrow.getTime());
  }

  function getFutureTasks(tasks) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tasks.filter(t => normalizeDate(t.date) > tomorrow);
  }

  /* load tasks */
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  /* render dynamic tasks */

  function sortByTime(list) {
  return [...list].sort((a, b) => {
    if (!a.time) return 1;   // no time → bottom
    if (!b.time) return -1;

    const [ah, am] = a.time.split(":").map(Number);
    const [bh, bm] = b.time.split(":").map(Number);

    return ah * 60 + am - (bh * 60 + bm);
  });
}
function renderDynamicToday(list) {
  const container = document.getElementById("todayTasks");
  if (!container || !list.length) return;

  const sortedList = sortByTime(list);

  container.innerHTML += sortedList.map((t, index) => `
    <div class="task task-row" data-index="${index}" data-type="dynamic">

      <div class="task-left">
        <input type="checkbox">
        <div>
          <p class="task-title">${t.title}</p>
          <div class="task-meta">
            <span class="time">
              <i class="fa-solid fa-clock"></i> ${t.time || "No time"}
            </span>
            <span class="label">${t.project || "General"}</span>
          </div>
        </div>
      </div>

      <div class="change">
        <div class="edit"><i class="fa-solid fa-pen-to-square"></i></div>
        <div class="update"><i class="fa-solid fa-caret-down"></i></div>
        <div class="delete"><i class="fa-solid fa-trash"></i></div>
      </div>

    </div>
  `).join("");
}

/*Delete Task*/
// document.getElementById("todayTasks").addEventListener("click", e => {
//   const delBtn = e.target.closest(".delete");
//   if (!delBtn) return;

//   const row = delBtn.closest(".task-row");
//   const index = Number(row.dataset.index);
//   const type = row.dataset.type;

//   // STATIC TASK
//   if (type === "static") {
//     staticTodayTasks.splice(index, 1);
//     renderStaticToday();
//     renderDynamicToday(getTodayTasks(
//       JSON.parse(localStorage.getItem("tasks")) || []
//     ));
//   }

//   // DYNAMIC TASK
//   if (type === "dynamic") {
//     const stored = JSON.parse(localStorage.getItem("tasks")) || [];
//     const todayDynamic = getTodayTasks(stored);

//     const target = todayDynamic[index];
//     const realIndex = stored.findIndex(
//       t => t.title === target.title && t.date === target.date
//     );

//     if (realIndex !== -1) {
//       stored.splice(realIndex, 1);
//       localStorage.setItem("tasks", JSON.stringify(stored));
//     }

//     renderStaticToday();
//     renderDynamicToday(getTodayTasks(stored));
//   }
// });
/*Edit Task*/
// document.getElementById("todayTasks").addEventListener("click", e => {
//   const editBtn = e.target.closest(".edit");
//   if (!editBtn) return;

//   const row = editBtn.closest(".task-row");
//   const index = Number(row.dataset.index);
//   const type = row.dataset.type;

//   let taskToEdit = null;

//   if (type === "static") {
//     taskToEdit = {
//       ...staticTodayTasks[index],
//       _type: "static",
//       _index: index
//     };
//   }

//   if (type === "dynamic") {
//     const stored = JSON.parse(localStorage.getItem("tasks")) || [];
//     const todayDynamic = getTodayTasks(stored);
//     const target = todayDynamic[index];

//     const realIndex = stored.findIndex(
//       t => t.title === target.title && t.date === target.date
//     );

//     taskToEdit = {
//       ...stored[realIndex],
//       _type: "dynamic",
//       _index: realIndex
//     };
//   }

//   // Save task for edit
//   localStorage.setItem("editTask", JSON.stringify(taskToEdit));

//   // Redirect to form
//   window.location.href = "create.html";
// });



  /*upcoming*/
  // function renderUpcomingSection(title, list, color) {
  //   const container = document.getElementById("upcomingTasks");
  //   if (!container || !list.length) return;

  //   container.innerHTML += `
  //     <div class="up-card">
  //       <h4>${title}</h4>
  //       ${list.map(t => `
  //         <div class="up-item">
  //           <div class="up-icon ${color}">
  //             <i class="fa-solid fa-calendar"></i>
  //           </div>
  //           <div class="up-text">
  //             <p class="title">${t.title}</p>
  //             <span class="sub">${t.date} • ${t.project}</span>
  //           </div>
  //         </div>
  //       `).join("")}
  //     </div>
  //   `;
  // }

 /*static*/
const staticUpcoming = [
  {
    heading: "TOMORROW",
    color: "orange",
    items: [
      { title: "Buy Birthday Gift", sub: "Shopping List" },
      { title: "Submit Expense Report", sub: "Work" }
    ]
  },
  {
    heading: "THIS WEEK",
    color: "blue",
    items: [
      { title: "Car Service Appointment", sub: "Thursday, 9:00 AM" },
      { title: "Book Flight to NYC", sub: "Friday, All Day" }
    ]
  }
];

/* ================= DATE HELPERS ================= */
function normalizeDate(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isTomorrow(dateStr) {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(0, 0, 0, 0);
  return normalizeDate(dateStr).getTime() === t.getTime();
}

function isThisWeek(dateStr) {
  const d = normalizeDate(dateStr);
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return d >= start && d < end;
}

/* ================= RENDER UPCOMING ================= */
function renderUpcoming() {
  const container = document.getElementById("upcomingTasks");
  if (!container) return;

  container.innerHTML = "";

  /* ---------- STATIC ---------- */
  staticUpcoming.forEach(section => {
    container.innerHTML += `
      <div class="up-card">
        <h4>${section.heading}</h4>
        ${section.items.map(item => `
          <div class="up-item">
            <div class="up-icon ${section.color}">
              <i class="fa-solid fa-calendar"></i>
            </div>
            <div class="up-text">
              <p class="title">${item.title}</p>
              <span class="sub">${item.sub}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  });

  /* ---------- DYNAMIC ---------- */
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];

  const tomorrowTasks = stored.filter(t => isTomorrow(t.date));
  const weekTasks = stored.filter(
    t => !isTomorrow(t.date) && isThisWeek(t.date)
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
              <span class="sub">${t.date} • ${t.project}</span>
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
              <span class="sub">${t.date} • ${t.project}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }
}


  /*priority*/
  let selectedPriority = "Med";
  document.querySelectorAll(".priority button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".priority button")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPriority = btn.textContent.trim();
    });
  });

  /*create task*/
  const taskForm = document.querySelector(".task-form");

  if (taskForm) {
    taskForm.addEventListener("submit", e => {
      e.preventDefault();

      const newTask = {
        title: taskForm.querySelector('input[type="text"]').value,
        date: taskForm.querySelector('input[type="date"]').value,
        time: taskForm.querySelector('input[type="time"]').value,
        project: taskForm.querySelector("select").value,
        priority: selectedPriority
      };

      const stored = JSON.parse(localStorage.getItem("tasks")) || [];
      stored.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(stored))
      alert("Task saved");
      setTimeout(() => {
      console.log("Redirecting to dashboard...");
  window.location.href = "Home.html";
}, 1000);
      taskForm.reset();
    });
  }

  /*sidebar*/
  const menuBtn = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.add("open");
      overlay.classList.add("show");
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });
  }

  /* final render */
  renderStaticToday();
  renderDynamicToday(getTodayTasks(tasks));
  renderUpcoming();
 const todayTasksEl = document.getElementById("todayTasks");
if (!todayTasksEl) return;

todayTasksEl.addEventListener("click", e => {
  const row = e.target.closest(".task-row");
  if (!row) return;

  const index = Number(row.dataset.index);
  const type = row.dataset.type;

  /* ===== DELETE ===== */
  if (e.target.closest(".delete")) {
    if (type === "dynamic") {
      const stored = JSON.parse(localStorage.getItem("tasks")) || [];
      const today = getTodayTasks(stored);
      const target = today[index];
      if (!target) return;

      const realIndex = stored.findIndex(
        t => t.title === target.title && t.date === target.date
      );

      if (realIndex !== -1) {
        stored.splice(realIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(stored));
      }

      renderStaticToday();
      renderDynamicToday(getTodayTasks(stored));
    }
  }

  /* ===== EDIT ===== */
  if (e.target.closest(".edit")) {
    if (type !== "dynamic") {
      alert("Static tasks cannot be edited");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = getTodayTasks(stored);
    const target = today[index];
    if (!target) return;

    const realIndex = stored.findIndex(
      t => t.title === target.title && t.date === target.date
    );

    localStorage.setItem(
      "editTask",
      JSON.stringify({ ...stored[realIndex], _index: realIndex })
    );

    window.location.href = "create.html";
  }

  /* ===== UPDATE / TOGGLE ===== */
  if (e.target.closest(".update")) {
    row.classList.toggle("open");
  }
});



  // renderUpcomingSection("TOMORROW", getTomorrowTasks(tasks), "blue");
  // renderUpcomingSection("LATER", getFutureTasks(tasks), "green");

});

/*add task*/
const addTaskBtn = document.querySelector(".add-task");
if (addTaskBtn) {
  addTaskBtn.addEventListener("click", () => {
    window.location.href = "create.html";
  });
}
