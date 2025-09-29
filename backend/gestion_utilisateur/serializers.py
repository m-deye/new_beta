
from rest_framework import serializers
from .models import Candidat

from experience.models import Experience

from diplomes.models import Diplome
from .models import Client
from langues.models import Langue

from specialisation.models import Specialisation

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class DiplomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diplome
        fields = '__all__'

class LangueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Langue
        fields = '__all__'

class SpecialisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialisation
        fields = '__all__'

class CandidatDetailSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    diplomes = DiplomeSerializer(many=True, read_only=True)
    langues = LangueSerializer(many=True, read_only=True)
    specialisations = SpecialisationSerializer(many=True, read_only=True)

    class Meta:
        model = Candidat
        fields = '__all__'

        
# class ClientSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Client
#         fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        exclude = ['utilisateur']
