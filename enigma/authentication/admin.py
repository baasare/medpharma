from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from authentication.forms import CustomUserCreationForm, CustomUserChangeForm
from authentication.models import User
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

admin.site.site_header = "MedPharma Consultation Manager"
admin.site.site_title = "MedPharma"
admin.site.index_title = "Consultation Manager | MedPharma"


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('email', 'first_name', 'last_name',
                    'user_type', 'user_type', 'date_joined')

    fieldsets = ((None,
                  {'fields': ('email', 'first_name', 'last_name', 'user_type', 'password',)}),
                 ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active')}),)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'phone_number', 'user_type', 'password1', 'password2', 'is_staff',
                'is_superuser',
                'is_active')}
         ),
    )
    search_fields = ('first_name', 'last_name',
                     'phone_number', 'email', 'user_type')
    ordering = ('last_name',)

    actions = ['delete_model', 'super_delete']

    @staticmethod
    def super_delete(self, request, queryset):
        users = queryset.values("id")
        OutstandingToken.objects.filter(user__id__in=users).delete()
        queryset.delete()
