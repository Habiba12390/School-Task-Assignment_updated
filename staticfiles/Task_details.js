document.addEventListener("DOMContentLoaded", () => {

    const loggedRole = localStorage.getItem("yallado_role") || "";
    const loggedName = localStorage.getItem("yallado_name") || "";

    // ====================== Dynamic Nav ======================
    function setupNavigation() {
        const navCenter = document.getElementById("nav-center");
        if (!navCenter) return;

        if (loggedRole === "admin") {
            navCenter.innerHTML = `
                <a href="Admin_Dashboard.html">Admin Dashboard</a>
                <a href="Add_Task.html">Add New Task</a>
                <a href="Completed_tasks.html">Completed Tasks</a>
            `;
        } else {
            navCenter.innerHTML = `
                <a href="Teacher_Dashboard.html">Teacher Dashboard</a>
                <a href="Completed_tasks.html">Completed Tasks</a>
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
    function getMyActiveTasks() {
        const allTasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];

        return allTasks.filter(task => {
            if (loggedRole === "admin") {
                return task.created_by === loggedName && task.status !== "Completed";
            } else {
                return task.teacher_name === loggedName && task.status !== "Completed";
            }
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
    
   function markComplete(taskID, cardEl) {
    let tasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];
    
    const idx = tasks.findIndex(t => 
        String(t.task_ID).trim() === String(taskID).trim()
    );
    
    if (idx === -1) {
        showToast('Task not found ❌', 'error');
        return;
    }

    tasks[idx].status = "Completed";
    tasks[idx].completed_at = new Date().toISOString();
    localStorage.setItem('yallado_tasks', JSON.stringify(tasks));

    showToast('Task marked as completed ✅');

    cardEl.style.opacity = "0";
    cardEl.style.transform = "translateY(-10px)";

    setTimeout(() => {
        cardEl.remove();

        const remainingTasks = getMyActiveTasks();
        
        if (remainingTasks.length === 0) {
            const emptyTemplate = document.getElementById("empty-state-template");
            if (emptyTemplate) {
                main.innerHTML = ''; 
                main.appendChild(emptyTemplate.content.cloneNode(true));
            }
        } else {
            renderAllRemainingTasks(remainingTasks);
        }
    }, 300);
} 



function renderAllRemainingTasks(tasks) {
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

    // ====================== Initialize ======================
    setupNavigation();

    const main = document.querySelector("main");

    const myTasks = getMyActiveTasks();

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