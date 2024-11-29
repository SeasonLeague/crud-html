document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://crud-operations-788o.onrender.com/api/tasks';
    const taskList = document.querySelector('.task-list');
    const taskForm = document.querySelector('form');

    // Fetch and display tasks
    async function fetchTasks() {
        try {
            const response = await fetch(API_URL);
            const tasks = await response.json();
            
            if (taskList) {
                taskList.innerHTML = tasks.map(task => `
                    <li data-id="${task._id}">
                        <span>${task.task || 'No task description'}</span>
                        <div class="task-actions">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </li>
                `).join('');

                // Add event listeners for edit and delete
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', handleEdit);
                });

                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', handleDelete);
                });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Create Task
    async function createTask(taskText) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText })
            });
            
            if (response.ok) {
                fetchTasks();
                taskForm.reset();
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    // Handle Edit
    function handleEdit(e) {
        const listItem = e.target.closest('li');
        const taskId = listItem.dataset.id;
        const currentTask = listItem.querySelector('span').textContent;
        
        const newTask = prompt('Edit task:', currentTask);
        if (newTask && newTask !== currentTask) {
            updateTask(taskId, newTask);
        }
    }

    // Update Task
    async function updateTask(taskId, newTask) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: newTask })
            });
            
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Handle Delete
    function handleDelete(e) {
        const listItem = e.target.closest('li');
        const taskId = listItem.dataset.id;
        
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(taskId);
        }
    }

    // Delete Task
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // Form Submit Event
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskInput = taskForm.querySelector('input[name="task"]');
            const taskText = taskInput.value.trim();
            
            if (taskText) {
                createTask(taskText);
            }
        });
    }

    // Initial fetch of tasks
    fetchTasks();
});
