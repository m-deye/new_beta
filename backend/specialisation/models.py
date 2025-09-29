from django.db import models

from offres_emploi.models import Candidat


class Specialisation(models.Model):
    titre_specialisation = models.CharField(max_length=255)
    niveaux_etude = models.CharField(max_length=255 , null=True, blank=True)  # ou ForeignKey si c'est un modèle lié
    experience = models.CharField( max_length=255 , null=True, blank=True)     # ou ForeignKey
    domaine = models.CharField(max_length=255 , null=True, blank=True)        # ou ForeignKey
    candidat = models.ForeignKey( Candidat, on_delete=models.CASCADE, related_name='specialisations')

    def __str__(self):
        return f"{self.titre_specialisation} - {self.candidat}"
