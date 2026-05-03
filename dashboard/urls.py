from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('admin-dashboard/', views.admin_dashboard),
    path('teacher-dashboard/', views.teacher_dashboard),
]