from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views


# app_name = 'appels_offres'

urlpatterns = [
    # path('', liste_appels_offres, name='liste_appels_offres'),
    path('appel-offres', views.admin_appels_offres, name='appels_offres'),
    path('creer-appels-offres', views.creer_appels_offres, name='creer_appels_offres'),
    path('detail-appels-offre/<int:offre_id>/', views.get_appels_offres_details, name='detail_appels_offres'), 
    path('modifier-appels-offre/<int:offre_id>/', views.modifier_appels_offres, name='modifier_appels_offres'),
    path('supprimer-document-appels-offre/<int:document_id>/', views.supprimer_document, name='supprimer_document_appels_offre'), 
    path('ajouter-au-groupe-appels-offre/', views.ajouter_au_groupe_appels_offre, name='ajouter_au_groupe_appels_offre'),
    path('retirer-du-groupe-appels-offre/', views.retirer_du_groupe_appels_offre, name='retirer_du_groupe_appels_offre'),
    path('traduction-appel-offres', views.traduction_appel_offre, name='traduction_appel_offre'),
    path('appel-offres/<int:offre_id>/traduire/', views.traduire_offre, name='traduire_appel_offre'),
    path('liste/', views.liste_appels_offres, name='liste_appels_offres'),
    path('detail/<int:apple_id>/', views.detail_apple_offre_api , name='detail_apple_offre_api'),
    path('liste_type/', views.liste_appels_offres_partype, name='liste_appels_offres'),
    #path('parclient/', views.liste_appels_offres_partype, name='liste_appels_offres'),
    path('api/client/<int:client_id>/', views.apple_offres_par_client, name='offres_emploi_par_client'),
    path('annonces_parclient/', views.liste_annoces_cleint, name='liste_annoces_cleint'),  
    # path('listcompler/', views.liste_appels_offres, name='listcompler_appels_offres'), pass 
    path('listcompler/', views.liste_appels_offres, name='liste_appels_offres'), 
    path('offres/ajouter/<int:id>/', views.ajouter_offre, name='ajouter_offre'), 
    path('nombre/apples_offres/<int:id>/', views.nombre_apples_offres, name='nombre_apples_offres'),
    path('api/offres/<int:id>/', views.update_AppelOffre, name='update_offre_emploi'),
    path('ajouter_document_client/<int:offre_emploi_id>/', views.ajouter_document, name='ajouter_document'),
    path('api/documents/<int:offre_id>/', views.get_documents_by_applesoffre, name='get_documents_by_offre'),
    path('api/documents/delete/<int:document_id>/',  views.delete_document, name='delete_document'),
    path('offres/modifier_type/<int:offre_id>/', views.modifier_type_offre, name='modifier_type_offre'),
    path('incremente/<int:offre_id>/incremente_vue/', views.increment_vue, name='incremente_vue'),
    path('convert/<int:post_id>/', views.convert_post_category_view, name='convert_appel_category'),





]