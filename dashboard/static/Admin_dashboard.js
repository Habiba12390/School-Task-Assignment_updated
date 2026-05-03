document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('task-table-body');
    if (!tableBody) return;

    const loggedName = localStorage.getItem('yallado_name') || '';
    const loggedRole = localStorage.getItem('yallado_role') || '';

    // ====================== Dynamic Nav Bar ======================
    function setupNavigation() {
        const navCenter = document.getElementById('nav-center');
        if (!navCenter) return;

        if (loggedRole === 'admin') {
            navCenter.innerHTML = `
                <a href="Add_Task.html" class="nav-link">Add New Task</a>
                <a href="Task_details.html" class="nav-link">Task Details</a>
                <a href="Completed_tasks.html" class="nav-link">Completed Tasks</a>
            `;
        } else if (loggedRole === 'teacher') {
            window.location.href = "Teacher_Dashboard.html";
        }
    }

    // ====================== Render Tasks ======================
    function renderTasks() {
        tableBody.innerHTML = '';

        let allTasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];

        let tasks = allTasks.filter(task =>
            task.created_by === loggedName && task.status !== "Completed"
        );

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
                    <a href="Edit_Task.html?task_ID=${encodeURIComponent(task.task_ID)}" class="btn btn-edit">Edit</a>
                    <button class="btn btn-delete" data-task-id="${task.task_ID}" style="cursor:pointer;">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        attachDeleteEvents();
    }

    function attachDeleteEvents() {
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function () {
                if (!confirm('Are you sure you want to delete this task?')) return;

                const taskID = this.getAttribute('data-task-id');
                let tasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];
                tasks = tasks.filter(t => t.task_ID !== taskID);
                localStorage.setItem('yallado_tasks', JSON.stringify(tasks));
                renderTasks();
            });
        });
    }

    setupNavigation();
    renderTasks();
});