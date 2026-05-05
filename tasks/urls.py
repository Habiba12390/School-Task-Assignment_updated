from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list),
    path('add-task/', views.add_task_page),             
    path('edit-task/', views.edit_task_page),
    path('completed-tasks/', views.completed_tasks_page),
    path('task-details/<str:task_id>/', views.task_details_page),
    path('<str:task_id>/', views.task_detail),            
]