from django.db import models

# Create your models here.
from django.db import models

from offres_emploi.models import Candidat


class Diplome(models.Model):
    candidat = models.ForeignKey(
        Candidat,
        on_delete=models.CASCADE,
        related_name='diplomes',
        verbose_name="Candidat"
    )
    diplome = models.CharField(
        max_length=255,
        verbose_name="Nom du diplôme",
        help_text="Ex: Licence en informatique"
    )
    etablissement = models.CharField(
        max_length=255,
        verbose_name="Établissement",
        help_text="Ex: Université de Nouakchott"
    )
    date_debut = models.DateField(
        verbose_name="Date de début"
    )
    date_fin = models.DateField(
        verbose_name="Date de fin"
    )
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )

    def __str__(self):
        return f"{self.diplome} - {self.etablissement}"


