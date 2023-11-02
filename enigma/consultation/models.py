from django.db import models
from django.utils.translation import gettext_lazy as _

from authentication.models import User

OUT_PATIENT = 'out_patient'
IN_PATIENT = 'in_patient'

CONSULTATION_TYPE_CHOICES = (
    (OUT_PATIENT, 'Out Patient'),
    (IN_PATIENT, 'In Patient'),
)


class Consultation(models.Model):
    date = models.DateTimeField(_('dDate'), auto_now_add=True)
    officer = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, db_constraint=False,
                                related_name="officer", )
    patient = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, db_constraint=False,
                                related_name="patient", )
    consultation_type = models.CharField(_('Consultation type'), max_length=20, choices=CONSULTATION_TYPE_CHOICES,
                                 default=OUT_PATIENT,
                                 error_messages={'required': 'Please select a consultation type'})
    healthcare_provider = models.CharField(_('Healthcare Provider'), max_length=255, null=True, blank=True)
    condition = models.CharField(_('Condition'), max_length=255, null=True, db_index=True)
    notes = models.CharField(_('Notes'), max_length=255, null=True, db_index=True)
    medication = models.CharField(_('Medication'), max_length=255, null=True, db_index=True)

    class Meta:
        verbose_name = _('Consultation')
        verbose_name_plural = _('Consultations')

    def __str__(self):
        return '%s' % self.officer
