const taskInput = document.querySelector('#task');               //the task input text field

const form = document.querySelector('#task-form');             //The form at the top

const filter = document.querySelector('#filter');                      //the task filter text field

const sorting = document.querySelector('#sorting');

const taskList = document.querySelector('.collection');          //The ul

const clearBtn = document.querySelector('.clear-tasks');      //the all task clear button

const reloadIcon = document.querySelector('.fa');

let DB;
let isSorted = true;
form.addEventListener('submit', addNewTask);

document.addEventListener('DOMContentLoaded', () => {

    //all code will reside here 
    let TasksDB = indexedDB.open("tasks", 1);
    TasksDB.onsuccess = function (event) {
        console.log('Database Ready');
        DB = TasksDB.result;
        displayTaskList();

    };
    TasksDB.onerror = function (event) {
        console.log('There was an error');
    };
    TasksDB.onupgradeneeded = function (e) {
        // the event will be the database
        let db = e.target.result;

        // create an object store, 
        // keypath is going to be the Indexes
        let objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

        // createindex: 1) field name 2) keypath 3) options
        // objectStore.createIndex('tasknamez', ['taskname', 'date'], { unique: false });
        objectStore.createIndex('created', 'date', { unique: true });

        console.log('Database ready and fields created!');
    }
    


});
function addNewTask(e) {
    // create a new object with the form info
    e.preventDefault();

    let newTask = {
        taskname: taskInput.value,
        date: Date.now()
    }
    // Insert the object into the database 
    let transaction = DB.transaction(['tasks'], 'readwrite');
    let objectStore = transaction.objectStore('tasks');

    let request = objectStore.add(newTask);
    // on success
    request.onsuccess = () => {
        form.reset();
    }
    transaction.oncomplete = () => {
        console.log('New appointment added');
        displayTaskList();
    }
    transaction.onerror = () => { console.log('There was an error, try again!'); }
}
clearBtn.addEventListener('click', clearAllTasks);
//clear tasks 
function clearAllTasks() {
    //Create the transaction and object store
    let transaction = DB.transaction("tasks", "readwrite");
    let tasks = transaction.objectStore("tasks");

    // clear the the table
    tasks.clear();
    //repaint the UI
    displayTaskList();

    console.log("Tasks Cleared !!!");
}
taskList.addEventListener('click', removeTask);

function removeTask(e) {

    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are You Sure about that ?')) {
            // get the task id
            let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
            // use a transaction
            let transaction = DB.transaction('tasks', 'readwrite');
            let objectStore = transaction.objectStore('tasks');
            objectStore.delete(taskID);

            transaction.oncomplete = () => {
                e.target.parentElement.parentElement.remove();
            }

        }
    }
}


sorting.addEventListener("change", order);
function order(e){
    isSorted = !isSorted;
    displayTaskList(e)
}
function displayTaskList(e){
    // clear the previous task list
    while (taskList.firstChild) { taskList.removeChild(taskList.firstChild); }

    // create the object store
    let objectStore = DB.transaction('tasks').objectStore('tasks').index('created');
    let param1;
    let param2;
    if(isSorted) {
        param1 = null; 
        param2 = 'next';
    }
    else{
        param1 = null;
        param2 = 'prev'
    }
    objectStore.openCursor(param1, param2).onsuccess = function (e) {
        // assign the current cursor
        let cursor = e.target.result;

        if (cursor) {
            const li = document.createElement('li');
            // Adding a class
            li.className = 'collection-item';
            // Create new element for the link 
            const link = document.createElement('a');
            // Add class and the x marker for a 
            link.className = 'delete-item secondary-content';
            link.innerHTML = '<i class="fa fa-remove"></i>';
            // Append link to li

            li.appendChild(link);
            li.setAttribute('data-task-id', cursor.value.id);
            // Create text node and append it 
            li.appendChild(document.createTextNode(cursor.value.taskname));
            taskList.appendChild(li);
            cursor.continue();
        }
    }
}