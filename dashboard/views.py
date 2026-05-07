from django.shortcuts import render, redirect  # type: ignore
from django.http import JsonResponse
from tasks.models import Task


def admin_dashboard(request):
    if not request.session.get("user_id"):
        return redirect("/login/")
    if request.session.get("user_role") != "admin":
        return redirect("/api/dashboard/teacher-dashboard/")
    return render(request, "Admin_dashboard.html")


def teacher_dashboard(request):
    if not request.session.get("user_id"):
        return redirect("/login/")
    if request.session.get("user_role") != "teacher":
        return redirect("/api/dashboard/admin-dashboard/")

    teacher_name = request.session.get("user_name", "")
    priority_filter = request.GET.get("priority", "").strip()

    tasks = Task.objects.filter(teacher_name=teacher_name).exclude(status="Completed")

    if priority_filter:
        tasks = tasks.filter(priority__iexact=priority_filter)

    context = {
        "teacher_name": teacher_name,
        "tasks": tasks,
        "priority_filter": priority_filter,
        "task_count": tasks.count(),
    }
    return render(request, "Teacher_dashboard.html", context)


def teacher_complete_task(request, task_id):
    """Mark a task as Completed via AJAX POST"""
    if not request.session.get("user_id"):
        return JsonResponse({"error": "Not authenticated"}, status=401)
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        task = Task.objects.get(
            task_ID=task_id, teacher_name=request.session.get("user_name")
        )
        task.status = "Completed"
        task.save()
        return JsonResponse({"success": True})
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)
