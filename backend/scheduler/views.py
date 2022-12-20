from django.shortcuts import render

import datetime
from rest_framework import viewsets, permissions, mixins, generics
from rest_framework.decorators import action
from django.contrib.auth.models import User

from .serializers import CalendarSerializer, TaskSerializer, InviteCodeSerializer
from .models import Calendar, Task
from .calendarTaskUtils import get_tasks, get_all_calendars
from rest_framework.response import Response

from .find_free_slot import allocate_free_slot

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
        try:
            calendar_id = self.request.GET.get('calendar')
            if calendar_id == 'all':
                calendar_list = get_all_calendars(self.request.user)
            else:
                calendar_list = Calendar.objects.filter(id=calendar_id)
            start_time = self.request.GET.get('start')
            end_time = self.request.GET.get('end')
            return get_tasks(calendar_list, start_time, end_time)
        except Exception as e:
            return Response({
                "Failed": e
            })
       



class InviteCodeAPI(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Calendar.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = InviteCodeSerializer

    @action(detail=True, methods=['put'])
    def add(self, request, pk=None):
        try:
            req_dict:dict = dict(request.data)
            calendar = Calendar.objects.get(pk=pk)
            if not calendar.invite_code == req_dict.get('invite_code')[0]:
                return Response({
                    "Failed": "Invite code wrong"
                })
            calendar.members.set(calendar.members.get_queryset() | User.objects.filter(username__in=req_dict.get('members', [])))
            calendar.guests.set(calendar.guests.get_queryset() | User.objects.filter(username__in=req_dict.get('guests', [])))
            calendar.save()
            print(User.objects.filter(username__in=req_dict.get('guests', [])))
            serializer = self.get_serializer(calendar)
            return Response(serializer.data)
        except BaseException as e:
            return Response({
                "Failed": str(e)
            })


class FindSlotAPI(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    # serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        try:
            req_dict:dict = request.data.dict()
            print(req_dict['duration'])
            duration = datetime.timedelta(minutes=int(req_dict['duration']))
            start_time = datetime.datetime.fromisoformat(req_dict["start_time"])
            end_time = datetime.datetime.fromisoformat(req_dict["end_time"])
            calendar_list = get_all_calendars(self.request.user)
            tasks = Task.objects.filter(calendar__in=calendar_list).filter(start_time__range=(start_time,end_time))
            task_list = [(t.start_time, t.end_time) for t in tasks]
            best_start_time, total_conflict_time, total_conflict_member = allocate_free_slot(duration, task_list, task_span=(start_time, end_time))
            return Response({
                "best_start_time": best_start_time,
                "total_conflict_time": total_conflict_time,
                "total_conflict_members": total_conflict_member
            })
        except BaseException as e:
            return Response({
                "Failed": str(e)
            })
        # return Response({
        #     "Failed": 0
        # })
