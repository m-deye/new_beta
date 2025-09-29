from django.db import models

class Parametres(models.Model):
    nombreoffres = models.PositiveIntegerField(default=0, verbose_name="Nombre d'offres")
    nombreapples = models.PositiveIntegerField(default=0, verbose_name="Nombre d'appels d'offre")
    nombreavis = models.PositiveIntegerField(default=0, verbose_name="Nombre d'avis")

    nombreoffresAr = models.PositiveIntegerField(default=0, verbose_name="عدد الوظائف")
    nombreapplesAr = models.PositiveIntegerField(default=0, verbose_name="عدد طلبات العروض")
    nombreavisAr = models.PositiveIntegerField(default=0, verbose_name="عدد الإشعارات")

    def __str__(self):
        return f"Paramètres ({self.id})"
