        // Global variables
        const taskForm = document.getElementById('task-form');
        const taskInput = document.getElementById('task-input');
        const taskList = document.getElementById('task-list');
        const editModal = document.getElementById('edit-modal');
        const editForm = document.getElementById('edit-form');
        const editInput = document.getElementById('edit-input');
        const cancelEditBtn = document.getElementById('cancel-edit');

        let currentEditTaskId = null;

        // Fetch tasks on page load
        async function fetchTasks() {
            try {
                const response = await fetch('https://crud-operations-788o.onrender.com/get_tasks');
                const tasks = await response.json();
                
                // Clear existing tasks
                taskList.innerHTML = '';

                // Render tasks
                tasks.forEach(task => {
                    const li = createTaskElement(task);
                    taskList.appendChild(li);
                });
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }

        // Create task element
        function createTaskElement(task) {
            const li = document.createElement('li');
            li.classList.add('task-item');
            li.dataset.id = task._id;

            li.innerHTML = `
                <span>${task.task}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // Edit button event
            li.querySelector('.edit-btn').addEventListener('click', () => {
                currentEditTaskId = task._id;
                editInput.value = task.task;
                editModal.style.display = 'flex';
            });

            // Delete button event
            li.querySelector('.delete-btn').addEventListener('click', () => {
                deleteTask(task._id);
            });

            return li;
        }

        // Add task
        async function addTask(taskText) {
            try {
                const response = await fetch('https://crud-operations-788o.onrender.com/create_task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task: taskText })
                });

                if (response.ok) {
                    const newTask = await response.json();
                    const li = createTaskElement(newTask);
                    taskList.appendChild(li);
                    taskInput.value = '';
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }

        // Update task
        async function updateTask(taskId, newTask) {
            try {
                const response = await fetch(`https://crud-operations-788o.onrender.com/update_task/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task: newTask })
                });

                if (response.ok) {
                    // Refetch tasks to ensure consistency
                    fetchTasks();
                    editModal.style.display = 'none';
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }

        // Delete task
        async function deleteTask(taskId) {
            try {
                const response = await fetch(`https://crud-operations-788o.onrender.com/delete_task/${taskId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    // Remove task from DOM
                    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
                    if (taskElement) {
                        taskElement.remove();
                    }
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }

        // Event Listeners
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTask(taskText);
            }
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTask = editInput.value.trim();
            if (newTask && currentEditTaskId) {
                updateTask(currentEditTaskId, newTask);
            }
        });

        cancelEditBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        // Fetch tasks when page loads
        fetchTasks();
