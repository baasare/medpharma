from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager

PATIENT = 'patient'
OFFICER = 'officer'
ADMIN = 'admin'
SUPER_ADMIN = 'super_admin'

USER_TYPE_CHOICES = (
    (PATIENT, 'Patient'),
    (OFFICER, 'Medical Officer'),
    (ADMIN, 'Admin'),
    (SUPER_ADMIN, 'Super Admin'),
)


class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=100)
    last_name = models.CharField(_('last name'), max_length=100)
    phone_number = models.CharField(_('phone number'), max_length=10)
    user_type = models.CharField(_('user type'), max_length=20, choices=USER_TYPE_CHOICES, default=PATIENT,
                                 error_messages={'required': 'Please select a user type'})

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        ordering = ['-last_name']
        verbose_name = _('user')
        verbose_name_plural = _('Users')

    def save(self, *args, **kwargs):
        if self.user_type in [ADMIN, SUPER_ADMIN]:
            self.is_staff = True
        super(User, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('user_detail', args=[self.id])

    def get_email(self):
        return '%s' % self.email

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
