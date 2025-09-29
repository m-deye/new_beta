
from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views ,tes


urlpatterns = [
       # path('', views.accueil, name='accueil'),inscription_client_front
       path('inscription/<str:role>/', views.inscription, name='inscription'),
       path('inscriptions/<str:role>/', views.inscription_client_front, name='inscriptions'),
       # path('', views.accueil, name='accueil'),
      #  path('inscription/<str:role>/', views.inscription, name='inscription'),
      path('accueil/', views.accueil, name='accueil'),
       path('connexion/', views.connexion, name='connexion'),
       path('deconnexion/', views.deconnexion, name='deconnexion'),
       path('', views.index, name='index'),
       path('acee/', views.aucun_acee, name='aucun_acee'),
       path('modifier-offre/<int:offre_id>/', views.modifier_offre, name='modifier_offre'),
       path('supprimer-document/<int:document_id>/', views.supprimer_document, name='supprimer_document'), 
       path('offres', views.admin_offres, name='admin_offres'),
       path('detail-offre/<int:offre_id>/', views.get_offre_details, name='detail_offre'), 
       path('creer-offre', views.creer_offre_admin, name='creer_offre'),
       path('ajouter-au-groupe/', views.ajouter_au_groupe, name='ajouter_au_groupe'),
       path('retirer-du-groupe/', views.retirer_du_groupe, name='retirer_du_groupe'),
       path('traduction-offre/', views.traduction_offre, name='traduction_offre'),
       path('offres/<int:offre_id>/traduire/', views.traduire_offre, name='traduire_offre'),

       path('parametre/', views.parametre, name='parametre'),
       path('base_cv/', views.base_cv, name='base_cv'),
      #  path('publicite/', views.get_publicite, name='get_publicite'),
      #  path('publicite/creer/', views.creer_publicite, name='creer_publicite'),
      #  path('publicites/modifier/<int:publicite_id>/', views.modifier_publicite, name='modifier_publicite'),
       
      path('publicites/', views.get_publicite, name='liste_publicites'),
      path('publicites/creer/', views.creer_publicite, name='creer_publicite'),
      path('publicites/modifier/<int:publicite_id>/', views.modifier_publicite, name='modifier_publicite'),
      
      
      path('porte-feuille/', views.porte_feuille, name='porte_feuille'),
      # Ajouter une URL pour l'export PDF si nécessaire
      path('porte-feuille/export-pdf/', views.export_pdf, name='export_pdf'),
      
      
       # path("modifier-utilisateur/<int:utilisateur_id>/", views.modifier_utilisateur, name="modifier_utilisateur"),
       path('offres_emploi/liste/', views.liste_offres_api ,name='liste_offres_api'),
       path('offres_emploi/liste/special/', tes.liste_offres_special_api ,name='liste_offres_api'),
       path('listcompler/', views.listcompler_offres_api, name='listcompler_offres_api'),

       # path('api/login/', login_view, name='api-login'),
       path('api/client/<int:client_id>/profile/', views.get_client_profile, name='get_client_profile'),
       path('api/client/<int:client_id>/update/', views.update_client_profile, name='update_client_profile'),
       path('api/candidat/<int:candidat_id>/profile/', views.get_candidat_profile, name='get_candidat_profile'),
       path('api/offres_emplois/', views.liste_apple_offre_candidat, name='liste_apple_offre_candidat'),
       path('api/client/<int:client_id>/offres-emploi/', views.offres_emploi_par_client, name='offres_emploi_par_client'),
      #  path('fixer-offre/<int:offre_id>/', views.fixer_offre, name='fixer_offre'),
       #   path('apple_offre/liste/', views.liste_apple_offre, name='liste_apple_offre'),
       path('avis_info/liste/', views.liste_avis_info, name='liste_avis_info'),
       path('api/publicites/', views.get_publicites, name='get_publicites'), 
       path('api/offres/detail/<int:offre_id>/', views.detail_offre_api, name='get_publicites'),
      #  path('api/offres/detail/<int:offre_id>/', views.detail_offre_api, name='get_publicites'),
       path('annonces_parclient/', views.liste_annoces_cleint, name='liste_annoces_cleint'), 
       path('offres/ajouter/<int:id>/', views.ajouter_offre, name='ajouter_offre'),

  path('api/login/', views.login_view, name='api-login'),


  path('api/client/<int:client_id>/profile/', views.get_client_profile, name='get_client_profile'),
  path('api/client/<int:client_id>/update/', views.update_client_profile, name='update_client_profile'),

  path('api/candidat/<int:candidat_id>/update/', views.update_candidat_profile, name='update_candiat_profile'),
  path('api/candidat/<int:candidat_id>/updatecv/', views.update_candidat_profilecv, name='update_candiat_profile'),

 path('api/candidat/<int:candidat_id>/getcv/', views.get_candidat_profilecv),

  path('api/documents/<int:document_id>/getducument/', views.get__document),

  path('api/candidat/<int:candidat_id>/profile/', views.get_candidat_profile, name='get_candidat_profile'),
 
path('api/candidat/<int:candidat_id>/updatelogo/', views.updatelogo_candidat_profile, name='updatelogo_candidat_profile'),
path('api/candidat/<int:candidat_id>/deletelogo/', views.delete_logo_candidat, name='delete_logo_candidat'),


  path('api/offres_emplois/', views.liste_apple_offre_candidat, name='liste_apple_offre_candidat'),
  path('api/client/<int:client_id>/offres-emploi/', views.offres_emploi_par_client, name='offres_emploi_par_client'),

  
  path("api/offres-fixes/", views.offres_fixes),
  path("api/avis-fixes/", views.avis_fixes),
  path("api/appels-fixes/", views.apples_fixes),

  # path('fixer-offre/<int:offre_id>/', views.fixer_offre, name='fixer_offre'),

path('fixer-offre/<int:offre_id>/', views.fixer_offre, name='fixer_offre'),
path('fixer-avis/<int:avis_id>/', views.fixer_avis, name='fixer_avis'),
path('fixer-appel/<int:appel_id>/', views.fixer_appel, name='fixer_appel'),


  #   path('apple_offre/liste/', views.liste_apple_offre, name='liste_apple_offre'),
  # path('avis_info/liste/', views.liste_avis_info, name='liste_avis_info'),

  path('publicite/', views.get_publicite, name='get_publicite'),
  path('publicite/creer/', views.creer_publicite, name='creer_publicite'),

  path('publicites/modifier/<int:publicite_id>/', views.modifier_publicite, name='modifier_publicite'),
  # path('api/publicites/', views.get_publicites, name='get_publicites'), 


  

  path('annonces_parclient/<str:client_nom>/', views.liste_annonces_client, name='annonces_parclient'),

        path('offres/ajouter/<int:id>/', views.ajouter_offre, name='ajouter_offre'),

     path('api/offres/<int:id>/', views.update_offre_emploi, name='update_offre_emploi'),

      #  path('api/update-type-offre/<int:id>/', views.update_type_offre, name='update_type_offre'),

       path('nombre/offreemplois/<int:id>/', views.nombre_offreemplois, name='nombre_offreemplois'),

      path('nombre/offreemplois_tous/', views.nombre_offreemplois_tous, name='nombre_offreemplois'),

       path('offres/modifier_type/<int:offre_id>/', views.modifier_type_offre, name='modifier_type_offre'),

         path('ajouter_document_client/<int:offre_emploi_id>/', views.ajouter_document, name='ajouter_document'),
       path('api/documents/<int:offre_id>/', views.get_documents_by_offre, name='get_documents_by_offre'),

       path('api/documents/delete/<int:document_id>/',  views.delete_document, name='delete_document'),



          path('api/compte/candidat/<int:candidat_id>/', views.get_compte_by_candidat),
    path('api/compte/candidat/<int:candidat_id>/update/', views.update_compte_by_candidat),

    path('api/compte/client/<int:client_id>/update/', views.update_compte_by_client),



     path('password_reset/', views.request_password_reset, name='password-reset'),
    path('password_reset_confirm/<uidb64>/<token>/', views.reset_password_confirm, name='password-reset-confirm'),
 

    path('api/offres/<int:offre_id>/incremente_vue/', views.increment_vue, name='incremente_vue'),
    path('convert/<int:post_id>/', views.convert_post_category_view, name='convert_offre_category'),

       

       ]

    

