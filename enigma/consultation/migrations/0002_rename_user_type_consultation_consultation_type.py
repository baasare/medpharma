# Generated by Django 3.2 on 2023-11-02 20:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='consultation',
            old_name='user_type',
            new_name='consultation_type',
        ),
    ]
