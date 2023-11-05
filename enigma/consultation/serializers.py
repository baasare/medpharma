from rest_framework import serializers

from authentication.serializers import ProfileSerializer
from consultation.models import Consultation


class ConsultationSerializer(serializers.ModelSerializer):
    """
    A Consultation serializer
    """

    class Meta:
        model = Consultation

        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['patient'] = ProfileSerializer(instance.patient).data
        rep['officer'] = ProfileSerializer(instance.officer).data
        return rep
