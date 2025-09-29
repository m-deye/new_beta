# mon_app/decorators.py
from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import redirect

def role_required(role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                # Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
                return redirect('login')  # Remplace 'login' par le nom de ton URL de connexion
            if request.user.role != role:
                # Retourne une réponse interdite ou redirige si le rôle ne correspond pas
                return HttpResponseForbidden("Vous n'avez pas le rôle requis pour accéder à cette page.")
            # Si tout est OK, exécute la vue
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

# Décorateur spécifique pour le rôle 'admin'
admin_required = role_required('admin')