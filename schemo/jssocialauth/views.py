from django.views.generic import TemplateView
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

class TokenPopView(TemplateView):
    template_name = "jssocialauth/token_pop.html"

    def dispatch(self, *args, **kwargs):
        kk = self.request.session.get("authkey")
        selfkk = self.request.GET.get('authkey')
        try:
            del self.request.session["authkey"]
        except:
            pass

        if kk != selfkk:
            raise Http404
        return super(TokenPopView, self).dispatch(*args, **kwargs)


    def get_context_data(self, **kwargs):
        token = Token.objects.get_or_create(user=self.request.user)
        ctx = super(TokenPopView, self).get_context_data(**kwargs)
        ctx['token'] =token[0]
        return ctx



#classes for user detection (roles, social auths)
from rest_framework.decorators import api_view
from .serializers import UserSerializer



class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)