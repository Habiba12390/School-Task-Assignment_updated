from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('tasks/', views.task_list),
    path('tasks/<str:task_id>/', views.task_detail),
    path('add-task/', views.add_task_page),
    path('edit-task/', views.edit_task_page),
    path('completed-tasks/', views.completed_tasks_page),
    path('task-details/<str:task_id>/', views.task_details_page),
]