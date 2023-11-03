# Generated by Django 3.2 on 2023-11-02 20:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(
                    auto_now_add=True, verbose_name='dDate')),
                ('user_type', models.CharField(choices=[('out_patient', 'Out Patient'), ('in_patient', 'In Patient')], default='out_patient', error_messages={
                 'required': 'Please select a consultation type'}, max_length=20, verbose_name='Consultation type')),
                ('healthcare_provider', models.CharField(
                    blank=True, max_length=255, null=True, verbose_name='Healthcare Provider')),
                ('condition', models.CharField(db_index=True,
                 max_length=255, null=True, verbose_name='Condition')),
                ('notes', models.CharField(db_index=True,
                 max_length=255, null=True, verbose_name='Notes')),
                ('medication', models.CharField(db_index=True,
                 max_length=255, null=True, verbose_name='Medication')),
                ('officer', models.ForeignKey(blank=True, db_constraint=False, null=True,
                 on_delete=django.db.models.deletion.SET_NULL, related_name='officer', to=settings.AUTH_USER_MODEL)),
                ('patient', models.ForeignKey(blank=True, db_constraint=False, null=True,
                 on_delete=django.db.models.deletion.SET_NULL, related_name='patient', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Consultation',
                'verbose_name_plural': 'Consultations',
            },
        ),
    ]
