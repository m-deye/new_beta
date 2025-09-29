from django.db import models
from django.contrib.auth.models import User, Group, AbstractUser
from django.utils.text import slugify
from django.core.files.base import ContentFile
import os

# Create your models here.
class UtilisateurPersonnalise(AbstractUser):
    email = models.EmailField(
        verbose_name="Adresse électronique",
        max_length=254,
        unique=False,
        blank=True,
        null=True
    )
    role = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Rôle",
        related_name="utilisateurs"
    )
    valide = models.BooleanField(default=False, verbose_name="Compte validé")
    date_creation = models.DateTimeField(auto_now_add=True) 

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        permissions = [
            ("valider_utilisateurpersonnalise", "Peut valider un utilisateur"),
            ("consulter_dashboard", "Peut consulter tableau de bord"),
        ]

    def save(self, *args, **kwargs):
        # Sauvegarde initiale pour s'assurer que l'ID est attribué
        super().save(*args, **kwargs)

        # Si c'est un superutilisateur, associer automatiquement au groupe "admin"
        if self.is_superuser:
            # Créer ou récupérer le groupe "admin"
            admin_group, created = Group.objects.get_or_create(name='admin')
            # Assigner le groupe "admin" comme rôle principal
            self.role = admin_group
            # S'assurer que l'utilisateur est également dans le groupe via le champ groups
            self.groups.clear()  # Supprimer tous les groupes actuels
            self.groups.add(admin_group)
            
            for group_name in ['client', 'candidat', 'commercial', 'traducteur']:
                Group.objects.get_or_create(name=group_name)
        else:
            # Logique existante pour les utilisateurs normaux
            self.groups.clear()  # Supprimer tous les groupes actuels
            if self.role:  # Vérifier si un rôle est défini
                self.groups.add(self.role)

        # Sauvegarde finale pour persister les changements
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
     
    # def save(self, *args, **kwargs):
    #     # Appeler la méthode save() du parent
    #     super().save(*args, **kwargs)

    #     # Créer les groupes s'ils n'existent pas
    #     group_name = self.role
    #     group, created = Group.objects.get_or_create(name=group_name)

    #     # Ajouter l'utilisateur au groupe
    #     self.groups.clear()  # Supprimer tous les groupes actuels
    #     self.groups.add(group)

    # def __str__(self):
    #     return self.username


class Client(models.Model):
    # Lien utilisateur
    utilisateur = models.OneToOneField(
        UtilisateurPersonnalise, on_delete=models.CASCADE, related_name="client", null=True
    )
    special = models.BooleanField(default=False, verbose_name="Compte special")
    # Informations générales
    logo = models.FileField(upload_to='logos/', null=True, blank=True)
    libelle_fr = models.CharField("Libellé (français)", max_length=255, null=True, blank=True)
    libelle_ar = models.CharField("Libellé (arabe)", max_length=255, null=True, blank=True)
    nom = models.CharField("Nom", max_length=200, null=True, blank=True)
    email = models.EmailField("Email", null=True, blank=True)
    tel = models.CharField("Téléphone", max_length=20, null=True )
   
    domaine = models.CharField("Domaine", max_length=100, null=True)
    type_organisation = models.CharField("Type d'Organisation", max_length=100, null=True, blank=True)
    adresse = models.CharField("Adresse", max_length=255, null=True, blank=True)
    site_web = models.URLField("Site Web", null=True, blank=True)

    # Contact responsable
    lieu = models.CharField("Lieu", max_length=255, null=True, blank=True)
    fax = models.CharField("Fax", max_length=20, null=True, blank=True)
    nom_responsable = models.CharField("Nom du Responsable", max_length=200, null=True, blank=True)
    fonction_responsable = models.CharField("Fonction du Responsable", max_length=200, null=True, blank=True)
    email_responsable = models.EmailField("Email du Responsable", null=True, blank=True)
    tel_responsable = models.CharField("Téléphone du Responsable", max_length=20, null=True, blank=True)

    # Références
    nom_ref1 = models.CharField("Nom référence 1", max_length=200, null=True, blank=True)
    email_ref1 = models.EmailField("Email référence 1", null=True, blank=True)
    nom_ref2 = models.CharField("Nom référence 2", max_length=200, null=True, blank=True)
    email_ref2 = models.EmailField("Email référence 2", null=True, blank=True)

    # Date de création
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.utilisateur.username if self.utilisateur else "Client sans utilisateur"



class Candidat(models.Model):
    logo = models.FileField(upload_to='logos/' ,null=True,)
    utilisateur = models.OneToOneField(UtilisateurPersonnalise, on_delete=models.CASCADE, related_name='candidat')
    cv = models.FileField(upload_to='cvs/', null=True, blank=True)
    lettre_motivation = models.FileField(upload_to='lettre_motivation/', null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    prenom_ar = models.CharField(max_length=100, blank=True, null=True)
    nom_ar = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    telephone = models.CharField(max_length=30, blank=True, null=True)
    pays = models.CharField(max_length=50, choices=[("Mauritanie", "Mauritanie"), ("France", "France"), ("Autre", "Autre")], blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    date_naissance = models.DateField(blank=True, null=True)
    lieu_naissance = models.CharField(max_length=50, choices=[("Trarza", "Trarza"), ("Nouakchott", "Nouakchott"), ("Autre", "Autre")], blank=True, null=True)
    genre = models.CharField(max_length=10, choices=[("Homme", "Homme"), ("Femme", "Femme")], blank=True, null=True)
    cv_validated = models.BooleanField(default=False, verbose_name="Validation CV")   
    def __str__(self):
        return self.utilisateur.username
    def generate_cv(self):
        if not self.prenom or not self.nom:
            return False

        # Construction dynamique du contenu CV avec un design amélioré
        cv_content = [
            "\\documentclass[a4paper,12pt]{article}",
            "\\usepackage[utf8]{inputenc}",
            "\\usepackage[T1]{fontenc}",
            "\\usepackage{geometry}",
            "\\geometry{a4paper, margin=1in}",
            "\\usepackage{amiri}",  # Police pour l'arabe
            "\\usepackage{fancyhdr}",
            "\\usepackage{enumitem}",  # Pour une liste plus stylée
            "\\pagestyle{fancy}",
            "\\fancyhf{}",
            f"\\lhead{{CV - {self.prenom} {self.nom}}}",
            f"\\rhead{{Généré le: {self.date_creation.strftime('%Y-%m-%d')}}}",
            "\\renewcommand{\\headrulewidth}{0.4pt}",
            "\\begin{document}",
            "\\begin{center}",
            "\\textbf{\\Large {CV - {self.prenom} {self.nom}}} \\\\",
            "\\vspace{0.2cm}",
            "\\textit{{Contact: {self.telephone or 'Non spécifié'} | {self.utilisateur.email or 'Non spécifié'}}}",
            "\\end{center}",
            "\\vspace{0.5cm}",
            "\\section*{Informations Personnelles}",
            f"\\textbf{{Nom:}} {self.prenom} {self.nom} ({self.prenom_ar or ''} {self.nom_ar or ''}) \\\\",
            f"\\textbf{{Téléphone:}} {self.telephone or 'Non spécifié'} \\\\",
            f"\\textbf{{Email:}} {self.utilisateur.email or 'Non spécifié'} \\\\",
            f"\\textbf{{Adresse:}} {self.adresse or 'Non spécifié'} \\\\",
            f"\\textbf{{Date de Naissance:}} {self.date_naissance.strftime('%Y-%m-%d') if self.date_naissance else 'Non spécifié'} \\\\",
            f"\\textbf{{Lieu de Naissance:}} {self.lieu_naissance or 'Non spécifié'} \\\\",
            f"\\textbf{{Pays:}} {self.pays or 'Non spécifié'} \\\\",
            f"\\textbf{{Genre:}} {self.genre or 'Non spécifié'}",
            "\\vspace{0.5cm}",
        ]

        # Ajout des diplômes
        if self.diplomes.exists():
            cv_content.append("\\section*{Diplômes}")
            cv_content.append("\\begin{itemize}[leftmargin=*]")
            for diplome in self.diplomes.all():
                cv_content.append(f"\\item \\textbf{{{diplome.diplome}}} - {diplome.etablissement} ({diplome.date_debut.strftime('%Y-%m-%d')} - {diplome.date_fin.strftime('%Y-%m-%d')})")
            cv_content.append("\\end{itemize}")
        else:
            cv_content.append("\\section*{Diplômes}")
            cv_content.append("Aucun diplôme enregistré.")

        # Ajout des langues
        if self.langues.exists():
            cv_content.append("\\section*{Langues}")
            cv_content.append("\\begin{itemize}[leftmargin=*]")
            for langue in self.langues.all():
                cv_content.append(f"\\item \\textbf{{{langue.langue}}} - {langue.niveau}")
            cv_content.append("\\end{itemize}")
        else:
            cv_content.append("\\section*{Langues}")
            cv_content.append("Aucune langue enregistrée.")

        # Ajout des expériences
        if self.experiences.exists():
            cv_content.append("\\section*{Expériences Professionnelles}")
            cv_content.append("\\begin{itemize}[leftmargin=*]")
            for exp in self.experiences.all():
                date_fin = exp.date_fin.strftime('%Y-%m-%d') if exp.date_fin else "En cours"
                cv_content.append(f"\\item \\textbf{{{exp.poste}}} - {exp.nom_entreprise} ({exp.date_debut.strftime('%Y-%m-%d')} - {date_fin})")
            cv_content.append("\\end{itemize}")
        else:
            cv_content.append("\\section*{Expériences Professionnelles}")
            cv_content.append("Aucune expérience enregistrée.")

        # Ajout des spécialisations
        if self.specialisations.exists():
            cv_content.append("\\section*{Spécialisations}")
            cv_content.append("\\begin{itemize}[leftmargin=*]")
            for spec in self.specialisations.all():
                cv_content.append(f"\\item \\textbf{{{spec.titre_specialisation}}} (Niveau d'étude: {spec.niveaux_etude or 'N/A'}, Expérience: {spec.experience or 'N/A'}, Domaine: {spec.domaine or 'N/A'})")
            cv_content.append("\\end{itemize}")
        else:
            cv_content.append("\\section*{Spécialisations}")
            cv_content.append("Aucune spécialisation enregistrée.")

        cv_content.append("\\end{document}")

        # Sauvegarde du fichier .tex
        cv_filename = f"cv_{slugify(self.prenom)}_{slugify(self.nom)}_{self.utilisateur.id}.tex"
        self.cv.save(cv_filename, ContentFile("\n".join(cv_content).encode('utf-8')))
        self.save()
        return self.cv.path  # Retourner le chemin du fichier généré