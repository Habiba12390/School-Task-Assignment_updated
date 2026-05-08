// Variables passed from Django template
// LOGGED_NAME and LOGGED_ROLE are defined in the HTML before this script

document.addEventListener("DOMContentLoaded", async () => {

    // Use Django session variables (passed from template)
    const loggedRole = typeof LOGGED_ROLE !== 'undefined' ? LOGGED_ROLE : "";
    const loggedName = typeof LOGGED_NAME !== 'undefined' ? LOGGED_NAME : "";
    const main = document.querySelector("main");

    // Redirect if not logged in
    if (!loggedName || !loggedRole) {
        console.error('User not logged in');
        window.location.href = '/login/';
        return;
    }

    // ====================== Dynamic Nav ======================
    function setupNavigation() {
        const navCenter = document.getElementById("nav-center");
        if (!navCenter) return;

        if (loggedRole === "admin") {
            navCenter.innerHTML = `
                <a href="/api/dashboard/admin-dashboard/">Admin Dashboard</a>
                <a href="/api/tasks/add-task/">Add New Task</a>
                <a href="/api/tasks/completed-tasks/">Completed Tasks</a>
            `;
        } else {
            navCenter.innerHTML = `
                <a href="/api/dashboard/teacher-dashboard/">Teacher Dashboard</a>
                <a href="/api/tasks/completed-tasks/">Completed Tasks</a>
            `;
        }
    }

    // ====================== Toast ======================
    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `td-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ====================== Filter: active tasks only ======================
    async function getMyActiveTasks() {
        try {
            const response = await fetch('/api/tasks/');
            const allTasks = await response.json();
            
            return allTasks.filter(task => {
                if (loggedRole === "admin") {
                    return task.created_by === loggedName && task.status !== "Completed";
                } else {
                    return task.teacher_name === loggedName && task.status !== "Completed";
                }
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showToast('Could not load tasks ❌', 'error');
            return [];
        }
    }

    // ====================== Check and Show Empty State ======================
    async function checkAndShowEmptyState() {
        const remainingTasks = await getMyActiveTasks();
        
        if (remainingTasks.length === 0) {
            main.innerHTML = '';
            const template = document.getElementById("empty-state-template");
            main.appendChild(template.content.cloneNode(true));
        } else {
            renderAllRemainingTasks(remainingTasks);
        }
    }

    // ====================== Render All Remaining Tasks ======================
    function renderAllRemainingTasks(tasks) {
        // Clear existing task cards
        document.querySelectorAll('.task-card').forEach(card => card.remove());
        
        tasks.forEach((task, i) => {
            const card = buildCard(task);
            main.appendChild(card);
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, i * 80);
        });
    }

    // ====================== Build Card ======================
    function buildCard(task) {
        const template = document.getElementById("task-card-template");
        const fragment = template.content.cloneNode(true);
        const card = fragment.querySelector(".task-card");

        card.querySelector('.task-title').textContent = task.task_title || 'Untitled Task';
        card.querySelector('.task-id-val').textContent = task.task_ID || '—';
        card.querySelector('.task-teacher-val').textContent = task.teacher_name || '—';
        card.querySelector('.task-creator-val').textContent = task.created_by || '—';

        const p = (task.priority || 'low').toLowerCase();
        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority ${p}`;
        priorityBadge.textContent = (task.priority || 'Low').toUpperCase();
        card.querySelector('.priority-container').appendChild(priorityBadge);

        if (task.description) {
            card.querySelector(".task-desc-container").classList.remove("hidden");
            card.querySelector('.task-desc-val').textContent = task.description;
        }

        card.style.opacity = "0";
        card.style.transform = "translateY(16px)";
        card.style.transition = "opacity 0.4s ease, transform 0.4s ease";

        card.querySelector(".btn-complete").addEventListener('click', () => markComplete(task.task_ID, card));

        return card;
    }

    // ====================== Mark Complete ======================
    async function markComplete(taskID, cardEl) {
        try {
            const response = await fetch(`/api/tasks/${taskID}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Completed' })
            });
            
            if (response.ok) {
                showToast('Task marked as completed ✅');
                
                cardEl.style.opacity = "0";
                cardEl.style.transform = "translateY(-10px)";
                
                setTimeout(() => {
                    cardEl.remove();
                    checkAndShowEmptyState();
                }, 300);
            } else {
                showToast('Failed to update task ❌', 'error');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            showToast('Could not reach the server ❌', 'error');
        }
    }

    // ====================== Initialize ======================
    setupNavigation();

    const myTasks = await getMyActiveTasks();

    if (myTasks.length === 0) {
        const template = document.getElementById("empty-state-template");
        main.appendChild(template.content.cloneNode(true));
    } else {
        myTasks.forEach((task, i) => {
            const card = buildCard(task);
            main.appendChild(card);
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, i * 100);
        });
    }
});
