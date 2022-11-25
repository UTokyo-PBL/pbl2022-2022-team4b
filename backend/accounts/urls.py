from django.urls import path, include
from . import views
from knox import views as knox_views


urlpatterns = [
    path('register/', views.RegistrationAPI.as_view(), name="register"),
    path('login/', views.LoginAPI.as_view(), name="login"),
    path('logout/', knox_views.LogoutView.as_view(), name="logout"),
    path('user/', views.UserAPI.as_view(), name="user"),
]
