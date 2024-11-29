document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:5000/api/tasks';
    const taskList = document.querySelector('.task-list');
    const taskForm = document.querySelector('form');

    // Fetch and display tasks
    async function fetchTasks() {
        try {
            const response = await fetch(API_BASE_URL);
            const tasks = await response.json();
            
            if (taskList) {
                taskList.innerHTML = tasks.map(task => `
                    <li>
                        <span class="task-content">${task.task}</span>
                        <div class="task-actions">
                            <a href="/edit/${task._id.$oid}" class="edit-link">Edit</a>
                            <a href="#" class="delete-link" data-id="${task._id.$oid}">Delete</a>
                        </div>
                    </li>
                `).join('');

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-link').forEach(link => {
                    link.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const taskId = e.target.dataset.id;
                        if (confirm('Are you sure you want to delete this task?')) {
                            await deleteTask(taskId);
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Add new task
    async function addTask(taskText) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText })
            });
            
            if (response.ok) {
                fetchTasks();
                // Reset form
                if (taskForm) taskForm.reset();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    // Delete task
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // Update task (for edit page)
    async function updateTask(taskId, taskText) {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText })
            });
            
            if (response.ok) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Event listeners
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const taskInput = taskForm.querySelector('input[name="task"]');
            
            if (taskInput) {
                const taskText = taskInput.value.trim();
                if (taskText) {
                    if (taskForm.dataset.editId) {
                        // Edit mode
                        await updateTask(taskForm.dataset.editId, taskText);
                    } else {
                        // Add mode
                        await addTask(taskText);
                    }
                }
            }
        });
    }

    // Initial fetch of tasks
    fetchTasks();
});
