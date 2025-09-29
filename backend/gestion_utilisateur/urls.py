from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views
from .views import CandidatDetailView

from .views import ClientCreateView

from .views import CandidatDetailViewall

# app_name = 'gestion_utilisateur'


urlpatterns = [
  path('creer-utilisateur-popup/', views.creer_utilisateur_popup, name='creer_utilisateur_popup'),
    path('api/modifier-utilisateur/', views.modifier_utilisateur_api, name='modifier_utilisateur_api'),
    path('api/client-profile/<int:user_id>/', views.get_client_profile, name='get_client_profile'),
    path('api/modifier-profile/', views.modifier_profile_api, name='modifier_profile_api'),
    
    path('candidate/<int:user_id>/', views.candidate_profile, name='candidate_profile'),
    path('validate_cv/<int:user_id>/', views.validate_cv, name='validate_cv'),
    path('generate_cv/<int:user_id>/', views.candidate_profile, name='generate_cv'),
    path('update_candidate_info/<int:user_id>/', views.update_candidate_info, name='update_candidate_info'),
    path('update_diplome/<int:user_id>/', views.update_diplome, name='update_diplome'),
    path('update_langue/<int:user_id>/', views.update_langue, name='update_langue'),
    path('update_experience/<int:user_id>/', views.update_experience, name='update_experience'),
    path('update_specialisation/<int:user_id>/', views.update_specialisation, name='update_specialisation'),
    path('delete_langue/<int:id>/', views.delete_langue, name='delete_langue'),
    path('delete_experience/<int:id>/', views.delete_experience, name='delete_experience'),
    path('delete_specialisation/<int:id>/', views.delete_specialisation, name='delete_specialisation'),
    
    

    # path('generate-cv/<int:candidat_id>/', views.generate_cv_view, name='generate_cv'),
    #   path('', views.accueil, name='accueil'),
    
    path('liste_utilisateurs/', views.liste_utilisateurs, name='liste_utilisateurs'),
    path('valider_utilisateur/<int:user_id>/', views.valider_utilisateur, name='valider_utilisateur'),
    # path('modifier_client/<int:user_id>/', views.modifier_client, name='modifier_client'),
    # path('modifier_candidat/<int:user_id>/', views.modifier_candidat, name='modifier_candidat'),
    path('supprimer_utilisateur/<int:user_id>/', views.supprimer_utilisateur, name='supprimer_utilisateur'),
    path('creer_utilisateur/', views.creer_utilisateur, name='creer_utilisateur'),
    # path('permissions/<int:user_id>/', views.get_permissions, name='get_permissions'),
    path('modifier_permissions/<int:user_id>/', views.modifier_permissions, name='modifier_permissions'),
    
    
    path('modifier_client/<int:utilisateur_id>/', views.modifier_client, name='modifier_client'),
    path('modifier_candidat/<int:utilisateur_id>/', views.modifier_candidat, name='modifier_candidat'),
    path("supprimer-utilisateur/<int:utilisateur_id>/", views.supprimer_utilisateur, name="supprimer_utilisateur"),
    path('utilisateurs/', views.liste_utilisateurs, name='liste_utilisateurs'),
    path('utilisateurs/valider/<int:utilisateur_id>/', views.valider_utilisateur, name='valider_utilisateur'),
    path('api/login/', views.login_view, name='api-login'),
    path('gestion-utilisateurs/', views.gestion_utilisateurs, name='gestion_utilisateurs'),
    path('clear_groups/', views.clear_groups, name='clear_groups'),
    path('gestion-groupes/', views.gestion_groupes, name='gestion_groupes'),
    path('permissions/<int:user_id>/', views.afficher_permissions, name='afficher_permissions'),
    path('modifier_permissions/<int:user_id>/', views.modifier_permissions, name='modifier_permissions'),
    path("creer-utilisateur/", views.creer_utilisateur, name="creer_utilisateur"),
    path('generer_utilisateur/', views.generer_utilisateur, name='generer_utilisateur'),
    
    path('ajouter-permission-groupe/', views.ajouter_permission_groupe, name='ajouter_au_groupe'),
    path('retirer-permission-groupe/', views.retirer_permission_groupe, name='retirer_du_groupe'),
    path('modifier-permissions-groupe/<int:groupe_id>/', views.modifier_permissions_groupe, name='modifier_permissions_groupe'),
    path('creer-groupe/', views.creer_groupe, name='creer_groupe'),
    path('creer-groupe/check-name/', views.check_group_name, name='check_group_name'),
    path('gestion-permissions-groupes/', views.gestion_permissions_groupes, name='gestion_permissions_groupes'),

    # # path('creer-groupe-page/', views.creer_groupe_page, name='creer_groupe_page'),

    # Nouvelles URLs pour les actions AJAX
    path('modifier_permissions/<int:user_id>/ajouter/', views.ajouter_permission, name='ajouter_permission'),
    path('modifier_permissions/<int:user_id>/retirer/', views.retirer_permission, name='retirer_permission'),
    path('ajouter-groupe-utilisateur/', views.ajouter_groupe_utilisateur, name='ajouter_groupe_utilisateur'),
    path('retirer-groupe-utilisateur/', views.retirer_groupe_utilisateur, name='retirer_groupe_utilisateur'),
    

      path('api/client/<int:client_id>/updatelogo/', views.updatelogo_client_profile, name='updatelogo_candidat_profile'),

      path('api/client/<int:client_id>/deletelogo/', views.delete_logo_client, name='delete_logo_client'),

     path('api/candidat/<int:candidat_id>/detail/', CandidatDetailView.as_view(), name='candidat-detail'),

      path('api/candidat/all/', CandidatDetailViewall.as_view(), name='candidat-all'),

     path('api/ajouterclient/',ClientCreateView.as_view(), name='candidat-detail'),



    ]