// Reference from Rob Dongas class tutorial walkthrough

// ── DOM references ──────────────────────────────────────────
const form               = document.getElementById("taskform");
var taskInput            = document.getElementById("taskInput");
var dueDateInput         = document.getElementById("dueDateInput");
var completionTimeInput  = document.getElementById("completionTimeInput");
var estimatedTimeInput   = document.getElementById("estimatedTimeInput");
var priorityInput        = document.getElementById("priorityInput");

var doIt     = document.getElementById("do-it");
var schedule = document.getElementById("schedule");
var relegate = document.getElementById("relegate");
var dontDo   = document.getElementById("dont-do");

// Drawer elements — needed to switch between Add / Edit modes
const drawerOverlay  = document.querySelector('.task-modal');
const drawerTitle    = document.querySelector('.drawer-header h2');
const submitBtn      = document.querySelector('.drawer-submit');
const drawerCloseBtn = document.querySelector('.drawer-close');

// ── State ───────────────────────────────────────────────────
let tasklist;
let draggedItem  = null;
let editingId    = null;   // null = adding new task, number = editing existing task
var taskListArray = [];

// ── localStorage ────────────────────────────────────────────
const LS_KEY = 'studbud-tasks';

// Walk all four quadrant boxes and snapshot every task + its current quadrant
// and completion state. Called after every state-changing action.
function saveTasks() {
    const quadrantMap = {
        'do-it':    doIt,
        'schedule': schedule,
        'relegate': relegate,
        'dont-do':  dontDo
    };
    const data = [];
    for (const [quadrantId, quadrantEl] of Object.entries(quadrantMap)) {
        quadrantEl.children[1].querySelectorAll('.itemDiv').forEach(item => {
            const id   = Number(item.getAttribute('data-id'));
            const task = taskListArray.find(t => t.id === id);
            if (task) {
                data.push({
                    ...task,
                    quadrant:         quadrantId,
                    completionStatus: item.classList.contains('completed')
                });
            }
        });
    }
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// Restore tasks from localStorage on page load.
// Uses the saved quadrant directly — does NOT re-run urgency/priority logic —
// so drag-and-drop decisions from the previous session are preserved.
function loadTasks() {
    let raw;
    try { raw = localStorage.getItem(LS_KEY); } catch { return; }
    if (!raw) return;
    let data;
    try { data = JSON.parse(raw); } catch { return; }

    // Guard against double-initialization: clear any existing state before
    // repopulating so a second call never duplicates tasks in the array or DOM.
    taskListArray.length = 0;
    [doIt, schedule, relegate, dontDo].forEach(q => {
        q.children[1].querySelectorAll('.itemDiv').forEach(el => el.remove());
    });

    const quadrantMap = {
        'do-it':    doIt,
        'schedule': schedule,
        'relegate': relegate,
        'dont-do':  dontDo
    };

    data.forEach(task => {
        taskListArray.push(task);
        const quadrantEl = quadrantMap[task.quadrant] || doIt;
        const item = createTaskElement(task);
        if (task.completionStatus) item.classList.add('completed');
        quadrantEl.children[1].appendChild(item);
    });

    sortAllQuadrants();
    updateEmpty();
}

// ── Form submission ─────────────────────────────────────────
form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (editingId !== null) {
        saveEdit();
        return;
    }
    const task           = taskInput.value;
    const dueDate        = dueDateInput.value;
    const completionTime = completionTimeInput.value;
    const estimatedTime  = estimatedTimeInput.value;
    const priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
    if (task) {
        addTask(task, dueDate, estimatedTime, priorityRating, completionTime, false);
        drawerOverlay.style.display = 'none';
    }
});

// ── Add task ────────────────────────────────────────────────
function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime, completionStatus) {
    const task = {
        id:            Date.now(),
        taskDescription,
        dueDate,
        dateCreated: new Date().toISOString(),
        estimatedTime,
        completionTime,
        priorityRating,
        completionStatus
    };
    taskListArray.push(task);
    renderTask(task);
}

// ── Create task DOM element ─────────────────────────────────
// Pure factory — no quadrant logic. Used by renderTask (new tasks)
// and loadTasks (persisted tasks).
function createTaskElement(task) {
    const item = document.createElement('li');
    item.classList.add("itemDiv");
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

    // Move button (mobile only — hidden on desktop via CSS)
    const moveButton = document.createElement("button");
    moveButton.innerHTML = '<i class="fas fa-arrows-alt"></i>';
    moveButton.classList.add("move-btn");
    moveButton.setAttribute('title', 'Move to quadrant');
    moveButton.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        showMovePopover(e.currentTarget, item);
    });

    // Edit button
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.classList.add("edit-btn");
    editButton.setAttribute('title', 'Edit task');
    editButton.addEventListener("click", function(e) {
        e.preventDefault();
        const id = Number(e.currentTarget.closest('li').getAttribute('data-id'));
        const t  = taskListArray.find(t => t.id === id);
        if (t) openDrawerForEdit(t);
    });

    // Complete button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    completedButton.setAttribute('title', 'Mark complete');
    completedButton.addEventListener("click", function(e) {
        e.currentTarget.closest('li').classList.toggle("completed");
        saveTasks();
    });

    // Delete button
    const delButton = document.createElement("button");
    delButton.innerHTML = '<i class="fas fa-times"></i>';
    delButton.classList.add('delete-btn');
    delButton.setAttribute('title', 'Remove task');
    delButton.addEventListener("click", function(e) {
        e.preventDefault();
        const li    = e.currentTarget.closest('li');
        const id    = Number(li.getAttribute('data-id'));
        const index = taskListArray.findIndex(t => t.id === id);
        removeItemFromArray(taskListArray, index);
        li.remove();
        updateEmpty();
        saveTasks();
    });

    item.appendChild(moveButton);
    item.appendChild(editButton);
    item.appendChild(completedButton);
    item.appendChild(delButton);
    return item;
}

// ── Render new task (computes quadrant from urgency + priority)
function renderTask(task) {
    const currentDate  = new Date();
    const taskDueDate  = new Date(task.dueDate);
    const dateDiff     = days_between(currentDate, taskDueDate);
    const urgencyValue = 5;

    if (dateDiff > urgencyValue) {
        tasklist = (task.priorityRating === "" || task.priorityRating === "Low") ? dontDo : schedule;
    } else {
        tasklist = (task.priorityRating === "" || task.priorityRating === "Low") ? relegate : doIt;
    }

    const box = tasklist.children[1];
    box.appendChild(createTaskElement(task));
    sortQuadrantBox(box);
    form.reset();
    updateEmpty();
    saveTasks();
}

// ── Edit flow ───────────────────────────────────────────────
// Opens the drawer pre-filled with the task's current values.
// The form submit handler routes to saveEdit() while editingId is set.
function openDrawerForEdit(task) {
    editingId                 = task.id;
    taskInput.value           = task.taskDescription;
    dueDateInput.value        = task.dueDate        || '';
    completionTimeInput.value = task.completionTime || '';
    estimatedTimeInput.value  = task.estimatedTime  || '';
    priorityInput.value       = task.priorityRating || '';
    drawerTitle.textContent   = 'Edit Task';
    submitBtn.textContent     = 'Save Changes';
    drawerOverlay.style.display = 'block';
}

// Updates the task data and its existing DOM element in place.
// Does NOT re-run quadrant logic — the task stays in whichever
// quadrant the user placed it via drag-and-drop.
function saveEdit() {
    const task = taskListArray.find(t => t.id === editingId);
    if (!task) { resetEditState(); return; }

    task.taskDescription = taskInput.value;
    task.dueDate         = dueDateInput.value;
    task.completionTime  = completionTimeInput.value;
    task.estimatedTime   = estimatedTimeInput.value;
    task.priorityRating  = priorityInput.options[priorityInput.selectedIndex].value;

    const item = document.querySelector(`[data-id="${editingId}"]`);
    if (item) {
        item.querySelector('.task-text').textContent = task.taskDescription;

        // Add, update, or remove the date span depending on new value
        let dateSpan = item.querySelector('.task-date');
        if (task.dueDate) {
            if (dateSpan) {
                dateSpan.textContent = task.dueDate;
            } else {
                dateSpan = document.createElement('span');
                dateSpan.className = 'task-date';
                dateSpan.textContent = task.dueDate;
                item.querySelector('.task-text').insertAdjacentElement('afterend', dateSpan);
            }
        } else if (dateSpan) {
            dateSpan.remove();
        }

        // Re-sort within its current quadrant so the updated due date is respected
        sortQuadrantBox(item.parentElement);
    }

    saveTasks();
    resetEditState();
}

// Resets drawer to Add-mode. Called after save, and also if the drawer
// is closed mid-edit (X button, backdrop click, Escape).
function resetEditState() {
    editingId                   = null;
    drawerTitle.textContent     = 'New Task';
    submitBtn.textContent       = 'Add Task';
    drawerOverlay.style.display = 'none';
    form.reset();
}

// Guard: reset edit state whenever drawer is dismissed without saving
drawerCloseBtn.addEventListener('click', function() {
    if (editingId !== null) resetEditState();
});
drawerOverlay.addEventListener('click', function(e) {
    if (e.target === drawerOverlay && editingId !== null) resetEditState();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && editingId !== null) resetEditState();
});

// ── Sorting ─────────────────────────────────────────────────
// Sorts the li items in a ul.box by due date (earliest first).
// Items with no due date sort to the bottom (Infinity).
// Operates only on the box element — does not touch .emptyList.
function sortQuadrantBox(box) {
    const items = Array.from(box.querySelectorAll('.itemDiv'));
    items.sort((a, b) => {
        const idA = Number(a.getAttribute('data-id'));
        const idB = Number(b.getAttribute('data-id'));
        const tA  = taskListArray.find(t => t.id === idA);
        const tB  = taskListArray.find(t => t.id === idB);
        const dA  = tA && tA.dueDate ? new Date(tA.dueDate).getTime() : Infinity;
        const dB  = tB && tB.dueDate ? new Date(tB.dueDate).getTime() : Infinity;
        return dA - dB;
    });
    items.forEach(item => box.appendChild(item));
}

function sortAllQuadrants() {
    [doIt, schedule, relegate, dontDo].forEach(q => sortQuadrantBox(q.children[1]));
}

// ── Helpers ─────────────────────────────────────────────────
function removeItemFromArray(arr, index) {
    if (index > -1) arr.splice(index, 1);
    return arr;
}

function updateEmpty() {
    [doIt, schedule, relegate, dontDo].forEach(q => {
        q.querySelector('.emptyList').style.display =
            q.children[1].childNodes.length > 0 ? 'none' : 'block';
    });
}

function days_between(date1, date2) {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    return Math.round(Math.abs(date1 - date2) / ONE_DAY);
}

// ── Mobile tap-to-move ──────────────────────────────────────
// Shows a compact popover so users can move a task to any quadrant
// without drag-and-drop. Moves the DOM node and calls saveTasks()
// via the same path as drag-drop, so persistence is identical.

const MOVE_TARGETS = [
    { label: 'Do Now',    getBox: () => doIt.children[1] },
    { label: 'Schedule',  getBox: () => schedule.children[1] },
    { label: 'Delegate',  getBox: () => relegate.children[1] },
    { label: 'Eliminate', getBox: () => dontDo.children[1] },
];

let activeMovePopover = null;

function closeMovePopover() {
    if (activeMovePopover) {
        activeMovePopover.remove();
        activeMovePopover = null;
    }
}

function showMovePopover(triggerBtn, item) {
    closeMovePopover();
    const currentBox = item.parentElement;

    const popover = document.createElement('div');
    popover.className = 'move-popover';

    MOVE_TARGETS.forEach(({ label, getBox }) => {
        const targetBox = getBox();
        const btn = document.createElement('button');
        btn.className = 'move-popover-option';
        btn.textContent = label;
        if (currentBox === targetBox) btn.classList.add('move-popover-option--current');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentBox !== targetBox) {
                targetBox.appendChild(item);
                updateEmpty();
                saveTasks();
            }
            closeMovePopover();
        });
        popover.appendChild(btn);
    });

    document.body.appendChild(popover);
    activeMovePopover = popover;

    // Position relative to trigger button — prefer below, fall back to above
    const rect  = triggerBtn.getBoundingClientRect();
    const popH  = popover.offsetHeight || 152;
    const below = window.innerHeight - rect.bottom;
    const left  = Math.max(8, Math.min(rect.right - popover.offsetWidth, window.innerWidth - 152));

    popover.style.position = 'fixed';
    popover.style.zIndex   = '500';
    popover.style.left     = left + 'px';
    popover.style.top = (below >= popH + 8)
        ? (rect.bottom + 4) + 'px'
        : Math.max(8, rect.top - popH - 4) + 'px';
}

document.addEventListener('click', (e) => {
    if (activeMovePopover && !activeMovePopover.contains(e.target)) {
        closeMovePopover();
    }
});

// ── Drag-and-drop drop zones ─────────────────────────────────
function initDropZones() {
    [doIt, schedule, relegate, dontDo].forEach(quadrant => {
        const box = quadrant.children[1];

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
                saveTasks();   // persist the new quadrant assignment
            }
        });
    });
}

initDropZones();
loadTasks();
