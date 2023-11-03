from django.contrib.auth import get_user_model, password_validation, user_logged_in
from easyaudit.models import LoginEvent
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class PasswordChangeRequestSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)

    class Meta:
        extra_kwargs = {
            'email': {'required': True},
        }

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class PasswordChangeConfirmRequestSerializer(serializers.Serializer):
    uid_64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class PasswordChangeSerializer(serializers.Serializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('password1', 'password2')

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class ProfileSerializer(serializers.ModelSerializer):
    """
    A user serializer for profile of the user
    """

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "user_type",
        ]


class UserSerializer(serializers.ModelSerializer):
    """
    A user serializer for registering the user
    """

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "is_active",
            "user_type",
            "date_joined",
        ]

        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': True
            },
            'date_joined': {'read_only': True},
            'is_active': {'read_only': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone_number': {'required': True},
            'user_type': {'required': True},
        }

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'phone_number': self.validated_data.get('phone_number', ''),
            'password': self.validated_data.get('password', ''),
            'user_type': self.validated_data.get('user_type', '')
        }

    @staticmethod
    def validate_password(value):
        password_validation.validate_password(value)
        return value


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        user_logged_in.send(sender=self.user.__class__,
                            request=self.context['request'], user=self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True)

    class Meta:
        extra_kwargs = {
            'refresh': {'required': True},
        }

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class LoginEventSerializer(serializers.ModelSerializer):
    login_type = serializers.SerializerMethodField('get_login_type')

    class Meta:
        model = LoginEvent
        fields = ['login_type', 'username', 'remote_ip', 'datetime']

    @staticmethod
    def get_login_type(obj):
        if obj.login_type == 0:
            return "Login"
        elif obj.login_type == 1:
            return "Logout"
        else:
            return "Failed Login"


class EmptySerializer(serializers.Serializer):
    pass
