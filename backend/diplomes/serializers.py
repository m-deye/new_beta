from rest_framework import serializers
from .models import Diplome

class DiplomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diplome
        fields = '__all__'
        read_only_fields = ('date_creation',)