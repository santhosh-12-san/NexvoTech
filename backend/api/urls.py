from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    FeatureViewSet,
    PricingPlanViewSet,
    ContactInquiryViewSet,
    CustomTokenObtainPairView,
    CurrentUserView,
    AdminStatsView
)

router = DefaultRouter()
router.register(r'features', FeatureViewSet, basename='feature')
router.register(r'pricing', PricingPlanViewSet, basename='pricing')
router.register(r'contact', ContactInquiryViewSet, basename='contact')

urlpatterns = [
    # SimpleJWT Auth Endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/me/', CurrentUserView.as_view(), name='current_user'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),

    # DRF Router Endpoints (/api/features/, /api/pricing/, /api/contact/)
    path('', include(router.urls)),
]
