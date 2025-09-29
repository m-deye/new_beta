from django.db import models

from offres_emploi.models import Candidat

class Experience(models.Model):
    nom_entreprise = models.CharField(max_length=255)
    poste = models.CharField(max_length=255)
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True)
    en_cours = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name='experiences')

    def __str__(self):
        return f"{self.nom_entreprise} - {self.poste}"
