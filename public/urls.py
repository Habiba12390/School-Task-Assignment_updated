from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('api/contact/', views.submit_contact_api, name='api_contact'),
    path('about/', views.about_us, name='about_us'),
]