from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup_page, name='signup'),
    path('api/signup/', views.signup, name='signup_api'),
]