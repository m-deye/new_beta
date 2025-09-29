from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

# app_name = 'avis_infos'

urlpatterns = [
    path('avis-infos', views.admin_avis_infos, name='avis_infos'),
    path('creer-avis-infos', views.creer_avis_infos, name='creer_avis_infos'),
    path('detail-avis-infos/<int:avis_id>/', views.get_avis_infos_details, name='detail_avis_infos'), 
    path('modifier-avis-infos/<int:avis_id>/', views.modifier_avis_infos, name='modifier_avis_infos'),
    path('supprimer-document-avis-infos/<int:document_id>/', views.supprimer_document, name='supprimer_document_avis_infos'), 
    path('ajouter-au-groupe-avis-infos/', views.ajouter_au_groupe_avis_infos, name='ajouter_au_groupe_avis_infos'),
    path('retirer-du-groupe-avis-infos/', views.retirer_du_groupe_avis_infos, name='retirer_du_groupe_avis_infos'),
    path('avis-infos/', views.traduction_avis_infos, name='traduction_avis_infos'),
    path('avis-infos/<int:offre_id>/traduire/', views.traduire_avis, name='traduire_avis_infos'),
    path('liste/', views.liste_avis_infos, name='liste_avis_infos'),
    path('listcompler/', views.listcompler_avis_infos, name='listcompler_avis_infos'),
    path('detail/<int:avis_id>/', views.detail_avis_infos, name='detail_avis_infos'),
    path('convert/<int:post_id>/', views.convert_post_category_view, name='convert_avis_category'),

    path('api/client/<int:client_id>/', views.apple_offres_par_client, name='offres_emploi_par_client'),

     path('annonces_parclient/', views.liste_annoces_cleint, name='liste_annoces_cleint'), 
      path('offres/ajouter/<int:id>/', views.ajouter_offre, name='ajouter_offre'), 
   path('nombre/avis_infos/<int:id>/', views.nombre_avis_infos, name='nombre_avis_infos'),

   path('api/offres/<int:id>/', views.update_offre_emploi, name='update_offre_emploi'),

    path('ajouter_document_client/<int:offre_emploi_id>/', views.ajouter_document, name='ajouter_document'),

    path('api/documents/<int:offre_id>/', views.get_documents_by_avisifos, name='get_documents_by_offre'),

    path('api/documents/delete/<int:document_id>/',  views.delete_document, name='delete_document'),

     path('offres/modifier_type/<int:offre_id>/', views.modifier_type_offre, name='modifier_type_offre'),
     path('incremente/<int:offre_id>/incremente_vue/', views.increment_vue, name='incremente_vue'),
]