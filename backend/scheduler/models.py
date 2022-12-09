from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
import calendar

class Calendar(models.Model):
    title = models.CharField(max_length=120)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calendars')
    members = models.ManyToManyField(User, related_name='calendars', through='Membership')
    guests = models.ManyToManyField(User, related_name='guest_calendars', through='Membership')
    description = models.TextField()
    invite_code = models.CharField(max_length=255)
    def _str_(self):
        return self.title

# An an intermediate model to manage additional information for a many-to-many relationship between User and Calendar
class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=255, choices=[('owner', ), ('member', ), ('guest', )])
    reason = models.CharField(max_length=255)


class Task(models.Model):
    title = models.CharField(max_length=120)
    completed = models.BooleanField(default=False)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='tasks')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    members = models.ManyToManyField(User, related_name='calendars', through='TaskAssignment')
    mode = models.CharField(max_length=255, choices=[('one-time',), ('daily',), ('weekly',), ('monthly',), ('yearly',)])
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField()

    '''
     A function to handle corner cases of Task scheduling for monthly and yearly tasks.
     For example, if current monthly task is seheduled on Aug 31st, next time for this task is on Sept. 30th, because Sept only have 30 days;
     Similarly, next time for a yearly task currently seheduled on Feb 29th (if any) should be on Feb 28th in the next year.

     An example of usage:

     ```
     current_time = datetime.now()
     task = Task(mode='monthly')
     next_time = get_next_time(task, current_time)
    ```
    '''

    def get_next_time(self, current_time):
        if self.mode == 'one-time':
            return None
        elif self.mode == 'daily':
            return current_time + timedelta(days=1)
        elif self.mode == 'weekly':
            return current_time + timedelta(weeks=1)
        elif self.mode == 'monthly':
            next_month = current_time.month + 1
            next_year = current_time.year
            if next_month > 12:
                next_month = 1
                next_year += 1
            last_day_of_next_month = calendar.monthrange(next_year, next_month)[1]
            next_time = datetime(next_year, next_month, min(last_day_of_next_month, current_time.day), current_time.hour, current_time.minute, current_time.second)
            return next_time
        elif self.mode == 'yearly':
            next_year = current_time.year + 1
            last_day_of_february_in_next_year = calendar.monthrange(next_year, 2)[1]
            next_time = datetime(next_year, current_time.month, min(last_day_of_february_in_next_year, current_time.day), current_time.hour, current_time.minute, current_time.second)
            return next_time

    def _str_(self):
        return self.title

# Skip Table, indicating some dates that should be skipped for a task
class SkipTable(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='skip_table')
    time = models.DateTimeField()

# An an intermediate model to manage additional information for a many-to-many relationship between TAsk and Calendar
class TaskAssignment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    role = models.CharField(max_length=255, choices=[('owner',), ('member',)])
    