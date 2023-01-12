"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts.urls import urlpatterns as accounts_urls
from scheduler.urls import urlpatterns as scheduler_urls
from scheduler import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/scheduler/', include(scheduler_urls)),
    path('api/account/', include(accounts_urls)),
    path('login/', views.Login),
    path('login', views.Login),
    path('main', views.HomePage),
    path('register', views.Register),
    path('settings', views.Settings),
    path('', views.index)
]
