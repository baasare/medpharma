from django.contrib.auth import get_user_model, user_logged_out
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from easyaudit.models import LoginEvent
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import TokenError

from authentication.permissions import IsSuperUser
from authentication.serializers import UserSerializer, ProfileSerializer, PasswordChangeSerializer, EmptySerializer, \
    LogoutSerializer, LoginSerializer, PasswordChangeRequestSerializer, \
    PasswordChangeConfirmRequestSerializer, LoginEventSerializer
from authentication.utils import create_user_account
from enigma import settings

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = EmptySerializer

    serializer_classes = {
        'logout': LogoutSerializer,
        'profile': ProfileSerializer,
        'register': UserSerializer,
        'password_change_request': PasswordChangeRequestSerializer,
        'password_change_confirm': PasswordChangeConfirmRequestSerializer,
        'password_change': PasswordChangeSerializer,
    }

    @action(methods=['POST', ], detail=False)
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = create_user_account(**serializer.validated_data)
        if user is None:
            data = {'message': 'User not created!'}
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['POST', ], detail=False, permission_classes=[IsAuthenticated, ])
    def logout(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            token = RefreshToken(serializer.validated_data['refresh'])
            token.blacklist()
            user_logged_out.send(sender=request.user.__class__, request=request, user=request.user)
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny, ])
    def password_change_request(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        print(serializer.data["email"])

        if User.objects.filter(email=serializer.data["email"]).exists():
            user = User.objects.get(email=serializer.data["email"])
            uid_64 = urlsafe_base64_encode(force_bytes(str(user.id)))
            token = PasswordResetTokenGenerator().make_token(user)

            current_site = request.META['HTTP_HOST']
            reset_url = current_site + 'password-reset/' + uid_64 + '/' + token

            send_mail(
                'Password Reset',
                'Click on this link to reset your password: ' + reset_url,
                settings.EMAIL_HOST_USER,
                [serializer.data["email"], ],
                fail_silently=False
            )

            data = {'message': 'Successful password change'}
            return Response(data=data, status=status.HTTP_204_NO_CONTENT)
        else:
            data = {'detail': 'Account does not exist'}
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny, ])
    def password_change_confirm(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user_id = smart_str(urlsafe_base64_decode(serializer.data["uid_64"]))
            user_token = serializer.data["token"]
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, user_token):
                return Response({'error': 'token is not valid, please check the new one'},
                                status=status.HTTP_401_UNAUTHORIZED)
            user.set_password(serializer.data["password"])
            user.save()

            return Response({'success': True,
                             'message': 'Credential Valid',
                             'uid_64': serializer.data["uid_64"],
                             'token': serializer.data["token"]},
                            status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError:
            return Response({'error': 'token is not valid, please check the new one'},
                            status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated, ])
    def password_change(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['password'])
        request.user.save()
        data = {'message': 'Successful password change'}
        return Response(data=data, status=status.HTTP_204_NO_CONTENT)

    @action(methods=['GET', ], detail=False, permission_classes=[IsAuthenticated, ])
    def profile(self, request):
        user_profile = User.objects.get(email=request.user.email)
        serializer = self.get_serializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes should be a dict mapping.")

        for serializer in self.serializer_classes:
            if self.action == serializer:
                return self.serializer_classes[self.action]
        return super().get_serializer_class()


class LoginAuthView(TokenObtainPairView):
    serializer_class = LoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.exclude(is_superuser=True)
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

    def list(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)


class LoginEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LoginEvent.objects.exclude(user__is_superuser=True)
    serializer_class = LoginEventSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
