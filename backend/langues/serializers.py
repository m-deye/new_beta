from rest_framework import serializers
from .models import Langue

class LangueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Langue
        fields = '__all__'
