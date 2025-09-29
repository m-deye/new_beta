from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UtilisateurPersonnalise, Client, Candidat, OffreEmploi, Document, Publicite

### 📌 1. Gestion des utilisateurs personnalisés
@admin.register(UtilisateurPersonnalise)
class UtilisateurPersonnaliseAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'valide', 'is_active', 'is_staff')
    list_filter = ('role', 'valide', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'role')
    fieldsets = UserAdmin.fieldsets + (
        ('Informations supplémentaires', {'fields': ('role', 'valide')}),
    )
    actions = ['valider_comptes']

    def valider_comptes(self, request, queryset):
        queryset.update(valide=True)
    valider_comptes.short_description = "Valider les comptes sélectionnés"


### 📌 2. Gestion des clients
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('libelle_fr', 'email', 'tel', 'domaine', 'type_organisation', 'date_creation')
    list_filter = ('domaine', 'type_organisation', 'date_creation')
    search_fields = ('libelle_fr', 'email', 'tel', 'domaine')
    readonly_fields = ('date_creation',)


### 📌 3. Gestion des candidats
@admin.register(Candidat)
class CandidatAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'date_creation')
    search_fields = ('utilisateur__username',)
    list_filter = ('date_creation',)
    readonly_fields = ('date_creation',)


### 📌 4. Gestion des offres d'emploi
@admin.register(OffreEmploi)
class OffreEmploiAdmin(admin.ModelAdmin):
    list_display = ('titre', 'type_offre', 'client', 'date_mise_en_ligne', 'date_limite', 'si_valider', 'a_traduire')
    search_fields = ('titre', 'client__nom', 'lieu')
    list_filter = ('si_valider', 'si_groupement', 'date_mise_en_ligne', 'a_traduire')
    readonly_fields = ('date_creation', 'nombre_vu')
    actions = ['valider_offres']
    
    fieldsets = (
        ("Informations Générales", {
            'fields': ('titre', 'description', 'client', 'type_offre')
        }),
        ("Détails", {
            'fields': ('lieu', 'afficher_heures', 'groupement_spacial', 'si_groupement', 'titre_groupement_cpacial')
        }),
        ("Statut", {
            'fields': ('si_valider', 'si_principal', 'offre_principale')
        }),
        ("Dates", {
            'fields': ('date_limite', 'date_mise_en_ligne')
        }),
    )

    def valider_offres(self, request, queryset):
        queryset.update(si_valider=True)
    valider_offres.short_description = "Valider les offres sélectionnées"

### 📌 5. Gestion des documents
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('titre_document', 'offre_emploi', 'date_creation')
    search_fields = ('titre_document', 'offre_emploi__titre')
    list_filter = ('date_creation',)
    readonly_fields = ('date_creation',)


### 📌 6. Gestion des publicités
@admin.register(Publicite)
class PubliciteAdmin(admin.ModelAdmin):
    list_display = ('libelle', 'fichier')
    search_fields = ('libelle',)
