// Reference from from Rob Dongas class tutorial walkthrough
//Define Variables
const form = document.getElementById("taskform");
const button = document.querySelector("#taskform > button")
var taskInput = document.getElementById("taskInput");

var doIt = document.getElementById("do-it");
var schedule = document.getElementById("schedule");
var relegate = document.getElementById("relegate");
var dontDo = document.getElementById("dont-do");

let tasklist;

// ── Drag-and-drop state ────────────────────────────────────
let draggedItem = null;

var dueDateInput = document.getElementById("dueDateInput");
var completionTimeInput = document.getElementById("completionTimeInput");
var estimatedTimeInput = document.getElementById("estimatedTimeInput");
var priorityInput = document.getElementById("priorityInput");

form.addEventListener("submit", function(event){
    event.preventDefault();
    let task = taskInput.value;
    let dueDate = dueDateInput.value;
    let completionTime = completionTimeInput.value;
    let estimatedTime = estimatedTimeInput.value;
    let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
    if (task) {
        addTask(task, dueDate, estimatedTime, priorityRating, completionTime, false); 
    }
})

var taskListArray = [];

function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime, completionStatus) {
    let d = new Date();
    let dateCreated = d.getFullYear();
    let task = {  
      // this id is going to be a way we can link our tasks inside the array to the task that is going to display on the screen
      // use the Date() field tiem. use the data.now function to return that date as a time stamp  
      id: Date.now(),
      taskDescription,
      dueDate,
      dateCreated,
      estimatedTime,
      completionTime,
      priorityRating,
      estimatedTime,
      completionStatus
    };
    taskListArray.push(task);
    console.log(taskListArray);
    renderTask(task);
  }

function renderTask(task){

    updateEmpty();

    var box = document.querySelector('.box')


    // Create LI
    let item = document.createElement('li');
    item.classList.add("itemDiv")
    // set this up as a html attribute, so we can create arbitrary html attributes for different data we install.
    // we do this by using the set attribute function, for the name attribute we usually use the data pre fix followed by whatever type of data we're storing
    item.setAttribute('data-id', task.id);
    item.setAttribute('draggable', 'true');
    item.innerHTML =
        '<span class="task-text">' + task.taskDescription + '</span>' +
        (task.dueDate ? '<span class="task-date">' + task.dueDate + '</span>' : '');

    // Drag events
    item.addEventListener('dragstart', () => {
        draggedItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
    });

    box.appendChild(item);

    // Complete Button
    let completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    completedButton.setAttribute('title', 'Mark complete');
    item.appendChild(completedButton);

    // Delete Button
    let delButton = document.createElement("button");
    delButton.innerHTML = '<i class="fas fa-times"></i>';
    delButton.classList.add('delete-btn');
    delButton.setAttribute('title', 'Remove task');
    item.appendChild(delButton);


    // Event Listeners for DOM elements
    delButton.addEventListener("click", function(event){
      event.preventDefault();
      let li = event.currentTarget.closest('li');
      let id = li.getAttribute('data-id');
      let index = taskListArray.findIndex(task => task.id === Number(id));
      removeItemFromArray(taskListArray, index);
      updateEmpty();
      li.remove();
    })
    // Event Listeners for complete button
    completedButton.addEventListener("click", function(event){
      let li = event.currentTarget.closest('li');
      li.classList.toggle("completed");
    })  

// help and assist from Rob Dongas
    // Extract the due date and priority from the task
    // Compare the due date to current date
    // Conditionally assign the urgency based on date comparison
    // --> If (dueDate - currentDate) < X THEN URGENT
    // --> If (dueDate - currentDate) > X THEN NOT URGENT
    // assign the importance based on the priority rating

    let currentDate = new Date();
    let taskDueDate = new Date(task.dueDate);
    let taskPriority = task.priorityRating;

    let dateDiff = days_between(currentDate,taskDueDate);
    let urgencyValue = 5;
    

    if (dateDiff > urgencyValue) {
      console.log("Not urgent");
      if (taskPriority == "" || taskPriority == "Low") {
        console.log("Don't do");
        tasklist = dontDo;
      } else {
        console.log("Schedule");
        tasklist = schedule;
      }
    } else {
      console.log("Urgent");
      if (taskPriority == "" || taskPriority == "Low") {
        console.log("Relegate");
        tasklist = relegate;
      } else {
        console.log("Do it");
        tasklist = doIt;
      }
    }

    // Append 
    // which is finding the second item in the tasklist, which is the ul
    tasklist.children[1].appendChild(item);

    // Clear the input form
    form.reset();  
    updateEmpty();
  }

//  function to remove that frmom the array 
  function removeItemFromArray(arr, index) {
      if (index > -1){
          arr.splice(index, 1)
      }
      return arr;
  }

// Make sure this makes sense for the user, and it doesnt tell them they havent added tasks, when they clearly have 
// Help from Rob Dongas
  // which checks to see if the ul has any children. the childNodes property is an array, so you can actually check it's length 
  // then inside the if statement, you try to find the empty list just for that specific quadrant
function updateEmpty() {
  if (doIt.children[1].childNodes.length > 0) {
    doIt.querySelector('.emptyList').style.display = 'none';
  } else {
    doIt.querySelector('.emptyList').style.display = 'block';
  }

  if (schedule.children[1].childNodes.length > 0) {
    schedule.querySelector('.emptyList').style.display = 'none';
  } else {
    schedule.querySelector('.emptyList').style.display = 'block';
  }

  if (relegate.children[1].childNodes.length > 0) {
    relegate.querySelector('.emptyList').style.display = 'none';
  } else {
    relegate.querySelector('.emptyList').style.display = 'block';
  }

  if (dontDo.children[1].childNodes.length > 0) {
    dontDo.querySelector('.emptyList').style.display = 'none';
  } else {
    dontDo.querySelector('.emptyList').style.display = 'block';
  }
  
}


function days_between(date1, date2) {

  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return
  return Math.round(differenceMs / ONE_DAY);

}
// Function adapted from https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates

// ── Drag-and-drop drop zones ───────────────────────────────
function initDropZones() {
    [doIt, schedule, relegate, dontDo].forEach(quadrant => {
        const box = quadrant.children[1]; // ul.box

        quadrant.addEventListener('dragover', e => {
            e.preventDefault();
            quadrant.classList.add('drag-over');
        });

        quadrant.addEventListener('dragleave', e => {
            if (!quadrant.contains(e.relatedTarget)) {
                quadrant.classList.remove('drag-over');
            }
        });

        quadrant.addEventListener('drop', e => {
            e.preventDefault();
            quadrant.classList.remove('drag-over');
            if (draggedItem && draggedItem.parentElement !== box) {
                box.appendChild(draggedItem);
                updateEmpty();
            }
        });
    });
}

initDropZones();