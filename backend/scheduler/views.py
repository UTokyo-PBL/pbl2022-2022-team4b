from django.shortcuts import render

from rest_framework import viewsets, permissions

from .serializers import CalendarSerializer, TaskSerializer
from .models import Calendar, Task

# Create your views here.
# Need to complete all the functions here to handle the requests
class CalendarAPI(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = CalendarSerializer
    
    # def get_queryset(self):
    #     return self.request.user.items.all()

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)


class TaskAPI(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = CalendarSerializer
    
    # def get_queryset(self):
    #     return self.request.user.items.all()

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)