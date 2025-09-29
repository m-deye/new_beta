from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.utils import timezone
import locale
from django.utils.html import strip_tags
from gestion_utilisateur.models import UtilisateurPersonnalise, Client, Candidat



class AvisInfos(models.Model):
    CATEGORIE_CHOICES = [
        ('standard', 'Standard'),
        ('autre', 'Autre'),
    ]
    GROUPEMENT_SPACIAL_CHOICES = [
        ('oui', 'Oui'),
        ('non', 'Non'),
    ]

    TYPE_OFFRE_CHOICES = [
        ('OFFRE_EMPLOI', 'Offre d\'emploi'),
        ('consultants', 'Consultants'),
    ]

    type_offre = models.CharField(choices=TYPE_OFFRE_CHOICES, default='OFFRE_EMPLOI', max_length=100)

    titre = CKEditor5Field('titre', config_name='extends')
    titre_ar = CKEditor5Field('titre_ar', config_name='extends', null=True, blank=True)

    titre_entreprise = models.CharField(max_length=100, null=True, blank=True)
    titre_entreprise_ar = models.CharField(max_length=100, null=True, blank=True)

    titre_documents_ar = CKEditor5Field('titre_documents_ar', config_name='extends', null=True, blank=True)

    description = CKEditor5Field('description', config_name='extends')
    description_ar = CKEditor5Field('description_ar', config_name='extends', null=True, blank=True)

    message_ar = CKEditor5Field('message_ar', config_name='extends', null=True, blank=True)

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='avis_infos')
    date_mise_en_ligne = models.DateTimeField(null=True, blank=True, verbose_name="Date de mise en ligne")
    date_limite = models.DateTimeField()
    lieu = models.CharField(max_length=100)
    lieu_ar = models.CharField(max_length=100,default="غير محدد")
    nombre_vu = models.IntegerField(default=0)
    si_archiver = models.BooleanField(default=False)
    si_valider = models.BooleanField(default=False)
    valider_par = models.ForeignKey(UtilisateurPersonnalise, on_delete=models.SET_NULL, null=True, blank=True, related_name='avis_infos_valider')
    si_groupement = models.BooleanField(default=False)
    si_fixe = models.BooleanField(default=False)
    si_traduire = models.BooleanField(default=False)
    acee_traduction = models.BooleanField(default=False)
    titre_entreprise = models.CharField(max_length=100,null=True,blank=True)
    titre_entreprise_ar = models.CharField(max_length=100,null=True,blank=True)
    lien = models.URLField(null=True,blank=True)
    # categorie = models.CharField(choices=CATEGORIE_CHOICES, default='standard', max_length=100)
    groupement_spacial = models.CharField(choices=GROUPEMENT_SPACIAL_CHOICES, default='non', max_length=100)
    titre_groupement_cpacial = models.CharField(max_length=100,null=True,blank=True)
    titre_groupement_cpacial_ar = models.CharField(max_length=100,null=True,blank=True)
    si_principal = models.BooleanField(default=False, verbose_name="Est l'avis principale")
    avis_principale = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, 
                                       related_name='avis_liees',
                                       verbose_name="Rattachée à l'avis")
    date_creation = models.DateTimeField(auto_now_add=True) 
    afficher_heures = models.BooleanField(default=True, verbose_name="Afficher les heures avec la date")
    a_traduire = models.BooleanField(default=False, verbose_name="pres a traduire")
    si_valider_ar = models.BooleanField(default=False)
    

    class Meta:
        verbose_name = "Avi Info"
        verbose_name_plural = "Avis Infos"
        permissions = [
            ("grouper_avisinfos", "Peut grouper des avis/infos"),
            ("valider_avisinfos", "Peut valider un avis/infos FR"),
            ("valider_ar_avisinfos", "Peut valider un avis/infos AR"),
            ("change_categorie_avisinfos", "Peut change categorie un avis/infos"),
            ("fixe_avisinfos", "Peut fixe un avis/infos"),
            ("traduire_avisinfos", "Peut traduire un avis/infos"),

        ]

    def date_limite_fr(self):
        try:
            locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')
        except locale.Error:
            locale.setlocale(locale.LC_TIME, '')
        return timezone.localtime(self.date_limite).strftime("%d %B %Y à %H:%M").encode('utf-8').decode('utf-8')

    def save(self, *args, **kwargs):
        # Set default date_mise_en_ligne if not provided
        if not self.date_mise_en_ligne:
            self.date_mise_en_ligne = timezone.now()
        
        if self.si_principal:
            self.avis_principale = None
        super().save(*args, **kwargs)

    def get_avis_groupe(self):
        if self.si_principal:
            return AvisInfos.objects.filter(models.Q(avis_principale=self) | models.Q(pk=self.pk))
        elif self.avis_principale:
            return AvisInfos.objects.filter(models.Q(avis_principale=self.avis_principale) |
                                            models.Q(pk=self.avis_principale.pk))
        return AvisInfos.objects.filter(pk=self.pk)

    def get_avis_liees(self):
        if self.si_principal:
            return self.avis_liees.all()
        return AvisInfos.objects.none()

    def nombre_avis_liees(self):
        return self.get_avis_liees().count()

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
    piece_join = models.FileField(upload_to='pieces_jointes/avis_infos/')
    avis_infos = models.ForeignKey(AvisInfos, on_delete=models.CASCADE, related_name='documents')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre_document
