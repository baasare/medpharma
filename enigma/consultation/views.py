from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from authentication.models import SUPER_ADMIN
from authentication.permissions import IsSuperUser
from consultation.models import Consultation
from consultation.serializers import ConsultationSerializer


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

    def list(self, request, *args, **kwargs):
        if request.user.user_type == SUPER_ADMIN:
            consultations = Consultation.objects.all()
        else:
            consultations = Consultation.objects.filter(officer=request.user)
        serializer = self.get_serializer(consultations, many=True)
        return Response(serializer.data)
