from django.db import models
from django.contrib.auth.models import User

import secrets
import string

def genShareCode():
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for i in range(10))

class Calendar(models.Model):
    title = models.CharField(max_length=120)
    created_time = models.DateTimeField(auto_now_add=True)
    invite_code = models.CharField(verbose_name="Invite Code", max_length=20, unique=True, default=genShareCode, blank=True)
    description = models.TextField(default='', blank=True)
    owner = models.ForeignKey(User, related_name="calendars",
                              on_delete=models.CASCADE, blank=False)

    members = models.ManyToManyField(User, related_name="member_calendars", blank=True)
    guests = models.ManyToManyField(User, related_name="guest_calendars", blank=True)

    def _str_(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(default='', blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    completed = models.BooleanField(default=False)
    calendar = models.ForeignKey(Calendar, related_name="tasks",
                              on_delete=models.CASCADE, blank=False)

    def _str_(self):
        return self.title


