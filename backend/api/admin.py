from django.contrib import admin
from .models import Feature, PricingPlan, ContactInquiry

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon_name', 'badge', 'order', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description', 'badge')
    list_editable = ('order', 'is_active')


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ('plan_name', 'price', 'billing_period', 'is_popular', 'order', 'is_active')
    list_filter = ('is_popular', 'is_active')
    search_fields = ('plan_name', 'description')
    list_editable = ('order', 'is_popular', 'is_active')


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'email', 'message', 'subject')
    list_editable = ('status',)
    readonly_fields = ('created_at',)
