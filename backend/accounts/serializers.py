from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['email'], # user email as the unique username
                                        None,
                                        validated_data['password'])
        Profile.objects.create(user=user,
                                name=validated_data['username'],
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
