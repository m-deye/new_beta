from rest_framework import serializers
from .models import Specialisation

class SpecialisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialisation
        fields = '__all__'
