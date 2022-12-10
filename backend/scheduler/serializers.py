from rest_framework import serializers
from .models import Calendar, Task
from django.contrib.auth.models import User


class CalendarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Calendar
        fields = ('id', 'title', 'created_time', 'description', 'owner', 'members','guests')
        read_only_fields = ['id', 'owner']

    def to_representation(self, instance: Calendar):
        rep = {
            'id': instance.id,
            'title': instance.title,
            'created_time': instance.created_time,
            'description': instance.description,
            'owner': instance.owner.username,
            'members': [ member.username for member in instance.members.all()],
            'guests': [ guest.username for guest in instance.guests.all()]
        }
        return rep

    def to_internal_value(self, data):
        data_dict = dict(data)
        rep = {
            'owner': User.objects.get(username=data_dict.get('owner')[0]),
            'title': data_dict.get('title', 'No Title'),
            'description': data_dict.get('description', ''),
            'members': User.objects.filter(username__in=data_dict.get('members', [])),
            'guests': [ i.id for i in User.objects.filter(username__in=data_dict.get('guests', []))],
        }
        return rep

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'completed', 'calendar', 'start_time', 'end_time')
        read_only_fields = ['id']



