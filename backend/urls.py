from django.contrib import admin # type: ignore
from django.urls import path, include # type: ignore

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('public.urls')),
    path('api/', include('accounts.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]