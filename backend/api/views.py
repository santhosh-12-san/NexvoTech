import csv
import time
import urllib.parse
from collections import defaultdict
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

# In-memory IP rate limiter: max 5 requests per 10 minutes
_IP_SUBMISSION_HISTORY = defaultdict(list)
_RATE_LIMIT_WINDOW_SECONDS = 600
_MAX_SUBMISSIONS_PER_WINDOW = 5

from .models import Feature, PricingPlan, ContactInquiry
from .serializers import (
    FeatureSerializer, 
    PricingPlanSerializer, 
    ContactInquirySerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer
)
from .permissions import IsAdminOrReadOnly, IsAdminUserOrContactSubmitOnly


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    JWT login endpoint with staff/admin role verification.
    """
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(APIView):
    """
    Get profile of the currently logged in admin user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class FeatureViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Features/Services:
    - Public: GET active features ordered by display order
    - Admin: Full CRUD operations
    """
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # Staff and superusers can see all features (including inactive)
        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return Feature.objects.all().order_by('order', '-created_at')
        # Public visitors only receive active features
        return Feature.objects.filter(is_active=True).order_by('order', '-created_at')


class PricingPlanViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Pricing Plans:
    - Public: GET active pricing plans ordered by display order
    - Admin: Full CRUD operations
    """
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # Staff and superusers can see all plans
        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return PricingPlan.objects.all().order_by('order', 'id')
        # Public visitors only receive active plans
        return PricingPlan.objects.filter(is_active=True).order_by('order', 'id')


class ContactInquiryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Contact Inquiries:
    - Public: POST to submit an inquiry
    - Admin: GET to list all inquiries, PATCH to update status, DELETE to remove
    """
    queryset = ContactInquiry.objects.all().order_by('-created_at')
    serializer_class = ContactInquirySerializer
    permission_classes = [IsAdminUserOrContactSubmitOnly]

    def create(self, request, *args, **kwargs):
        # 1. Anti-Spam: Check honeypot field
        # If bot filled hidden 'hp_token' or 'website', pretend success without saving
        honeypot = request.data.get('hp_token') or request.data.get('website')
        if honeypot:
            return Response({
                "message": "Thank you for contacting Nexvo Technology! Our AI specialists will connect with you shortly.",
                "whatsapp_url": "https://wa.me/919113233351",
            }, status=status.HTTP_201_CREATED)

        # 2. Rate Limiting: Check client IP
        client_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '127.0.0.1')).split(',')[0].strip()
        now = time.time()
        _IP_SUBMISSION_HISTORY[client_ip] = [t for t in _IP_SUBMISSION_HISTORY[client_ip] if now - t < _RATE_LIMIT_WINDOW_SECONDS]
        if len(_IP_SUBMISSION_HISTORY[client_ip]) >= _MAX_SUBMISSIONS_PER_WINDOW:
            return Response({
                "error": "Submission rate limit exceeded. Please wait a few minutes or message our team directly on WhatsApp (+91 91132 33351)."
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Record this submission
        _IP_SUBMISSION_HISTORY[client_ip].append(now)

        # 3. Validate & Save Inquiry
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        headers = self.get_success_headers(serializer.data)
        
        # 4. Automated Email Notifications (Try/Except safe)
        subject = inquiry.subject or 'General Inquiry'
        full_name = inquiry.full_name or 'Valued Client'
        
        try:
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Nexvo AI <contact@nexvotechnology.com>')
            admin_email = getattr(settings, 'ADMIN_ALERT_EMAIL', 'admin@nexvo.tech')

            # Client Confirmation Email
            send_mail(
                subject=f"Nexvo Technology | Inquiry Received: {subject}",
                message=(
                    f"Hello {full_name},\n\n"
                    f"Thank you for contacting Nexvo Technology!\n\n"
                    f"We have securely received your inquiry regarding \"{subject}\". "
                    f"Our enterprise AI specialists are reviewing your parameters and will follow up within 4 hours.\n\n"
                    f"• Direct WhatsApp Support: +91 91132 33351\n"
                    f"• Corporate Portal: https://nexvotechnology.com\n\n"
                    f"Best regards,\n"
                    f"Nexvo Technology Engineering Team\n"
                    f"Blending Human and Artificial Intelligence"
                ),
                from_email=from_email,
                recipient_list=[inquiry.email],
                fail_silently=True,
            )

            # Admin Notification Alert
            send_mail(
                subject=f"[NEW LEAD] {full_name} submitted inquiry: {subject}",
                message=(
                    f"New Lead Alert on Nexvo Technology:\n\n"
                    f"• Name: {full_name}\n"
                    f"• Email: {inquiry.email}\n"
                    f"• Phone: {inquiry.phone or 'Not provided'}\n"
                    f"• Subject: {subject}\n"
                    f"• Date: {inquiry.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                    f"Message:\n{inquiry.message}\n\n"
                    f"Dashboard Review: http://localhost:5173/admin-dashboard\n"
                    f"Reply via WhatsApp: https://wa.me/{inquiry.phone or '919113233351'}"
                ),
                from_email=from_email,
                recipient_list=[admin_email],
                fail_silently=True,
            )
        except Exception:
            pass

        # 5. Build direct WhatsApp confirmation URL
        msg_text = f"Hi Nexvo Technology, I just submitted an inquiry regarding {subject} ({full_name})"
        whatsapp_url = f"https://wa.me/919113233351?text={urllib.parse.quote(msg_text)}"

        return Response({
            "message": "Thank you for contacting Nexvo Technology! Our AI specialists will connect with you shortly.",
            "whatsapp_url": whatsapp_url,
            "inquiry": serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser], url_path='export-csv')
    def export_csv(self, request):
        """
        Export all inquiries as a structured CSV file for CRM or Admin offline analysis.
        """
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="nexvo_inquiries.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Full Name', 'Email', 'Phone', 'Subject', 'Status', 'Submitted At', 'Message'])
        
        for inq in ContactInquiry.objects.all().order_by('-created_at'):
            writer.writerow([
                inq.id,
                inq.full_name,
                inq.email,
                inq.phone,
                inq.subject,
                inq.status,
                inq.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                inq.message
            ])
        return response


class AdminStatsView(APIView):
    """
    Summary stats for Admin Dashboard.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_features = Feature.objects.count()
        active_features = Feature.objects.filter(is_active=True).count()
        total_plans = PricingPlan.objects.count()
        total_inquiries = ContactInquiry.objects.count()
        new_inquiries = ContactInquiry.objects.filter(status='new').count()

        return Response({
            "stats": {
                "total_features": total_features,
                "active_features": active_features,
                "total_plans": total_plans,
                "total_inquiries": total_inquiries,
                "new_inquiries": new_inquiries,
            }
        })
