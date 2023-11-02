from authentication.views import AuthViewSet, UserViewSet, LoginAuthView, LoginEventViewSet
from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter(trailing_slash=False)
router.register('account', AuthViewSet, basename='auth')
router.register('account/users', UserViewSet, basename='users')
router.register('audit-log', LoginEventViewSet, basename='login_event')

urlpatterns = [
    path('account/login', LoginAuthView.as_view(), name='token_obtain_pair'),
    path('account/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns = urlpatterns + router.urls
