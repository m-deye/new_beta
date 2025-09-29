from rest_framework import serializers
from .models import Temoignage

class TemoignageSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Temoignage
        fields = '__all__'