document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addTaskForm');
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
                <a href="Task_details.html">Task Details</a>
                <a href="Completed_tasks.html">Completed Tasks</a>
            `;
        } else {
            window.location.href = "Teacher_Dashboard.html";
        }
    }

    setupNavigation();

    if (createdByInput) {
        createdByInput.value = loggedName;
        createdByInput.readOnly = true;
        createdByInput.style.backgroundColor = '#f8fafc';
        createdByInput.style.cursor = 'not-allowed';
    }

    let isSubmitting = false;

    function showSuccessMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'success-message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);
        setTimeout(() => messageContainer.remove(), 2000);
    }

    form.addEventListener('reset', function () {
        setTimeout(() => {
            if (createdByInput) {
                createdByInput.value = loggedName;
            }
        }, 10);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        const newTask = {
            time: Date.now(),
            task_ID: document.getElementById('task_ID').value.trim(),
            task_title: document.getElementById('task_title').value.trim(),
            teacher_name: document.getElementById('teacher_name').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            grade: document.getElementById('grade').value.trim(),
            priority: document.querySelector('input[name="priority"]:checked')?.value || 'medium',
            description: document.getElementById('description').value.trim(),
            created_by: loggedName,
            created_at: new Date().toLocaleString('ar-EG'),
            status: "Pending"
        };

        let tasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];
        tasks.push(newTask);
        localStorage.setItem('yallado_tasks', JSON.stringify(tasks));

        showSuccessMessage('Task created successfully ✅');

        setTimeout(() => {
            window.location.href = "Admin_Dashboard.html";
        }, 1800);
    });
});