document.addEventListener("DOMContentLoaded", () => {

  /*today tasks*/
  const todayTasks = [
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

  function renderTodayTasks() {
    const container = document.getElementById("todayTasks");
    if (!container) return;

    container.innerHTML = todayTasks.map(task => `
      <div class="task">
        <input type="checkbox">
        <div>
          <p>${task.title}</p>
          <div class="task-meta">
            <span class="time ${task.timeClass}">
              <i class="fa-solid fa-clock"></i> ${task.time}
            </span>
            <span class="label ${task.label.toLowerCase()}">
              ${task.label}
            </span>
          </div>
        </div>
      </div>
    `).join("");
  }

  /*upcoming tasks*/
  const upcomingData = [
    {
      heading: "TOMORROW",
      items: [
        {
          icon: "fa-cart-shopping",
          color: "orange",
          title: "Buy Birthday Gift",
          sub: "Shopping List"
        },
        {
          icon: "fa-file-lines",
          color: "green",
          title: "Submit Expense Report",
          sub: "Work"
        }
      ]
    },
    {
      heading: "THIS WEEK",
      items: [
        {
          icon: "fa-car",
          color: "blue",
          title: "Car Service Appointment",
          sub: "Thursday, 9:00 AM"
        },
        {
          icon: "fa-plane",
          color: "pink",
          title: "Book Flight to NYC",
          sub: "Friday, All Day"
        }
      ]
    }
  ];

  function renderUpcomingTasks() {
    const container = document.getElementById("upcomingTasks");
    if (!container) return;

    container.innerHTML = upcomingData.map(section => `
      <div class="up-card">
        <h4>${section.heading}</h4>
        ${section.items.map(item => `
          <div class="up-item">
            <div class="up-icon ${item.color}">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <div class="up-text">
              <p class="title">${item.title}</p>
              <span class="sub">${item.sub}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `).join("");
  }

  /* priority */
  let selectedPriority = "Med";

  const priorityButtons = document.querySelectorAll(".priority button");

  priorityButtons.forEach(button => {
    button.addEventListener("click", () => {
      priorityButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      selectedPriority = button.textContent.trim();
      console.log("Priority selected:", selectedPriority);
    });
  });

  /*create task*/
  const taskForm = document.querySelector(".task-form");

  if (taskForm) {
    taskForm.addEventListener("submit", e => {
      e.preventDefault();

      const title = taskForm.querySelector('input[type="text"]').value;
      const date = taskForm.querySelector('input[type="date"]').value;
      const time = taskForm.querySelector('input[type="time"]').value;
      const project = taskForm.querySelector("select").value;

      console.log("TASK CREATED");
      console.log("Title:", title);
      console.log("Date:", date);
      console.log("Time:", time);
      console.log("Project:", project);
      console.log("Priority:", selectedPriority);

      alert("Task created successfully ");

      /* Reset form */
      taskForm.reset();

      /* Reset priority to Med */
      priorityButtons.forEach(btn => btn.classList.remove("active"));
      const medBtn = document.querySelector(".priority .med");
      if (medBtn) medBtn.classList.add("active");
      selectedPriority = "Med";
    });
  }

  /* sidebar */
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

  /* initial render */
  renderTodayTasks();
  renderUpcomingTasks();

});
