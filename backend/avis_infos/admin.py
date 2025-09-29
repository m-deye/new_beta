from django.contrib import admin
from .models import AvisInfos, Document

@admin.register(AvisInfos)
class AvisInfosAdmin(admin.ModelAdmin):
    list_display = ('titre', 'client', 'date_mise_en_ligne', 'date_limite',  'si_valider')
    list_filter = ('client', 'si_valider', 'groupement_spacial')
    search_fields = ('titre', 'client__nom')
    readonly_fields = ('nombre_vu',)

    fieldsets = (
        ("Informations Générales", {
            'fields': ('titre', 'description', 'client',  'lien')
        }),
        ("Détails", {
            'fields': ('lieu', 'afficher_heures', 'groupement_spacial', 'si_groupement', 'titre_groupement_cpacial')
        }),
        ("Statut", {
            'fields': ( 'si_valider', 'si_principal', 'avis_principale')
        }),
        ("Dates", {
            'fields': ('date_limite', 'date_mise_en_ligne')
        }),
    )

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('titre_document', 'titre_piece_join', 'avis_infos', 'date_creation')
    search_fields = ('titre_document', 'titre_piece_join')
    list_filter = ('date_creation', 'avis_infos')
