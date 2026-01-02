// Priority toggle
const priorityButtons = document.querySelectorAll(".priority button");

priorityButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    priorityButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Form submit
const form = document.querySelector(".task-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = {
    title: document.getElementById("title").value,
    desc: document.getElementById("desc").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    project: document.getElementById("project").value,
    priority: document.querySelector(".priority .active").innerText
  };

  console.log("Task Created:", task);
  alert("Task created successfully!");
  form.reset();
});
