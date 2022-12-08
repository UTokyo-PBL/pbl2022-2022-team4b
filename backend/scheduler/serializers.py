from rest_framework import serializers
from .models import Calendar, Task
from django.contrib.auth.models import User


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('id', 'title', 'created_time', 'description', 'owner', 'members','guests')
    
    def create(self, validated_data):
        validated_data.pop('id', None)
        validated_data.pop('owner', None)
        owner = serializers.CurrentUserDefault()
        members = validated_data.pop('members', [])
        guests = validated_data.pop('guests', [])
        calendar = Calendar.objects.create(owner=owner, **validated_data)
        calendar.members.add(User.objects.filter(username__in=members))
        calendar.guests.add(User.objects.filter(username__in=guests))
        return calendar

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'completed', 'calendar', 'start_time', 'end_time')

    def create(self, validated_data):
        validated_data.pop('id', None)
        calendar = Calendar.objects.filter(id=validated_data.pop('calendar'))
        task = Task.objects.create(calendar=calendar, **validated_data)
        return task