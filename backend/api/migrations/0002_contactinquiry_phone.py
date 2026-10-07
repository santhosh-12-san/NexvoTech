# Generated manually for Nexvo Technology contact inquiry phone support
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactinquiry',
            name='phone',
            field=models.CharField(blank=True, default='', help_text='Contact or WhatsApp phone number', max_length=35),
        ),
    ]
