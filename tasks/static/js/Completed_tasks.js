// Variables passed from Django template
// LOGGED_NAME and LOGGED_ROLE are defined in the HTML before this script

document.addEventListener("DOMContentLoaded", async () => {

    // Use Django session variables (passed from template)
    const loggedName = typeof LOGGED_NAME !== 'undefined' ? LOGGED_NAME : "";
    const loggedRole = typeof LOGGED_ROLE !== 'undefined' ? LOGGED_ROLE : "";
    
    const main = document.querySelector("main");
    const emptyState = document.getElementById("empty-state");
    const template = document.getElementById("task-card-template");

    // Redirect if not logged in
    if (!loggedName || !loggedRole) {
        console.error('User not logged in');
        window.location.href = '/login/';
        return;
    }

    // ====================== Dynamic Nav ======================
    function setupNavigation() {
        const navCenter = document.getElementById('nav-center');
        if (!navCenter) return;

        if (loggedRole === 'admin') {
            navCenter.innerHTML = `
                <a href="/api/dashboard/admin-dashboard/">Admin Dashboard</a>
                <a href="/api/tasks/task-details/">Task Details</a>
                <a href="/api/tasks/add-task/">Add New Task</a>
            `;
        } else {
            navCenter.innerHTML = `
                <a href="/api/dashboard/teacher-dashboard/">Teacher Dashboard</a>
                <a href="/api/tasks/task-details/">Task Details</a>
            `;
        }
    }

    // ====================== Render Completed Tasks ======================
    async function loadCompletedTasks() {
        try {
            const response = await fetch('/api/tasks/');
            const allTasks = await response.json();
            
            const completedTasks = allTasks.filter(task => {
                if (loggedRole === 'admin') {
                    return task.created_by === loggedName && task.status === "Completed";
                } else {
                    return task.teacher_name === loggedName && task.status === "Completed";
                }
            });
            
            // Sort by completion date (newest first)
            completedTasks.sort((a, b) => {
                const dateA = a.completed_at || a.updated_at || '';
                const dateB = b.completed_at || b.updated_at || '';
                return dateB.localeCompare(dateA);
            });
            
            renderCompletedTasks(completedTasks);
        } catch (error) {
            console.error('Error loading completed tasks:', error);
            if (emptyState) {
                emptyState.style.display = "block";
                const emptyTitle = emptyState.querySelector('.empty-title');
                if (emptyTitle) emptyTitle.textContent = 'Error loading tasks';
            }
        }
    }

    // ====================== Render Tasks Function ======================
    function renderCompletedTasks(completedTasks) {
        // Hide empty state initially
        if (emptyState) emptyState.style.display = "none";
        
        // Remove any existing task cards
        document.querySelectorAll('.task-card').forEach(card => card.remove());
        
        if (completedTasks.length === 0) {
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        completedTasks.forEach((task, i) => {
            const fragment = template.content.cloneNode(true);
            const card = fragment.querySelector(".task-card");

            card.querySelector(".task-title").textContent = task.task_title || "Untitled Task";
            card.querySelector(".task-id").textContent = task.task_ID || "—";
            card.querySelector(".task-teacher").textContent = task.teacher_name || "—";
            card.querySelector(".task-creator").textContent = task.created_by || "—";

            const priorityBadge = card.querySelector(".task-priority");
            const p = (task.priority || "low").toLowerCase();
            const validPriority = ['high', 'medium', 'low'].includes(p) ? p : 'low';
            priorityBadge.className = `priority ${validPriority}`;
            priorityBadge.textContent = validPriority.toUpperCase();

            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;

            main.appendChild(card);

            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // ====================== Initialize ======================
    setupNavigation();
    await loadCompletedTasks();
});
