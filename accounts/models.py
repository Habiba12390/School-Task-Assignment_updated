from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    ]
    username   = models.CharField(max_length=100, unique=True)
    email      = models.EmailField(unique=True)
    password   = models.CharField(max_length=255)
    role       = models.CharField(max_length=10, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True) 

    def set_password(self, raw_password):
        self.password = raw_password

    def check_password(self, raw_password):
        return self.password == raw_password

    def __str__(self):
        return f"{self.username} ({self.role})"