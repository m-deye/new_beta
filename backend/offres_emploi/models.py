from django.db import models
from django.contrib.auth.models import User, Group, AbstractUser
from django.utils import timezone
from django_ckeditor_5.fields import CKEditor5Field
from django.utils.html import strip_tags
from gestion_utilisateur.models import UtilisateurPersonnalise, Client, Candidat
import locale
from gestion_utilisateur.models import Client


# class OffreEmploi(models.Model):
#     TYPE_OFFRE_CHOICES = [
#         ('OFFRE_EMPLOI', 'Offre d\'emploi'),
#         ('consultants', 'Consultants'),
#     ]
#     CATEGORIE_CHOICES = [
#         ('standard', 'Standard'),
#         ('autre', 'Autre'),
#     ]
#     GROUPEMENT_SPACIAL_CHOICES = [
#         ('oui', 'Oui'),
#         ('non', 'Non'),
#     ]
#     titre = CKEditor5Field('titre', config_name='extends')
#     type_offre = models.CharField(choices=TYPE_OFFRE_CHOICES, default='OFFRE_EMPLOI',max_length=100)
#     description = CKEditor5Field('Description', config_name='extends')
#     client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='offres_emploi')
#     date_mise_en_ligne = models.DateField(default=timezone.now) 
#     date_limite = models.DateTimeField()
#     lieu = models.CharField(max_length=100)
#     nombre_vu = models.IntegerField(default=0)
#     si_national = models.BooleanField(default=True)
#     si_archiver = models.BooleanField(default=False)
#     si_valider = models.BooleanField(default=False)
#     si_groupement = models.BooleanField(default=False)
#     si_fixe = models.BooleanField(default=False)
#     si_traduire = models.BooleanField(default=False)
#     acee_traduction = models.BooleanField(default=False)
#     titre_entreprise = models.CharField(max_length=100,null=True,blank=True)
#     categorie = models.CharField(choices=CATEGORIE_CHOICES, default='standard', max_length=100)
#     groupement_spacial = models.CharField(choices=GROUPEMENT_SPACIAL_CHOICES, default='non', max_length=100)
#     titre_groupement_cpacial = models.CharField(max_length=100,null=True,blank=True)
#     si_principal = models.BooleanField(default=False, verbose_name="Est l'offre principale")
#     offre_principale = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, 
#                                        related_name='offres_liees',
#                                        verbose_name="Rattachée à l'offre")
#     date_creation = models.DateTimeField(auto_now_add=True)    
    
    
#     class Meta:
#         verbose_name = "Offre d'emploi"
#         verbose_name_plural = "Offres d'emplois"
#         permissions = [
#             ("grouper_offreemploi", "Peut grouper des offres d'emploi"),
#             ("valider_offreemploi", "Peut valider un offre d'emploi"),
#             ("fixe_offreemploi", "Peut fixe un offre d'emploi"),

#         ]
#         # default_permissions = ()  # Désactive les permissions automatiques
    
#     def date_limite_fr(self):
#         try:
#             locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')
#         except locale.Error:
#             locale.setlocale(locale.LC_TIME, '')

#         return timezone.localtime(self.date_limite).strftime("%d %B %Y à %H:%M").encode('utf-8').decode('utf-8')
    
#     def save(self, *args, **kwargs):
#         # Si c'est une offre principale, s'assurer qu'elle n'est pas liée à une autre offre
#         if self.si_principal:
#             self.offre_principale = None
        
#         # Si l'offre est liée à une offre principale, s'assurer qu'elle n'est pas elle-même principale
#         if self.offre_principale:
#             self.si_principal = False
#             # Copier le nom du groupe de l'offre principale
            
        
#         super().save(*args, **kwargs)
        
#     def get_offres_groupe(self):
#         """Retourne toutes les offres du même groupe, y compris l'offre principale"""
#         if self.si_principal:
#             return OffreEmploi.objects.filter(models.Q(offre_principale=self) | models.Q(pk=self.pk))
#         elif self.offre_principale:
#             return OffreEmploi.objects.filter(models.Q(offre_principale=self.offre_principale) | 
#                                             models.Q(pk=self.offre_principale.pk))
#         return OffreEmploi.objects.filter(pk=self.pk)
    
#     def get_offres_liees(self):
#         """Retourne uniquement les offres liées (sans l'offre principale)"""
#         if self.si_principal:
#             return self.offres_liees.all()
#         return OffreEmploi.objects.none()
    
#     def nombre_offres_liees(self):
#         """Retourne le nombre d'offres liées"""
#         return self.get_offres_liees().count()
    
#     def __str__(self):
#         return strip_tags(self.titre)
    

class OffreEmploi(models.Model):
    TYPE_OFFRE_CHOICES = [
        ('OFFRE_EMPLOI', 'Offre d\'emploi'),
        ('consultants', 'Consultants'),
    ]
    CATEGORIE_CHOICES = [
        ('standard', 'Standard'),
        ('autre', 'Autre'),
    ]
    GROUPEMENT_SPACIAL_CHOICES = [
        ('oui', 'Oui'),
        ('non', 'Non'),
    ]

    titre = CKEditor5Field('titre', config_name='extends')
    titre_ar = CKEditor5Field('titre_ar', config_name='extends', null=True, blank=True)
    titre_entreprise = models.CharField(max_length=100, null=True, blank=True)
    titre_entreprise_ar = models.CharField(max_length=100, null=True, blank=True)
    titre_documents_ar = CKEditor5Field('titre_documents_ar', config_name='extends', null=True, blank=True)
    description = CKEditor5Field('Description', config_name='extends')
    description_ar = CKEditor5Field('description_ar', config_name='extends', null=True, blank=True)
    message_ar = CKEditor5Field('message_ar', config_name='extends', null=True, blank=True)
    type_offre = models.CharField(choices=TYPE_OFFRE_CHOICES, default='OFFRE_EMPLOI', max_length=100)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='offres_emploi')
    # date_mise_en_ligne = models.DateField(default=timezone.now)
    date_mise_en_ligne = models.DateTimeField(null=True, blank=True, verbose_name="Date de mise en ligne")
    date_limite = models.DateTimeField()
    lieu = models.CharField(max_length=100)
    lieu_ar = models.CharField(default="غير محدد", max_length=255, null=True, blank=True)
    nombre_vu = models.IntegerField(default=0)
    si_national = models.BooleanField(default=True)
    si_archiver = models.BooleanField(default=False)
    si_valider = models.BooleanField(default=False)
    valider_par = models.ForeignKey(UtilisateurPersonnalise, on_delete=models.SET_NULL, null=True, blank=True, related_name='offres_emploi_valider')
    si_groupement = models.BooleanField(default=False)
    si_fixe = models.BooleanField(default=False)
    si_traduire = models.BooleanField(default=False)
    acee_traduction = models.BooleanField(default=False)
    titre_entreprise = models.CharField(max_length=100,null=True,blank=True)
    titre_entreprise_ar = models.CharField(max_length=100,null=True,blank=True)
    categorie = models.CharField(choices=CATEGORIE_CHOICES, default='standard', max_length=100)
    groupement_spacial = models.CharField(choices=GROUPEMENT_SPACIAL_CHOICES, default='non', max_length=100)
    titre_groupement_cpacial = models.CharField(max_length=100,null=True,blank=True)
    titre_groupement_cpacial_ar = models.CharField(max_length=100,null=True,blank=True)
    si_principal = models.BooleanField(default=False, verbose_name="Est l'offre principale")
    offre_principale = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                                         related_name='offres_liees',
                                         verbose_name="Rattachée à l'offre")
    date_creation = models.DateTimeField(auto_now_add=True)
    afficher_heures = models.BooleanField(default=True, verbose_name="Afficher les heures avec la date")
    a_traduire = models.BooleanField(default=False, verbose_name="pres a traduire")
    si_valider_ar = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Offre d'emploi"
        verbose_name_plural = "Offres d'emplois"
        permissions = [
            ("grouper_offreemploi", "Peut grouper des offres d'emploi"),
            ("valider_offreemploi", "Peut valider un offre d'emploi FR"),
            ("valider_ar_offreemploi", "Peut valider un offre d'emploi AR"),
            ("change_categorie_offreemploi", "Peut change categorie un offre d'emploi"),
            ("fixe_offreemploi", "Peut fixe un offre d'emploi"),
            ("traduire_offreemploi", "Peut traduire un offre d'emploi"),
            ("porte_feuille", "Peut consulter porte feuille"),
            

        ]

    def date_limite_fr(self):
        try:
            locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')
        except locale.Error:
            locale.setlocale(locale.LC_TIME, '')
        if self.afficher_heures :
            return timezone.localtime(self.date_limite).strftime("%d %B %Y à %H:%M").encode('utf-8').decode('utf-8')
        else :
            return timezone.localtime(self.date_limite).strftime("%d %B %Y").encode('utf-8').decode('utf-8')

    def save(self, *args, **kwargs):
        # Set default date_mise_en_ligne if not provided
        if not self.date_mise_en_ligne:
            self.date_mise_en_ligne = timezone.now()
        
        if self.si_principal:
            self.offre_principale = None
        if self.offre_principale:
            self.si_principal = False
        super().save(*args, **kwargs)

    def get_offres_groupe(self):
        if self.si_principal:
            return OffreEmploi.objects.filter(models.Q(offre_principale=self) | models.Q(pk=self.pk))
        elif self.offre_principale:
            return OffreEmploi.objects.filter(models.Q(offre_principale=self.offre_principale) |
                                              models.Q(pk=self.offre_principale.pk))
        return OffreEmploi.objects.filter(pk=self.pk)

    def get_offres_liees(self):
        if self.si_principal:
            return self.offres_liees.all()
        return OffreEmploi.objects.none()

    def nombre_offres_liees(self):
        return self.get_offres_liees().count()

    def __str__(self):
        return strip_tags(self.titre)


    
class Document(models.Model):
    DOCUMENT_LANG = [
        ('ar', 'Arabe'),
        ('fr', 'Français'),
    ]
    langue = models.CharField(choices=DOCUMENT_LANG, default='fr', max_length=100)
    titre_document = models.CharField(max_length=100)
    titre_piece_join = models.CharField(max_length=100)
    piece_join = models.FileField(upload_to='pieces_jointes/offres_emploi')
    offre_emploi = models.ForeignKey(OffreEmploi, on_delete=models.CASCADE, related_name='documents')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre_document
    

# class Publicite(models.Model):
#     libelle = models.CharField(max_length=255)
#     fichier = models.FileField(upload_to='publicites/')
#     date_creation = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.libelle



class Publicite(models.Model):
    TYPE_PUB_CHOICES = [
        ('GENERAL', 'Général'),
        ('OFFRES', 'Publicité des offres'),
        ('AVIS', 'Publicité des avis'),
        ('APPELS', 'Publicité des appels d\'offre'),
        ('COTE', 'Publicité à côté'),
    ]

    TYPE_CONTENU_CHOICES = [
        ('LIEN', 'Lien'),
        ('DOCUMENT', 'Document'),
    ]

    libelle = models.CharField(max_length=255, verbose_name="Libellé")
    client = models.ForeignKey(
        Client, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name="ID du client"
    )
    type_publicite = models.CharField(
        max_length=20, 
        choices=TYPE_PUB_CHOICES, 
        default='GENERAL', 
        verbose_name="Type de publicité"
    )
    type_contenu = models.CharField(
        max_length=10, 
        choices=TYPE_CONTENU_CHOICES, 
        default='LIEN', 
        verbose_name="Type"
    )
    lien = models.URLField(
        null=True, 
        blank=True, 
        verbose_name="Lien"
    )
    fichier = models.FileField(
        upload_to='publicites/document', 
        null=True, 
        blank=True, 
        verbose_name="Document"
    )
    image = models.FileField(upload_to='publicites/images/', blank=True, null=True)  # Nouveau champ
    date_limite = models.DateField(
        verbose_name="Date limite"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.libelle
