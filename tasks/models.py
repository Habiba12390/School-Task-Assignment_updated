from django.db import models # type: ignore


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    task_ID      = models.CharField(max_length=50, unique=True)
    task_title   = models.CharField(max_length=200)
    teacher_name = models.CharField(max_length=100)
    subject      = models.CharField(max_length=100)
    grade        = models.CharField(max_length=50)
    priority     = models.CharField( max_length=10, choices=PRIORITY_CHOICES,default='medium')
    description  = models.TextField()
    created_by   = models.CharField(max_length=100)
    status       = models.CharField(max_length=50, default='Pending')

    def __str__(self):
        return self.task_ID
    
    class Meta:
            ordering = ['task_ID']