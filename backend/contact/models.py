from django.db import models

class ContactMessage(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    sujet = models.CharField(max_length=200)
    description = models.TextField()
    # captcha = models.CharField(max_length=10)
    date_envoi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} - {self.sujet}"
