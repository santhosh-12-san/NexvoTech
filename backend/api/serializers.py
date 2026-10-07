from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Feature, PricingPlan, ContactInquiry

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = [
            'id', 
            'title', 
            'description', 
            'icon_name', 
            'image_url', 
            'badge', 
            'order', 
            'is_active', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PricingPlanSerializer(serializers.ModelSerializer):
    # Ensure features is represented cleanly as a list
    class Meta:
        model = PricingPlan
        fields = [
            'id', 
            'plan_name', 
            'price', 
            'billing_period', 
            'description', 
            'features', 
            'is_popular', 
            'cta_text', 
            'order', 
            'is_active', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_features(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Features must be a JSON array of strings.")
        return value


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = [
            'id', 
            'full_name', 
            'email', 
            'phone',
            'subject', 
            'message', 
            'status', 
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that checks admin privileges and includes user details.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        # Verify staff/superuser access for admin dashboard
        if not (self.user.is_staff or self.user.is_superuser):
            raise serializers.ValidationError({"detail": "Access restricted: Staff or Administrator privileges required."})

        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser,
        }
        return data
