function addTask() {
    var input = document.getElementById('todo-input');
    var newTask = input.value;
    if (newTask) {
        var listItem = document.createElement('li');
        listItem.textContent = newTask;
        document.getElementById('todo-list').appendChild(listItem);
        input.value = ''; // Clear the input
    }
}