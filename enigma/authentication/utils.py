from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework import serializers

from authentication.models import PATIENT
from enigma import settings

User = get_user_model()


def get_and_authenticate_user(email, password):
    user = authenticate(username=email, password=password)

    if user is None:
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email/password. Please try again!")

    return user


def create_user_account(email, first_name, last_name, phone_number, password, user_type=PATIENT):
    user = User.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        password=password,
        user_type=user_type
    )
    return user


def send_email():
    send_mail(
        'Subject here',
        'Here is the message.',
        settings.EMAIL_HOST_USER,
        ['user@medpharma.com', ],
        fail_silently=False,
    )


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
