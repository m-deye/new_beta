from django.db import models

from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.utils import timezone
import locale
from django.utils.html import strip_tags
from gestion_utilisateur.models import UtilisateurPersonnalise, Client, Candidat



# class AppelOffre(models.Model):
#     TYPE_OFFRE_CHOICES = [
#         ('OFFRE_EMPLOI', 'Offre d\'emploi'),
#         ('APPEL_OFFRE', 'Appel d\'offre'),
#     ]
#     TYPE_S = [
#         ('internationaux', 'Internationaux'),
#         ('consultations', 'Consultations'),
#         ('locaux', 'Locaux'),
#         ('manifestations', 'Manifestations d\'Intérêts'),
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
#     type_offre = models.CharField(choices=TYPE_OFFRE_CHOICES, default='APPEL_OFFRE',max_length=100)
#     type_s = models.CharField(choices=TYPE_S, default='internationaux',max_length=100)
#     description = CKEditor5Field('description', config_name='extends')
#     client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='appels_offres')
#     date_mise_en_ligne = models.DateField(default=timezone.now) 
#     date_limite = models.DateTimeField()
#     lieu = models.CharField(max_length=100)
#     nombre_vu = models.IntegerField(default=0)
#     # si_national = models.BooleanField(default=True)
#     # si_publier = models.BooleanField(default=False)
#     si_archiver = models.BooleanField(default=False)
#     si_valider = models.BooleanField(default=False)
#     si_groupement = models.BooleanField(default=False)
#     si_fixe = models.BooleanField(default=False)
#     si_traduire = models.BooleanField(default=False)
#     acee_traduction = models.BooleanField(default=False)
#     titre_entreprise = models.CharField(max_length=100,null=True,blank=True)
#     # categorie = models.CharField(choices=CATEGORIE_CHOICES, default='standard', max_length=100)
#     groupement_spacial = models.CharField(choices=GROUPEMENT_SPACIAL_CHOICES, default='non', max_length=100)
#     si_principal = models.BooleanField(default=False, verbose_name="Est l'offre principale")
#     titre_groupement_cpacial = models.CharField(max_length=100,null=True,blank=True)
#     offre_principale = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, 
#                                        related_name='offres_liees',
#                                        verbose_name="Rattachée à l'offre")
    
#     class Meta:
#         verbose_name = "Appel d'offre"
#         verbose_name_plural = "Appels d'offres"
#         permissions = [
#             ("grouper_appeloffre", "Peut grouper des appel d'offre"),
#             ("valider_appeloffre", "Peut valider un appel d'offre"),

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
        
       
        
#         super().save(*args, **kwargs)
        
#     def get_offres_groupe(self):
#         """Retourne toutes les offres du même groupe, y compris l'offre principale"""
#         if self.si_principal:
#             return AppelOffre.objects.filter(models.Q(offre_principale=self) | models.Q(pk=self.pk))
#         elif self.offre_principale:
#             return AppelOffre.objects.filter(models.Q(offre_principale=self.offre_principale) | 
#                                             models.Q(pk=self.offre_principale.pk))
#         return AppelOffre.objects.filter(pk=self.pk)
    
#     def get_offres_liees(self):
#         """Retourne uniquement les offres liées (sans l'offre principale)"""
#         if self.si_principal:
#             return self.offres_liees.all()
#         return AppelOffre.objects.none()
    
#     def nombre_offres_liees(self):
#         """Retourne le nombre d'offres liées"""
#         return self.get_offres_liees().count()
    
#     def __str__(self):
#         return strip_tags(self.titre)
    

class AppelOffre(models.Model):
    TYPE_OFFRE_CHOICES = [
        ('OFFRE_EMPLOI', 'Offre d\'emploi'),
        ('APPEL_OFFRE', 'Appel d\'offre'),
    ]
    TYPE_S = [
        ('internationaux', 'Internationaux'),
        ('consultations', 'Consultations'),
        ('locaux', 'Locaux'),
        ('manifestations', 'Manifestations d\'Intérêts'),
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

    description = CKEditor5Field('description', config_name='extends')
    description_ar = CKEditor5Field('description_ar', config_name='extends', null=True, blank=True)

    message_ar = CKEditor5Field('message_ar', config_name='extends', null=True, blank=True)

    type_offre = models.CharField(choices=TYPE_OFFRE_CHOICES, default='APPEL_OFFRE', max_length=100)
    type_s = models.CharField(choices=TYPE_S, default='internationaux', max_length=100)

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='appels_offres')
    # date_mise_en_ligne = models.DateField(default=timezone.now)
    date_mise_en_ligne = models.DateTimeField(null=True, blank=True, verbose_name="Date de mise en ligne")
    date_limite = models.DateTimeField()
    lieu = models.CharField(max_length=100,default="", blank=True, null=True)
    lieu_ar = models.CharField(max_length=100,default="",blank=True, null=True)
    nombre_vu = models.IntegerField(default=0)
    si_archiver = models.BooleanField(default=False)
    si_valider = models.BooleanField(default=False)
    valider_par = models.ForeignKey(UtilisateurPersonnalise, on_delete=models.SET_NULL, null=True, blank=True, related_name='appels_offres_valider')
    si_groupement = models.BooleanField(default=False)
    si_fixe = models.BooleanField(default=False)
    si_traduire = models.BooleanField(default=False)
    acee_traduction = models.BooleanField(default=False)

    groupement_spacial = models.CharField(choices=GROUPEMENT_SPACIAL_CHOICES, default='non', max_length=100)
    si_principal = models.BooleanField(default=False, verbose_name="Est l'offre principale")
    titre_groupement_cpacial = models.CharField(max_length=100, null=True, blank=True)
    titre_groupement_cpacial_ar = models.CharField(max_length=100, null=True, blank=True)

    offre_principale = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                                         related_name='offres_liees',
                                         verbose_name="Rattachée à l'offre")
    date_creation = models.DateTimeField(auto_now_add=True) 
    afficher_heures = models.BooleanField(default=True, verbose_name="Afficher les heures avec la date")
    a_traduire = models.BooleanField(default=False, verbose_name="pres a traduire")
    si_valider_ar = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Appel d'offre"
        verbose_name_plural = "Appels d'offres"
        permissions = [
            ("grouper_appeloffre", "Peut grouper des appel d'offre"),
            ("valider_appeloffre", "Peut valider un appel d'offre FR"),
            ("valider_ar_appeloffre", "Peut valider un appel d'offre AR"),
            ("change_categorie_appeloffre", "Peut change categorie un appel d'offre"),
            ("fixe_appeloffre", "Peut fixe un appel d'offre"),
            ("traduire_appeloffre", "Peut traduire un appel d'offre"),

        ]

    def date_limite_fr(self):
        try:
            locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')
        except locale.Error:
            locale.setlocale(locale.LC_TIME, '')
        if self.afficher_heures:
            return timezone.localtime(self.date_limite).strftime("%d %B %Y à %H:%M").encode('utf-8').decode('utf-8')
        else:
            return timezone.localtime(self.date_limite).strftime("%d %B %Y").encode('utf-8').decode('utf-8')

    def save(self, *args, **kwargs):
        # Set default date_mise_en_ligne if not provided
        if not self.date_mise_en_ligne:
            self.date_mise_en_ligne = timezone.now()
        
        if self.si_principal:
            self.offre_principale = None
        super().save(*args, **kwargs)

    def get_offres_groupe(self):
        if self.si_principal:
            return AppelOffre.objects.filter(models.Q(offre_principale=self) | models.Q(pk=self.pk))
        elif self.offre_principale:
            return AppelOffre.objects.filter(models.Q(offre_principale=self.offre_principale) |
                                             models.Q(pk=self.offre_principale.pk))
        return AppelOffre.objects.filter(pk=self.pk)

    def get_offres_liees(self):
        if self.si_principal:
            return self.offres_liees.all()
        return AppelOffre.objects.none()

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
    piece_join = models.FileField(upload_to='pieces_jointes/appels_offres/')
    appels_offres = models.ForeignKey(AppelOffre, on_delete=models.CASCADE, related_name='documents')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre_document
