from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup_page, name='signup'),
    path('signup-api/', views.signup, name='signup_api'),
    path('login/', views.login_page, name='login_page'),    
    path('login-api/', views.login_view, name='login_api'), 
    path('logout/', views.logout_view, name='logout'),
]
