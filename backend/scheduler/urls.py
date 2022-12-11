# from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'calendars', views.CalendarAPI, 'calendar')
router.register(r'tasks', views.TaskAPI, 'task')
router.register(r'invitecode', views.InviteCodeAPI, 'invitecode')

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', include(router.urls)),
]