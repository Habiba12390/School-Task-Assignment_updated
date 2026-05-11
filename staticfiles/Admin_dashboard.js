document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('task-table-body');
    if (!tableBody) return;

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // ====================== Dynamic Nav Bar ======================
    function setupNavigation() {
        const navCenter = document.getElementById('nav-center');
        if (!navCenter) return;
        navCenter.innerHTML = `
            <a href="/api/tasks/add-task/" class="nav-link">Add New Task</a>
            <a href="/api/tasks/task-details/" class="nav-link">Task Details</a>
            <a href="/api/tasks/completed-tasks/" class="nav-link">Completed Tasks</a>
        `;
    }

    // ====================== Fetch & Render Tasks ======================
    function fetchTasks() {
        fetch('/api/dashboard/api/admin-tasks/')
            .then(response => response.json())
            .then(data => {
                renderTasks(data.tasks);
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    function renderTasks(tasks) {
        tableBody.innerHTML = '';

        if (tasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding: 40px; color: #6b7280;">
                        <div style="font-size:2rem; margin-bottom:10px;">📋</div>
                        No active tasks yet.<br>
                        <span style="font-size:0.9rem;">Click "Create New Task" to add one.</span>
                    </td>
                </tr>`;
            return;
        }

        tasks.forEach((task) => {
            const row = document.createElement('tr');
            const priorityClass = (task.priority || 'low').toLowerCase();

            row.innerHTML = `
                <td>${task.task_ID || 'N/A'}</td>
                <td>${task.task_title || 'Untitled'}</td>
                <td>${task.teacher_name || 'Unassigned'}</td>
                <td><span class="priority ${priorityClass}">${task.priority || 'Low'}</span></td>
                <td>${task.description || ''}</td>
                <td class="actions-cell">
                    <a href="/api/tasks/edit-task/?task_ID=${task.task_ID}" class="btn btn-edit">Edit</a>
                    <button class="btn btn-delete" data-task-id="${task.task_ID}" style="cursor:pointer;">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        attachDeleteEvents();
    }

    // ====================== Delete Task (AJAX) ======================
    function attachDeleteEvents() {
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function () {
                if (!confirm('Are you sure you want to delete this task?')) return;

                const taskID = this.getAttribute('data-task-id');

                fetch(`/api/dashboard/api/delete-task/${taskID}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetchTasks();
                    } else {
                        alert('Error deleting task!');
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });
    }

    setupNavigation();
    fetchTasks();
});