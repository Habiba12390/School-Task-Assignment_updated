from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    ]
    name     = models.CharField(max_length=100)
    email    = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role     = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.role})"