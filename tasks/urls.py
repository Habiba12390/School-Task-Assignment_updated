from django.urls import path  # type: ignore
from . import views

urlpatterns = [
    path('admin-dashboard/', views.admin_dashboard),
    path('teacher-dashboard/', views.teacher_dashboard),
    path('teacher-complete/<str:task_id>/', views.teacher_complete_task),
    path('api/admin-tasks/', views.get_admin_tasks),
    path('api/delete-task/<str:task_id>/', views.admin_delete_task),
]
