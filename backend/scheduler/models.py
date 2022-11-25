from django.db import models

# Create your models here.
from django.contrib.auth.models import User

# Create your models here.

class Calendar(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    owner = models.ForeignKey(User, related_name="calendars",
                              on_delete=models.CASCADE, null=True)

    members = models.ManyToManyField(User, related_name="members")
    guests = models.ManyToManyField(User, related_name="guests")

    def _str_(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    owner = models.ForeignKey(Calendar, related_name="tasks",
                              on_delete=models.CASCADE, null=True)

    def _str_(self):
        return self.title


