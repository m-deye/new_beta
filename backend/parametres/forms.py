from django import forms
from .models import Parametres

class ParametresForm(forms.ModelForm):
    class Meta:
        model = Parametres
        fields = '__all__'
        widgets = {
            'nombreoffres': forms.NumberInput(attrs={'class': 'form-control'}),
            'nombreapples': forms.NumberInput(attrs={'class': 'form-control'}),
            'nombreavis': forms.NumberInput(attrs={'class': 'form-control'}),
            'nombreoffresAr': forms.NumberInput(attrs={'class': 'form-control'}),
            'nombreapplesAr': forms.NumberInput(attrs={'class': 'form-control'}),
            'nombreavisAr': forms.NumberInput(attrs={'class': 'form-control'}),
        }
