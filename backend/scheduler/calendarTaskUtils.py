from datetime import datetime
from .models import Task

def get_tasks(calendar_list=[], start_time:str=None, end_time:str=None):
    if start_time==None or end_time==None:
        tasks = Task.objects.filter(calendar__in=calendar_list)
    else:
        start_time = datetime.fromisoformat(start_time)
        end_time = datetime.fromisoformat(end_time)
        tasks = Task.objects.filter(calendar__in=calendar_list).filter(start_time__range=(start_time,end_time))
    return tasks
    
def get_all_calendars(user):
    calendars = user.calendars.all()
    member_calendars = user.member_calendars.all()
    guest_calendars = user.guest_calendars.all()
    return calendars | member_calendars | guest_calendars
