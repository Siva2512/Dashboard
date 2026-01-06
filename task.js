document.addEventListener("DOMContentLoaded", () => {

  /* ===== PRIORITY TOGGLE ===== */
  const priorityButtons = document.querySelectorAll(".priority button");
  let selectedPriority = "Med"; // default (because Med is active in HTML)

  priorityButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      priorityButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPriority = btn.innerText.trim();
    });
  });

  /* FORM SUBMIT */
  const form = document.querySelector(".task-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = {
      title: document.getElementById("title")?.value || "",
      desc: document.getElementById("desc")?.value || "",
      date: document.getElementById("date")?.value || "",
      time: document.getElementById("time")?.value || "",
      project: document.getElementById("project")?.value || "",
      priority: selectedPriority
    };

    console.log("Task Created:", task);

    // save task
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    alert("Task created successfully!");
    

    // ✅ redirect to dashboard
  });

});
