// import from the other js file
import { getWeather, wwCodes, badWeather } from "./weather_open_meteo.js";

// const for all functions

let task_arr = []; //empty array, where you add the objects in the createTask
const task_input = document.querySelector(".task_text"); //input for the task text
const todo_list = document.querySelector(".tasks"); //to_list the class ul for tasks
const done_list = document.querySelector(".done"); //done_list the class ul for done
const date = document.querySelector(".date"); //input for the date
const outdoor = document.querySelector(".outdoor_check"); //input to check if the task is outdoor
const empty_task = document.querySelector(".empty-state"); //the class for the no tasks completed yet
const empty_task_todo = document.querySelector(".empty-state-todo");
const dateInput = document.querySelector(".date"); //the date input to show it when clicking
const form = document.querySelector("form");

form.addEventListener("submit", createTask);

//EventListener to the create button when you click

dateInput.addEventListener("click", () => {
  // when user is clicking, show the whole date input
  dateInput.showPicker();
});

function createTask(e) {
  e.preventDefault();
  // if (!task_input.value.trim() || !date.value) return;
  const userDate = date.value; //userDate is the date and value
  console.log("userDate", userDate);
  console.log("Make task");
  const task_obj = {
    //objects for the array
    taskTxt: task_input.value, //the taskTxt is the input + value
    taskDone: false, //the taskDone is set to false, if it´s not true
    id: self.crypto.randomUUID(), //id with the build in randomUUID() method
    taskDate: date.value, //taskDate is the date + value
    outdoor: outdoor.checked, // outdoor is the outdoor + checked
    weatherCode: null,
    weatherMax: null,
    weatherMin: null,
    weatherIcon: null,
    unavailable: false,
  };
  task_arr.push(task_obj); // push immediately
  renderList();

  getWeather(task_obj.taskDate, (data) => {
    //get the weather from the API
    console.log("API data:", data);
    if (!data || !data.daily) {
      task_obj.weatherIcon = "unknown.png";
      task_obj.unavailable = false;
      task_obj.error = "Could not get the weather";
      renderList();
      return;
    }
    task_obj.weatherCode = data.daily.weathercode[0];
    task_obj.weatherMax = data.daily.temperature_2m_max[0];
    task_obj.weatherMin = data.daily.temperature_2m_min[0];
    task_obj.weatherIcon = wwCodes[data.daily.weathercode[0]];
    console.log("RAW CODE:", data.daily.weathercode[0]);

    if (task_obj.outdoor && badWeather(task_obj.weatherCode)) {
      // if the object outdoor and badWeather (weathercode is the wrong number)
      task_obj.unavailable = true; // then the task object is unavailable = means it´s true
    }
    renderList();

    console.log("task_obj", task_obj); //checking to see all the objects in the console log
  });

  task_input.value = "";
  date.value = "";
  outdoor.checked = false;
  console.log("date", date);
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("task-item"); // adding a class to the li element
  li.innerHTML = ` <div class="task-top"><input type="checkbox" ${task.taskDone ? "checked" : ""}/>
  <div class="task-info">
  <p>${task.taskTxt}</p>

  </div>
  <p class="outdoor_yes">${task.outdoor ? "Outdoor" : ""}</p>
  <button class="delete">X</button></div>
   <div class="task-bottom">
    <p class="date_text">${task.taskDate}</p>
   ${!task.error && task.weatherIcon ? `<img class="weather-icon" src="png/${task.weatherIcon}" alt="weather icon" />` : ""} 
 </div><p class="min_max">Min ${task.weatherMin}° - Max ${task.weatherMax}°</p>`;

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
    // for each task createTaskElement, if task.unavailable add the class "unavailable"
    const li = createTaskElement(task);
    if (task.unavailable) {
      li.classList.add("unavailable");
      li.insertAdjacentHTML(
        "beforeend",
        `<div class="weather-bad">
        <p class="warning">The weather is not good enough for "${task.taskTxt}"</p> </div>`,
      );
    }

    if (task.error) {
      li.insertAdjacentHTML(
        "beforeend", //before the element and after it´s last child
        `<p class="warning">⚠ ${task.error}</p>`, // writing the error text "Could not find the weather"
      );
    }
    if (task.outdoor && !task.unavailable) {
      // ! means NOT
      li.classList.add("outdoor-ok");
      li.insertAdjacentHTML(
        "beforeend",
        `<div class="weather-ok fade-in">Perfect weather for "${task.taskTxt}"
        </div>`,
      );
    }

    (task.taskDone ? done_list : todo_list).appendChild(li); // if taskDone is true make done_list else make todo_list
  });

  if (done_list.children.length === 0) {
    // if the done_list object lenght is 0, remove the hidden class
    empty_task.classList.remove("hidden");
  } else {
    empty_task.classList.add("hidden"); // else add the hidden class
  }

  if (todo_list.children.length === 0) {
    // if the done_list object lenght is 0, remove the hidden class
    empty_task_todo.classList.remove("hidden");
  } else {
    empty_task_todo.classList.add("hidden"); // else add the hidden class
  }

  localStorage.setItem("data", JSON.stringify(task_arr));
}

// data = key
// task_arr = value

const storageData = JSON.parse(localStorage.getItem("data"));
if (storageData) {
  task_arr = storageData;
}
renderList();
