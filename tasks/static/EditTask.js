document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    const loggedName = localStorage.getItem('yallado_name') || 'Admin';
    const loggedRole = localStorage.getItem('yallado_role') || '';
    const createdByInput = document.getElementById('created_by');

    // ====================== Dynamic Nav Bar ======================
    function setupNavigation() {
        const navCenter = document.getElementById('nav-center');
        if (!navCenter) return;

        if (loggedRole === 'admin') {
            navCenter.innerHTML = `
                <a href="Admin_Dashboard.html">Admin Dashboard</a>
                <a href="Add_Task.html">Add New Task</a>
                <a href="Task_details.html">Task Details</a>
                <a href="Completed_tasks.html">Completed Tasks</a>
            `;
        } else {
            window.location.href = "Teacher_Dashboard.html";
        }
    }

    setupNavigation();

    function showSuccessMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'success-message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);
        setTimeout(() => messageContainer.remove(), 2500);
    }

    function showErrorMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'error-message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);
        setTimeout(() => messageContainer.remove(), 3000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const taskID = urlParams.get('task_ID');

    if (!taskID) {
        showErrorMessage("The task number has not been specified for editing ❌");
        setTimeout(() => window.history.back(), 1500);
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.task_ID === taskID);

    if (taskIndex === -1) {
        showErrorMessage("The requested task does not exist or you don't have permission to edit it ❌");
        setTimeout(() => window.history.back(), 1500);
        return;
    }

    const currentTask = tasks[taskIndex];

    if (currentTask.created_by !== loggedName) {
        showErrorMessage("You don't have permission to edit this task ❌");
        setTimeout(() => window.location.href = "Admin_Dashboard.html", 1500);
        return;
    }

    document.getElementById('task_ID').value = currentTask.task_ID;
    document.getElementById('task_title').value = currentTask.task_title || '';
    document.getElementById('teacher_name').value = currentTask.teacher_name || '';
    document.getElementById('subject').value = currentTask.subject || '';
    document.getElementById('grade').value = currentTask.grade || '';
    document.getElementById('description').value = currentTask.description || '';

    if (createdByInput) {
        createdByInput.value = currentTask.created_by || loggedName;
        createdByInput.readOnly = true;
        createdByInput.style.backgroundColor = '#f8fafc';
        createdByInput.style.cursor = 'not-allowed';
    }

    const priorityRadios = document.querySelectorAll('input[name="priority"]');
    priorityRadios.forEach(radio => {
        if (radio.value === (currentTask.priority || 'low').toLowerCase()) {
            radio.checked = true;
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        currentTask.task_title = document.getElementById('task_title').value.trim();
        currentTask.teacher_name = document.getElementById('teacher_name').value.trim();
        currentTask.subject = document.getElementById('subject').value.trim();
        currentTask.grade = document.getElementById('grade').value.trim();
        currentTask.priority = document.querySelector('input[name="priority"]:checked')?.value || currentTask.priority || 'low';
        currentTask.description = document.getElementById('description').value.trim();
        currentTask.updated_at = new Date().toLocaleString('ar-EG');

        tasks[taskIndex] = currentTask;
        localStorage.setItem('yallado_tasks', JSON.stringify(tasks));

        showSuccessMessage('Task updated successfully ✅');

        setTimeout(() => {
            window.location.href = "Admin_Dashboard.html";
        }, 2500);
    });
});