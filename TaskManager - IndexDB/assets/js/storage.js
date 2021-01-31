document.addEventListener('DOMContentLoaded', loadTasksfromDB)
function addToDatabase(newTask) {
    let listofTasks;
    if (localStorage.getItem("tasks") === null) {
        listofTasks = []
    }
    else {
        listofTasks = JSON.parse(localStorage.getItem('tasks'));
    }
    listofTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(listofTasks));
}
function loadFromDatabase() {
    let listofTasks;
    if (localStorage.getItem("tasks") === null) {
        listofTasks = []
    }
    else {
        listofTasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return listofTasks;
}
function loadTasksfromDB() {
    let listofTasks = loadFromDatabase();
    if (listofTasks.length != 0) {

        listofTasks.forEach(function(eachTask) {

          const li = document.createElement('li');             // Create an li element when the user adds a task
          li.className = 'collection-item';                                                  // Adding a class
          li.appendChild(document.createTextNode(eachTask));            // Create text node and append it 
          const link = document.createElement('a');                        // Create new element for the link 
          link.className = 'delete-item secondary-content';          // Add class and the x marker for a 
          link.innerHTML = '<i class="fa fa-remove"> </i>';
          li.appendChild(link);                                                    // Append link to li
          taskList.appendChild(li);                                            // Append to UL 
        });
    }
}
function clearAllTasksfromDB() 
{
    localStorage.clear();
}
function removeFromDB(taskItem){
    let listofTasks;
    if (localStorage.getItem("tasks") === null) {
        listofTasks = []
    }
    else {
        listofTasks = JSON.parse(localStorage.getItem('tasks'));
    }
    listofTasks.forEach(function(task, index){
        if(taskItem.textContent === task + " "){
            listofTasks.splice(index, 1)
        }
    })
    localStorage.setItem('tasks', JSON.stringify(listofTasks));
}