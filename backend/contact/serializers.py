from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

    def validate_captcha(self, value):
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Requête manquante pour la validation du CAPTCHA.")
        expected_captcha = request.session.get('captcha_text')
        if not expected_captcha or value.lower() != expected_captcha.lower():
            raise serializers.ValidationError("CAPTCHA incorrect.")
        return value
