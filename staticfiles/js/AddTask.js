document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addTaskForm');
    if (!form) return;

    const createdByInput = document.getElementById('created_by');

    // ====================== Dynamic Nav Bar ======================
    function setupNavigation() {
        const navCenter = document.getElementById('nav-center');
        if (!navCenter) return;

        if (LOGGED_ROLE === 'admin') {
            navCenter.innerHTML = `
                <a href="/api/dashboard/admin-dashboard/">Admin Dashboard</a>
                <a href="/api/tasks/task-details/">Task Details</a>
                <a href="/api/tasks/completed-tasks/">Completed Tasks</a>
            `;
        }
    }

    setupNavigation();

    if (createdByInput) {
        createdByInput.value = LOGGED_NAME;
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
            if (createdByInput) createdByInput.value = LOGGED_NAME;
        }, 10);
    });

    let isSubmitting = false;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const taskData = {
            // ✅ task_ID اتشالت، Django هيحطها تلقائي
            task_title:   document.getElementById('task_title').value.trim(),
            teacher_name: document.getElementById('teacher_name').value.trim(),
            subject:      document.getElementById('subject').value.trim(),
            grade:        document.getElementById('grade').value.trim(),
            priority:     document.querySelector('input[name="priority"]:checked')?.value || 'medium',
            description:  document.getElementById('description').value.trim(),
            created_by:   LOGGED_NAME,
            status:       'Pending',
        };

        try {
            const res = await fetch('/api/tasks/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (res.ok) {
                showSuccessMessage('Task created successfully ✅');
                setTimeout(() => {
                    window.location.href = '/api/dashboard/admin-dashboard/';
                }, 1800);
            } else {
                const err = await res.json();
                showErrorMessage('Failed to create task. Please check all fields ❌');
                isSubmitting = false;
            }
        } catch {
            showErrorMessage('Could not reach the server. Make sure the backend is running ❌');
            isSubmitting = false;
        }
    });
});