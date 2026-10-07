from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Feature, PricingPlan, ContactInquiry

class Command(BaseCommand):
    help = 'Seeds initial administrative user, features, pricing plans, and inquiries for Nexvo Technology'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting Nexvo Technology initial data seeding...'))

        # 1. Create or get Admin Superuser
        admin_username = 'admin'
        admin_email = 'admin@nexvo.tech'
        admin_pass = 'admin123'

        user, created = User.objects.get_or_create(username=admin_username, defaults={'email': admin_email})
        user.is_staff = True
        user.is_superuser = True
        user.set_password(admin_pass)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created Superuser: {admin_username} / {admin_pass}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Updated Superuser password: {admin_username} / {admin_pass}'))

        # 2. Seed Features
        features_data = [
            {
                "title": "Autonomous Neural Networks",
                "description": "Self-learning multi-modal architectures designed to process complex enterprise unstructured data in real time with 99.98% inference fidelity.",
                "icon_name": "Brain",
                "badge": "Core Engine",
                "order": 1,
                "is_active": True,
            },
            {
                "title": "Quantum-Speed Microservices",
                "description": "Sub-millisecond latency distributed APIs running resilient AI pipelines with automatic horizontal scaling and zero cold starts.",
                "icon_name": "Zap",
                "badge": "Ultra Low Latency",
                "order": 2,
                "is_active": True,
            },
            {
                "title": "Deep Cognitive Vision",
                "description": "State-of-the-art visual transformers delivering real-time spatio-temporal segmentation, robotic telemetry, and multimodal recognition.",
                "icon_name": "Eye",
                "badge": "Vision AI",
                "order": 3,
                "is_active": True,
            },
            {
                "title": "Decentralized Cyber Shield",
                "description": "Zero-trust cryptographic data protection with proactive automated threat vectors neutralization powered by continuous adversarial simulations.",
                "icon_name": "Shield",
                "badge": "Security",
                "order": 4,
                "is_active": True,
            },
            {
                "title": "Predictive Telemetry & Insights",
                "description": "Predictive market analytics and systems anomaly detection driven by non-linear Bayesian neural engines.",
                "icon_name": "Activity",
                "badge": "Predictive",
                "order": 5,
                "is_active": True,
            },
            {
                "title": "Global Edge Orchestration",
                "description": "Deploy model weights seamlessly across 300+ edge locations globally for ubiquitous local execution and data sovereignty compliance.",
                "icon_name": "Globe",
                "badge": "Global Edge",
                "order": 6,
                "is_active": True,
            },
        ]

        for item in features_data:
            feat, f_created = Feature.objects.update_or_create(
                title=item["title"],
                defaults=item
            )
            action = "Created" if f_created else "Updated"
            self.stdout.write(f' - {action} Feature: {feat.title}')

        # 3. Seed Pricing Plans
        plans_data = [
            {
                "plan_name": "Starter Neural",
                "price": "$49",
                "billing_period": "/mo",
                "description": "Ideal for ambitious startups and agile engineering squads exploring AI integration.",
                "features": [
                    "Up to 250,000 monthly API inferences",
                    "Dual-cluster neural acceleration",
                    "Community Discord & standard support",
                    "REST & GraphQL endpoints access",
                    "Standard 99.9% uptime SLA"
                ],
                "is_popular": False,
                "cta_text": "Start Starter Trial",
                "order": 1,
                "is_active": True,
            },
            {
                "plan_name": "Enterprise Quantum",
                "price": "$149",
                "billing_period": "/mo",
                "description": "Engineered for high-throughput production workloads needing custom models and speed.",
                "features": [
                    "Up to 2,500,000 monthly API inferences",
                    "Dedicated GPU nodes & zero cold starts",
                    "Custom model fine-tuning weights pipeline",
                    "Priority 24/7 technical architect support",
                    "Enterprise 99.99% uptime guarantee",
                    "Comprehensive compliance and audit logs"
                ],
                "is_popular": True,
                "cta_text": "Launch Quantum Tier",
                "order": 2,
                "is_active": True,
            },
            {
                "plan_name": "Apex Sovereign",
                "price": "$499",
                "billing_period": "/mo",
                "description": "Full sovereign AI infrastructure with custom private cloud hosting and dedicated research engineers.",
                "features": [
                    "Unlimited high-speed neural executions",
                    "On-premise or private VPC edge deployment",
                    "Dedicated Solutions Engineer & Slack channel",
                    "Custom fine-tuned foundation models",
                    "Tailored hardware & custom SLA agreements",
                    "SOC2 Type II, HIPAA & GDPR compliance ready"
                ],
                "is_popular": False,
                "cta_text": "Schedule Executive Demo",
                "order": 3,
                "is_active": True,
            },
        ]

        for plan in plans_data:
            p, p_created = PricingPlan.objects.update_or_create(
                plan_name=plan["plan_name"],
                defaults=plan
            )
            action = "Created" if p_created else "Updated"
            self.stdout.write(f' - {action} Pricing Plan: {p.plan_name}')

        # 4. Seed Demo Inquiries
        inquiries_data = [
            {
                "full_name": "Elena Rostova",
                "email": "elena.r@synapse-tech.io",
                "phone": "+91 91132 33351",
                "subject": "Private Edge AI Deployment Consultation",
                "message": "We are seeking to integrate Nexvo's deep cognitive vision pipeline into our autonomous logistics fleet. Would like to discuss high-throughput SLA terms.",
                "status": "new",
            },
            {
                "full_name": "Marcus Vance",
                "email": "m.vance@vanguard-ai.com",
                "phone": "+1 (415) 890-2134",
                "subject": "Enterprise Quantum Plan Multi-Region Expansion",
                "message": "Our data science team is scaling to 10M daily requests across APAC and EMEA. We would love to test the sub-millisecond API endpoints.",
                "status": "in_review",
            },
            {
                "full_name": "Dr. Sarah Chen",
                "email": "schen@quantumlabs.org",
                "phone": "+44 20 7946 0912",
                "subject": "Partnership on Multimodal Research",
                "message": "Interested in evaluating your autonomous neural network capabilities for our research lab genomics datasets.",
                "status": "resolved",
            }
        ]

        for inq in inquiries_data:
            ContactInquiry.objects.get_or_create(
                email=inq["email"],
                subject=inq["subject"],
                defaults=inq
            )
            self.stdout.write(f' - Seeded Inquiry from: {inq["full_name"]}')

        self.stdout.write(self.style.SUCCESS('\nSuccessfully completed Nexvo Technology initial data seeding!'))
