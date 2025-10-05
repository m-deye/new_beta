from django import forms
from .models import *
from django.forms import modelformset_factory
from django_ckeditor_5.widgets import CKEditor5Widget
from gestion_utilisateur.models import Client
from django.db.models.functions import Coalesce



class AvisInfosForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["description"].required = False
        self.fields["titre"].required = True
        # Trier les clients par libelle_fr puis fallback username
        self.fields['client'] = forms.ModelChoiceField(
            queryset=Client.objects.annotate(
                _order_name=Coalesce('libelle_fr', 'utilisateur__username')
            ).order_by('_order_name'),
            label="Client",
            widget=forms.Select(attrs={'class': 'form-select'}),
            empty_label="Sélectionner un client",
            to_field_name='id',
        )
        # Afficher libelle_fr sinon username
        def label_from_instance(self, obj):
            return obj.libelle_fr if obj.libelle_fr else (obj.utilisateur.username if getattr(obj, 'utilisateur', None) else str(obj.pk))
        self.fields['client'].label_from_instance = label_from_instance.__get__(self, self.__class__)

    class Meta:
        model = AvisInfos
        fields = (
            'titre', 'description', 'client', 'date_limite', 'date_mise_en_ligne', 'afficher_heures', 'lieu',
            # 'si_national', 'categorie',
            'titre_entreprise', 'lien',  'groupement_spacial', 'titre_groupement_cpacial'
        )
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
            'client': forms.Select(attrs={'class': 'form-select'}),
            'date_limite': forms.DateTimeInput(attrs={'class': 'form-control','type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            'date_mise_en_ligne': forms.DateTimeInput(attrs={'class': 'form-control','type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            'afficher_heures': forms.CheckboxInput(attrs={'class': 'toggle-switch-input', 'id': 'afficher_heures_toggle'}),
            'lieu': forms.TextInput(attrs={'class': 'form-control'}),
            # 'si_national': forms.RadioSelect(choices=[(True, "Oui"), (False, "Non")]),
            'titre_entreprise': forms.TextInput(attrs={'class': 'form-control'}),
            'lien': forms.URLInput(attrs={'class': 'form-control'}),
            # 'categorie': forms.Select(attrs={'class': 'form-select'}),
            'groupement_spacial': forms.Select(attrs={'class': 'form-select'}),
            'titre_groupement_cpacial': forms.TextInput(attrs={'class': 'form-control'}),
        }

    
class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['titre_document', 'titre_piece_join', 'piece_join']
        widgets = {
            'titre_document': forms.TextInput(attrs={'class': 'form-control'}),
            'titre_piece_join': forms.TextInput(attrs={'class': 'form-control'}),
            'piece_join': forms.FileInput(attrs={'class': 'form-control'}),
        }
        
DocumentFormSetModifier = modelformset_factory(
    Document,
    fields=('titre_document', 'titre_piece_join', 'piece_join'),
    extra=0, 
)

class TraductionAvisInfos(forms.ModelForm):
    class Meta:
        model = AvisInfos
        fields = ['titre_ar', 'description_ar','lieu_ar']
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
        }

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