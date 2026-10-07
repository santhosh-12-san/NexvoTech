from django.db import models

class Feature(models.Model):
    """
    Core AI and Technology Services / Features offered by Nexvo Technology.
    """
    title = models.CharField(max_length=200, help_text="Feature or Service title")
    description = models.TextField(help_text="Detailed description of the feature or capability")
    icon_name = models.CharField(
        max_length=100, 
        default='Cpu', 
        help_text="Lucide icon identifier (e.g., Cpu, Brain, Shield, Zap, Globe, Sparkles, Layers)"
    )
    image_url = models.CharField(
        max_length=500, 
        blank=True, 
        default='', 
        help_text="Optional image link or 3D asset reference identifier"
    )
    badge = models.CharField(
        max_length=50, 
        blank=True, 
        default='AI Powered', 
        help_text="Badge label displayed on feature card"
    )
    order = models.PositiveIntegerField(default=0, help_text="Display order on the page")
    is_active = models.BooleanField(default=True, help_text="Toggle visibility on website")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Feature / Service'
        verbose_name_plural = 'Features / Services'

    def __str__(self):
        return self.title


class PricingPlan(models.Model):
    """
    Subscription tiers and pricing packages for Nexvo Technology services.
    """
    plan_name = models.CharField(max_length=100, help_text="e.g. Starter Neural, Pro Quantum, Enterprise AI")
    price = models.CharField(max_length=50, help_text="e.g. $49, $199, or Custom")
    billing_period = models.CharField(max_length=50, default='/mo', help_text="e.g. /mo, /year, or one-time")
    description = models.CharField(max_length=255, blank=True, default='', help_text="Short highlight line")
    features = models.JSONField(
        default=list, 
        help_text="List of feature bullet points (JSON array of strings)"
    )
    is_popular = models.BooleanField(default=False, help_text="Highlight as recommended / most popular tier")
    cta_text = models.CharField(max_length=50, default='Get Started Now')
    order = models.PositiveIntegerField(default=0, help_text="Order in pricing table")
    is_active = models.BooleanField(default=True, help_text="Toggle plan visibility")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Pricing Plan'
        verbose_name_plural = 'Pricing Plans'

    def __str__(self):
        return f"{self.plan_name} ({self.price}{self.billing_period})"


class ContactInquiry(models.Model):
    """
    Inquiries submitted from the frontend contact form.
    """
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_review', 'In Review'),
        ('contacted', 'Contacted'),
        ('resolved', 'Resolved'),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=35, blank=True, default='', help_text="Contact or WhatsApp phone number")
    subject = models.CharField(max_length=250, blank=True, default='General Inquiry')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Inquiry'
        verbose_name_plural = 'Contact Inquiries'

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
