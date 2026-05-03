const API = 'http://127.0.0.1:8000/api';
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
        }
    }

    setupNavigation();

    if (createdByInput) {
        createdByInput.value = loggedName;
        createdByInput.readOnly = true;
        createdByInput.style.backgroundColor = '#f8fafc';
        createdByInput.style.cursor = 'not-allowed';
    }

    function showSuccessMessage(message) {
        const el = document.createElement('div');
        el.className = 'success-message';
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }

    function showErrorMessage(message) {
        const el = document.createElement('div');
        el.className = 'error-message';
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    form.addEventListener('reset', function () {
        setTimeout(() => {
            if (createdByInput) createdByInput.value = loggedName;
        }, 10);
    });

    let isSubmitting = false;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const taskData = {
            task_ID:      document.getElementById('task_ID').value.trim(),
            task_title:   document.getElementById('task_title').value.trim(),
            teacher_name: document.getElementById('teacher_name').value.trim(),
            subject:      document.getElementById('subject').value.trim(),
            grade:        document.getElementById('grade').value.trim(),
            priority:     document.querySelector('input[name="priority"]:checked')?.value || 'medium',
            description:  document.getElementById('description').value.trim(),
            created_by:   loggedName,
            status:       'Pending',
        };

        try {
            const res = await fetch(`${API}/tasks/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (res.ok) {
                showSuccessMessage('Task created successfully ✅');
                setTimeout(() => { window.location.href = "Admin_Dashboard.html"; }, 1800);
            } else {
                const err = await res.json();
                const message = err.task_ID
                    ? 'A task with this ID already exists ❌'
                    : 'Failed to create task. Please check all fields ❌';
                showErrorMessage(message);
                isSubmitting = false;
            }
        } catch {
            showErrorMessage('Could not reach the server. Make sure the backend is running ❌');
            isSubmitting = false;
        }
    });
});
