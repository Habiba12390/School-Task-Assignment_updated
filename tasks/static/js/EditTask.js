const API = 'http://127.0.0.1:8000/api';
document.addEventListener('DOMContentLoaded', async () => {
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
        }
    }

    setupNavigation();

    function showSuccessMessage(message) {
        const el = document.createElement('div');
        el.className = 'success-message';
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
    }

    function showErrorMessage(message) {
        const el = document.createElement('div');
        el.className = 'error-message';
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const taskID = urlParams.get('task_ID');

    if (!taskID) {
        showErrorMessage("The task number has not been specified for editing ❌");
        setTimeout(() => window.history.back(), 1500);
        return;
    }

    // ── Load task from backend ────────────────────────────────────────────────
    let currentTask;
    try {
        const res = await fetch(`${API}/tasks/${taskID}/`);
        if (!res.ok) {
            showErrorMessage("The requested task does not exist or you don't have permission to edit it ❌");
            setTimeout(() => window.history.back(), 1500);
            return;
        }
        currentTask = await res.json();
    } catch {
        showErrorMessage("Could not reach the server. Make sure the backend is running ❌");
        setTimeout(() => window.history.back(), 1500);
        return;
    }

    if (currentTask.created_by !== loggedName) {
        showErrorMessage("You don't have permission to edit this task ❌");
        setTimeout(() => { window.location.href = "Admin_Dashboard.html"; }, 1500);
        return;
    }

    // ── Populate form ─────────────────────────────────────────────────────────
    document.getElementById('task_ID').value       = currentTask.task_ID;
    document.getElementById('task_title').value    = currentTask.task_title || '';
    document.getElementById('teacher_name').value  = currentTask.teacher_name || '';
    document.getElementById('subject').value       = currentTask.subject || '';
    document.getElementById('grade').value         = currentTask.grade || '';
    document.getElementById('description').value   = currentTask.description || '';

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

    // ── Submit ────────────────────────────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const updates = {
            task_title:   document.getElementById('task_title').value.trim(),
            teacher_name: document.getElementById('teacher_name').value.trim(),
            subject:      document.getElementById('subject').value.trim(),
            grade:        document.getElementById('grade').value.trim(),
            priority:     document.querySelector('input[name="priority"]:checked')?.value || currentTask.priority || 'low',
            description:  document.getElementById('description').value.trim(),
        };

        try {
            const res = await fetch(`${API}/tasks/${taskID}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                showSuccessMessage('Task updated successfully ✅');
                setTimeout(() => { window.location.href = "Admin_Dashboard.html"; }, 2500);
            } else {
                showErrorMessage('Failed to update task. Please check all fields ❌');
            }
        } catch {
            showErrorMessage('Could not reach the server. Make sure the backend is running ❌');
        }
    });
});
