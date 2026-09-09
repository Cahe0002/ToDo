// import from the other js file
import { getWeather, wwCodes, badWeather } from "./weather_open_meteo.js";

// const for all functions
// const savedTask = localStorage.getItem("data");
const task_input = document.querySelector(".task_text");
const create_task_btn = document.querySelector(".create_task");
const todo_list = document.querySelector(".tasks");
const done_list = document.querySelector(".done");
const task_arr = [];
const date = document.querySelector(".date");
const outdoor = document.querySelector(".outdoor_check");
create_task_btn.addEventListener("click", createTask);
const empty_task = document.querySelector(".empty-state");

task_input.addEventListener("keypress", (e) => {
  // If the user presses the "Enter" key on the keyboard
  if (e.key === "Enter" && task_input.value !== "") {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger the button element with a click
    create_task_btn.click();
  }
});

function createTask() {
  if (!task_input.value.trim() || !date.value) return;
  const userDate = date.value;
  console.log("userDate", userDate);
  console.log("Make task");
  const task_obj = {
    //objects for the array
    taskTxt: task_input.value,
    taskDone: false,
    id: self.crypto.randomUUID(),
    taskDate: date.value,
    outdoor: outdoor.checked,
    weatherCode: null,
    weatherMax: null,
    weatherMin: null,
    weatherIcon: null,
    unavailable: false,
  };
  task_arr.push(task_obj); // push immediately
  renderList();

  getWeather(task_obj.taskDate, (data) => {
    console.log("API data:", data);
    if (!data || !data.daily) {
      task_obj.weatherIcon = "unknown.png";
      task_obj.unavailable = false;
      task_obj.error = "Kunne ikke hente vejrdata";
      renderList();
      return;
    }
    task_obj.weatherCode = data.daily.weathercode[0];
    task_obj.weatherMax = data.daily.temperature_2m_max[0];
    task_obj.weatherMin = data.daily.temperature_2m_min[0];
    task_obj.weatherIcon = wwCodes[data.daily.weathercode[0]];
    console.log("RAW CODE:", data.daily.weathercode[0]);

    if (task_obj.outdoor && badWeather(task_obj.weatherCode)) {
      task_obj.unavailable = true;
    }
    renderList();

    console.log("task_obj", task_obj);
  });

  task_input.value = "";
  date.value = "";
  outdoor.checked = false;
  console.log("date", date);
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.innerHTML = ` <div class="task-top"><input type="checkbox" ${task.taskDone ? "checked" : ""}/>
  <div class="task-info">
  <p>${task.taskTxt}</p>
  </div>
  <p class="outdoor_yes">${task.outdoor ? "Outdoor" : ""}</p>
  <button class="delete">X</button></div>
   <div class="task-bottom">
    <p class="date_text">${task.taskDate}</p>
   ${!task.error && task.weatherIcon ? `<img class="weather-icon" src="/outdoorpakke/png/${task.weatherIcon}" alt="weather icon" />` : ""}
   
 </div>`;
  const checkbox = li.querySelector('[type = "checkbox"]');
  checkbox.addEventListener("change", (e) => {
    task.taskDone = e.target.checked;
    renderList();
  });

  const delete_btn = li.querySelector(".delete"); // delete button
  delete_btn.addEventListener("click", () => {
    console.log("delete", task.id);
    const index = task_arr.findIndex((t) => t.id === task.id);
    task_arr.splice(index, 1);
    renderList();
  });
  return li;
}

function renderList() {
  // render the task
  todo_list.innerHTML = "";
  done_list.innerHTML = "";
  task_arr.forEach((task) => {
    const li = createTaskElement(task);
    if (task.unavailable) {
      li.classList.add("unavailable");
      li.insertAdjacentHTML(
        "beforeend",
        `<div class="weather-bad">
        <p class="warning">Vejret er ikke godt nok til "${task.taskTxt}"</p> </div>`,
      );
    }

    if (task.error) {
      li.insertAdjacentHTML(
        "beforeend",
        `<p class="warning">⚠ ${task.error}</p>`,
      );
    }
    if (task.outdoor && !task.unavailable) {
      li.classList.add("outdoor-ok");
      li.insertAdjacentHTML(
        "beforeend",
        `<div class="weather-ok fade-in">Perfekt vejr til "${task.taskTxt}"
        </div>`,
      );
    }

    (task.taskDone ? done_list : todo_list).appendChild(li);
  });

  if (done_list.children.length === 0) {
    empty_task.classList.remove("hidden");
  } else {
    empty_task.classList.add("hidden");
  }

  localStorage.setItem("data", JSON.stringify(task_arr));
}

// data = key
// task_arr = value

const storageData = JSON.parse(localStorage.getItem("data"));
console.log(storageData);

console.log(`${localStorage.getItem("data")}`);
