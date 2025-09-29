from rest_framework import serializers
from .models import OffreEmploi
from django.contrib.auth.models import Group, Permission

class OffreEmploiSerializer(serializers.ModelSerializer):
    class Meta:
        model = OffreEmploi
        fields = '__all__'

    # Vous pouvez ajouter des méthodes personnalisées si nécessaire, par exemple :
    def validate_date_limite(self, value):
        if value < self.initial_data['date_mise_en_ligne']:
            raise serializers.ValidationError("La date limite doit être postérieure à la date de mise en ligne.")
        return value
    

from rest_framework import serializers
from .models import UtilisateurPersonnalise, Client ,Candidat

# class UtilisateurSerializer(serializers.ModelSerializer):
#     role = serializers.CharField(write_only=True)

#     class Meta:
#         model = UtilisateurPersonnalise
#         fields = ['username', 'email', 'password', 'role']  # Ajoutez le champ role
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }

#     def create(self, validated_data):
#         role = validated_data.pop('role')  # Retirer 'role' de validated_data
#         user = UtilisateurPersonnalise(
#             username=validated_data['username'],
#             email=validated_data['email'],
#         )
#         user.set_password(validated_data['password'])
#         user.save()
#         user.role = role  # Affecter le rôle
#         user.save()  # Sauvegarder après avoir ajouté le rôle
#         return user


class UtilisateurSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = UtilisateurPersonnalise
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }


    def create(self, validated_data):
        role = validated_data.pop('role')  # Retirer 'role' de validated_data
        user = UtilisateurPersonnalise(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        # Si un rôle est spécifié, l'assigner correctement
        if role:
            # Récupérer ou créer le groupe correspondant
            group, created = Group.objects.get_or_create(name=role)
            user.role = group  # Assigner l'instance Group
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)

    def to_internal_value(self, data):
        # Supprimer le champ passwordConfirm s'il est envoyé
        data = data.copy()
        data.pop('passwordConfirm', None)
        return super().to_internal_value(data)





class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class CandidatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidat
        fields = '__all__'


# class OffreEmploiSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OffreEmploi
#         fields = '__all__'


from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import OffreEmploi
from rest_framework import serializers

# Sérialiseur pour les offres liées
class LinkedOffreSerializer(serializers.ModelSerializer):
    date_limite = serializers.SerializerMethodField()

    class Meta:
        model = OffreEmploi
        fields = ['id', 'titre', 'date_limite', 'lieu']

    def get_date_limite(self, obj):
        if obj.date_limite:
            mois_fr = [
                "janvier", "février", "mars", "avril", "mai", "juin",
                "juillet", "août", "septembre", "octobre", "novembre", "décembre"
            ]
            return {
                "days": [obj.date_limite.day],
                "months": [mois_fr[obj.date_limite.month - 1]],
                "year": obj.date_limite.year,
                "times": [{"hour": obj.date_limite.hour, "minute": obj.date_limite.minute}]
            }
        return 'N/A'

# Sérialiseur principal
class OffreEmploiSerializer(serializers.ModelSerializer):
    client__nom = serializers.CharField(source='client.libelle_fr', allow_null=True)
    client__logo = serializers.SerializerMethodField()
    client__site_web = serializers.CharField(source='client.site_web', allow_null=True)
    offres_liees = LinkedOffreSerializer(many=True, source='get_offres_liees')
    date_limite = serializers.SerializerMethodField()
    type_offre = serializers.CharField()

    class Meta:
        model = OffreEmploi
        fields = [
            'id', 'titre', 'description', 'date_limite', 'lieu', 'titre_entreprise',
            'client__nom', 'client__logo','client__site_web', 'si_principal', 'offres_liees', 'type_offre'
        ]

    def get_client__logo(self, obj):
        if obj.client and obj.client.logo:
            return self.context['request'].build_absolute_uri(obj.client.logo.url)
        return None

    def get_date_limite(self, obj):
        mois_fr = [
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
        ]
        linked_offres = obj.get_offres_liees().filter(si_valider=True)

        if obj.si_principal and linked_offres:
            dates = [obj.date_limite] + [linked.date_limite for linked in linked_offres]
            dates = [d for d in dates if d]
            if dates:
                dates.sort()
                days = sorted(set(d.day for d in dates))
                months = sorted(set(d.month for d in dates))
                years = sorted(set(d.year for d in dates))
                hours = sorted(set((d.hour, d.minute) for d in dates))
                if len(years) == 1:
                    months_str = [mois_fr[m - 1] for m in months]
                    return {
                        "days": days,
                        "months": months_str,
                        "year": years[0],
                        "times": [{"hour": h[0], "minute": h[1]} for h in hours]
                    }
                else:
                    date_parts = []
                    for date in sorted(set((d.day, d.month, d.year, d.hour, d.minute) for d in dates)):
                        time_str = f" {date[3]:02d}:{date[4]:02d}" if (date[3] != 0 or date[4] != 0) else ""
                        date_parts.append(f"{date[0]} {mois_fr[date[1] - 1]} {date[2]}{time_str}")
                    return ','.join(date_parts)
        else:
            if obj.date_limite:
                return {
                    "days": [obj.date_limite.day],
                    "months": [mois_fr[obj.date_limite.month - 1]],
                    "year": obj.date_limite.year,
                    "times": [{"hour": obj.date_limite.hour, "minute": obj.date_limite.minute}]
                }
            return 'N/A'



# serializers.py
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('offre_emploi',)





        
