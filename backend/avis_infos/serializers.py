from rest_framework import serializers
from .models import AvisInfos

class AvisInfosSerializer(serializers.ModelSerializer):
   # date_limite_fr = serializers.SerializerMethodField()

    class Meta:
        model = AvisInfos
        fields = '__all__'  # Inclut tous les champs du modèle
       

