from rest_framework import serializers

from consultation.models import Consultation


class ConsultationSerializer(serializers.ModelSerializer):
    """
    A Consultation serializer
    """

    class Meta:
        model = Consultation

        fields = '__all__'
