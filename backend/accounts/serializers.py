from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], # user email as the unique username
                                        validated_data['email'],
                                        validated_data['password'])
        Profile.objects.create(user=user,
                                name=validated_data['first_name'],
                                email=validated_data['email'])  # create the user's profile
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['name', 'email', 'user']
