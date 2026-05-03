from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('signup/', views.signup_page, name='signup'),
    path('signup-api/', views.signup, name='signup_api'),
    path('login/', views.login_view, name='login_api'),
]