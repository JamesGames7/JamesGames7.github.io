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

self.addEventListener('install', function(event) {
    // Perform install steps
    var CACHE_NAME = 'ophy-todo-cache-v1';
    var urlsToCache = [
        '/',
        '/style.css',
        '/app.js'
    ];

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});