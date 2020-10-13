from rest_framework import serializers
from django.contrib.auth.models import User
from  social.apps.django_app.default.models import UserSocialAuth

class UserSocialAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSocialAuth
        #exclude = ['extra_data']



class UserSerializer(serializers.ModelSerializer):

    auths = UserSocialAuthSerializer(many=True, source="social_auth")

    class Meta:
        model = User
        exclude = ['password', 'is_staff', 'is_superuser']


