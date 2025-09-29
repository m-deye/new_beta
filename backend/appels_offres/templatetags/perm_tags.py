from django import template
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

import logging
logger = logging.getLogger(__name__)
logger.info("Chargement de perm_tags.py")

register = template.Library()

@register.filter
def has_any_permission_appels_offres(user, model_name):
    """
    Vérifie si l'utilisateur a au moins une permission sur le modèle donné.
    model_name : nom du modèle en minuscules (ex. 'appeloffre')
    """
    try:
        content_type = ContentType.objects.get(app_label='appels_offres', model=model_name.lower())
        permissions = Permission.objects.filter(content_type=content_type)
        return any(user.has_perm(f'appels_offres.{perm.codename}') for perm in permissions)
    except ContentType.DoesNotExist:
        return False


@register.filter
def has_any_permission_avis_infos(user, model_name):

    try:
        content_type = ContentType.objects.get(app_label='avis_infos', model=model_name.lower())
        permissions = Permission.objects.filter(content_type=content_type)
        return any(user.has_perm(f'avis_infos.{perm.codename}') for perm in permissions)
    except ContentType.DoesNotExist:
        return False
  
    
@register.filter
def has_any_permission_gestion_utilisateur(user, model_name):

    try:
        content_type = ContentType.objects.get(app_label='gestion_utilisateur', model=model_name.lower())
        permissions = Permission.objects.filter(content_type=content_type)
        return any(user.has_perm(f'gestion_utilisateur.{perm.codename}') for perm in permissions)
    except ContentType.DoesNotExist:
        return False
  
      
@register.filter
def has_any_permission_offres_emploi(user, model_name):

    try:
        content_type = ContentType.objects.get(app_label='offres_emploi', model=model_name.lower())
        permissions = Permission.objects.filter(content_type=content_type)
        return any(user.has_perm(f'offres_emploi.{perm.codename}') for perm in permissions)
    except ContentType.DoesNotExist:
        return False

@register.filter
def has_any_permission_gestion_utilisateur(user, model_name):

    try:
        content_type = ContentType.objects.get(app_label='gestion_utilisateur', model=model_name.lower())
        permissions = Permission.objects.filter(content_type=content_type)
        return any(user.has_perm(f'gestion_utilisateur.{perm.codename}') for perm in permissions)
    except ContentType.DoesNotExist:
        return False
    
@register.filter
def has_role(user, role):
    """
    Vérifie si l'utilisateur a le rôle spécifié basé sur le groupe.
    Args:
        user: L'objet utilisateur (request.user)
        role: Le nom du rôle à vérifier (ex. 'admin')
    Returns:
        bool: True si l'utilisateur a le rôle et est authentifié, False sinon
    """
    if not user.is_authenticated:
        return False
    return user.role and user.role.name == role



@register.filter
def get_model_type(annonce):
    model_name = annonce.__class__.__name__
    if model_name == 'OffreEmploi':
        return "Offre d'emploi"
    elif model_name == 'AppelOffre':
        return "Appel d'offre"
    elif model_name == 'AvisInfos':
        return "Avis et infos"
    return "Inconnu"


@register.filter
def has_implied_permission(user, perm_codename):
    """
    Vérifie si l'utilisateur a la permission demandée, ou une permission qui l'implique.
    Args:
        user: L'objet utilisateur (request.user)
        perm_codename: Le codename de la permission (ex. 'view_appeloffre')
    Returns:
        bool: True si l'utilisateur a la permission directement ou via implication.
    """
    if not user.is_authenticated:
        return False

    app_label = 'appels_offres'  # Adaptez si nécessaire pour d'autres apps
    model_name = 'appeloffre'   # Nom du modèle en minuscules

    # Récupérer la permission demandée
    try:
        content_type = ContentType.objects.get(app_label=app_label, model=model_name)
        target_perm = Permission.objects.get(content_type=content_type, codename=perm_codename)
    except (ContentType.DoesNotExist, Permission.DoesNotExist):
        return False

    # Vérifier directement la permission
    if user.has_perm(f'{app_label}.{perm_codename}'):
        return True

    # Définir les règles d'implication (dictionnaire : permission_enfant -> liste de permissions_parents)
    implications = {
        'view_appeloffre': ['change_appeloffre', 'delete_appeloffre', 'valider_appeloffre', 'grouper_appeloffre', 'traduire_appeloffre'],
        # Ajoutez d'autres implications ici, ex. :
        # 'change_appeloffre': ['traduire_appeloffre'],  # Si traduire implique modifier
    }

    # Vérifier les permissions parents pour cette permission
    parent_perms = implications.get(perm_codename, [])
    for parent_codename in parent_perms:
        if user.has_perm(f'{app_label}.{parent_codename}'):
            return True

    return False



@register.filter
def has_permission(user, permission):
    """
    Vérifie si l'utilisateur a la permission spécifique donnée.
    Args:
        user: L'objet utilisateur (request.user)
        permission: Le nom complet de la permission (ex. 'appels_offres.view_appeloffre')
    Returns:
        bool: True si l'utilisateur a la permission, False sinon
    """
    if not user.is_authenticated:
        return False
    return user.has_perm(permission)

@register.filter
def count_all_permissions(user):
    """
    Compte le nombre total de permissions que l'utilisateur possède à travers toutes les applications.
    Args:
        user: L'objet utilisateur (request.user)
    Returns:
        int: Nombre total de permissions de l'utilisateur
    """
    if not user.is_authenticated:
        logger.debug(f"Utilisateur non authentifié : 0 permissions")
        return 0
    
    try:
        # Récupérer toutes les permissions de l'utilisateur via get_all_permissions()
        permissions = user.get_all_permissions()
        count = len(permissions)
        logger.debug(f"Nombre total de permissions pour {user}: {count}")
        return count
    except Exception as e:
        logger.error(f"Erreur lors du comptage des permissions totales pour {user}: {str(e)}")
        return 0