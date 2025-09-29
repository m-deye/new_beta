from functools import wraps
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponseForbidden

def has_any_permission_for_model(model_name, app_label):
    """
    Décorateur qui vérifie si l'utilisateur a au moins une permission sur le modèle donné.
    model_name : nom du modèle en minuscules (ex. 'appeloffre')
    app_label : nom de l'application (par défaut 'offres_emploi')
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            try:
                content_type = ContentType.objects.get(app_label=app_label, model=model_name.lower())
                permissions = Permission.objects.filter(content_type=content_type)
                if any(request.user.has_perm(f'{app_label}.{perm.codename}') for perm in permissions):
                    # Si l'utilisateur a au moins une permission, exécute la vue
                    return view_func(request, *args, **kwargs)
                else:
                    # Sinon, renvoie une erreur 403 (accès interdit)
                    return HttpResponseForbidden("Vous n'avez pas les permissions nécessaires pour accéder à cette page.")
            except ContentType.DoesNotExist:
                return HttpResponseForbidden("Le modèle spécifié n'existe pas.")
        return _wrapped_view
    return decorator