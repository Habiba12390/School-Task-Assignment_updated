from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('', TemplateView.as_view(template_name='Home.html')),
    path('signup/', TemplateView.as_view(template_name='Sign_up.html')),
    path('login/', TemplateView.as_view(template_name='login.html')),
]