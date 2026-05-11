from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list, name='task_list'),
    path('add-task/', views.add_task_page, name='add_task'),
    path('edit-task/', views.edit_task_page, name='edit_task'),
    path('completed-tasks/', views.completed_tasks_page, name='completed_tasks'),
    path('task-details/', views.task_details_page, name='task_details'),
    path('<str:task_id>/', views.task_detail, name='task_detail'),

]
