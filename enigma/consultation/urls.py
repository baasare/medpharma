from rest_framework import routers

from consultation.views import ConsultationViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('consultation', ConsultationViewSet, basename='consultation')

urlpatterns = router.urls
