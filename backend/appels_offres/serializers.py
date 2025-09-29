from rest_framework import serializers
from .models import AppelOffre

class AppelOffreSerializer(serializers.ModelSerializer):
   # date_limite_fr = serializers.SerializerMethodField()

    class Meta:
        model = AppelOffre
        fields = '__all__'  # Inclut tous les champs du modèle
       

