from django.contrib import admin

from consultation.models import Consultation


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'officer', 'consultation_type', 'healthcare_provider', 'condition', 'status')

    search_fields = ('patient', 'date', 'patient', 'officer', )
    ordering = ('patient',)