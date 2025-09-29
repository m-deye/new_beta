# models.py
from django.db import models

from offres_emploi.models import Candidat


class Langue(models.Model):
    langue = models.CharField(max_length=100)
    niveau = models.CharField(max_length=50)
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name='langues')

    def __str__(self):
        return f"{self.langue} - {self.niveau}"
