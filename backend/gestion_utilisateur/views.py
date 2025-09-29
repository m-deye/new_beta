from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view , parser_classes
from django.contrib.admin.views.decorators import staff_member_required
from .models import Client
from diplomes.models import *
from experience.models import *
from langues.models import *
from specialisation.models import *

from .serializers import ClientSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Candidat
from .serializers import CandidatDetailSerializer


from .models import *
from .forms import *
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect
from django.contrib.auth.models import Group, Permission
from django.apps import apps
from .models import UtilisateurPersonnalise
from django.views.decorators.http import require_POST
from django.db import transaction
from collections import defaultdict
from rest_framework.authtoken.models import Token
import json
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.decorators import permission_required
from django.utils import timezone


from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from .forms import UtilisateurForm, ClientInfoForm
from .models import Client, Candidat
import uuid
import string
import random
from django.http import FileResponse
import subprocess
import os


@login_required
@permission_required('gestion_utilisateur.change_utilisateurpersonnalise', raise_exception=True)
def candidate_profile(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    if utilisateur.role.name != 'candidat':
        return redirect('liste_utilisateurs')
    candidat = get_object_or_404(Candidat, utilisateur=utilisateur)
    if request.method == 'POST' and 'generate_cv' in request.POST:
        if candidat.generate_cv():
            return redirect('candidate_profile', user_id=user_id)
    return render(request, 'candidate_profile.html', {'candidat': candidat})

@login_required
def delete_experience(request, id):
    experience = get_object_or_404(Experience, id=id)
    candidat_id = experience.candidat.utilisateur.id
    experience.delete()
    return redirect('candidate_profile', user_id=candidat_id)

@login_required
def delete_specialisation(request, id):
    specialisation = get_object_or_404(Specialisation, id=id)
    candidat_id = specialisation.candidat.utilisateur.id
    specialisation.delete()
    return redirect('candidate_profile', user_id=candidat_id)

@login_required
def delete_langue(request, id):
    langue = get_object_or_404(Langue, id=id)
    candidat_id = langue.candidat.utilisateur.id
    langue.delete()
    return redirect('candidate_profile', user_id=candidat_id)

@login_required
@permission_required('gestion_utilisateur.valider_utilisateurpersonnalise', raise_exception=True)
def validate_cv(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    if utilisateur.role.name != 'candidat':
        return redirect('liste_utilisateurs')
    candidat = get_object_or_404(Candidat, utilisateur=utilisateur)
    if request.method == 'POST':
        candidat.cv_validated = True
        candidat.save()
        return redirect('candidate_profile', user_id=user_id)
    return redirect('candidate_profile', user_id=user_id)

@login_required
def update_candidate_info(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    if utilisateur.role.name != 'candidat':
        return redirect('liste_utilisateurs')
    candidat = get_object_or_404(Candidat, utilisateur=utilisateur)
    if request.method == 'POST':
        candidat.prenom = request.POST.get('prenom', '')
        candidat.nom = request.POST.get('nom', '')
        candidat.prenom_ar = request.POST.get('prenom_ar', '')
        candidat.nom_ar = request.POST.get('nom_ar', '')
        candidat.telephone = request.POST.get('telephone', '')
        candidat.pays = request.POST.get('pays', '')
        candidat.adresse = request.POST.get('adresse', '')
        candidat.date_naissance = request.POST.get('date_naissance', None)
        candidat.lieu_naissance = request.POST.get('lieu_naissance', '')
        candidat.genre = request.POST.get('genre', '')
        candidat.save()
        return redirect('candidate_profile', user_id=user_id)
    return redirect('candidate_profile', user_id=user_id)

@login_required
def update_diplome(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    if utilisateur.role.name != 'candidat':
        return redirect('liste_utilisateurs')
    candidat = get_object_or_404(Candidat, utilisateur=utilisateur)
    if request.method == 'POST':
        for diplome in candidat.diplomes.all():
            diplome.diplome = request.POST.get(f'diplome_{diplome.id}', diplome.diplome)
            diplome.etablissement = request.POST.get(f'etablissement_{diplome.id}', diplome.etablissement)
            diplome.date_debut = request.POST.get(f'date_debut_{diplome.id}', diplome.date_debut)
            diplome.date_fin = request.POST.get(f'date_fin_{diplome.id}', diplome.date_fin)
            diplome.save()
        if 'add_diplome' in request.POST:
            Diplome.objects.create(
                candidat=candidat,
                diplome=request.POST.get('new_diplome', ''),
                etablissement=request.POST.get('new_etablissement', ''),
                date_debut=request.POST.get('new_date_debut', None),
                date_fin=request.POST.get('new_date_fin', None)
            )
        return redirect('candidate_profile', user_id=user_id)
    return redirect('candidate_profile', user_id=user_id)

@login_required
def update_langue(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    if utilisateur.role.name != 'candidat':
        return redirect('liste_utilisateurs')
    candidat = get_object_or_404(Candidat, utilisateur=utilisateur)
    if request.method == 'POST':
        for langue in candidat.langues.all():
            langue.langue = request.POST.get(f'langue_{langue.id}', langue.langue)
            langue.niveau = request.POST.get(f'niveau_{langue.id}', langue.niveau)
            langue.save()
        if 'add_langue' in request.POST:
            Langue.objects.create(
                candidat=candidat,
                langue=request.POST.get('new_langue', ''),
                niveau=request.POST.get('new_niveau', '')
            )
        return redirect('candidate_profile', user_id=user_id)
    return redirect('candidate_profile', user_id=user_id)

@login_required
def update_experience(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    if utilisateur.role.name != 'candidat':
        return redirect('liste_utilisateurs')
    candidat = get_object_or_404(Candidat, utilisateur=utilisateur)
    if request.method == 'POST':
        for exp in candidat.experiences.all():
            exp.nom_entreprise = request.POST.get(f'nom_entreprise_{exp.id}', exp.nom_entreprise)
            exp.poste = request.POST.get(f'poste_{exp.id}', exp.poste)
            exp.date_debut = request.POST.get(f'date_debut_{exp.id}', exp.date_debut)
            exp.date_fin = request.POST.get(f'date_fin_{exp.id}', exp.date_fin)
            exp.en_cours = 'en_cours_{exp.id}' in request.POST
            exp.save()
        if 'add_experience' in request.POST:
            Experience.objects.create(
                candidat=candidat,
                nom_entreprise=request.POST.get('new_nom_entreprise', ''),
                poste=request.POST.get('new_poste', ''),
                date_debut=request.POST.get('new_date_debut', None),
                date_fin=request.POST.get('new_date_fin', None),
                en_cours='new_en_cours' in request.POST
            )
        return redirect('candidate_profile', user_id=user_id)
    return redirect('candidate_profile', user_id=user_id)

@login_required
def update_specialisation(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    if utilisateur.role.name != 'candidat':
        return redirect('liste_utilisateurs')
    candidat = get_object_or_404(Candidat, utilisateur=utilisateur)
    if request.method == 'POST':
        for spec in candidat.specialisations.all():
            spec.titre_specialisation = request.POST.get(f'titre_specialisation_{spec.id}', spec.titre_specialisation)
            spec.niveaux_etude = request.POST.get(f'niveaux_etude_{spec.id}', spec.niveaux_etude)
            spec.experience = request.POST.get(f'experience_{spec.id}', spec.experience)
            spec.domaine = request.POST.get(f'domaine_{spec.id}', spec.domaine)
            spec.save()
        if 'add_specialisation' in request.POST:
            Specialisation.objects.create(
                candidat=candidat,
                titre_specialisation=request.POST.get('new_titre_specialisation', ''),
                niveaux_etude=request.POST.get('new_niveaux_etude', ''),
                experience=request.POST.get('new_experience', ''),
                domaine=request.POST.get('new_domaine', '')
            )
        return redirect('candidate_profile', user_id=user_id)
    return redirect('candidate_profile', user_id=user_id)

@permission_required("gestion_utilisateur.add_utilisateurpersonnalise", raise_exception=True)
# from django.contrib import messages
# from django.shortcuts import redirect
# from django.core.mail import send_mail
# import string
# import random
# from django.contrib.auth import get_user_model
# from django.contrib.auth.models import Group
# from django.utils import timezone

def generer_utilisateur(request):
    User = get_user_model()
    if request.method == "POST":
        email = request.POST.get("email")
        is_client = request.POST.get("is_client") == "on"  # Vérifie si la case est cochée

        # Récupérer le dernier client créé
        last_client = Client.objects.order_by('-utilisateur__date_joined').first()
        if last_client and last_client.utilisateur.username.startswith("emp_"):
            # Extraire le numéro du dernier username
            last_num = int(last_client.utilisateur.username.split('_')[1].split('@')[0])
            start_num = last_num + 1
        else:
            # Si aucun client avec format "emp_" ou format différent, commencer à 0001
            start_num = 1

        # Générer un nom d'utilisateur unique avec incrémentation
        username = f"emp_{start_num:04d}@beta.mr"
        while User.objects.filter(username=username).exists():
            start_num += 1
            username = f"emp_{start_num:04d}@beta.mr"

        # Générer un mot de passe aléatoire
        characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(characters) for i in range(12))

        try:
            # Créer l'utilisateur
            utilisateur = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                date_joined=timezone.now()  # Ajouter la date d'inscription
            )
            # Assigner le rôle basé sur le toggle
            role_name = "client" if is_client else "candidat"
            role_group, _ = Group.objects.get_or_create(name=role_name)
            utilisateur.role = role_group
            utilisateur.groups.add(role_group)
            utilisateur.save()

            # Créer le profil correspondant
            if is_client:
                client = Client.objects.create(utilisateur=utilisateur)
                client.libelle_fr = "TRANSAC SA (GROUPE AZIZI)"  # Définir le libelle_fr
                client.save()
            else:
                Candidat.objects.create(utilisateur=utilisateur)

            # Envoyer l'email avec le format spécifié
            subject = "Vos identifiants de connexion"
            message = (
                "Bonjour,\n"
                "Nous sommes ravis de vous annoncer que votre organisation TRANSAC SA (GROUPE AZIZI) a été confirmée avec succès !Vous pouvez désormais publier des offres d'emploi sur BETA Conseils en toute facilité.\n"
                "Informations de connexion :\n"
                f"Login : {username}\n"
                "Mot de passe : Votre mot de passe d'inscription\n"
                f"Gérer : {client.libelle_fr if is_client else ''}\n"
                "-----------------------------\n"
                "Beta Conseils\n"
                "Premier portail de recrutement et d'informations économiques en Mauritanie."
            )
            send_mail(
                subject=subject,
                message=message,
                from_email="betamessagerie@gmail.com",
                recipient_list=[email],
                fail_silently=False,
            )

            messages.success(request, "Utilisateur créé et identifiants envoyés par email.")
            return redirect("liste_utilisateurs")
        except Exception as e:
            messages.error(request, f"Erreur lors de la création de l'utilisateur : {str(e)}")
            return redirect("creer_utilisateur")
    
    return redirect("creer_utilisateur")

@permission_required("gestion_utilisateur.add_utilisateurpersonnalise", raise_exception=True)
def creer_utilisateur(request):
    """Vue principale pour créer un utilisateur - affiche maintenant le formulaire d'information client"""
    if request.method == "POST":
        form = ClientInfoForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                # Créer l'utilisateur
                utilisateur = UtilisateurPersonnalise.objects.create_user(
                    username=form.cleaned_data['username'],
                    email=form.cleaned_data['email'],
                    password=form.cleaned_data['password1']
                )
                
                # Assigner le rôle client
                client_group, _ = Group.objects.get_or_create(name='client')
                utilisateur.role = client_group
                utilisateur.groups.add(client_group)
                utilisateur.save()

                # Créer le profil client avec toutes les informations
                client = Client.objects.create(
                    utilisateur=utilisateur,
                    logo=form.cleaned_data.get('logo'),
                    libelle_fr=form.cleaned_data['libelle_fr'],
                    libelle_ar=form.cleaned_data.get('libelle_ar', ''),
                    tel=form.cleaned_data['tel'],
                    email=form.cleaned_data['email'],
                    domaine=form.cleaned_data['domaine'],
                    type_organisation=form.cleaned_data['type_organisation'],
                    adresse=form.cleaned_data.get('adresse', ''),
                    lieu=form.cleaned_data.get('lieu', ''),
                    fax=form.cleaned_data.get('fax', ''),
                    nom_responsable=form.cleaned_data.get('nom_responsable', ''),
                    fonction_responsable=form.cleaned_data.get('fonction_responsable', ''),
                    email_responsable=form.cleaned_data.get('email_responsable', ''),
                    tel_responsable=form.cleaned_data.get('tel_responsable', ''),
                    site_web=form.cleaned_data.get('site_web', ''),
                    special=form.cleaned_data.get('special', False)
                )

                messages.success(request, "Utilisateur client créé avec succès avec toutes les informations.")
                return redirect("liste_utilisateurs")
            except Exception as e:
                messages.error(request, f"Erreur lors de la création de l'utilisateur : {str(e)}")
        else:
            # Afficher les erreurs spécifiques du formulaire
            for field, errors in form.errors.items():
                for error in errors:
                    field_label = form.fields[field].label or field
                    messages.error(request, f"Erreur dans le champ '{field_label}' : {error}")
    else:
        form = ClientInfoForm()

    return render(request, "creer_utilisateur.html", {"client_info_form": form})

@permission_required("gestion_utilisateur.add_utilisateurpersonnalise", raise_exception=True)
def creer_utilisateur_info(request):
    """Vue pour créer un utilisateur avec informations client complètes"""
    if request.method == "POST":
        form = ClientInfoForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                # Créer l'utilisateur
                utilisateur = UtilisateurPersonnalise.objects.create_user(
                    username=form.cleaned_data['username'],
                    email=form.cleaned_data['email'],
                    password=form.cleaned_data['password1']
                )
                
                # Assigner le rôle client
                client_group, _ = Group.objects.get_or_create(name='client')
                utilisateur.role = client_group
                utilisateur.groups.add(client_group)
                utilisateur.save()

                # Créer le profil client avec toutes les informations
                client = Client.objects.create(
                    utilisateur=utilisateur,
                    logo=form.cleaned_data.get('logo'),
                    libelle_fr=form.cleaned_data['libelle_fr'],
                    libelle_ar=form.cleaned_data.get('libelle_ar', ''),
                    tel=form.cleaned_data['tel'],
                    email=form.cleaned_data['email'],
                    domaine=form.cleaned_data['domaine'],
                    type_organisation=form.cleaned_data['type_organisation'],
                    adresse=form.cleaned_data.get('adresse', ''),
                    lieu=form.cleaned_data.get('lieu', ''),
                    fax=form.cleaned_data.get('fax', ''),
                    nom_responsable=form.cleaned_data.get('nom_responsable', ''),
                    fonction_responsable=form.cleaned_data.get('fonction_responsable', ''),
                    email_responsable=form.cleaned_data.get('email_responsable', ''),
                    tel_responsable=form.cleaned_data.get('tel_responsable', ''),
                    site_web=form.cleaned_data.get('site_web', ''),
                    special=form.cleaned_data.get('special', False)
                )

                messages.success(request, "Utilisateur client créé avec succès avec toutes les informations.")
                return redirect("liste_utilisateurs")
            except Exception as e:
                messages.error(request, f"Erreur lors de la création de l'utilisateur : {str(e)}")
        else:
            # Afficher les erreurs spécifiques du formulaire
            for field, errors in form.errors.items():
                for error in errors:
                    field_label = form.fields[field].label or field
                    messages.error(request, f"Erreur dans le champ '{field_label}' : {error}")
    else:
        form = ClientInfoForm()

    return render(request, "creer_utilisateur.html", {"client_info_form": form})

@csrf_exempt
@permission_required("auth.change_group", raise_exception=True)
def ajouter_groupe_utilisateur(request):
    if request.method == 'POST':
        data = request.POST
        utilisateur_id = data.get('utilisateur_id')
        groupe_id = data.get('groupe_id')
        
        try:
            utilisateur = UtilisateurPersonnalise.objects.get(id=utilisateur_id)
            groupe = Group.objects.get(id=groupe_id)
            utilisateur.groups.add(groupe)
            return JsonResponse({'success': True})
        except (User.DoesNotExist, Group.DoesNotExist):
            return JsonResponse({'success': False, 'error': 'Utilisateur ou groupe non trouvé'})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée'})

@csrf_exempt
@permission_required("auth.change_group", raise_exception=True)
def retirer_groupe_utilisateur(request):
    if request.method == 'POST':
        data = request.POST
        utilisateur_id = data.get('utilisateur_id')
        groupe_id = data.get('groupe_id')
        
        try:
            utilisateur = UtilisateurPersonnalise.objects.get(id=utilisateur_id)
            groupe = Group.objects.get(id=groupe_id)
            utilisateur.groups.remove(groupe)
            return JsonResponse({'success': True})
        except (User.DoesNotExist, Group.DoesNotExist):
            return JsonResponse({'success': False, 'error': 'Utilisateur ou groupe non trouvé'})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée'})



@login_required
@permission_required("auth.change_permission", raise_exception=True)
def modifier_permissions_groupe(request, groupe_id):
    if request.user.role.name != 'admin':
        messages.error(request, "Vous n'avez pas les permissions nécessaires.")
        return redirect('gestion_permissions_groupes')

    groupe = get_object_or_404(Group, id=groupe_id)

    # Garder les autres applications intactes
    apps = ['offres_emploi', 'appels_offres', 'avis_infos']
    
    # Récupérer les ContentType des autres applications (tous les modèles)
    content_types_autres_apps = ContentType.objects.filter(app_label__in=apps).exclude(model__in=['Document'])
    
    # Pour gestion_utilisateur : SEULEMENT UtilisateurPersonnalise
    try:
        utilisateur_content_type = ContentType.objects.get(
            app_label='gestion_utilisateur', 
            model='utilisateurpersonnalise'
        )
    except ContentType.DoesNotExist:
        messages.error(request, "Modèle UtilisateurPersonnalise non trouvé.")
        return redirect('gestion_permissions_groupes')
    
    # Combiner : UtilisateurPersonnalise + autres apps + Group + Permission
    group_content_type = ContentType.objects.get_for_model(Group)
    permission_content_type = ContentType.objects.get_for_model(Permission)
    
    all_content_types = (
        content_types_autres_apps | 
        ContentType.objects.filter(id__in=[
            utilisateur_content_type.id, 
            # group_content_type.id, 
            permission_content_type.id])
    )

    # Filtrer les permissions
    permissions = Permission.objects.filter(content_type__in=all_content_types)
    permissions_attribuees = groupe.permissions.filter(content_type__in=all_content_types)
    permissions_disponibles = permissions.exclude(id__in=permissions_attribuees)

    # Le reste du code reste identique...
    if request.method == 'POST':
        permission_ids = request.POST.getlist('permission_id')
        with transaction.atomic():
            groupe.permissions.set(permission_ids)

        messages.success(request, f"Les permissions du groupe '{groupe.name}' ont été mises à jour.")
        return redirect('gestion_permissions_groupes')

    context = {
        'groupe': groupe,
        'permissions_attribuees': permissions_attribuees,
        'permissions_disponibles': permissions_disponibles,
    }
    return render(request, 'modifier_permissions_groupe.html', context)


@csrf_exempt
@permission_required("auth.add_permission", raise_exception=True)
def ajouter_permission_groupe(request):
    if request.method == 'POST':
        try:
            groupe_id = request.POST.get('groupe_id')
            permission_id = request.POST.get('permission_id')

            groupe = get_object_or_404(Group, id=groupe_id)
            permission = get_object_or_404(Permission, id=permission_id)

            groupe.permissions.add(permission)

            return JsonResponse({'success': True, 'message': f"Permission '{permission.name}' ajoutée."})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@permission_required("auth.add_permission", raise_exception=True)
def retirer_permission_groupe(request):
    if request.method == 'POST':
        try:
            groupe_id = request.POST.get('groupe_id')
            permission_id = request.POST.get('permission_id')

            groupe = get_object_or_404(Group, id=groupe_id)
            permission = get_object_or_404(Permission, id=permission_id)

            groupe.permissions.remove(permission)

            return JsonResponse({'success': True, 'message': f"Permission '{permission.name}' retirée."})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
       

from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.models import Group, Permission
from django.db import transaction
from django.shortcuts import render, redirect, get_object_or_404
from collections import defaultdict

@login_required
def gestion_permissions_groupes(request):
    if request.user.role.name != 'admin':
        messages.error(request, "Vous n'avez pas les permissions nécessaires.")
        return redirect('home')

    groupes = Group.objects.prefetch_related('permissions').all()
    permissions = Permission.objects.select_related("content_type").all()

    if request.method == 'POST':
        groupe_id = request.POST.get('groupe_id')
        action = request.POST.get('action')

        if action == 'supprimer_groupe':
            if request.user.has_perm('auth.delete_group'):
                groupe = get_object_or_404(Group, id=groupe_id)
                # Supprimer tous les utilisateurs appartenant à ce groupe
                utilisateurs_supprimes, _ = UtilisateurPersonnalise.objects.filter(groups=groupe).delete()
                groupe_name = groupe.name
                groupe.delete()
                messages.success(request, f"Le groupe '{groupe_name}' et utilisateur(s) associé(s) ont été supprimés.")
                return redirect('gestion_permissions_groupes')

        permission_ids = request.POST.getlist('permission_id')
        if not groupe_id or not permission_ids:
            messages.error(request, "Veuillez sélectionner un groupe et au moins une permission.")
            return redirect('gestion_permissions_groupes')

        groupe = get_object_or_404(Group, id=groupe_id)

        try:
            with transaction.atomic():
                if action == 'ajouter_permission_groupe':
                    permissions_to_add = Permission.objects.filter(id__in=permission_ids)
                    groupe.permissions.add(*permissions_to_add)
                    messages.success(request, f"{len(permissions_to_add)} permissions ajoutées à '{groupe.name}'.")

                elif action == 'supprimer_permission_groupe':
                    permissions_to_remove = Permission.objects.filter(id__in=permission_ids)
                    groupe.permissions.remove(*permissions_to_remove)
                    messages.success(request, f"{len(permissions_to_remove)} permissions retirées de '{groupe.name}'.")

        except Exception as e:
            messages.error(request, f"Une erreur est survenue : {str(e)}")

        return redirect('gestion_permissions_groupes')

    # Organisation des permissions par modèle avec actions groupées
    groupes_permissions = {}
    for groupe in groupes:
        permissions_by_model = defaultdict(set)
        for perm in groupe.permissions.all():
            model_name = perm.content_type.model.replace('_', ' ').title()  # Ex: Log Entry
            action = perm.codename.split('_')[0].capitalize()  # Ex: Add, Change, Delete, View
            permissions_by_model[model_name].add(action)

        formatted_permissions = {
            model: f"{', '.join(sorted(actions))} {model}"  # Ex: "Add, Change, Delete, View Log Entry"
            for model, actions in permissions_by_model.items()
        }

        groupes_permissions[groupe] = formatted_permissions

    context = {
        'groupes': groupes,
        'permissions': permissions,
        'groupes_permissions': groupes_permissions,
    }
    return render(request, 'gestion_permissions_groupes.html', context)

@permission_required("auth.add_group", raise_exception=True)
def creer_groupe(request):
    if request.method == 'POST':
        step = request.POST.get('step')
        
        if step == 'check_name':
            nom_groupe = request.POST.get('nom_groupe')
            if Group.objects.filter(name=nom_groupe).exists():
                messages.error(request, f"Le groupe '{nom_groupe}' existe déjà. Veuillez choisir un autre nom.")
                return render(request, 'creer_groupe.html', {
                    'step': 'check_name',
                    'permissions': Permission.objects.all(),
                })
            return render(request, 'creer_groupe.html', {
                'step': 'assign_permissions',
                'nom_groupe': nom_groupe,
                'permissions': Permission.objects.all()
            })
        
        elif step == 'create_group':
            nom_groupe = request.POST.get('nom_groupe')
            permissions_ids = request.POST.getlist('permissions')
            
            if Group.objects.filter(name=nom_groupe).exists():
                messages.error(request, f"Le groupe '{nom_groupe}' existe déjà. Veuillez choisir un autre nom.")
                return render(request, 'creer_groupe.html', {
                    'step': 'check_name',
                    'permissions': Permission.objects.all(),
                })
            
            try:
                with transaction.atomic():
                    groupe = Group.objects.create(name=nom_groupe)
                    if permissions_ids:
                        permissions = Permission.objects.filter(id__in=permissions_ids)
                        groupe.permissions.set(permissions)
                    messages.success(request, f"Le groupe '{nom_groupe}' a été créé avec succès.")
                    return redirect('gestion_permissions_groupes')
            except Exception as e:
                messages.error(request, f"Une erreur est survenue lors de la création du groupe : {str(e)}")
                return render(request, 'creer_groupe.html', {
                    'step': 'assign_permissions',
                    'nom_groupe': nom_groupe,
                    'permissions': Permission.objects.all()
                })
    
    return render(request, 'creer_groupe.html', {
        'step': 'check_name',
        'permissions': Permission.objects.all(),
    })


@login_required
@require_POST
@permission_required("auth.add_group", raise_exception=True)
def check_group_name(request):
    """Retourne JSON indiquant si un groupe existe déjà."""
    nom_groupe = request.POST.get('nom_groupe', '').strip()
    exists = Group.objects.filter(name=nom_groupe).exists() if nom_groupe else False
    return JsonResponse({
        'exists': exists,
        'message': "Le nom du groupe existe déjà." if exists else "Nom disponible."
    })


@login_required
def modifier_permissions(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    
    if request.method == 'POST':
        selected_permissions = request.POST.getlist('permissions')
        utilisateur.user_permissions.clear()
        for perm_id in selected_permissions:
            permission = get_object_or_404(Permission, id=perm_id)
            utilisateur.user_permissions.add(permission)
        messages.success(request, f"Les permissions de {utilisateur.username} ont été mises à jour avec succès.")
        return JsonResponse({'status': 'success', 'message': 'Permissions mises à jour'})
    
    user_permissions = [perm for perm in utilisateur.user_permissions.all()]
    group_permissions = []
    for group in utilisateur.groups.all():
        group_permissions.extend([perm for perm in group.permissions.all()])
    current_permissions = list(set(user_permissions + group_permissions))
    
    all_permissions = Permission.objects.all()
    user_permission_ids = [perm.id for perm in user_permissions]
    print({
    'utilisateur': utilisateur.username,
    'current_permissions': current_permissions,
    'all_permissions': list(all_permissions),
    'user_permission_ids': user_permission_ids,
})

    return render(request, 'modifier_permissions.html', {
        'utilisateur': utilisateur,
        'current_permissions': current_permissions,
        'all_permissions': all_permissions,
        'user_permission_ids': user_permission_ids,
    })
    
@login_required
@require_POST
def ajouter_permission(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    perm_id = request.POST.get('permission_id')
    permission = get_object_or_404(Permission, id=perm_id)
    
    utilisateur.user_permissions.add(permission)
    return JsonResponse({'success': True})

@login_required
@require_POST
def retirer_permission(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    perm_id = request.POST.get('permission_id')
    permission = get_object_or_404(Permission, id=perm_id)
    
    utilisateur.user_permissions.remove(permission)
    return JsonResponse({'success': True})

# Autres vues inchangées...

@login_required
def gestion_groupes(request):
    if request.user.role.name != 'admin':
        messages.error(request, "Vous n'avez pas les permissions nécessaires.")
        return redirect('home')
    
    groupes = Group.objects.all()
    # Récupérer tous les modèles de l'application avec leurs noms
    modeles = [
        {'name': model._meta.verbose_name.title(), 'model_name': model._meta.model_name}
        for model in apps.get_models() if model.__module__.startswith('gestion_utilisateur')  # Remplacez par le nom de votre app
    ]
    print(modeles)
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'creer_groupe':
            nom_groupe = request.POST.get('nom_groupe')
            if nom_groupe:
                groupe, created = Group.objects.get_or_create(name=nom_groupe)
                if created:
                    messages.success(request, f"Le groupe {nom_groupe} a été créé avec succès")
                else:
                    messages.warning(request, f"Le groupe {nom_groupe} existe déjà")
                    
                permissions = request.POST.getlist('permissions')
                for perm_id in permissions:
                    permission = Permission.objects.get(id=perm_id)
                    groupe.permissions.add(permission)
                return redirect('gestion_groupes')
            else:
                messages.error(request, "Le nom du groupe est requis")
                
        elif action == 'supprimer_groupe':
            groupe_id = request.POST.get('groupe_id')
            groupe = Group.objects.get(id=groupe_id)
            # Supprimer tous les utilisateurs appartenant à ce groupe
            utilisateurs_supprimes, _ = UtilisateurPersonnalise.objects.filter(groups=groupe).delete()
            groupe_name = groupe.name
            groupe.delete()
            messages.success(request, f"Le groupe {groupe_name} et utilisateur(s) associé(s) ont été supprimés")
            
        elif action == 'ajouter_utilisateur':
            groupe_id = request.POST.get('groupe_id')
            utilisateur_id = request.POST.get('utilisateur_id')
            groupe = Group.objects.get(id=groupe_id)
            utilisateur = UtilisateurPersonnalise.objects.get(id=utilisateur_id)
            utilisateur.groups.add(groupe)
            messages.success(request, f"{utilisateur.username} a été ajouté au groupe {groupe.name}")
            
        elif action == 'retirer_utilisateur':
            groupe_id = request.POST.get('groupe_id')
            utilisateur_id = request.POST.get('utilisateur_id')
            groupe = Group.objects.get(id=groupe_id)
            utilisateur = UtilisateurPersonnalise.objects.get(id=utilisateur_id)
            utilisateur.groups.remove(groupe)
            messages.success(request, f"{utilisateur.username} a été retiré du groupe {groupe.name}")
            
        return redirect('gestion_groupes')
    
    utilisateurs = UtilisateurPersonnalise.objects.all()
    permissions_disponibles = Permission.objects.all()
    
    context = {
        'groupes': groupes,
        'utilisateurs': utilisateurs,
        'permissions': permissions_disponibles,
        'modeles': modeles,  # Liste de dictionnaires avec les noms des modèles
    }
    return render(request, 'gestion_groupes.html', context)


@login_required
def gestion_utilisateurs(request):
    # Vérifier si l'utilisateur a le rôle 'admin'
    if not request.user.is_authenticated or not (request.user.role and request.user.role.name == 'admin'):
        messages.error(request, "Vous n'avez pas les permissions nécessaires.")
        return redirect('index')  # Remplacez 'home' par 'index' ou une URL définie

    utilisateurs = UtilisateurPersonnalise.objects.all()
    groupes = Group.objects.all()
    permissions = Permission.objects.all()

    # Récupérer les modèles avec leurs noms lisibles
    modeles = [
        {'name': model._meta.verbose_name.title(), 'model_name': model._meta.model_name}
        for model in apps.get_models() if model.__module__.startswith('gestion_utilisateur')
    ]

    if request.method == 'POST':
        user_id = request.POST.get('utilisateur_id')
        action = request.POST.get('action')
        utilisateur = UtilisateurPersonnalise.objects.get(id=user_id)

        if action == 'set_single_group':
            groupe_id = request.POST.get('groupe_id')
            # Clear all existing groups
            utilisateur.groups.clear()
            if groupe_id:
                groupe = Group.objects.get(id=groupe_id)
                utilisateur.groups.add(groupe)
                utilisateur.role = groupe  # Synchroniser le champ role avec le groupe
                utilisateur.save()
                messages.success(request, f"Le groupe de {utilisateur.username} a été mis à jour à {groupe.name}")
            else:
                messages.warning(request, f"Aucun groupe sélectionné pour {utilisateur.username}")

        elif action == 'valider_compte':
            utilisateur.valide = True
            utilisateur.save()
            messages.success(request, f"Le compte de {utilisateur.username} a été validé")

        return redirect('gestion_utilisateurs')

    context = {
        'utilisateurs': utilisateurs,
        'groupes': groupes,
        'permissions': permissions,
        'modeles': modeles,
    }
    return render(request, 'gestion_utilisateurs.html', context)

@csrf_exempt
def clear_groups(request):
    if request.method == 'POST':
        user_id = request.POST.get('utilisateur_id')
        utilisateur = UtilisateurPersonnalise.objects.get(id=user_id)
        utilisateur.groups.clear()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})


# Create your views here.
@permission_required("gestion_utilisateur.change_candidat", raise_exception=True)
def modifier_candidat(request, utilisateur_id):
    """ Vue pour modifier les informations d'un candidat """
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=utilisateur_id)

    try:
        candidat = utilisateur.candidat  # Accès au candidat lié à l'utilisateur
    except Candidat.DoesNotExist:
        messages.error(request, "Ce candidat n'existe pas.")
        return redirect('liste_utilisateurs')

    if request.method == "POST":
        form = CandidatForm(request.POST, request.FILES, instance=candidat)
        if form.is_valid():
            form.save()
            messages.success(request, "Informations mises à jour avec succès !")
            return redirect('liste_utilisateurs')
    else:
        form = CandidatForm(instance=candidat)

    return render(request, 'modifier_candidat.html', {'form': form, 'candidat': candidat})

@permission_required("gestion_utilisateur.change_client", raise_exception=True)
def modifier_client(request, utilisateur_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=utilisateur_id)
    
    try:
        client = utilisateur.client  # Accède au client lié à l'utilisateur
    except Client.DoesNotExist:
        messages.error(request, "Ce client n'existe pas.")
        return redirect('liste_utilisateurs')  # Rediriger si aucun client trouvé

    if request.method == "POST":
        form = ClientForm(request.POST, request.FILES, instance=client)
        if form.is_valid():
            form.save()
            messages.success(request, "Informations mises à jour avec succès !")
            return redirect('liste_utilisateurs')  # Rediriger après la modification
    else:
        form = ClientForm(instance=client)

    return render(request, 'modifier_client.html', {'form': form, 'client': client})

@permission_required("gestion_utilisateur.delete_utilisateurpersonnalise", raise_exception=True)
def supprimer_utilisateur(request, utilisateur_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=utilisateur_id)
    utilisateur.delete()
    messages.success(request, "Utilisateur supprimé avec succès.")
    return redirect("liste_utilisateurs")

@api_view(['POST'])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    print(f"Tentative de connexion pour l'email : {email}")

    # Vérifier si l'utilisateur existe avec cet email
    try:
        user = UtilisateurPersonnalise.objects.get(email=email)
    except UtilisateurPersonnalise.DoesNotExist:
        return JsonResponse({"error": "Utilisateur non trouvé"}, status=400)

    # Authentification avec username=email
    user = authenticate(username=user.username, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)

        # Vérifier le rôle et récupérer l'ID correspondant
        role_id = None
        if user.role.name == "client":
            try:
                client = Client.objects.get(utilisateur=user)
                role_id = client.id
            except Client.DoesNotExist:
                return JsonResponse({"error": "Aucun client associé à cet utilisateur."}, status=400)

        elif user.role.name == "candidat":
            try:
                candidat = Candidat.objects.get(utilisateur=user)
                role_id = candidat.id
            except Candidat.DoesNotExist:
                return JsonResponse({"error": "Aucun candidat associé à cet utilisateur."}, status=400)

        return JsonResponse({
            "token": token.key,
            "user_id": user.id,
            "role_id": role_id,  # ID du client ou du candidat
            "username": user.username,
            "role": user.role.name
        })

    else:
        return JsonResponse({"error": "Email ou mot de passe incorrect"}, status=400)

# @staff_member_required
# def valider_utilisateur(request, utilisateur_id):
#     utilisateur = get_object_or_404(UtilisateurPersonnalise, id=utilisateur_id)

#     if not utilisateur.valide:
#         utilisateur.valide = True
#         utilisateur.save()

#         try:
#             # Envoi d'un email de confirmation
#             send_mail(
#                 'Validation de votre compte',
#                 f'Bonjour {utilisateur.username},\n\nVotre compte a été validé par un administrateur. Vous pouvez maintenant vous connecter.\n\nCordialement,\nL\'équipe',
#                 settings.DEFAULT_FROM_EMAIL,
#                 [utilisateur.email],
#                 fail_silently=False,
#             )
#             # Message de succès
#             messages.success(request, f"Le compte de {utilisateur.username} a été validé avec succès.")
#         except Exception as e:
#             # Message d'erreur
#             messages.error(request, f"Erreur lors de l'envoi de l'e-mail : {e}")
        
#         # Ajouter un délai de 30 secondes avant la redirection
#         time.sleep(30)
    
#     # Redirection après le délai
#     return redirect('liste_utilisateurs')
@login_required
def afficher_permissions(request, user_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=user_id)
    print("pages/liste_utilisateurs.html pages/liste_utilisateurs.html")
    # Récupérer les permissions spécifiques de l'utilisateur
    user_permissions = [perm.name for perm in utilisateur.user_permissions.all()]
    
    # Récupérer les permissions héritées des groupes
    group_permissions = []
    for group in utilisateur.groups.all():
        group_permissions.extend([perm.name for perm in group.permissions.all()])
    
    # Combiner et supprimer les doublons
    all_permissions = list(set(user_permissions + group_permissions))
    
    data = {
        'username': utilisateur.username,
        'permissions': all_permissions if all_permissions else ["Aucune permission spécifique"],
    }
    
    return JsonResponse(data)


@login_required
def liste_utilisateurs(request):
    
    utilisateurs = UtilisateurPersonnalise.objects.all().order_by('-date_creation')
    all_users = []
    for utilisateur in utilisateurs:
        utilisateur.all_permissions = [perm.name for perm in utilisateur.user_permissions.all()] + \
                                     [perm.name for group in utilisateur.groups.all() for perm in group.permissions.all()]
        all_users.append(utilisateur)

    # Filter users by role
    clients = [u for u in all_users if u.role.name == 'client']
    candidats = [u for u in all_users if u.role.name == 'candidat']
    system_users = [u for u in all_users if u.role.name not in ['client', 'candidat']]
    groups = Group.objects.all()
    return render(request, 'liste_utilisateurs.html', {
        'utilisateurs': all_users,
        'clients': clients,
        'candidats': candidats,
        'system_users': system_users,
        'groups': groups,
    })


from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.conf import settings
from django.core.mail import send_mail

@staff_member_required
def valider_utilisateur(request, utilisateur_id):
    utilisateur = get_object_or_404(UtilisateurPersonnalise, id=utilisateur_id)

    # Inverser l'état de validation
    utilisateur.valide = not utilisateur.valide
    utilisateur.save()

    if utilisateur.valide:
        organisation = "Organisation non spécifiée"
        try:
            client = utilisateur.client  # Accéder au profil Client via la relation OneToOne
            organisation = client.libelle_fr if client.libelle_fr else "Organisation non spécifiée"
            # Envoi d'un email de confirmation
            send_mail(
                'Validation de votre compte',
                f"""Bonjour, 
                Nous sommes ravis de vous annoncer que votre organisation {organisation} a été confirmée avec succès !
                Vous pouvez désormais publier des offres d'emploi sur BETA Conseils en toute facilité.

                Informations de connexion :
                Login : {utilisateur.email}
                Mot de passe : Votre mot de passe d'inscription
                Gérer : {organisation}

                -----------------------------
                Beta Conseils
                Premier portail de recrutement et d'informations économiques en Mauritanie.""",
                settings.EMAIL_HOST_USER,
                [utilisateur.email],
                fail_silently=False,
            )
            messages.success(request, f"Le compte de {utilisateur.username} a été validé avec succès.")
        except Exception as e:
            messages.error(request, f"Erreur lors de l'envoi de l'e-mail : {e}")
    else:
        messages.warning(request, f"Le compte de {utilisateur.username} a été invalidé avec succès.")

    return redirect('liste_utilisateurs')


from django.shortcuts import get_object_or_404, redirect
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .models import UtilisateurPersonnalise


# def valider_utilisateur(request, utilisateur_id):
#     my_user = get_object_or_404(UtilisateurPersonnalise, id=utilisateur_id)
#     if not my_user.valide:
#         my_user.valide = True
#         my_user.save()
#         # Welcome email
#         subject = "Bienvenue sur Permis de travail"
#         message = (
#             f"Bienvenue {my_user.username},\n\n"
#             "Merci d'avoir choisi notre site.\n"
#             "Pour demander des permis, vous devez confirmer votre e-mail.\n"
#             "Merci.\n\nAhmedou, programmeur."
#         )
#         send_mail(subject, message, settings.EMAIL_HOST_USER, [my_user.email], fail_silently=False)
#         # Confirmation email
#         current_site = get_current_site(request)
#         email_subject = "Confirmez votre email, connectez-vous !"
#         context = {
#             'name': my_user.username,
#             'domain': current_site.domain,
#             'uid': urlsafe_base64_encode(force_bytes(my_user.pk)),
#         }
#         message_confirm = render_to_string(
#             'liste_utilisateurs.html',
#             context=context,
#             request=request
#         )
#         email = EmailMessage(email_subject, message_confirm, settings.EMAIL_HOST_USER, [my_user.email])
#         email.send()
#     return redirect('liste_utilisateurs')



from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework import status

@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])  # Gestion des fichiers et formulaires
def updatelogo_client_profile(request, client_id):
    print(client_id)
    try:
        client = get_object_or_404(Client, id=client_id)
        if "logo" in request.FILES:
            client.logo.save(
                request.FILES["logo"].name,
                ContentFile(request.FILES["logo"].read()),
                save=True  # Assure-toi que save=True pour enregistrer le fichier
            )
            client.save()
        return Response({
            "message": "Logo mis à jour avec succès",
            "logo_url": request.build_absolute_uri(client.logo.url) if client.logo else None
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
def delete_logo_client(request, client_id):
    try:
        client = get_object_or_404(Client, id=client_id)
        if client.logo:
            client.logo.delete(save=True)
            return Response({
                "message": "Logo supprimé avec succès",
                "logo_url": None
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Aucun logo à supprimer"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class CandidatDetailAPIView(APIView):
    def get(self, request, candidat_id):
        try:
            candidat = Candidat.objects.get(id=candidat_id)
            serializer = CandidatDetailSerializer(candidat)
            return Response(serializer.data)
        except Candidat.DoesNotExist:
            return Response({'error': 'Candidat non trouvé'}, status=404)



from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Candidat
from .serializers import CandidatDetailSerializer

class CandidatDetailView(APIView):
    def get(self, request, candidat_id):
        try:
            candidat = Candidat.objects.prefetch_related(
                'experiences', 'diplomes', 'langues', 'specialisations'
            ).get(id=candidat_id)
            serializer = CandidatDetailSerializer(candidat)
            return Response(serializer.data)
        except Candidat.DoesNotExist:
            return Response({'error': 'Candidat non trouvé'}, status=status.HTTP_404_NOT_FOUND)


# class CandidatDetailViewall(APIView):
#     def get(self, request):
#      try:
#         candidat = Candidat.objects.prefetch_related('experiences', 'diplomes', 'langues', 'specialisations').get()
#         print("Nombre de candidats :", candidat.count())  # 🔍 DEBUG
#         serializer = CandidatDetailSerializer(candidat)
#         print("Résultat de la sérialisation :", serializer.data)  # 🔍 DEBUG
#         return Response(serializer.data)
#      except Candidat.DoesNotExist:
#       return Response({'error': 'Candidat non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class CandidatDetailViewall(APIView):
    def get(self, request):
        try:
            # Fetch all candidates with related data
            candidats = Candidat.objects.prefetch_related(
                'experiences', 'diplomes', 'langues', 'specialisations'
            ).all()

            # Apply dynamic filters based on query parameters (optional)
            domaine = request.query_params.get('domaine')
            niv_etude = request.query_params.get('niv_etude')
            niv_exp = request.query_params.get('niv_exp')
            genre = request.query_params.get('genre')
            langue = request.query_params.get('langue')

            if domaine and domaine != 'all':
                candidats = candidats.filter(specialisations__domaine=domaine)
            if niv_etude and niv_etude != 'all':
                candidats = candidats.filter(specialisations__niveaux_etude=niv_etude)
            if niv_exp and niv_exp != 'all':
                candidats = candidats.filter(experiences__poste=niv_exp)
            if genre and genre != 'all':
                candidats = candidats.filter(genre=genre)
            if langue and langue != 'all':
                candidats = candidats.filter(langues__langue=langue)

            # Serialize the queryset
            serializer = CandidatDetailSerializer(candidats, many=True)
            print(f"Nombre de candidats : {candidats.count()}")  # 🔍 DEBUG
            print(f"Résultat de la sérialisation : {serializer.data}")  # 🔍 DEBUG
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClientCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Client ajouté avec succès.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

























# ---------------------------------------------------------------------------------------------

@api_view(['POST'])
def modifier_utilisateur_api(request):
    """API pour modifier les coordonnées d'un utilisateur et/ou son profil"""
    if request.method == 'POST':
        # Toujours utiliser handle_combined_update pour traiter les deux onglets
        return handle_combined_update(request)
    
    return JsonResponse({
        'success': False,
        'error': 'Méthode non autorisée'
    })

@api_view(['GET'])
def get_client_profile(request, user_id):
    """Récupérer le profil client pour le modal de modification"""
    try:
        utilisateur = UtilisateurPersonnalise.objects.get(id=user_id)
        print(f"Utilisateur trouvé: {utilisateur.username}")
        
        client = utilisateur.client
        print(f"Client trouvé: {client.libelle_fr}")
        print(f"Client ID: {client.id}")
        print(f"Client libelle_fr: {client.libelle_fr}")
        print(f"Client email: {client.email}")
        
        response_data = {
            'success': True,
            'client': {
                'id': client.id,
                'libelle_fr': client.libelle_fr,
                'libelle_ar': client.libelle_ar,
                'tel': client.tel,
                'email_client': client.email,
                'domaine': client.domaine,
                'type_organisation': client.type_organisation,
                'adresse': client.adresse,
                'lieu': client.lieu,
                'fax': client.fax,
                'nom_responsable': client.nom_responsable,
                'fonction_responsable': client.fonction_responsable,
                'email_responsable': client.email_responsable,
                'tel_responsable': client.tel_responsable,
                'site_web': client.site_web,
                'special': client.special,
            }
        }
        print(f"Response data: {response_data}")
        return JsonResponse(response_data)
    except UtilisateurPersonnalise.DoesNotExist:
        print(f"Utilisateur avec ID {user_id} non trouvé")
        return JsonResponse({
            'success': False,
            'error': 'Utilisateur non trouvé'
        })
    except Client.DoesNotExist:
        print(f"Client pour utilisateur {user_id} non trouvé")
        return JsonResponse({
            'success': False,
            'error': 'Client non trouvé'
        })
    except Exception as e:
        print(f"Erreur inattendue: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': f'Erreur inattendue: {str(e)}'
        })

@api_view(['POST'])
def modifier_profile_api(request):
    """API pour modifier le profil client et envoyer un mail si login, mot de passe ou libellé changent"""
    if request.method == 'POST':
        client_id = request.POST.get('client_id')
        new_libelle_fr = request.POST.get('libelle_fr')
        new_email = request.POST.get('email')
        new_password = request.POST.get('password')  # Si tu veux permettre la modif du mot de passe ici
        
        try:
            client = Client.objects.get(id=client_id)
            utilisateur = client.utilisateur
            old_libelle_fr = client.libelle_fr
            old_email = client.email
            old_username = utilisateur.username
            old_password = None  # On ne peut pas comparer le hash, donc on ne détecte que si un nouveau mot de passe est fourni

            form = ClientForm(request.POST, request.FILES, instance=client)
            
            if form.is_valid():
                form.save()
                # Mettre à jour le mot de passe si fourni
                password_changed = False
                if new_password:
                    utilisateur.set_password(new_password)
                    utilisateur.save()
                    password_changed = True
                # Vérifier si login/email/libellé ont changé
                login_changed = (old_email != new_email) or (old_username != new_email)
                libelle_changed = (old_libelle_fr != new_libelle_fr)
                # Envoyer un mail si un des champs critiques a changé
                if login_changed or password_changed or libelle_changed:
                    subject = "Modification de votre profil client"
                    message = (
                        f"Bonjour,\n"
                        f"Votre profil client a été modifié. Voici les nouvelles informations :\n"
                        f"Login : {utilisateur.username}\n"
                        f"Email : {client.email}\n"
                        f"Gérer (Organisation) : {client.libelle_fr}\n"
                        f"{'Nouveau mot de passe : ' + new_password if password_changed else ''}\n"
                        f"-----------------------------\n"
                        f"Beta Conseils\n"
                        f"Premier portail de recrutement et d'informations économiques en Mauritanie."
                    )
                    try:
                        send_mail(
                            subject=subject,
                            message=message,
                            from_email="betamessagerie@gmail.com",
                            recipient_list=[client.email],
                            fail_silently=False,
                        )
                    except Exception as e:
                        print(f"Erreur lors de l'envoi de l'email : {str(e)}")
                return JsonResponse({
                    'success': True,
                    'message': 'Profil modifié avec succès' + (" et email envoyé" if (login_changed or password_changed or libelle_changed) else "")
                })
            else:
                errors = {}
                for field, field_errors in form.errors.items():
                    errors[field] = [str(error) for error in field_errors]
                return JsonResponse({
                    'success': False,
                    'errors': errors
                })
                
        except Client.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Client non trouvé'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Erreur lors de la modification : {str(e)}'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Méthode non autorisée'
    })



@permission_required("gestion_utilisateur.add_utilisateurpersonnalise", raise_exception=True)
def creer_utilisateur_popup(request):
    """Vue pour le popup intégré de création d'utilisateur et modification de profil"""
    User = get_user_model()
    
    if request.method == "POST":
        action = request.POST.get('action')
        send_email = request.POST.get('send_email', 'false') == 'true'
        
        if action == 'generer':
            # Logique pour la génération automatique
            email = request.POST.get("email")
            is_client = request.POST.get("is_client") == "on"
            
            # Récupérer le dernier client créé
            last_client = Client.objects.order_by('-utilisateur__date_joined').first()
            if last_client and last_client.utilisateur.username.startswith("emp_"):
                last_num = int(last_client.utilisateur.username.split('_')[1].split('@')[0])
                start_num = last_num + 1
            else:
                start_num = 1

            username = f"emp_{start_num:04d}@beta.mr"
            while User.objects.filter(username=username).exists():
                start_num += 1
                username = f"emp_{start_num:04d}@beta.mr"

            characters = string.ascii_letters + string.digits + string.punctuation
            password = ''.join(random.choice(characters) for i in range(12))

            try:
                utilisateur = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    date_joined=timezone.now()
                )
                
                role_name = "client" if is_client else "candidat"
                role_group, _ = Group.objects.get_or_create(name=role_name)
                utilisateur.role = role_group
                utilisateur.groups.add(role_group)
                utilisateur.save()

                if is_client:
                    client = Client.objects.create(utilisateur=utilisateur)
                    client.libelle_fr = "TRANSAC SA (GROUPE AZIZI)"
                    client.save()
                    
                    # Retourner les données du client créé pour le formulaire de profil
                    return JsonResponse({
                        'success': True,
                        'message': 'Utilisateur créé avec succès',
                        'client_id': client.id,
                        'utilisateur_id': utilisateur.id,
                        'username': username,
                        'password': password
                    })
                else:
                    Candidat.objects.create(utilisateur=utilisateur)
                    return JsonResponse({
                        'success': True,
                        'message': 'Candidat créé avec succès',
                        'utilisateur_id': utilisateur.id,
                        'username': username,
                        'password': password
                    })

            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'error': f"Erreur lors de la création : {str(e)}"
                })
                
        elif action == 'manuel':
            # Logique pour la création manuelle
            form = UtilisateurForm(request.POST)
            if form.is_valid():
                try:
                    utilisateur = form.save()
                    
                    if utilisateur.role and utilisateur.role.name == "client":
                        client = Client.objects.create(utilisateur=utilisateur)
                        return JsonResponse({
                            'success': True,
                            'message': 'Utilisateur créé avec succès',
                            'client_id': client.id,
                            'utilisateur_id': utilisateur.id,
                            'username': utilisateur.username,
                            'password': 'Mot de passe défini manuellement'
                        })
                    elif utilisateur.role and utilisateur.role.name == "candidat":
                        Candidat.objects.create(utilisateur=utilisateur)
                        return JsonResponse({
                            'success': True,
                            'message': 'Candidat créé avec succès',
                            'utilisateur_id': utilisateur.id,
                            'username': utilisateur.username,
                            'password': 'Mot de passe défini manuellement'
                        })
                    else:
                        return JsonResponse({
                            'success': True,
                            'message': 'Utilisateur créé avec succès',
                            'utilisateur_id': utilisateur.id,
                            'username': utilisateur.username,
                            'password': 'Mot de passe défini manuellement'
                        })
                        # print("=========")
                        # messages.success(request, f"Le compte de {utilisateur.username} a été créé avec succès.")
                        # return redirect('liste_utilisateurs')
                except Exception as e:
                    return JsonResponse({
                        'success': False,
                        'error': f"Erreur lors de la création : {str(e)}"
                    })
            else:
                errors = {}
                for field, field_errors in form.errors.items():
                    errors[field] = [str(error) for error in field_errors]
                return JsonResponse({
                    'success': False,
                    'errors': errors
                })
                
        elif action == 'update_profile':
            # Logique pour la mise à jour du profil client
            client_id = request.POST.get('client_id')
            pending_user_data = request.POST.get('pending_user_data')
            
            try:
                client = Client.objects.get(id=client_id)
                form = ClientForm(request.POST, request.FILES, instance=client)
                if form.is_valid():
                    form.save()
                    
                    # Envoyer l'email seulement si demandé et si on a les données utilisateur
                    if send_email and pending_user_data:
                        try:
                            user_data = json.loads(pending_user_data)
                            subject = "Vos identifiants de connexion"
                            message = (
                                "Bonjour,\n"
                                "Nous sommes ravis de vous annoncer que votre organisation a été confirmée avec succès ! "
                                "Vous pouvez désormais publier des offres d'emploi sur BETA Conseils en toute facilité.\n"
                                "Informations de connexion :\n"
                                f"Login : {user_data.get('username', '')}\n"
                                f"Mot de passe : {user_data.get('password', 'Votre mot de passe d' + chr(39) + 'inscription')}\n"
                                f"Gérer : {client.libelle_fr}\n"
                                "-----------------------------\n"
                                "Beta Conseils\n"
                                "Premier portail de recrutement et d'informations économiques en Mauritanie."
                            )
                            send_mail(
                                subject=subject,
                                message=message,
                                from_email="betamessagerie@gmail.com",
                                recipient_list=[user_data.get('email', '')],
                                fail_silently=False,
                            )
                        except Exception as e:
                            # Log l'erreur mais ne pas faire échouer la sauvegarde du profil
                            print(f"Erreur lors de l'envoi de l'email : {str(e)}")
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Profil mis à jour avec succès'
                    })
                else:
                    errors = {}
                    for field, field_errors in form.errors.items():
                        errors[field] = [str(error) for error in field_errors]
                    return JsonResponse({
                        'success': False,
                        'errors': errors
                    })
            except Client.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Client non trouvé'
                })
    
    # GET request - afficher le formulaire
    form = UtilisateurForm()
    client_form = ClientForm()
    
    return render(request, 'creer_utilisateur_popup.html', {
        'form': form,
        'client_form': client_form,
    })


def handle_combined_update(request):
    """Gérer la modification combinée utilisateur + profil avec gestion d'erreurs améliorée"""
    import re
    
    user_id = request.POST.get('user_id')
    client_id = request.POST.get('client_id')
    
    user_errors = {}
    profile_errors = {}
    
    try:
        # Validation et modification utilisateur
        utilisateur = UtilisateurPersonnalise.objects.get(id=user_id)
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')
        
        # Debug: Afficher les valeurs reçues
        print(f"DEBUG - user_id: {user_id}")
        print(f"DEBUG - client_id: {client_id}")
        print(f"DEBUG - username: '{username}'")
        print(f"DEBUG - email: '{email}'")
        print(f"DEBUG - password: {'fourni' if password else 'non fourni'}")
        print(f"DEBUG - password_confirm: {'fourni' if password_confirm else 'non fourni'}")
        
        # Validation détaillée des champs utilisateur
        if not username:
            user_errors['username'] = ['Le nom d\'utilisateur est obligatoire']
        elif len(username) < 3:
            user_errors['username'] = ['Le nom d\'utilisateur doit contenir au moins 3 caractères']
        elif len(username) > 30:
            user_errors['username'] = ['Le nom d\'utilisateur ne peut pas dépasser 30 caractères']
        elif username != utilisateur.username:
            if UtilisateurPersonnalise.objects.filter(username=username).exclude(id=user_id).exists():
                user_errors['username'] = ['Ce nom d\'utilisateur est déjà utilisé par un autre compte']
        
        if not email:
            user_errors['email'] = ['L\'adresse email est obligatoire']
        elif '@' not in email or '.' not in email:
            user_errors['email'] = ['Veuillez saisir une adresse email valide']
        elif email != utilisateur.email:
            if UtilisateurPersonnalise.objects.filter(email=email).exclude(id=user_id).exists():
                user_errors['email'] = ['Cette adresse email est déjà utilisée par un autre compte']
        
        # Validation du mot de passe (sans contraintes de complexité)
        if password:
            if password != password_confirm:
                user_errors['password'] = ['Les mots de passe ne correspondent pas. Veuillez les saisir à nouveau']
        
        # Validation et modification profil client (si client_id est fourni)
        profile_form = None
        if client_id:
            try:
                client = Client.objects.get(id=client_id)
                
                profile_form = ClientForm(request.POST, request.FILES, instance=client)
                if not profile_form.is_valid():
                    # Améliorer les messages d'erreur du formulaire
                    for field, errors in profile_form.errors.items():
                        field_name = field
                        custom_errors = []
                        for error in errors:
                            if 'required' in error.lower():
                                custom_errors.append('Ce champ est obligatoire')
                            elif 'max_length' in error.lower():
                                max_length = profile_form.fields[field].max_length if hasattr(profile_form.fields[field], 'max_length') else 'la limite'
                                custom_errors.append(f'Ce champ ne peut pas dépasser {max_length} caractères')
                            elif 'invalid' in error.lower():
                                if 'email' in field.lower():
                                    custom_errors.append('Veuillez saisir une adresse email valide')
                                elif 'url' in field.lower():
                                    custom_errors.append('Veuillez saisir une URL valide')
                                else:
                                    custom_errors.append('Format invalide')
                            else:
                                custom_errors.append(str(error))
                        
                        profile_errors[field_name] = custom_errors
            except Client.DoesNotExist:
                profile_errors['client'] = ['❌ Profil client non trouvé. Veuillez contacter l\'administrateur.']
        
        # S'il y a des erreurs, les retourner
        if user_errors or profile_errors:
            return JsonResponse({
                'success': False,
                'errors': {
                    'user_errors': user_errors,
                    'profile_errors': profile_errors
                }
            })
        
        # Si pas d'erreurs, procéder aux modifications
        old_email = utilisateur.email
        old_username = utilisateur.username
        
        print(f"DEBUG - Avant modification:")
        print(f"  - Ancien username: '{old_username}'")
        print(f"  - Ancien email: '{old_email}'")
        print(f"  - Nouveau username: '{username}'")
        print(f"  - Nouveau email: '{email}'")
        print(f"  - Password fourni: {'oui' if password else 'non'}")
        
        # Modifier l'utilisateur
        if password:
            print(f"DEBUG - Modification du mot de passe")
            utilisateur.set_password(password)
        
        utilisateur.username = username
        utilisateur.email = email
        
        print(f"DEBUG - Sauvegarde de l'utilisateur...")
        
        # Sauvegarder l'utilisateur avec save() pour inclure le mot de passe
        try:
            utilisateur.save()
            print(f"DEBUG - Utilisateur sauvegardé avec save()")
        except Exception as e:
            print(f"DEBUG - Erreur avec save(): {str(e)}")
            # Fallback: utiliser update() seulement pour username et email
            UtilisateurPersonnalise.objects.filter(id=user_id).update(
                username=username,
                email=email
            )
            print(f"DEBUG - Utilisateur sauvegardé avec update() (fallback)")
        
        # Recharger l'utilisateur pour avoir les données à jour
        utilisateur.refresh_from_db()
        
        # Modifier le profil client (si disponible)
        if profile_form:
            email_client = request.POST.get('email_client')
            if email_client:
                # Assigner la valeur de email_client au champ email de l'instance client
                client.email = email_client
                # Sauvegarder l'instance client directement pour persister email
                client.save()
            # Sauvegarder les autres champs du formulaire
            
            profile_form.save()
        
        # Envoyer un email de notification si les coordonnées ont changé
        if old_email != email or old_username != username or password:
            subject = "Modification de vos coordonnées de connexion"
            message = (
                f"Bonjour,\n"
                f"Vos coordonnées de connexion ont été modifiées :\n"
                f"Ancien nom d'utilisateur : {old_username}\n"
                f"Nouveau nom d'utilisateur : {username}\n"
                f"Ancien email : {old_email}\n"
                f"Nouveau email : {email}\n"
                f"{'Nouveau mot de passe : ' + password if password else ''}\n"
                f"-----------------------------\n"
                f"Beta Conseils\n"
                f"Premier portail de recrutement et d'informations économiques en Mauritanie."
            )
            
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email="betamessagerie@gmail.com",
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Erreur lors de l'envoi de l'email : {str(e)}")
        
        # Déterminer le message de succès approprié
        if profile_form:
            message = '✅ Utilisateur et profil modifiés avec succès ! Les modifications ont été enregistrées.'
        else:
            message = '✅ Utilisateur modifié avec succès ! Les modifications ont été enregistrées.'
        
        return JsonResponse({
            'success': True,
            'message': message
        })
        
    except UtilisateurPersonnalise.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': '❌ Utilisateur non trouvé. Veuillez rafraîchir la page et réessayer.'
        })
    except Exception as e:
        print(f"Erreur lors de la modification: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': '❌ Une erreur inattendue s\'est produite. Veuillez réessayer ou contacter l\'administrateur.'
        })

