from django.shortcuts import render

from datetime import datetime
from rest_framework import viewsets, permissions, mixins

from .serializers import CalendarSerializer, TaskSerializer, InviteCodeSerializer
from .models import Calendar, Task
from .calendarTaskUtils import *

# Create your views here.
# Need to complete all the functions here to handle the requests
class CalendarAPI(viewsets.ModelViewSet):
    # queryset = Calendar.objects.all()
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = CalendarSerializer

    def get_queryset(self):
        return get_all_calendars(self.request.user)

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)


class TaskAPI(viewsets.ModelViewSet):
    # queryset = Task.objects.all()
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = TaskSerializer

    def get_queryset(self):
        calendar_id = self.request.GET.get('calendar')
        if calendar_id == 'all':
            calendar_list = get_all_calendars(self.request.user)
        else:
            calendar_list = Calendar.objects.filter(id=calendar_id)
        start_time = self.request.GET.get('start')
        end_time = self.request.GET.get('end')
        return get_tasks(calendar_list, start_time, end_time)



class InviteCodeAPI(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Calendar.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = InviteCodeSerializer

    # def get_queryset(self):
    #     calendar_id = self.request.GET.get('calendar')
    #     shareCode = Calendar.objects.get(pk=calendar_id)
    #     return [shareCode]
