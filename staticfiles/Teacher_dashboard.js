document.addEventListener("DOMContentLoaded", () => {

    const loggedName = localStorage.getItem("yallado_name") || '';
    const loggedRole = localStorage.getItem("yallado_role") || '';

    // ====================== Redirect if not teacher ======================
    if (loggedRole === 'admin') {
        window.location.href = "Admin_Dashboard.html";
        return;
    }

    // ====================== Greeting ======================
    const greeting = document.querySelector("main h2");
    if (greeting && loggedName) {
        greeting.textContent = `Hello, ${loggedName}! 👋`;
    }

    // ====================== Dynamic Nav Bar ======================
    function setupNavigation() {
        const navCenter = document.getElementById('nav-center');
        if (!navCenter) return;

        navCenter.innerHTML = `
            <a href="Task_details.html">Task Details</a>
            <a href="Completed_tasks.html">Completed Tasks</a>
        `;
    }

    function priorityBadge(priority) {
        const p = (priority || "low").toLowerCase();
        return `<span class="badge badge-${p}">${priority || 'Low'}</span>`;
    }

    function getMyTasks(priorityFilter = null) {
        const allTasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];

        return allTasks.filter(task => {
            return task.teacher_name === loggedName && task.status !== "Completed";
        }).filter(task => {
            if (!priorityFilter) return true;
            return task.priority?.toLowerCase() === priorityFilter.toLowerCase();
        });
    }

    function renderCards(tasks, priorityFilter) {
        const container = document.getElementById("task-list-container");
        if (!container) return;
        container.innerHTML = "";

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p class="empty-state-title">
                        ${priorityFilter ? `No ${priorityFilter} priority tasks found` : 'No tasks assigned to you yet'}
                    </p>
                    <p class="empty-state-text">
                        ${priorityFilter ? 'Try another priority.' : 'Tasks assigned to you will appear here.'}
                    </p>
                </div>`;
            return;
        }

        tasks.forEach((task, i) => {
            const card = document.createElement("div");
            card.className = "task-card";

            card.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.task_title || 'Untitled Task'}</h3>
                    <span class="task-status">🔄 Ongoing</span>
                </div>
                <div class="task-grid">
                    <div><span class="task-label">Task ID:</span> <span class="task-value">${task.task_ID || '—'}</span></div>
                    <div><span class="task-label">Subject:</span> <span class="task-value">${task.subject || '—'}</span></div>
                    <div><span class="task-label">Priority:</span> <span class="task-value-wrapper">${priorityBadge(task.priority)}</span></div>
                    <div><span class="task-label">Created by:</span> <span class="task-value">${task.created_by || '—'}</span></div>
                    <div><span class="task-label">Grade:</span> <span class="task-value">${task.grade || '—'}</span></div>
                    <div><span class="task-label">Status:</span> <span class="task-value">Ongoing</span></div>
                </div>
                <div class="task-footer">
                    <a href="Task_details.html" class="btn-details">
                        📋 View Details →
                    </a>
                </div>
            `;

            container.appendChild(card);

            requestAnimationFrame(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            });
        });
    }

    const form = document.querySelector("form");
    const searchInput = document.getElementById("search");

    if (form && searchInput) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            renderCards(getMyTasks(query), query);
        });
    }

    setupNavigation();
    renderCards(getMyTasks());
});