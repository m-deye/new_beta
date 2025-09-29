from django.db import models

class Temoignage(models.Model):
    nom = models.CharField(max_length=100, verbose_name="Nom")
    poste = models.CharField(max_length=100, verbose_name="Poste actuel")
    photo = models.ImageField(upload_to='temoignages/photos/', null=True, blank=True, verbose_name="Photo")
    description = models.TextField(verbose_name="Description")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")

    class Meta:
        verbose_name = "Témoignage"
        verbose_name_plural = "Témoignages"

    def __str__(self):
        return f"{self.nom} - {self.poste}"
