from django.shortcuts import render

from datetime import datetime
from rest_framework import viewsets, permissions, generics

from .serializers import CalendarSerializer, TaskSerializer
from .models import Calendar, Task

# Create your views here.
# Need to complete all the functions here to handle the requests
class CalendarAPI(viewsets.ModelViewSet):
    # queryset = Calendar.objects.all()
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = CalendarSerializer

    def get_queryset(self):
        calendars = self.request.user.calendars.all()
        member_calendars = self.request.user.member_calendars.all()
        guest_calendars = self.request.user.guest_calendars.all()
        return calendars | member_calendars | guest_calendars

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)


class TaskAPI(viewsets.ModelViewSet):
    # queryset = Task.objects.all()
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = TaskSerializer

    def get_queryset(self):
        calendar_id = self.request.GET.get('calendar')
        if self.request.GET.keys() >= {'start', 'end'}:
            start_time = datetime.fromisoformat(self.request.GET.get('start'))
            end_time = datetime.fromisoformat(self.request.GET.get('end'))
            tasks = Task.objects.filter(calendar__id=calendar_id).filter(start_time__range=(start_time,end_time))
        else:
            tasks = Task.objects.filter(calendar__id=calendar_id)
        return tasks
