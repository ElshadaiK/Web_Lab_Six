const taskInput = document.querySelector('#task');               //the task input text field

const form = document.querySelector('#task-form');             //The form at the top

const filter = document.querySelector('#filter');                      //the task filter text field

const sorting = document.querySelector('#sorting'); 

const taskList = document.querySelector('.collection');          //The ul

const clearBtn = document.querySelector('.clear-tasks');      //the all task clear button

// form submit 
form.addEventListener('submit', addNewTask);

// Clear All Tasks
clearBtn.addEventListener('click', clearAllTasks);

//   Filter Task 
filter.addEventListener('keyup', filterTasks);

taskList.addEventListener('click', removeTask);

// Sort Task
sorting.addEventListener("change", order);
let isSorted = true;

function addNewTask(e) {

    if (taskInput.value === '') 
    {
        taskInput.style.borderColor = "red";
       return;     //avoiding else statement

    }

   e.preventDefault();    //disable form submission
       // Create an li element when the user adds a task 
       const li = document.createElement('li');
       // Adding a class
       li.className = 'collection-item';
       // Create text node and append it 
       li.appendChild(document.createTextNode(taskInput.value));
       // Create new element for the link 
       const link = document.createElement('a');
       // Add class and the x marker for a 
       link.className = 'delete-item secondary-content';
       link.innerHTML = '<i class="fa fa-remove"></i>';
       // Append link to li
       li.appendChild(link);
       // Append to ul 
    if(!isSorted) taskList.insertBefore(li, taskList.children[0])
    else taskList.appendChild(li);
    addToDatabase(taskInput.value)
       taskInput.value= "";
   

}

// Clear Task Function definition 
function clearAllTasks() {

    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    clearAllTasksfromDB()


}
// Filter tasks function definition 
function filterTasks(e) {

    let filter = (e.target.value).toUpperCase();
    const li = taskList.querySelectorAll('li')
    li.forEach(item => {
        let txtValue = (item.textContent).toUpperCase();
        if (txtValue.indexOf(filter) > -1) {
            item.style.display = "block"
        } else {
            item.style.display = "none";
        }
    });

}
function removeTask(e) {

    if (e.target.parentElement.classList.contains('delete-item'))
        {
        if (confirm('Are You Sure about that ?'))
        {
            removeFromDB(e.target.parentElement.parentElement);
            e.target.parentElement.parentElement.remove();
        }

    }

}
const reloadIcon = document.querySelector('.fa');   

 
// Event Listener for reload 
reloadIcon.addEventListener('click', reloadPage);

// Reload Page Function 
function reloadPage() {
    //using the reload fun on location object 
    location.reload();
}

function order(e){
    let i = taskList.childNodes.length
    while(i--){
        taskList.appendChild(taskList.childNodes[i])
    }
    isSorted = !isSorted;
}