from django.contrib import admin
from .models import AppelOffre, Document

@admin.register(AppelOffre)
class AppelOffreAdmin(admin.ModelAdmin):
    list_display = ('titre', 'client', 'type_offre', 'date_mise_en_ligne', 'date_limite',  'si_valider')
    list_filter = ('type_offre', 'type_s', 'client', 'date_mise_en_ligne',  'si_valider')
    search_fields = ('titre', 'client__nom')
    readonly_fields = ('nombre_vu',)
    
    fieldsets = (
        ("Informations Générales", {
            'fields': ('titre', 'description', 'client', 'type_offre', 'type_s')
        }),
        ("Détails", {
            'fields': ('lieu', 'groupement_spacial', 'si_groupement', 'titre_groupement_cpacial')
        }),
        ("Statut", {
            'fields': ('si_valider', 'si_principal', 'offre_principale')
        }),
        ("Dates", {
            'fields': ('date_limite', 'date_mise_en_ligne')
        }),
    )

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('titre_document', 'titre_piece_join', 'appels_offres', 'date_creation')
    search_fields = ('titre_document', 'titre_piece_join')
    list_filter = ('date_creation', 'appels_offres')
