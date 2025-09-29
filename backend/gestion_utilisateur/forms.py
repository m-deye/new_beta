from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import *

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control form-control-user',  # Classes CSS ici
        'placeholder': 'Enter Email Address...',
        'id': 'exampleInputEmail',
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control form-control-user',  # Classes CSS ici
        'placeholder': 'Password',
        'id': 'exampleInputPassword',
    }))
    
class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = UtilisateurPersonnalise
        fields = ['username', 'email', 'password1', 'password2']
        
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import UtilisateurPersonnalise
from django.contrib.auth.models import Group

class UtilisateurForm(UserCreationForm):
    # ROLE_CHOICES = [
    #     ('admin', 'Administrateur'),
    #     ('candidat', 'Candidat'),
    #     ('client', 'Client'),
    #     ('traducteur', 'Traducteur'),
    #     ('commercial', 'Commercial'),
    # ]
    role = forms.ModelChoiceField(
        queryset=Group.objects.all(),
        label="Rôle",
        widget=forms.Select(attrs={'class': 'form-control'}),
        empty_label="Sélectionner un rôle"
    )
    # role = forms.ChoiceField(choices=ROLE_CHOICES, label="Rôle", widget=forms.Select(attrs={'class': 'form-control'}))
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
    password1 = forms.CharField(label="Mot de passe", widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    password2 = forms.CharField(label="Confirmez le mot de passe", widget=forms.PasswordInput(attrs={'class': 'form-control'}))

    class Meta:
        model = UtilisateurPersonnalise
        fields = ["username", "email", "role", "password1", "password2"]
        labels = {
            'username': 'Nom utilisateur',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Désactiver complètement les validateurs de mot de passe
        self.fields['password1'].validators = []
        self.fields['password2'].validators = []

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        # Vérifier uniquement si les mots de passe correspondent
        if password1 and password2 and password1 != password2:
            self.add_error('password2', "Les mots de passe ne correspondent pas.")
        
        return cleaned_data

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if UtilisateurPersonnalise.objects.filter(username=username).exists():
            raise forms.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return username

    # def clean_email(self):
    #     email = self.cleaned_data.get('email')
    #     if UtilisateurPersonnalise.objects.filter(email=email).exists():
    #         raise forms.ValidationError("Cet email est déjà utilisé.")
    #     return email

    def save(self, commit=True):
        # Surcharger la méthode save pour éviter les validateurs globaux
        user = super(UserCreationForm, self).save(commit=False)
        # Définir le mot de passe manuellement sans validation
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

# Nouveau formulaire pour l'onglet Information
class ClientInfoForm(forms.Form):
    # Champs utilisateur
    username = forms.CharField(
        label="Nom d'utilisateur",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )
    email = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        required=True
    )
    password1 = forms.CharField(
        label="Mot de passe",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        required=True
    )
    password2 = forms.CharField(
        label="Confirmez le mot de passe",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        required=True
    )
    
    # Champs client
    logo = forms.FileField(
        label="Logo",
        widget=forms.ClearableFileInput(attrs={'class': 'form-control'}),
        required=False
    )
    libelle_fr = forms.CharField(
        label="Libellé (français)",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )
    libelle_ar = forms.CharField(
        label="Libellé (arabe)",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=False
    )
    tel = forms.CharField(
        label="Téléphone",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )
    domaine = forms.CharField(
        label="Domaine",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )
    type_organisation = forms.ChoiceField(
        label="Type d'Organisation",
        choices=[
            ('', '---------'), 
            ('Sociétés/Organismes Internationaux', 'Sociétés/Organismes Internationaux'),
            ('Banques', 'Banques'),
            ('Instituts', 'Instituts'),
            ('ONG & Associations', 'ONG & Associations'),
            ('Sociétés Locales & Bureaux d\'Etudes', 'Sociétés Locales & Bureaux d\'Etudes'),
            ('Projets & Administrations', 'Projets & Administrations'),
        ],
        widget=forms.Select(attrs={'class': 'form-control'}),
        required=True
    )
    adresse = forms.CharField(
        label="Adresse",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=False
    )
    lieu = forms.CharField(
        label="Lieu",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=False
    )
    fax = forms.CharField(
        label="Fax",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=False
    )
    nom_responsable = forms.CharField(
        label="Nom du Responsable",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=False
    )
    fonction_responsable = forms.CharField(
        label="Fonction du Responsable",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=False
    )
    email_responsable = forms.EmailField(
        label="Email du Responsable",
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        required=False
    )
    tel_responsable = forms.CharField(
        label="Téléphone du Responsable",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=False
    )
    site_web = forms.URLField(
        label="Site Web",
        widget=forms.URLInput(attrs={'class': 'form-control'}),
        required=False
    )
    special = forms.BooleanField(
        label="Compte spécial",
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        required=False
    )

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if 'email_client' in cleaned_data:
            cleaned_data['email'] = cleaned_data['email_client']
        if password1 and password2 and password1 != password2:
            self.add_error('password2', "Les mots de passe ne correspondent pas.")
        
        return cleaned_data

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if UtilisateurPersonnalise.objects.filter(username=username).exists():
            raise forms.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return username
        
from django import forms
from .models import Client

class ClientForm(forms.ModelForm):
    TYPE_ORGANISATION_CHOICES = [
        ('', '---------'), 
        ('Sociétés/Organismes Internationaux', 'Sociétés/Organismes Internationaux'),
        ('Banques', 'Banques'),
        ('Instituts', 'Instituts'),
        ('ONG & Associations', 'ONG & Associations'),
        ("Sociétés Locales & Bureaux d'Etudes", "Sociétés Locales & Bureaux d'Etudes"),
        ('Projets & Administrations', 'Projets & Administrations'),
    ]
    
    type_organisation = forms.ChoiceField(
        choices=TYPE_ORGANISATION_CHOICES,
        label="Type d'Organisation",
        widget=forms.Select(attrs={'class': 'form-control'}),
        required=True
    )
    
    class Meta:
        model = Client
        fields = [
            'logo', 'libelle_fr', 'libelle_ar', 'tel', 'email', 'domaine', 'type_organisation', 
            'adresse', 'lieu', 'fax', 'nom_responsable', 'fonction_responsable', 
            'email_responsable', 'tel_responsable', 'site_web', 'special'
        ]
        widgets = {
            'logo': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'libelle_fr': forms.TextInput(attrs={'class': 'form-control'}),
            'libelle_ar': forms.TextInput(attrs={'class': 'form-control'}),
            'tel': forms.TextInput(attrs={'class': 'form-control', 'required': 'required'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'domaine': forms.TextInput(attrs={'class': 'form-control', 'required': 'required'}),
            'type_organisation': forms.TextInput(attrs={'class': 'form-control'}),
            'adresse': forms.TextInput(attrs={'class': 'form-control'}),
            'lieu': forms.TextInput(attrs={'class': 'form-control'}),
            'fax': forms.TextInput(attrs={'class': 'form-control'}),
            'nom_responsable': forms.TextInput(attrs={'class': 'form-control'}),
            'fonction_responsable': forms.TextInput(attrs={'class': 'form-control'}),
            'email_responsable': forms.EmailInput(attrs={'class': 'form-control'}),
            'tel_responsable': forms.TextInput(attrs={'class': 'form-control'}),
            'site_web': forms.URLInput(attrs={'class': 'form-control'}),
            'special': forms.CheckboxInput(attrs={'class': 'form-check-input'}),

        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['type_organisation'].initial = ''
        # Marquer les champs comme requis
        self.fields['tel'].required = True
        self.fields['email'].required = True
        self.fields['domaine'].required = True
        self.fields['libelle_fr'].required = True
        self.fields['logo'].required = True
        self.fields['type_organisation'].required = True
        self.fields['special'].required = False 

class CandidatForm(forms.ModelForm):
    class Meta:
        model = Candidat
        fields = ['cv', 'lettre_motivation']
        widgets = {
            'cv': forms.FileInput(attrs={'class': 'form-control'}),
            'lettre_motivation': forms.FileInput(attrs={'class': 'form-control'}),
        }