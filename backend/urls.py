from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tasks/', include('tasks.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('', include('public.urls')),
    path('', include('accounts.urls')), 
    path('about/', include('public.urls')),
]