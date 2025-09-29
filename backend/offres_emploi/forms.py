from django import forms
from .models import *
from django.forms import modelformset_factory
from django_ckeditor_5.widgets import CKEditor5Widget
from gestion_utilisateur.models import Client
from .models import Publicite
from django.db.models.functions import Coalesce

class OffreEmploiForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["description"].required = False
        self.fields["titre"].required = True
        
        # Personnaliser le champ client pour afficher libelle_fr
        self.fields['client'] = forms.ModelChoiceField(
            queryset=Client.objects.annotate(
                _order_name=Coalesce('libelle_fr', 'utilisateur__username')
            ).order_by('_order_name'),
            label="Client",
            widget=forms.Select(attrs={'class': 'form-select'}),
            empty_label="Sélectionner un client",
            to_field_name='id',  # Assurez-vous que l'ID est utilisé comme valeur
        )
        # Surcharger la méthode label_from_instance pour afficher libelle_fr
        def label_from_instance(self, obj):
            return obj.libelle_fr if obj.libelle_fr else obj.utilisateur.username

        # Associer la méthode personnalisée au champ client
        self.fields['client'].label_from_instance = label_from_instance.__get__(self, self.__class__)
        # Custom toggle switch for afficher_heures
        self.fields['afficher_heures'].widget = forms.CheckboxInput(attrs={
            'class': 'toggle-switch-input',
            'id': 'afficher_heures_toggle'
        })
        self.fields['afficher_heures'].label = "Afficher les heures avec la date"
    class Meta:
        model = OffreEmploi
        fields = ['titre', 'type_offre', 'description', 'client', 'date_limite', 'date_mise_en_ligne', 'afficher_heures',
                #   'si_national', 'categorie',
                  'lieu','titre_entreprise', 'groupement_spacial', 'titre_groupement_cpacial']
        # labels = {
        #     'si_national': 'National', 
        # }
        widgets = {
            "titre": CKEditor5Widget(
                  attrs={"class": "django_ckeditor_5"}, config_name="extends"
              ),
            "description": CKEditor5Widget(
                  attrs={"class": "django_ckeditor_5"}, config_name="extends"
              ),
            'type_offre': forms.Select(attrs={'class': 'form-select'}),
            'client': forms.Select(attrs={'class': 'form-select'}),
            'date_limite': forms.DateTimeInput(attrs={'class': 'form-control','type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            'date_mise_en_ligne': forms.DateTimeInput(attrs={'class': 'form-control','type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            # 'si_national': forms.RadioSelect(choices=[(True, "Oui"), (False, "Non")]),
            'lieu': forms.TextInput(attrs={'class': 'form-control'}),
            'titre_entreprise': forms.TextInput(attrs={'class': 'form-control'}),
            # 'categorie': forms.Select(attrs={'class': 'form-select'}),
            'groupement_spacial': forms.Select(attrs={'class': 'form-select'}),
            'titre_groupement_cpacial': forms.TextInput(attrs={'class': 'form-control'}),
        }
    
class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['titre_document', 'titre_piece_join', 'piece_join']
        widgets = {
            'langue':          forms.Select(attrs={'class':'form-control'}),
            'titre_document': forms.TextInput(attrs={'class': 'form-control'}),
            'titre_piece_join': forms.TextInput(attrs={'class': 'form-control'}),
            'piece_join': forms.FileInput(attrs={'class': 'form-control'}),
        }
        
        
# Créer un formset pour les documents
DocumentFormSet = modelformset_factory(
    Document,
    fields=('titre_document', 'titre_piece_join', 'piece_join'),
    extra=1,  # Nombre de formulaires vides à afficher par défaut
    can_delete=True,  # Permettre la suppression de documents
)

DocumentFormSetModifier = modelformset_factory(
    Document,
    fields=('titre_document', 'titre_piece_join', 'piece_join'),
    extra=0,  # Nombre de formulaires vides à afficher par défaut
      # Permettre la suppression de documents
)

class PubliciteForm(forms.ModelForm):
    class Meta:
        model = Publicite
        fields = ["libelle", "fichier"]
        


from django import forms
from .models import Publicite

class PubliciteForm(forms.ModelForm):
    class Meta:
        model = Publicite
        fields = ['libelle', 'client', 'type_publicite', 'type_contenu', 'lien', 'image', 'fichier', 'date_limite']
        widgets = {
            'date_limite': forms.DateInput(attrs={'type': 'date'}),
            'image': forms.FileInput(),  # Désactive ClearableFileInput
            'fichier': forms.FileInput(),  # Désactive ClearableFileInput
        }
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['client'] = forms.ModelChoiceField(
            queryset=Client.objects.all(),
            required=False,  # Car le champ client est null=True, blank=True dans le modèle
            label="Client",
            to_field_name='id',  # Utilise l'ID comme valeur dans le formulaire
            empty_label="Sélectionner un client",  # Texte pour l'option vide
        )
        # Personnaliser l'affichage du champ client pour utiliser le champ 'nom' ou 'libelle_fr'
        def label_from_instance(obj):
            # Utiliser 'nom' si disponible, sinon 'libelle_fr', sinon le username
            return obj.nom or obj.libelle_fr or obj.utilisateur.username if obj.utilisateur else "Client sans utilisateur"
        self.fields['client'].label_from_instance = label_from_instance
        
class TraductionOffreForm(forms.ModelForm):
    class Meta:
        model = OffreEmploi
        fields = [
            'titre_ar',
            'description_ar',
            'lieu_ar',
            'titre_entreprise_ar',            # ajouté
            'titre_groupement_cpacial_ar',    # ajouté
        ]
        widgets = {
            'titre_ar': CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"},
                config_name="extends"
            ),
            'description_ar': CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"},
                config_name="extends"
            ),
            'lieu_ar': forms.TextInput(attrs={'class': 'form-control'}),
            'titre_entreprise_ar': forms.TextInput(attrs={'class': 'form-control'}),
            'titre_groupement_cpacial_ar': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Si l’instance n’est pas groupement, on retire les champs
        if not getattr(self.instance, 'si_groupement', False):
            self.fields.pop('titre_entreprise_ar', None)
            self.fields.pop('titre_groupement_cpacial_ar', None)

class TraductionOffreForm(forms.ModelForm):
    class Meta:
        model = OffreEmploi
        fields = [
            'titre_ar',
            'description_ar',
            'lieu_ar',
            'titre_entreprise_ar',            # ajouté
            'titre_groupement_cpacial_ar',    # ajouté
        ]
        widgets = {
            'titre_ar': CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"},
                config_name="extends"
            ),
            'description_ar': CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"},
                config_name="extends"
            ),
            'lieu_ar': forms.TextInput(attrs={'class': 'form-control'}),
            'titre_entreprise_ar': forms.TextInput(attrs={'class': 'form-control'}),
            'titre_groupement_cpacial_ar': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Si l’instance n’est pas groupement, on retire les champs
        if not getattr(self.instance, 'si_groupement', False):
            self.fields.pop('titre_entreprise_ar', None)
            self.fields.pop('titre_groupement_cpacial_ar', None)

class DocumentForms(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['langue', 'titre_document', 'titre_piece_join', 'piece_join']
        widgets = {
            'langue':          forms.Select(attrs={'class':'form-control'}),
            'titre_document':  forms.TextInput(attrs={'class':'form-control'}),
            'titre_piece_join':forms.TextInput(attrs={'class':'form-control'}),
            'piece_join':      forms.ClearableFileInput(attrs={'class':'form-control'}),
        }      