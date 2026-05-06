from django.db import models # type: ignore
from django.contrib.auth.hashers import make_password, check_password # type: ignore

class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    ]
    username   = models.CharField(max_length=100, unique=True)
    email      = models.EmailField(unique=True)
    password   = models.CharField(max_length=255)   # stored as a hashed value
    role       = models.CharField(max_length=10, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        """Hash and store the password."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Return True if raw_password matches the stored hash."""
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.username} ({self.role})"