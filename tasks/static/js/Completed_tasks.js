document.addEventListener("DOMContentLoaded", () => {

    const loggedName = localStorage.getItem("yallado_name") || '';
    const loggedRole = localStorage.getItem("yallado_role") || "";

    const main = document.querySelector("main");
    const emptyState = document.getElementById("empty-state");
    const template = document.getElementById("task-card-template");

    // ====================== Dynamic Nav ======================
    function setupNavigation() {
        const navCenter = document.getElementById('nav-center');
        if (!navCenter) return;

        if (loggedRole === 'admin') {
            navCenter.innerHTML = `
                <a href="Admin_Dashboard.html">Admin Dashboard</a>
                <a href="Task_details.html">Task Details</a>
                 <a href="Add_Task.html">Add New Task</a>

            `;
        } else {
            navCenter.innerHTML = `
                <a href="Teacher_Dashboard.html">Teacher Dashboard</a>
                <a href="Task_details.html">Task Details</a>
            `;
        }
    }

    // ====================== Render Completed Tasks ======================
    const allTasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];

    const completedTasks = allTasks.filter(task => {
        if (loggedRole === 'admin') {
            return task.created_by === loggedName && task.status === "Completed";
        } else {
            return task.teacher_name === loggedName && task.status === "Completed";
        }
    });

    completedTasks.sort((a, b) => (b.completed_at || 0) > (a.completed_at || 0) ? 1 : -1);

    if (completedTasks.length === 0) {
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";

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

    setupNavigation();
});