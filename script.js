
const apiUrl = "http://localhost:5000/api/projects";

document.addEventListener("DOMContentLoaded", () => {
  fetchProjects();
  updateDashboardStats();
});

document.getElementById("projectForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const projectName = document.getElementById("projectName").value;
  const projectDescription = document.getElementById("projectDescription").value;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
      }),
    });

    if (!response.ok) throw new Error("Failed to add project");

    document.getElementById("projectForm").reset();
    fetchProjects();
    updateDashboardStats();
  } catch (error) {
    console.error("Error adding project:", error);
  }
});

async function fetchProjects() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch projects");

    const projects = await response.json();
    displayProjects(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}

function displayProjects(projects) {
  const projectsList = document.getElementById("projectsList");
  projectsList.innerHTML = "";

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${project.name}</strong><br>${project.description}`;
    projectsList.appendChild(li);
  });
}

async function updateDashboardStats() {
  try {
    const projectsResponse = await fetch(apiUrl);
    if (!projectsResponse.ok) throw new Error("Failed to fetch projects");
    const projects = await projectsResponse.json();
    document.getElementById("projectCount").textContent = projects.length;

    const tasksResponse = await fetch("http://localhost:5000/api/tasks");
    if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
    const tasks = await tasksResponse.json();
    document.getElementById("taskCount").textContent = tasks.length;

    const teamResponse = await fetch("http://localhost:5000/api/team");
    if (!teamResponse.ok) throw new Error("Failed to fetch team members");
    const team = await teamResponse.json();
    document.getElementById("teamCount").textContent = team.length;
  } catch (error) {
    console.error("Error updating dashboard stats:", error);
  }
}
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;

  addTask(taskName, taskDescription);

  taskForm.reset();
});

function addTask(name, description) {
  const li = document.createElement("li");

  li.innerHTML = `
    <div>
      <strong>${name}</strong><br>
      <small>${description}</small>
    </div>
    <button class="task-complete">Complete</button>
  `;

  li.querySelector(".task-complete").addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  taskList.appendChild(li);
}
const teamForm = document.getElementById("teamForm");
const teamList = document.getElementById("teamList");

teamForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const memberName = document.getElementById("memberName").value;
  const memberRole = document.getElementById("memberRole").value;

  addTeamMember(memberName, memberRole);

  teamForm.reset();
});

function addTeamMember(name, role) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${name}</strong> - <span class="member-role">${role}</span>`;
  teamList.appendChild(li);
}
const users = [];

document.getElementById("signupForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    alert("This email is already registered!");
    return;
  }

  users.push({ name, email, password });
  alert("Registration successful! Please login.");
  window.location.href = "login.html";
});

document.getElementById("loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  alert(`Welcome back, ${user.name}!`);
  window.location.href = "homepage.html";
});
