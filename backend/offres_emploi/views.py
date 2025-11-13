from venv import logger
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import AuthenticationForm ,UserCreationForm
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import datetime, date
from django.http import JsonResponse
from django.db.models import Count, Q
from django.contrib.admin.views.decorators import staff_member_required
from .models import *
from gestion_utilisateur.models import *
from avis_infos.models import *
from appels_offres.models import *
from gestion_utilisateur.urls import *
from avis_infos.urls import *
from appels_offres.urls import *
from appels_offres.models import *
from avis_infos.models import *

from .forms import *
from gestion_utilisateur.forms import *
from django.forms import formset_factory, inlineformset_factory
from django.views.decorators.csrf import csrf_exempt
from .models import OffreEmploi
import base64
from rest_framework.decorators import api_view , parser_classes
from rest_framework.response import Response
from django.db.models.functions import TruncMonth
import base64
from django.conf import settings
from django.core.mail import send_mail
import time
from rest_framework import status
import json
from rest_framework.authtoken.models import Token
from .serializers import  OffreEmploiSerializer,  ClientSerializer ,CandidatSerializer
from urllib.parse import urljoin
from django.utils.html import strip_tags
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.http import require_GET
from rest_framework.parsers import MultiPartParser, FormParser
from appels_offres.decorators import has_any_permission_for_model
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.base import ContentFile

# from .serializers import UserSerializer
from .serializers import UtilisateurSerializer
from django.utils import timezone

# offres_emploi/views.py
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from offres_emploi.models import OffreEmploi
from appels_offres.models import AppelOffre
from avis_infos.models import AvisInfos
from gestion_utilisateur.models import Client, UtilisateurPersonnalise

def base_cv(request):

    return render(request, 'base_cv.html')

def parametre(request):

    return render(request, 'parametre.html')

# views.py
def traduction_offre(request):
    # Récupérer toutes les offres d'emploi avec le nombre d'offres publiées du client
    
    offres = OffreEmploi.objects.filter(
        si_archiver=False
    ).annotate(
        nombre_offres_publiees=Count('client__offres_emploi', filter=Q(client__offres_emploi__si_valider=True))
    ).order_by('-date_creation')

    
    # Actions de l'administrateur
    if request.method == 'POST':
        action = request.POST.get('action')
        offre_id = request.POST.get('offre_id')

        if action and offre_id:
            offre = get_object_or_404(OffreEmploi, id=offre_id)

            # if action == 'publier':
            #     if offre.si_valider:  # Vérifier si l'offre est validée
            #         offre.si_valider = True
            #         offre.save()
            #         messages.success(request, f"L'offre '{offre.titre}' a été publiée.")
            #     else:
            #         messages.error(request, f"L'offre '{offre.titre}' ne peut pas être publiée car elle n'est pas validée.")
            # elif action == 'depublier':
            #     offre.si_publier = False
            #     offre.save()
            #     messages.success(request, f"L'offre '{offre.titre}' a été dépubliée.")
            if action == 'valider':
                if request.user.has_perm('offres_emploi.valider_offreemploi'):
                    offre.si_valider = True
                    offre.valider_par = request.user
                    # Only set date_mise_en_ligne if not already set
                    if not offre.date_mise_en_ligne:
                        offre.date_mise_en_ligne = timezone.now()
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été validée.")
            elif action == 'invalider':
                if request.user.has_perm('offres_emploi.valider_offreemploi'):
                    offre.si_valider = False
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été invalidée et dépubliée.")
            elif action == 'supprimer':
                if request.user.has_perm('offres_emploi.delete_offreemploi'):
                    offre.delete()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été supprimée.")
            elif action == 'modifier':
                if request.user.has_perm('offres_emploi.change_offreemploi'):
                    return redirect('modifier_offre', offre_id=offre.id)
            elif action == 'details':
                if request.user.has_perm('offres_emploi.view_offreemploi'):
                    return redirect('detail_offre', offre_id=offre.id)
            elif action == 'groupement':
                if request.user.has_perm('offres_emploi.grouper_offreemploi'):
                    return redirect('groupement_offres', offre_id=offre.id)

    return render(request, 'traduction.html', {
        'offres': offres,
    })
# @login_required
# @permission_required('offres_emploi.change_offreemploi', raise_exception=True)
def traduire_offre(request, offre_id):
    offre = get_object_or_404(OffreEmploi, id=offre_id)

    # --- Suppression d’un document existant ---
    if request.method == 'POST' and request.POST.get('action') == 'supprimer':
        doc_id = request.POST.get('delete_doc_id')

        try:
            doc = Document.objects.get(id=doc_id, offre_emploi=offre)
            doc.delete()
            messages.success(request, "Document supprimé avec succès.")
        except Document.DoesNotExist:
            messages.error(request, "Document introuvable ou non autorisé.")
        return redirect('traduire_offre', offre_id=offre.id)

    # Form de traduction et formset new (reste inchangé)…
    form_offre = TraductionOffreForm(request.POST or None, instance=offre)
    DocumentFormSet = inlineformset_factory(
        OffreEmploi, Document,
        form=DocumentForms,
        extra=1,
        can_delete=False
    )
    formset_new = DocumentFormSet(
        request.POST or None,
        request.FILES or None,
        instance=offre,
        queryset=Document.objects.none()
    )

    if request.method == 'POST' and form_offre.is_valid() and formset_new.is_valid():
        form_offre.save()
        formset_new.save()
        messages.success(request, "Traduction et nouveaux documents enregistrés.")
        return redirect('admin_offres')

    docs_exist = offre.documents.all()
    return render(request, 'traduction_offres_emploi.html', {
        'form':        form_offre,
        'formset_new': formset_new,
        'docs_exist':  docs_exist,
        'offre':       offre,
    })



    

def export_pdf(request):
    try:
        # Récupérer les filtres
        date_debut = request.GET.get('date_debut')
        date_fin = request.GET.get('date_fin')
        client_id = request.GET.get('client')
        utilisateur_id = request.GET.get('utilisateur')
        categorie = request.GET.get('categorie')

        # Initialiser une liste pour stocker toutes les annonces
        annonces = []

        # Filtrer les offres d'emploi
        offres_emploi = OffreEmploi.objects.filter(Q(si_valider=True) | Q(si_archiver=True))
        if date_debut:
            offres_emploi = offres_emploi.filter(date_mise_en_ligne__date__gte=date_debut)
        if date_fin:
            offres_emploi = offres_emploi.filter(date_mise_en_ligne__date__lte=date_fin)
        if client_id:
            offres_emploi = offres_emploi.filter(client_id=client_id)
        if utilisateur_id:
            offres_emploi = offres_emploi.filter(valider_par_id=utilisateur_id)
        if categorie and categorie == 'offre_emploi':
            annonces.extend(offres_emploi)

        # Filtrer les appels d'offres
        appels_offres = AppelOffre.objects.filter(Q(si_valider=True) | Q(si_archiver=True))
        if date_debut:
            appels_offres = appels_offres.filter(date_mise_en_ligne__date__gte=date_debut)
        if date_fin:
            appels_offres = appels_offres.filter(date_mise_en_ligne__date__lte=date_fin)
        if client_id:
            appels_offres = appels_offres.filter(client_id=client_id)
        if utilisateur_id:
            appels_offres = appels_offres.filter(valider_par_id=utilisateur_id)
        if categorie and categorie == 'appel_offre':
            annonces.extend(appels_offres)

        # Filtrer les avis et infos
        avis_infos = AvisInfos.objects.filter(Q(si_valider=True) | Q(si_archiver=True))
        if date_debut:
            avis_infos = avis_infos.filter(date_mise_en_ligne__date__gte=date_debut)
        if date_fin:
            avis_infos = avis_infos.filter(date_mise_en_ligne__date__lte=date_fin)
        if client_id:
            avis_infos = avis_infos.filter(client_id=client_id)
        if utilisateur_id:
            avis_infos = avis_infos.filter(valider_par_id=utilisateur_id)
        if categorie and categorie == 'avis_infos':
            annonces.extend(avis_infos)

        # Si aucune catégorie n'est sélectionnée, inclure toutes les annonces
        if not categorie:
            annonces.extend(offres_emploi)
            annonces.extend(appels_offres)
            annonces.extend(avis_infos)

        # Ajouter un attribut type_display à chaque annonce
        for annonce in annonces:
            if isinstance(annonce, OffreEmploi):
                annonce.type_display = "Offre d'emploi"
            elif isinstance(annonce, AppelOffre):
                annonce.type_display = "Appel d'offre"
            elif isinstance(annonce, AvisInfos):
                annonce.type_display = "Avis et infos"
            else:
                annonce.type_display = "Inconnu"
        # Trier les annonces par date_mise_en_ligne
        def get_date_mise_en_ligne(annonce):
            date_value = annonce.date_mise_en_ligne
            # Convertir date en datetime si nécessaire
            if isinstance(date_value, date) and not isinstance(date_value, datetime):
                return datetime.combine(date_value, datetime.min.time())
            return date_value or datetime.min  # Gestion des valeurs None

        annonces.sort(key=get_date_mise_en_ligne, reverse=True)

        # Récupérer les clients et utilisateurs pour les filtres
        clients = Client.objects.all()
        utilisateurs = UtilisateurPersonnalise.objects.all()  # Appliquez un filtre par rôle si nécessaire

        # Contexte pour le template PDF
        context = {
            'annonces': annonces,
            'clients': clients,
            'utilisateurs': utilisateurs,
            'date_debut': date_debut,
            'date_fin': date_fin,
            'selected_client': client_id,
            'selected_utilisateur': utilisateur_id,
            'selected_categorie': categorie,
        }

        # Rendre le template HTML pour le PDF
        html_string = render_to_string('porte_feuille_pdf.html', context)

        # Générer le PDF en mémoire (avec base_url pour résoudre les ressources)
        html = HTML(string=html_string, base_url=request.build_absolute_uri('/'))
        pdf_bytes = html.write_pdf()

        # Renvoyer la réponse avec le PDF en pièce jointe
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="porte_feuille_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf"'

        return response

    except Exception as e:
        messages.error(request, f"Erreur lors de la génération du PDF : {str(e)}")
        return redirect('porte_feuille')
    
def porte_feuille(request):
    # Récupérer les filtres
    date_debut = request.GET.get('date_debut')
    date_fin = request.GET.get('date_fin')
    client_id = request.GET.get('client')
    utilisateur_id = request.GET.get('utilisateur')
    categorie = request.GET.get('categorie')

    # Initialiser une liste pour stocker toutes les annonces
    annonces = []

    # Filtrer les offres d'emploi
    offres_emploi = OffreEmploi.objects.filter(Q(si_valider=True) | Q(si_archiver=True))
    if date_debut:
        offres_emploi = offres_emploi.filter(date_mise_en_ligne__date__gte=date_debut)
    if date_fin:
        offres_emploi = offres_emploi.filter(date_mise_en_ligne__date__lte=date_fin)
    if client_id:
        offres_emploi = offres_emploi.filter(client_id=client_id)
    if utilisateur_id:
        offres_emploi = offres_emploi.filter(valider_par_id=utilisateur_id)
    if categorie and categorie == 'offre_emploi':
        annonces.extend(offres_emploi)

    # Filtrer les appels d'offres
    appels_offres = AppelOffre.objects.filter(Q(si_valider=True) | Q(si_archiver=True))
    if date_debut:
        appels_offres = appels_offres.filter(date_mise_en_ligne__date__gte=date_debut)
    if date_fin:
        appels_offres = appels_offres.filter(date_mise_en_ligne__date__lte=date_fin)
    if client_id:
        appels_offres = appels_offres.filter(client_id=client_id)
    if utilisateur_id:
        appels_offres = appels_offres.filter(valider_par_id=utilisateur_id)
    if categorie and categorie == 'appel_offre':
        annonces.extend(appels_offres)

    # Filtrer les avis et infos
    avis_infos = AvisInfos.objects.filter(Q(si_valider=True) | Q(si_archiver=True))
    if date_debut:
        avis_infos = avis_infos.filter(date_mise_en_ligne__date__gte=date_debut)
    if date_fin:
        avis_infos = avis_infos.filter(date_mise_en_ligne__date__lte=date_fin)
    if client_id:
        avis_infos = avis_infos.filter(client_id=client_id)
    if utilisateur_id:
        avis_infos = avis_infos.filter(valider_par_id=utilisateur_id)
    if categorie and categorie == 'avis_infos':
        annonces.extend(avis_infos)
        
    # Si aucune catégorie n'est sélectionnée, inclure toutes les annonces
    if not categorie:
        annonces.extend(offres_emploi)
        annonces.extend(appels_offres)
        annonces.extend(avis_infos)
    
    # Trier les annonces par date
    annonces.sort(key=lambda x: x.date_mise_en_ligne, reverse=True)

    # Récupérer les clients et utilisateurs pour les filtres
    clients = Client.objects.all()
    utilisateurs = UtilisateurPersonnalise.objects.filter(
        role__name__in=['admin', 'commercial', 'traducteur']
    ).distinct()
    # utilisateurs = UtilisateurPersonnalise.objects.filter(role__in = ['admin', 'commercial', 'traducteur'])  # Filtrer par rôle 'admin'

    context = {
        'annonces': annonces,
        'clients': clients,
        'utilisateurs': utilisateurs,
        'date_debut': date_debut,
        'date_fin': date_fin,
        'selected_client': client_id,
        'selected_utilisateur': utilisateur_id,
        'selected_categorie': categorie,
    }
    return render(request, 'porte_feuille.html', context)


# views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Publicite
from .forms import PubliciteForm
from django.contrib.auth.decorators import login_required, permission_required

@login_required
@permission_required('offres_emploi.view_publicite', raise_exception=True)
def liste_publicites(request):
    # Récupérer toutes les publicités
    publicites = Publicite.objects.all().order_by('-date_creation')  # Tri par date de création (plus récent d'abord)
    
    # Contexte à passer au template
    context = {
        'publicites': publicites,
    }
    
    return render(request, 'publicite.html', context)

@login_required
@permission_required('offres_emploi.add_publicite', raise_exception=True)
def creer_publicite(request):
    if request.method == 'POST':
        form = PubliciteForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Publicité créée avec succès.')
            return redirect('liste_publicites')
    else:
        form = PubliciteForm()
    return render(request, 'pages/creer_publicite.html', {'form': form})

@login_required
@permission_required('offres_emploi.change_publicite', raise_exception=True)
def modifier_publicite(request, publicite_id):
    publicite = get_object_or_404(Publicite, id=publicite_id)
    if request.method == 'POST':
        form = PubliciteForm(request.POST, request.FILES, instance=publicite)
        if form.is_valid():
            form.save()
            messages.success(request, 'Publicité modifiée avec succès.')
            return redirect('liste_publicites')
    else:
        form = PubliciteForm(instance=publicite)
    return render(request, 'pages/modifier_publicite.html', {'form': form, 'publicite': publicite})

@login_required
@permission_required('offres_emploi.delete_publicite', raise_exception=True)
def supprimer_publicite(request, publicite_id):
    publicite = get_object_or_404(Publicite, id=publicite_id)
    if request.method == 'POST':
        publicite.delete()
        messages.success(request, 'Publicité supprimée avec succès.')
        return redirect('liste_publicites')
    return render(request, 'supprimer_publicite.html', {'publicite': publicite})






@permission_required("offres_emploi.add_offreemploi", raise_exception=True)
def creer_offre_admin(request):
    DocumentFormSet = formset_factory(DocumentForm, extra=0)  # Formulaire dynamique pour les documents

    if request.method == 'POST':
        offre_form = OffreEmploiForm(request.POST)
        document_formset = DocumentFormSet(request.POST, request.FILES)

        if offre_form.is_valid() :
            offre = offre_form.save()  # Sauvegarder l'offre
            if document_formset.is_valid():
                for form in document_formset:
                    document = form.save(commit=False)
                    document.offre_emploi = offre  # Associer le document à l'offre
                    document.save()
            return redirect('admin_offres')  # Rediriger après succès

    else:
        offre_form = OffreEmploiForm()
        document_formset = DocumentFormSet()

    return render(request, 'creer_offre.html', {
        'offre_form': offre_form,
        'document_formset': document_formset,
    })

@login_required
def aucun_acee(request):
    return render(request, 'aucun_acee.html', {})

#

import logging

logger = logging.getLogger(__name__)

def has_any_permission_for_model_vue(user, app_label, model_name):
    """
    Vérifie si l'utilisateur a au moins une permission pour le modèle spécifié.
    Reproduit la logique des filtres has_any_permission_*.
    """
    try:
        content_type = ContentType.objects.get(app_label=app_label, model=model_name.lower())
        permissions = Permission.objects.filter(content_type=content_type)
        has_perm = any(user.has_perm(f'{app_label}.{perm.codename}') for perm in permissions)
        logger.debug(f"Vérification permissions pour {app_label}.{model_name} pour {user}: {has_perm}")
        return has_perm, [f'{app_label}.{perm.codename}' for perm in permissions if user.has_perm(f'{app_label}.{perm.codename}')]
    except ContentType.DoesNotExist:
        logger.error(f"ContentType non trouvé pour {app_label}.{model_name}")
        return False, []

@login_required
def accueil(request):
    """
    Vue d'accueil qui redirige l'utilisateur en fonction de ses permissions.
    - Si aucune permission, redirige vers 'aucun_acee'.
    - Sinon, redirige vers l'URL associée à la première permission trouvée.
    """
    # Compter toutes les permissions de l'utilisateur
    permissions = request.user.get_all_permissions()
    perm_count = len(permissions)
    
    if perm_count == 0:
        logger.debug(f"Aucune permission pour {request.user}: redirection vers aucun_acee")
        return redirect('aucun_acee')
    
    # Définir les modèles à vérifier avec leurs applications et URLs correspondantes
    models_to_check = [
        # {'app_label': 'gestion_utilisateur', 'model_name': 'utilisateurpersonnalise', 'url': 'dashboard'},
        {'app_label': 'appels_offres', 'model_name': 'AppelOffre', 'url': 'appels_offres'},
        {'app_label': 'avis_infos', 'model_name': 'avisinfos', 'url': 'avis_infos'},
        {'app_label': 'offres_emploi', 'model_name': 'offreemploi', 'url': 'admin_offres'},
        {'app_label': 'offres_emploi', 'model_name': 'publicite', 'url': 'liste_publicites'},
    ]
    
    # Vérifier les permissions pour chaque modèle
    for model_info in models_to_check:
        has_perm, model_permissions = has_any_permission_for_model_vue(
            request.user,
            model_info['app_label'],
            model_info['model_name']
        )
        if has_perm:
            # Rediriger vers l'URL associée au premier modèle avec des permissions
            logger.debug(f"Permissions trouvées pour {model_info['app_label']}.{model_info['model_name']}: {model_permissions}")
            return redirect(model_info['url'])
    
    # Si aucune permission correspondante n'est trouvée, rediriger vers une URL par défaut
    logger.debug(f"Aucune permission mappée trouvée pour {request.user}, redirection par défaut vers dashboard")
    return redirect('dashboard')

@login_required
def index(request):
    if request.user.is_authenticated and request.user.role.name != 'client' and request.user.role.name != 'candidat':
        permissions = request.user.get_all_permissions()
        perm_count = len(permissions)
        if perm_count == 0:
            return redirect('aucun_acee')
        TYPE_OFFRE_MAP = dict(OffreEmploi.TYPE_OFFRE_CHOICES)

        nbr_OffreEmploi = OffreEmploi.objects.count()
        nbr_Client = Client.objects.count()
        nbr_Candidat = Candidat.objects.count()
        nbr_AppelOffre = AppelOffre.objects.count()
        nbr_AvisInfos = AvisInfos.objects.count()
        nbr_Publicite = Publicite.objects.count()
        
        offres_par_mois = (
            OffreEmploi.objects
            .filter(si_valider=True)  # ✅ Filtrer uniquement les offres validées
            .annotate(mois=TruncMonth('date_mise_en_ligne'))  # Regrouper par mois
            .values('mois')  # Sélectionner uniquement les mois
            .annotate(total=Count('id'))  # Compter les offres par mois
            .order_by('mois')  # Trier par ordre chronologique
        )
        
        types_offres = (
            OffreEmploi.objects
            .values('type_offre')
            .annotate(total_pie=Count('id'))
        )

        pie_labels = [TYPE_OFFRE_MAP.get(entry['type_offre'], entry['type_offre']) for entry in types_offres]
        pie_data = [entry['total_pie'] for entry in types_offres]

        labels = [entry['mois'].strftime('%B %Y') for entry in offres_par_mois]  # Mois en format "Janvier 2025"
        data = [entry['total'] for entry in offres_par_mois]  # Nombre d'offres validées par mois

        return render(request, 'index.html', {
            'labels': json.dumps(labels),  # Convertir en JSON
            'data': json.dumps(data),
            'pie_labels': json.dumps(pie_labels),
            'pie_data': json.dumps(pie_data),
            'nbr_Publicite': nbr_Publicite,
            'nbr_AvisInfos': nbr_AvisInfos,
            'nbr_AppelOffre': nbr_AppelOffre,
            'nbr_Candidat': nbr_Candidat,
            'nbr_Client': nbr_Client,
            'nbr_OffreEmploi': nbr_OffreEmploi,
        })
    else:
        return redirect('connexion')
    

#ahmed
def connexion(request):
    if request.method == 'POST':
        formulaire = AuthenticationForm(request, data=request.POST)
        if formulaire.is_valid():
            nom_utilisateur = formulaire.cleaned_data.get('username')
            mot_de_passe = formulaire.cleaned_data.get('password')
            utilisateur = authenticate(username=nom_utilisateur, password=mot_de_passe)
            if utilisateur is not None:
                login(request, utilisateur)
                # Rediriger l'administrateur vers la page admin_offres
                if request.user.role.name != 'client' and request.user.role.name != 'candidat':
                    # if request.user.role.name == 'admin':
                    return redirect('accueil')
                    # if request.user.role.name == 'traducteur':
                    #     return redirect('traduction_offre')
                    # if request.user.role.name == 'commercial':
                    #     return redirect('porte_feuille')
                logout(request)
                # Rediriger les autres utilisateurs vers la page d'accueil
                return redirect('connexion')
    else:
        formulaire = CustomAuthenticationForm()
    return render(request, 'login.html', {'form': formulaire})

#ahmed
# def accueil(request):
#     if request.user.is_authenticated and request.user.role.name == 'admin':
#         return redirect('index')
    
#     # Récupérer les offres en fonction de l'utilisateur
#     if request.user.is_authenticated and hasattr(request.user, 'client'):
#         offres = OffreEmploi.objects.filter(client=request.user.client)
#     else:
#         offres = OffreEmploi.objects.filter(si_valider=True)

#     # Séparer les offres groupées et non groupées
#     offres_groupées = offres.filter(si_groupement=True)
#     offres_non_groupées = offres.filter(si_groupement=False)

#     # Grouper les offres groupées par client
#     offres_groupées_par_client = {}
#     for offre in offres_groupées:
#         client = offre.client
#         if client not in offres_groupées_par_client:
#             offres_groupées_par_client[client] = {
#                 "offres": [],
#                 "lieux": set(),  # Utiliser un ensemble pour stocker les lieux uniques
#             }
#         offres_groupées_par_client[client]["offres"].append(offre)
#         offres_groupées_par_client[client]["lieux"].add(offre.lieu)

#     # Formater les dates et les lieux pour les offres groupées
#     for client, data in offres_groupées_par_client.items():
#         # Grouper les offres par mois et année
#         offres_par_mois_annee = {}
#         for offre in data["offres"]:
#             mois_annee = (offre.date_limite.month, offre.date_limite.year)
#             if mois_annee not in offres_par_mois_annee:
#                 offres_par_mois_annee[mois_annee] = []
#             offres_par_mois_annee[mois_annee].append(offre)

#         # Formater les dates pour chaque groupe de mois/année
#         dates_formatees = []
#         for (mois, annee), offres_mois in offres_par_mois_annee.items():
#             jours = sorted([offre.date_limite.day for offre in offres_mois])
#             jours_str = ",".join(map(str, jours))
#             mois_str = datetime.strftime(offres_mois[0].date_limite, "%B")  # Nom du mois
#             annee_str = str(annee)
#             dates_formatees.append(f"{jours_str} {mois_str} {annee_str}")

#         # Formater les lieux
#         lieux_formates = ", ".join(data["lieux"])  # Concaténer les lieux uniques avec une virgule

#         # Ajouter les données formatées au contexte
#         offres_groupées_par_client[client] = {
#             "offres": data["offres"],
#             "dates_formatees": " | ".join(dates_formatees),
#             "lieux_formates": lieux_formates,  # Ajouter les lieux formatés
#         }

#     return render(request, 'home.html', {
#         'offres_groupées_par_client': offres_groupées_par_client,
#         'offres_non_groupées': offres_non_groupées,
#     })

#ahmed
@login_required
def deconnexion(request):
    logout(request)
    return redirect('connexion')

#ahmed
def inscription(request, role):
    if request.method == 'POST':
        user_form = CustomUserCreationForm(request.POST)
        if role == 'client':
            additional_form = ClientForm(request.POST, request.FILES)
        elif role == 'candidat':
            additional_form = CandidatForm(request.POST, request.FILES)

#         if user_form.is_valid() and additional_form.is_valid():
#             # Créer l'utilisateur
#             user = user_form.save(commit=False)
#             user.role.name = role  # Attribuer le rôle à l'utilisateur
#             user.save()

#             # Créer le client ou le candidat
#             if role == 'client':
#                 client = additional_form.save(commit=False)
#                 client.utilisateur = user
#                 client.save()
#             elif role == 'candidat':
#                 candidat = additional_form.save(commit=False)
#                 candidat.utilisateur = user
#                 candidat.save()

#             # Connecter l'utilisateur
#             login(request, user)
#             return redirect('accueil')  # Rediriger vers la page d'accueil
#     else:
#         user_form = CustomUserCreationForm()
#         if role == 'client':
#             additional_form = ClientForm()
#         elif role == 'candidat':
#             additional_form = CandidatForm()

    return render(request, 'inscription.html', {
        'user_form': user_form,
        'additional_form': additional_form,
        'role': role,
    })

#ahmed  
@login_required
def creer_offre(request):
    if not hasattr(request.user, 'client'):
        return redirect('index')  # Rediriger si l'utilisateur n'est pas un client

    if request.method == 'POST':
        offre_form = OffreEmploiForm(request.POST)
        document_formset = DocumentFormSet(request.POST, request.FILES, prefix='documents')

        if offre_form.is_valid() and document_formset.is_valid():
            # Enregistrer l'offre d'emploi
            offre = offre_form.save(commit=False)
            offre.client = request.user.client
            offre.save()

            # Enregistrer les documents
            for form in document_formset:
                if form.cleaned_data and not form.cleaned_data.get('DELETE', False):
                    document = form.save(commit=False)
                    document.offre_emploi = offre  # Associer le document à l'offre
                    document.save()  # Enregistrer chaque document

            return redirect('admin_offres')  # Rediriger vers la page d'accueil après la création
    else:
        offre_form = OffreEmploiForm()
        document_formset = DocumentFormSet(queryset=Document.objects.none(), prefix='documents')

    return render(request, 'creer_offre.html', {
        'offre_form': offre_form,
        'document_formset': document_formset,
    })


@csrf_exempt
@login_required

def creer_offre_parclient(request):
    if not hasattr(request.user, 'client'):
        return JsonResponse({"error": "Vous devez être un client pour créer une offre"}, status=403)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # Ajouter l'ID du client connecté automatiquement
            form = OffreEmploiForm(data)
            
            if form.is_valid():
                offre = form.save(commit=False)
                offre.client = request.user.client  # Associer le client connecté
                offre.save()
                return JsonResponse({
                    "message": "Offre ajoutée avec succès",
                    "id": offre.id,
                    "titre": offre.titre
                }, status=201)
            else:
                return JsonResponse({
                    "error": "Données invalides",
                    "details": form.errors
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Format JSON invalide"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Erreur serveur : {str(e)}"}, status=500)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

#ahmed  
@login_required
@permission_required("offres_emploi.change_offreemploi", raise_exception=True)
def modifier_offre(request, offre_id):
    offre = get_object_or_404(OffreEmploi, id=offre_id)
    
    offres_disponibles = OffreEmploi.objects.none()
    offres_liees = OffreEmploi.objects.none()

    if request.method == 'POST':
        offre_form = OffreEmploiForm(request.POST, instance=offre)
        document_formset = DocumentFormSetModifier(request.POST, request.FILES, queryset=Document.objects.filter(offre_emploi=offre), prefix='documents')
        
        offres_groupees = request.POST.get("offres_groupees", "")  # Récupérer les IDs sous forme de chaîne
        offres_ids = offres_groupees.split(",") if offres_groupees else []

        
        if offre_form.is_valid() :
            offre_form.save()
            if document_formset.is_valid():
                documents = document_formset.save(commit=False)
                for document in documents:
                    document.offre_emploi = offre  # Assigner l'offre au document
                    document.save()
                # Supprimer les documents marqués pour suppression
                for document in document_formset.deleted_objects:
                    document.delete()

                document_formset.save_m2m()
        return redirect('admin_offres')

            
    else:
        offre_form = OffreEmploiForm(instance=offre)
        document_formset = DocumentFormSetModifier(queryset=Document.objects.filter(offre_emploi=offre), prefix='documents')
    if offre.si_principal:
        offres_liees = offre.get_offres_liees()
        offres_disponibles = OffreEmploi.objects.filter(
            client=offre.client, 
            si_groupement=False, 
            
            ).exclude(id=offre.id)
    elif not offre.si_groupement:
        offres_disponibles = OffreEmploi.objects.filter(
            client=offre.client, 
            si_groupement=False, 
            
            ).exclude(id=offre.id)
        
    return render(request, 'modifier_offre.html', {
        'offre': offre,
        'offre_form': offre_form,
        'document_formset': document_formset,
        'offres_disponibles': offres_disponibles,
        'offres_liees': offres_liees,
    })
    
#ahmed
@login_required
@permission_required("offres_emploi.delete_offreemploi", raise_exception=True)
def supprimer_document(request, document_id):
    # Récupérer le document à supprimer
    document = get_object_or_404(Document, id=document_id)

    # Vérifier que l'utilisateur est un client et que le document appartient à une de ses offres
    if hasattr(request.user, 'client') :
        if document.offre_emploi.client != request.user.client:
            return redirect('accueil')  # Rediriger si l'utilisateur n'est pas autorisé
    else:
        # Supprimer le document
        document.delete()
        return redirect('modifier_offre', offre_id=document.offre_emploi.id)

#ahmed
@permission_required("offres_emploi.view_offreemploi", raise_exception=True)
def detail_offre_page(request, offre_id):
    # Récupérer l'offre en fonction de son ID
    offre = get_object_or_404(OffreEmploi, id=offre_id)
    
    # Récupérer les documents associés à l'offre
    documents = Document.objects.filter(offre_emploi=offre)
    
    context = {
        'offre': offre,
        'documents': documents,
    }
    
    return render(request, 'detail_offre.html', context)

#ahmed
@permission_required("offres_emploi.view_offreemploi", raise_exception=True)
def get_offre_details(request, offre_id):
    # Récupérer l'offre en fonction de son ID
    offre = get_object_or_404(OffreEmploi, id=offre_id)
    
    # Récupérer les documents associés à l'offre
    documents = Document.objects.filter(offre_emploi=offre)
    
    # Préparer les données à renvoyer au format JSON
    data = {
        'titre': strip_tags(offre.titre),
        'type_offre': offre.type_offre,
        'description': offre.description,
        'date_limite': offre.date_limite.strftime('%Y-%m-%d'),  # Formater la date
        'lieu': offre.lieu,
        'si_valider': offre.si_valider,
        'documents': [
            {
                'titre_document': doc.titre_document,
                'piece_join': doc.piece_join.url  # URL du document
            }
            for doc in documents
        ]
    }
    
    # Renvoyer les données au format JSON
    return JsonResponse(data)  

#ahmed
@has_any_permission_for_model('OffreEmploi','offres_emploi')
def admin_offres(request):
    # Récupérer toutes les offres d'emploi avec le nombre d'offres publiées du client
    if(request.user.role.name != 'admin'):
        offres = OffreEmploi.objects.annotate(
            nombre_offres_publiees=Count('client__offres_emploi', filter=Q(client__offres_emploi__si_valider=True))
        ).filter(a_traduire=True).order_by('-date_creation')
    else:
        offres = OffreEmploi.objects.annotate(
            nombre_offres_publiees=Count('client__offres_emploi', filter=Q(client__offres_emploi__si_valider=True))
        ).order_by('-date_creation')
        
    # Actions de l'administrateur
    if request.method == 'POST':
        action = request.POST.get('action')
        offre_id = request.POST.get('offre_id')

        if action and offre_id:
            offre = get_object_or_404(OffreEmploi, id=offre_id)

            # if action == 'publier':
            #     if offre.si_valider:  # Vérifier si l'offre est validée
            #         offre.si_valider = True
            #         offre.save()
            #         messages.success(request, f"L'offre '{offre.titre}' a été publiée.")
            #     else:
            #         messages.error(request, f"L'offre '{offre.titre}' ne peut pas être publiée car elle n'est pas validée.")
            # elif action == 'depublier':
            #     offre.si_publier = False
            #     offre.save()
            #     messages.success(request, f"L'offre '{offre.titre}' a été dépubliée.")
            # if action == 'valider':
            #     if request.user.has_perm('offres_emploi.valider_offreemploi'):
            #         offre.si_valider = True
            #         offre.valider_par = request.user
            #         # Only set date_mise_en_ligne if not already set
            #         if not offre.date_mise_en_ligne:
            #             offre.date_mise_en_ligne = timezone.now()
            #         offre.save()
            #         messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été validée.")
            # elif action == 'invalider':
            #     if request.user.has_perm('offres_emploi.valider_offreemploi'):
            #         offre.si_valider = False
            #         # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
            #         offre.save()
            #         messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été invalidée et dépubliée.")
            if action == 'valider_fr' and request.user.has_perm('offres_emploi.valider_offreemploi'):
                offre.si_valider = True
                offre.valider_par = request.user
                if not offre.date_mise_en_ligne:
                    offre.date_mise_en_ligne = timezone.now()
                offre.save()
                messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été validée (Français).")
            elif action == 'invalider_fr' and request.user.has_perm('offres_emploi.valider_offreemploi'):
                offre.si_valider = False
                offre.save()
                messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été invalidée (Français).")
            elif action == 'valider_ar' and request.user.has_perm('offres_emploi.valider_ar_offreemploi'):
                if not offre.titre_ar or not offre.description_ar:
                    messages.error(request, f"L'offre '{strip_tags(offre.titre)}' ne peut pas être validée en arabe car les champs de traduction sont manquants.")
                else:
                    offre.si_valider_ar = True
                    offre.valider_par = request.user
                    if not offre.date_mise_en_ligne:
                        offre.date_mise_en_ligne = timezone.now()
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été validée (Arabe).")
            elif action == 'invalider_ar' and request.user.has_perm('offres_emploi.valider_ar_offreemploi'):
                offre.si_valider_ar = False
                offre.save()
                messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été invalidée (Arabe).")
            elif action == 'Valide_a_traduire':
                if request.user.has_perm('offres_emploi.traduire_offreemploi'):
                    offre.a_traduire = True
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' pres a traduire")
            elif action == 'Invalider_a_traduire':
                if request.user.has_perm('offres_emploi.traduire_offreemploi'):
                    offre.a_traduire = False
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' n'est pas pres a traduire")
                    
            elif action == 'supprimer':
                if request.user.has_perm('offres_emploi.delete_offreemploi'):
                    offre.delete()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été supprimée.")
            elif action == 'modifier':
                if request.user.has_perm('offres_emploi.change_offreemploi'):
                    return redirect('modifier_offre', offre_id=offre.id)
            elif action == 'details':
                if request.user.has_perm('offres_emploi.view_offreemploi'):
                    return redirect('detail_offre', offre_id=offre.id)
            elif action == 'groupement':
                if request.user.has_perm('offres_emploi.grouper_offreemploi'):
                    return redirect('groupement_offres', offre_id=offre.id)

    return render(request, 'admin.html', {
        'offres': offres,
    })
    
#ahmed
@csrf_exempt
@permission_required("offres_emploi.grouper_offreemploi", raise_exception=True)
def ajouter_au_groupe(request):
    if request.method == 'POST':
        # Logique pour ajouter l'offre au groupe
        try:
            current_offer_id = request.POST.get('current_offer_id')
            offer_id = request.POST.get('offer_id')

            # Récupérer les objets Offre correspondants
            offre_principale = OffreEmploi.objects.get(pk=current_offer_id)
            offre_a_modifier = OffreEmploi.objects.get(pk=offer_id)

            # Associer l'offre à modifier à l'offre principale
            offre_a_modifier.offre_principale = offre_principale
            offre_a_modifier.si_groupement = True 
            offre_a_modifier.save()
            if not offre_principale.si_principal:
                offre_principale.si_principal = True
                offre_principale.si_groupement = True
                offre_principale.save()
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée'})


@csrf_exempt
@api_view(['POST'])
def inscription_client_front(request, role):

    if role not in ['candidat', 'client']:
        return JsonResponse({'error': 'Role invalide.'}, status=400)

    # Sérialisation de l'utilisateur
    serializer = UtilisateurSerializer(data=request.data)
    if not serializer.is_valid():
        return JsonResponse({'error': 'Données invalides.', 'details': serializer.errors}, status=400)

    try:
        
        # Sauvegarde de l'utilisateur
        user = serializer.save()
        # user.role.name = role
        # user.save()

        if role == 'client':
            client_data = {
                'utilisateur': user.id,
                'libelle_fr': request.data.get('libelle_fr', None),
                'libelle_ar': request.data.get('libelle_ar', None),
                'tel': request.data.get('tel', None),
                'email': request.data.get('email', None),
                'domaine': request.data.get('domaine', None),
                'type_organisation': request.data.get('type_organisation', None),
                'lieu': request.data.get('lieu', None),
                'fax': request.data.get('fax', None),
                'nom_responsable': request.data.get('nom_responsable', None),
                'fonction_responsable': request.data.get('fonction_responsable', None),
                'email_responsable': request.data.get('email_responsable', None),
                'tel_responsable': request.data.get('tel_responsable', None),
                'site_web': request.data.get('site_web', None),
                'nom': request.data.get('nom', None),
            }
            client_serializer = ClientSerializer(data=client_data)
            if client_serializer.is_valid():
                client_serializer.save()
            else:
                return JsonResponse({'error': 'Données invalides pour le client.', 'details': client_serializer.errors}, status=400)

        elif role == 'candidat':
            candidat_data = {
                'utilisateur': user.id,
                'cv': request.data.get('cv', None),
                'lettre_motivation': request.data.get('lettre_motivation', None),
            }
            candidat_serializer = CandidatSerializer(data=candidat_data)
            if candidat_serializer.is_valid():
                candidat_serializer.save()
            else:
                return JsonResponse({'error': 'Données invalides pour le candidat.', 'details': candidat_serializer.errors}, status=400)

        return JsonResponse({'message': f'Inscription réussie en tant que {role}.'}, status=201)

    except Exception as e:
        return JsonResponse({'error': f'Erreur interne : {str(e)}'}, status=500)


@api_view(['GET'])
def get_client_profile(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        client_data = {
            
            "id": client.id,
            "libelle_fr": client.libelle_fr,
            "libelle_ar": client.libelle_ar,
             "logo": request.build_absolute_uri(client.logo.url) if client.logo else None,
            "tel": client.tel,
            "email": client.utilisateur.email, 
            "username":client.utilisateur.username,
            "domaine": client.domaine,
            "type_organisation": client.type_organisation,
            "lieu": client.lieu,
            "fax": client.fax,
            "nom_responsable": client.nom_responsable,
            "fonction_responsable": client.fonction_responsable,
            "email_responsable": client.email_responsable,
            "tel_responsable": client.tel_responsable,
            "site_web": client.site_web,
            "nom": client.nom,
        }
        return JsonResponse(client_data)
    except Client.DoesNotExist:
        return JsonResponse({"error": "Client non trouvé"}, status=404)




@api_view(['GET'])
def get_candidat_profile(request, candidat_id):
    try:
        candidat = Candidat.objects.get(id=candidat_id)  
        candidat_data = {
            "id": candidat.id,
            "prenom": candidat.prenom ,  
            "nom": candidat.nom or candidat.utilisateur.username,    
            "prenom_ar": candidat.prenom_ar,
            "nom_ar": candidat.nom_ar,
            "telephone": candidat.telephone ,  
            "email": candidat.utilisateur.email, 
            "username": candidat.utilisateur.username,
            "pays": candidat.pays,
            "adresse": candidat.adresse,
            "date_naissance": candidat.date_naissance,
            "lieu_naissance": candidat.lieu_naissance,
            "genre": candidat.genre,
            "cv": candidat.cv.url if candidat.cv else None,  
            "lettre_motivation": candidat.lettre_motivation.url if candidat.lettre_motivation else None,
            "date_creation": candidat.date_creation.strftime("%Y-%m-%d %H:%M:%S"),  # Formater la date

            "logo": request.build_absolute_uri(candidat.logo.url) if candidat.logo else None,
        }
        
        return JsonResponse(candidat_data, safe=False)
    
    except Candidat.DoesNotExist:
        return JsonResponse({"error": "Candidat non trouvé"}, status=404)



@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])  # Ajout du parser pour gérer les fichiers
def update_client_profile(request, client_id):
    try:
        client = get_object_or_404(Client, id=client_id)
        # Log des données reçues

        data = request.data
        client.nom = data.get("nom", client.nom)
        client.utilisateur.email = data.get("email", client.email)
        client.tel = data.get("tel", client.tel)
        client.domaine = data.get("domaine", client.domaine)
        client.type_organisation = data.get("type_organisation", client.type_organisation)
        client.lieu = data.get("lieu", client.lieu)
        client.fax = data.get("fax", client.fax)
        client.site_web = data.get("site_web", client.site_web)
        client.libelle_fr = data.get("libelle_fr", client.libelle_fr)
        client.libelle_ar = data.get("libelle_ar", client.libelle_ar)
        client.nom_responsable = data.get("nom_responsable", client.nom_responsable)
        
        client.fonction_responsable = data.get("fonction_responsable", client.fonction_responsable)
        client.email_responsable = data.get("email_responsable", client.email_responsable)
        client.tel_responsable = data.get("tel_responsable", client.tel_responsable)

        client.save()  # Sauvegarde des modifications

        return Response({"message": "Profil mis à jour avec succès"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])  # Gestion des fichiers et formulaires
def update_candidat_profile(request, candidat_id):
    try:
        candidat = get_object_or_404(Candidat, id=candidat_id)

        # Log des données reçues


        # Gestion des fichiers (CV & Lettre de motivation)
        if "cv" in request.FILES:
            candidat.cv.save(
                request.FILES["cv"].name,
                ContentFile(request.FILES["cv"].read()),  # Stocker le fichier
                save=False
            )

        if "lettre_motivation" in request.FILES:
            candidat.lettre_motivation.save(
                request.FILES["lettre_motivation"].name,
                ContentFile(request.FILES["lettre_motivation"].read()),
                save=False
            )

        # Mise à jour des autres champs
        data = request.data
        candidat.prenom = data.get("prenom", candidat.prenom)
        candidat.nom = data.get("nom", candidat.nom)
        candidat.prenom_ar = data.get("prenom_ar", candidat.prenom_ar)
        candidat.nom_ar = data.get("nom_ar", candidat.nom_ar)
        candidat.telephone = data.get("telephone", candidat.telephone)
        candidat.pays = data.get("pays", candidat.pays)
        candidat.adresse = data.get("adresse", candidat.adresse)
        candidat.date_naissance = data.get("date_naissance", candidat.date_naissance)
        candidat.lieu_naissance = data.get("lieu_naissance", candidat.lieu_naissance)
        candidat.genre = data.get("genre", candidat.genre)

        candidat.save()  # Sauvegarde des modifications

        return Response({"message": "Profil mis à jour avec succès"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def update_candidat_profilecv(request, candidat_id):
    try:
        candidat = get_object_or_404(Candidat, id=candidat_id)

        if "cv" in request.FILES:
            candidat.cv.save(
                request.FILES["cv"].name,
                ContentFile(request.FILES["cv"].read()),
                save=False
            )

        candidat.save()

        cv_url = request.build_absolute_uri(candidat.cv.url) if candidat.cv else None
        return Response({
            "message": "Profil mis à jour avec succès",
            "cv_url": cv_url
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_candidat_profilecv(request, candidat_id):
    candidat = get_object_or_404(Candidat, id=candidat_id)
    cv_url = request.build_absolute_uri(candidat.cv.url) if candidat.cv else None
    return Response({
        "id": candidat.id,
        "cv_url": cv_url,
    }, status=status.HTTP_200_OK)


from .models import Document

@api_view(['GET'])
def get__document(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    cv_url = request.build_absolute_uri(document.piece_join.url) if document.piece_join else None
    return Response({
        "id":document.id,
        "cv_url": cv_url,
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])  # Gestion des fichiers et formulaires
def updatelogo_candidat_profile(request, candidat_id):

    try:
        candidat = get_object_or_404(Candidat, id=candidat_id)
        if "logo" in request.FILES:
            candidat.logo.save(
                request.FILES["logo"].name,
                ContentFile(request.FILES["logo"].read()),
                save=True  # Assure-toi que save=True pour enregistrer le fichier
            )
            candidat.save()
        return Response({
            "message": "Logo mis à jour avec succès",
            "logo_url": request.build_absolute_uri(candidat.logo.url) if candidat.logo else None
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
def delete_logo_candidat(request, candidat_id):
    try:
        candidat = get_object_or_404(Candidat, id=candidat_id)
        if candidat.logo:
            candidat.logo.delete(save=True)  # Supprime le fichier et met à jour le champ
            return Response({
                "message": "Logo supprimé avec succès",
                "logo_url": None
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Aucun logo à supprimer"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@permission_required("offres_emploi.grouper_offreemploi", raise_exception=True)
def retirer_du_groupe(request):

    if request.method == 'POST':
        # Logique pour retirer l'offre du groupe
        try:
            current_offer_id = request.POST.get('current_offer_id')
            offer_id = request.POST.get('offer_id')
            
            offre_principale = OffreEmploi.objects.get(pk=current_offer_id)
            offre_a_modifier = OffreEmploi.objects.get(pk=offer_id)

            # Associer l'offre à modifier à l'offre principale
            offre_a_modifier.offre_principale = None
            offre_a_modifier.si_groupement = False 
            offre_a_modifier.save()
            
            if(offre_principale.nombre_offres_liees() == 0):
                offre_principale.si_principal = False
                offre_principale.si_groupement = False
                offre_principale.save()
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée'})



# @staff_member_required
# def liste_utilisateurs(request):
#     utilisateurs = UtilisateurPersonnalise.objects.all()  # Récupérer tous les utilisateurs
#     return render(request, 'pages/liste_utilisateurs.html', {'utilisateurs': utilisateurs})



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


# @permission_required("offres_emploi.fixe_offreemploi", raise_exception=True)
# def fixer_offre(request, offre_id):
#     print(offre_id)
#     if request.method == "POST":
#         offre = get_object_or_404(OffreEmploi, id=offre_id)
#         offre.si_fixe = not offre.si_fixe  # Inverse l'état actuel de si_fixe
#         offre.save()
#         return redirect(request.META.get("HTTP_REFERER", "accueil"))  # Redirection après action

#     return JsonResponse({"success": False, "message": "Méthode non autorisée"}, status=405)


from django.contrib.auth.decorators import permission_required
from django.shortcuts import get_object_or_404, redirect
from django.http import JsonResponse


@permission_required("offres_emploi.fixe_offreemploi", raise_exception=True)
def fixer_offre(request, offre_id):
    if request.method == "POST":
        offre = get_object_or_404(OffreEmploi, id=offre_id)
        offre.si_fixe = not offre.si_fixe
        offre.save()
        
        if offre.si_fixe:
            messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été fixée.")
        else:
            messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été défixée.")
            
        return redirect(request.META.get("HTTP_REFERER", "accueil"))
    return JsonResponse({"success": False, "message": "Méthode non autorisée"}, status=405)


@permission_required("avis_infos.fixe_avis_infos", raise_exception=True)
def fixer_avis(request, avis_id):
    if request.method == "POST":
        avis = get_object_or_404(AvisInfos, id=avis_id)
        avis.si_fixe = not avis.si_fixe
        avis.save()
        
        if avis.si_fixe:
            messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été fixé.")
        else:
            messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été défixé.")
            
        return redirect(request.META.get("HTTP_REFERER", "accueil"))
    return JsonResponse({"success": False, "message": "Méthode non autorisée"}, status=405)


@permission_required("appels_offres.fixe_appels_offres", raise_exception=True)
def fixer_appel(request, appel_id):
    if request.method == "POST":
        appel = get_object_or_404(AppelOffre, id=appel_id)
        appel.si_fixe = not appel.si_fixe
        appel.save()
        
        if appel.si_fixe:
            messages.success(request, f"L'appel d'offre '{strip_tags(appel.titre)}' a été fixé.")
        else:
            messages.success(request, f"L'appel d'offre '{strip_tags(appel.titre)}' a été défixé.")
            
        return redirect(request.META.get("HTTP_REFERER", "accueil"))
    return JsonResponse({"success": False, "message": "Méthode non autorisée"}, status=405)


# Exemple dans views.py
# @api_view(['GET'])
# def offres_fixes(request):
#     offres = OffreEmploi.objects.filter(si_fixe=True)
#     serializer = OffreEmploiSerializer(offres, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# def avis_fixes(request):
#     avis = AvisInfos.objects.filter(si_fixe=True)
#     serializer = AvisInfosSerializer(avis, many=True)
#     return Response(serializer.data)

# def avis_fixes(request):
#     offres = AvisInfos.objects.filter(si_fixe=True ).select_related('client').values(
#         'id',
#         'titre',
#         'date_limite',
#         'lieu',
#         'titre_entreprise', 
#         'client__logo',  # Contient le chemin de l'image
#         'client__libelle_fr',
     
#     )
#     offres_list = list(offres)

#     for offre in offres_list:
#         if offre['client__logo']:
#             # Construire l'URL complète du logo
#             offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + offre['client__logo'])
#         else:
#             # URL d'une image par défaut si le logo est absent
#             offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + 'logos/default.png')

#     return JsonResponse(offres_list, safe=False)


# @api_view(['GET'])
# def offres_fixes(request):
#     offres = AppelOffre.objects.filter(si_fixe=True)
#     serializer = AppelOffreSerializer(offres, many=True, context={'request': request})
#     return Response(serializer.data)

# def offres_fixes(request):
#     offres = AppelOffre.objects.filter(si_fixe=True).select_related('client').values(
#         'id',
#         'titre',
#         'date_limite',
#         'lieu',
#         'titre_entreprise', 
#         'client__logo',  # Contient le chemin de l'image
#          'client__libelle_fr',
     
#     )
#     offres_list = list(offres)

#     for offre in offres_list:
#         if offre['client__logo']:
#             # Construire l'URL complète du logo
#             offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + offre['client__logo'])
#         else:
#             # URL d'une image par défaut si le logo est absent
#             offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + 'logos/default.png')

#     return JsonResponse(offres_list, safe=False)



def avis_fixes(request):  
    lang = request.GET.get('lang', 'fr')
    offres = AvisInfos.objects.filter(si_fixe=True).select_related('client').values(
        'id',
        'titre',
        'date_limite',
        'lieu',
        'titre_entreprise', 
        'client__logo',  # Contient le chemin de l'image
        'client__libelle_fr',
     
    )
    offres_list = list(offres)

    # 2) filtrer les offres « fixes » validées
    if lang == 'fr':
        qs = (AvisInfos.objects
            .filter(si_fixe=True, si_valider=True)
            .select_related('client'))
    else:
        qs = (AvisInfos.objects
            .filter(si_fixe=True, si_valider_ar=True)
            .select_related('client'))
    data = []
    for offre in qs:
        titre            = offre.titre_ar if lang == 'ar' else offre.titre
        lieu             = offre.lieu_ar  if lang == 'ar' else offre.lieu
      
        client_nom = None
        if offre.client:
            client_nom = (
            offre.client.libelle_ar 
            if lang == 'ar' 
            else offre.client.libelle_fr
            ) if offre.client else None
        if offre.client and offre.client.logo:
            logo_url = request.build_absolute_uri(offre.client.logo.url)
        else:
            logo_url = request.build_absolute_uri(
                settings.MEDIA_URL + 'logos/default.png'
            )
        data.append({
            "id":                offre.id,
            "titre":             offre.titre_ar if lang == 'ar' else offre.titre,
            "date_limite":       offre.date_limite.strftime('%Y-%m-%d'),
            "lieu":              lieu,
            "client_nom":       client_nom,
            "client__logo":      logo_url,
            "lang":              lang,
            "dir":               'rtl' if lang == 'ar' else 'ltr',
        })

    return JsonResponse(data, safe=False)


def apples_fixes(request):  
    lang = request.GET.get('lang', 'fr')
    offres = AppelOffre.objects.filter(si_fixe=True).select_related('client').values(
        'id',
        'titre',
        'date_limite',
        'lieu',
        'titre_entreprise', 
        'client__logo',  # Contient le chemin de l'image
        'client__libelle_fr',
     
    )
    offres_list = list(offres)

    # 2) filtrer les offres « fixes » validées
    if lang == 'fr':
        qs = (AppelOffre.objects
            .filter(si_fixe=True, si_valider=True)
            .select_related('client'))
    else:
        qs = (AppelOffre.objects
          .filter(si_fixe=True, si_valider_ar=True)
          .select_related('client'))
    data = []
    for offre in qs:
        titre            = offre.titre_ar if lang == 'ar' else offre.titre
        lieu             = offre.lieu_ar  if lang == 'ar' else offre.lieu
      
        client_nom = None
        if offre.client:
            client_nom = (
            offre.client.libelle_ar 
            if lang == 'ar' 
            else offre.client.libelle_fr
            ) if offre.client else None
        if offre.client and offre.client.logo:
            logo_url = request.build_absolute_uri(offre.client.logo.url)
        else:
            logo_url = request.build_absolute_uri(
                settings.MEDIA_URL + 'logos/default.png'
            )
        data.append({
            "id":                offre.id,
            "titre":             offre.titre_ar if lang == 'ar' else offre.titre,
            "date_limite":       offre.date_limite.strftime('%Y-%m-%d'),
            "lieu":              lieu,
            "client_nom":       client_nom,
            "client__logo":      logo_url,
            "lang":              lang,
            "dir":               'rtl' if lang == 'ar' else 'ltr',
        })

    return JsonResponse(data, safe=False)

def offres_fixes(request):  
    lang = request.GET.get('lang', 'fr')
    if lang == 'fr':
        offres = OffreEmploi.objects.filter(si_fixe=True, si_valider=True).select_related('client').values(
            'id',
            'titre',
            'date_limite',
            'lieu',
            'titre_entreprise', 
            'client__logo',  # Contient le chemin de l'image
            'client__libelle_fr',
        
        )
    else:
        offres = OffreEmploi.objects.filter(si_fixe=True, si_valider_ar=True).select_related('client').values(
            'id',
            'titre',
            'date_limite',
            'lieu',
            'titre_entreprise', 
            'client__logo',  # Contient le chemin de l'image
            'client__libelle_fr',
        
        )
    offres_list = list(offres)

    # 2) filtrer les offres « fixes » validées
    if lang == 'fr':
        qs = (OffreEmploi.objects
            .filter(si_fixe=True, si_valider=True)
            .select_related('client'))
    else:
        qs = (OffreEmploi.objects
          .filter(si_fixe=True, si_valider_ar=True)
          .select_related('client'))
    # 3) construire la liste renvoyée
    data = []
    for offre in qs:
        # choisir le bon champ selon la langue
        titre            = offre.titre_ar if lang == 'ar' else offre.titre
        lieu             = offre.lieu_ar  if lang == 'ar' else offre.lieu
        # si vous avez un champ titre_entreprise_ar, sinon on retombe sur titre_entreprise
        # titre_entreprise = (offre.titre_entreprise_ar 
        #                     if lang == 'ar' and offre.titre_entreprise_ar 
        #                     else offre.titre_entreprise)
        # client__nom arabe vs français
        client_nom = None
        if offre.client:

            client_nom = (
            offre.client.libelle_ar 
            if lang == 'ar' 
            else offre.client.libelle_fr
            ) if offre.client else None
        # construction de l’URL du logo (ou fallback)
        if offre.client and offre.client.logo:
            logo_url = request.build_absolute_uri(offre.client.logo.url)
        else:
            logo_url = request.build_absolute_uri(
                settings.MEDIA_URL + 'logos/default.png'
            )

        # formater la date_limite si vous le souhaitez


        data.append({
            "id":                offre.id,
            "titre":             offre.titre_ar if lang == 'ar' else offre.titre,
            "date_limite":       offre.date_limite.strftime('%Y-%m-%d'),
            "lieu":              lieu,
            # "titre_entreprise":  titre_entreprise,
            "client_nom":       client_nom,
            "client__logo":      logo_url,
            "lang":              lang,
            "dir":               'rtl' if lang == 'ar' else 'ltr',
        })

    return JsonResponse(data, safe=False)



def liste_apple_offre(request):
    offres = OffreEmploi.objects.all().select_related('client').values(
        'id',
        'titre',
        'description',
        'date_limite',
        'lieu',
        'titre_entreprise',
        'client__nom',
        'client__logo',  # Contient le chemin de l'image
        'client__site_web',
    )

    offres_list = list(offres)

    for offre in offres_list:
        if offre['client__logo']:
            # Construire l'URL complète du logo
            offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + offre['client__logo'])
        else:
            # URL d'une image par défaut si le logo est absent
            offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + 'logos/default.png')

    return JsonResponse(offres_list, safe=False)

def liste_apple_offre_candidat(request):
    offres = OffreEmploi.objects.all().select_related('client').values(
        'id',
        'titre',
        'type_offre',
        'description',
        'date_limite',
        'date_mise_en_ligne',
        'lieu',
        'titre_entreprise',
        'client__libelle_fr',
        'client__logo',  # Contient le chemin de l'image
        'client__site_web',
    )

    offres_list = list(offres)

    for offre in offres_list:
        if offre['client__logo']:
            # Construire l'URL complète du logo
            offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + offre['client__logo'])
        else:
            # URL d'une image par défaut si le logo est absent
            offre['client__logo'] = request.build_absolute_uri(settings.MEDIA_URL + 'logos/default.png')

    return JsonResponse(offres_list, safe=False)



from django.views.decorators.http import require_GET
    

def offres_emploi_par_client(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        offres = OffreEmploi.objects.filter(client=client)      
        offres_data = []
        for offre in offres:
           
            documents_data = []
            for document in offre.documents.all():  # Accès via l'instance d'offre
                documents_data.append({
                    "titre_document": document.titre_document,
                    "titre_piece_join": document.titre_piece_join,
                    "piece_join": request.build_absolute_uri(document.piece_join.url) if document.piece_join else None,
                    "date_creation": document.date_creation.strftime('%Y-%m-%d %H:%M:%S'),
                })
            
            # Construction des données par offre
            offre_data = {
                "id": offre.id,
                'si_valider': offre.si_valider,
                'titre': offre.titre,
                'description': offre.description,
                'date_limite': offre.date_limite.strftime('%Y-%m-%d'),
                'lieu': offre.lieu,
                'type_offre': offre.type_offre,
                'titre_entreprise': offre.titre_entreprise,
                'client__nom': client.libelle_fr,  # Utilisation directe du client déjà récupéré
              
                'client__logo': request.build_absolute_uri(offre.client.logo.url) if offre.client and offre.client.logo else None,
                'client__site_web': client.site_web,
                'documents': documents_data,
            }
            offres_data.append(offre_data)
        
        return JsonResponse(offres_data, safe=False)
    
    except Client.DoesNotExist:
        return JsonResponse({'error': 'Client non trouvé'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def liste_avis_info(request):
    avis_infos = OffreEmploi.objects.all().select_related('client').order_by('-date_creation').values(
        'id',
        'titre',
        'description',
        'date_limite',
        'lieu',
        'titre_entreprise',
        'client__nom',
        'client__logo',
        'client__site_web',
    )

    avis_infos = list(avis_infos)

    for avis in avis_infos:
        # Construire l'URL complète du logo
        if avis['client__logo']:
            avis['logo'] = request.build_absolute_uri(settings.MEDIA_URL + avis['client__logo'])
        else:
            avis['logo'] = request.build_absolute_uri(settings.MEDIA_URL + 'logos/default.png')

        # Renommer les clés pour correspondre aux besoins de React
        avis['entreprise'] = avis.pop('client__nom')
        avis['site_web'] = avis.pop('client__site_web')

        # Formater la date (ex: "05 Février 2025")
        avis['date_limite'] = avis['date_limite'].strftime('%d %B %Y') if avis['date_limite'] else "Non spécifié"

    return JsonResponse(avis_infos, safe=False)


@has_any_permission_for_model('Publicite','offres_emploi')
def get_publicite(request):
     publicites = Publicite.objects.all()
     return render(request, "pages/publicite.html", {"publicites": publicites})


def get_publicites(request):
    # Vérifier s'il existe au moins un client spécial
    existe_client_special = Publicite.objects.filter(client__special=True).exists()
    main = request.GET.get('main', 'oui')
    if main == 'non':
    
        # Si un client spécial existe, ne récupérer que ses publicités
        publicites = (
            Publicite.objects
            .filter(client__special=True,date_limite__gte=timezone.now().date())
            .select_related('client')
            .order_by('-date_creation')
        )
    else:
        # Sinon, récupérer toutes les publicités
        publicites = (
            Publicite.objects
            .select_related('client')
            .filter(date_limite__gte=timezone.now().date())
            .order_by('-date_creation')
        )

    # Construction des données à renvoyer
    data = [
        {
            "id": pub.id,
            "libelle": pub.libelle,
            "lien": pub.lien,
            "type_contenu": pub.type_contenu,
            "fichier": request.build_absolute_uri(pub.fichier.url) if pub.fichier else None,
            "type_publicite": pub.type_publicite,
            "image": request.build_absolute_uri(pub.image.url)  # URL complète de l'image
        }
        for pub in publicites
    ]
    # print(data)
    return JsonResponse(data, safe=False)


def listcompler_offres_api(request):
    offres_list = OffreEmploi.objects.all().select_related('client')
from django.conf import settings


# def liste_offres_api(request):
#     offres_list = OffreEmploi.objects.all().select_related('client')
#     offres_data = [
#         {
#             "id": off.id,
#             'titre': off.titre,
#             'description': off.description,
#             'date_limite': off.date_limite,  # Formater la date
#             'lieu': off.lieu,
#             'titre_entreprise': off.titre_entreprise,
#             'client__nom': off.client.libelle_fr if off.client else None,  # Accéder au nom du client
#             'client__logo': request.build_absolute_uri(off.client.logo.url) if off.client.logo else None,

#             'client__site_web': off.client.site_web if off.client else None,
#         }
#         for off in offres_list
#     ]
#     return JsonResponse(offres_data, safe=False)


from django.http import JsonResponse
from .models import OffreEmploi

# def liste_offres_api(request):
#     # Filtrer les offres où si_publier=True et trier par date_limite (ordre décroissant)
#     offres_list = OffreEmploi.objects.filter(si_valider=True).order_by('-date_limite').select_related('client')
    
#     offres_data = [
#         {
#             "id": off.id,
#             'titre': off.titre,
#             'description': off.description,
#             'date_limite': off.date_limite_fr(),  # Formater la date
#             'lieu': off.lieu,
#             'titre_entreprise': off.titre_entreprise,
#             'client__nom': off.client.libelle_fr if off.client else None,  # Accéder au nom du client
#             'client__logo': request.build_absolute_uri(off.client.logo.url) if off.client.logo else None,
#             'client__site_web': off.client.site_web if off.client else None,
#         }
#         for off in offres_list
#     ]
    
#     return JsonResponse(offres_data, safe=False)

# views.py

from parametres.models import Parametres
from django.http import JsonResponse
from django.db.models import Q
from .models import OffreEmploi
import json

def liste_offres_api(request):
    # 1) Récupérer la langue demandée (fr par défaut) et groupement_id
    lang = request.GET.get('lang', 'fr')
    groupement_id = request.GET.get('groupement_id', None)
    param = Parametres.objects.last()
    limite = param.nombreoffresAr if lang == 'ar' else param.nombreoffres
    valeur_liste = request.GET.get('listes', 'noncomplet')

    # 2) Liste des offres validées
    if groupement_id:
        if lang == 'fr' :
        # Si groupement_id est fourni, récupérer l'offre principale et ses offres liées
            offre_principale = get_object_or_404(OffreEmploi, id=groupement_id, si_valider=True)
            offres_list = (
                OffreEmploi.objects
                .filter(Q(id=groupement_id) | Q(offre_principale=offre_principale))
                .filter(si_valider=True)
                .select_related('client')
                .prefetch_related('offres_liees')
                .order_by('-date_creation')
            )
        else:
            offre_principale = get_object_or_404(OffreEmploi, id=groupement_id, si_valider=True)
            offres_list = (
                OffreEmploi.objects
                .filter(Q(id=groupement_id) | Q(offre_principale=offre_principale))
                .filter(si_valider_ar=True)
                .select_related('client')
                .prefetch_related('offres_liees')
                .order_by('-date_creation')
            )
    else:
        # Sinon, récupérer les offres principales ou sans groupe
        if lang == 'fr' :
            offres_list = (
                OffreEmploi.objects
                .filter(si_valider=True)
                .filter(Q(si_principal=True) | Q(offre_principale__isnull=True))
                .select_related('client')
                .prefetch_related('offres_liees')
                .order_by('-date_creation')[:limite]
            )
        else:
            offres_list = (
                OffreEmploi.objects
                .filter(si_valider_ar=True)
                .filter(Q(si_principal=True) | Q(offre_principale__isnull=True))
                .select_related('client')
                .prefetch_related('offres_liees')
                .order_by('-date_creation')[:limite]
            )

    # 3) Tableaux de noms de mois
    mois_fr = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ]
    mois_ar = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ]
    mois = mois_ar if lang == 'ar' else mois_fr

    offres_data = []

    for offre in offres_list:
        # 4) Récupérer les offres liées (robuste même si si_principal n'est pas correctement coché)
        linked = OffreEmploi.objects.filter(offre_principale=offre, si_valider=True)

        # 5) Préparer le grouping des dates en respectant afficher_heures
        if offre.si_principal and linked and not groupement_id:
            dates = [offre.date_limite] + [o.date_limite for o in linked if o.date_limite]
            dates = [d for d in dates if d]
            dates.sort()
            days = sorted({d.day for d in dates})
            months_idx = sorted({d.month for d in dates})
            years = sorted({d.year for d in dates})
            times = sorted({(d.hour, d.minute) for d in dates})
            
            if valeur_liste == 'noncomplet':
                if len(years) == 1:
                    # Même année → on regroupe
                    date_limite = {
                        "days": days,
                        "months": [mois[m-1] for m in months_idx],
                        "year": years[0],
                        "times": [{"hour": h, "minute": m} for h, m in times] if offre.afficher_heures else []
                    }
                else:
                    # Années multiples → on liste en strings
                    parts = []
                    for d in sorted({(d.day, d.month, d.year, d.hour, d.minute) for d in dates}):
                        j, mn, yr, hh, mi = d
                        if offre.afficher_heures:
                            tstr = f" {hh:02d}:{mi:02d}" if (hh or mi) else ""
                        else:
                            tstr = ""
                        parts.append(f"{j} {mois[mn-1]} {yr}{tstr}")
                    date_limite = ", ".join(parts)
                
            else :
                d = offre.date_limite
                if d:
                    date_limite = {
                        "days": [d.day],
                        "months": [mois[d.month-1]],
                        "year": d.year,
                        "times": [{"hour": d.hour, "minute": d.minute}] if offre.afficher_heures else []
                    }
                
        else:
            # Offres 
            
            d = offre.date_limite
            if d:
                date_limite = {
                    "days": [d.day],
                    "months": [mois[d.month-1]],
                    "year": d.year,
                    "times": [{"hour": d.hour, "minute": d.minute}] if offre.afficher_heures else []
                }
            else:
                date_limite = "N/A"

        # 6) Sélection des champs FR vs AR
        titre = offre.titre_ar if lang == 'ar' else offre.titre
        description = offre.description_ar if lang == 'ar' else offre.description
        lieu = offre.lieu_ar if lang == 'ar' else offre.lieu
        titre_entreprise = offre.titre_entreprise_ar if lang == 'ar' else offre.titre_entreprise
        titre_groupement_cpacial = offre.titre_groupement_cpacial_ar if lang == 'ar' else offre.titre_groupement_cpacial
        client_nom = (
            offre.client.libelle_ar if offre.client and lang == 'ar'
            else offre.client.libelle_fr if offre.client
            else None
        )
        
        # 7) Construction de la réponse
        offres_data.append({
            "id": offre.id,
            "client__special": offre.client.special if offre.client else False,
            "titre": titre,
            "titre_entreprise": titre_entreprise,
            "titre_groupement_cpacial": titre_groupement_cpacial,
            "groupement_spacial": offre.groupement_spacial,
            "description": description,
            "date_limite": date_limite,
            "lieu": lieu,
            "client__nom": client_nom,
            "client__logo": (
                request.build_absolute_uri(offre.client.logo.url)
                if offre.client and offre.client.logo else None
            ),
            "client__site_web": offre.client.site_web if offre.client else None,
            "si_principal": offre.si_principal,
            "type_offre": offre.type_offre,
            "offres_liees": [
                {
                    "id": o.id,
                    "titre": (o.titre_ar if lang == 'ar' else o.titre),
                    "date_limite": {
                        "days": [o.date_limite.day],
                        "months": [mois[o.date_limite.month-1]],
                        "year": o.date_limite.year,
                        "times": [{"hour": o.date_limite.hour, "minute": o.date_limite.minute}] if o.afficher_heures else []
                    } if o.date_limite else "N/A",
                    "lieu": (o.lieu_ar if lang == 'ar' else o.lieu)
                }
                for o in linked
            ] if linked.exists() else [],
            "lang": lang,
            "dir": 'rtl' if lang == 'ar' else 'ltr'
        })
  
    return JsonResponse(offres_data, safe=False)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse

def detail_offre_api(request, offre_id):
  
    lang = request.GET.get('lang', 'fr')
    offre = get_object_or_404(OffreEmploi, id=offre_id) 
    # offre.nombre_vu = offre.nombre_vu+ 1
    # offre.save()
    
    # Filtrer les documents selon la langue
    documents = offre.documents.filter(langue=lang)
    if lang == "ar":
        Nbr_OffreEmploi = OffreEmploi.objects.filter(si_valider_ar=True,client__libelle_ar=(offre.client.libelle_ar if offre.client else None)).select_related('client').count()
        Nbr_AvisInfos = AvisInfos.objects.filter(si_valider_ar=True,client__libelle_ar=(offre.client.libelle_ar if offre.client else None)).select_related('client').count()
        Nbr_AppelOffre = AppelOffre.objects.filter(si_valider_ar=True,client__libelle_ar=(offre.client.libelle_ar if offre.client else None)).select_related('client').count()
    else:
        Nbr_OffreEmploi = OffreEmploi.objects.filter(si_valider=True,client__libelle_fr=(offre.client.libelle_fr if offre.client else None)).select_related('client').count()
        Nbr_AvisInfos = AvisInfos.objects.filter(si_valider=True,client__libelle_fr=(offre.client.libelle_fr if offre.client else None)).select_related('client').count()
        Nbr_AppelOffre = AppelOffre.objects.filter(si_valider=True,client__libelle_fr=(offre.client.libelle_fr if offre.client else None)).select_related('client').count()

    # 3. Préparer les données des documents filtrés par langue
    documents_data = []
    for document in documents:
        documents_data.append({
            "titre_document": document.titre_document,
            "titre_piece_join": document.titre_piece_join,
            "piece_join": request.build_absolute_uri(document.piece_join.url)
                           if document.piece_join else None,
            "date_creation": document.date_creation.strftime('%Y-%m-%d %H:%M:%S'),
            "langue": document.langue,
        })

    # 4. Sélectionner les champs traduits en fonction de la langue
    if lang == 'ar':
        titre       = offre.titre_ar            # suppose que vous avez un champ titre_ar
        description = offre.description_ar      # idem pour description_ar
        lieu        = offre.lieu_ar             # et lieu_ar
        client_nom  = (offre.client.libelle_ar 
                       if offre.client else None)
    else:
        titre       = offre.titre            # champ titre_fr pour le français
        description = offre.description
        lieu        = offre.lieu
        client_nom  = (offre.client.libelle_fr 
                       if offre.client else None)

    # 5. Construire la réponse JSON
    offre_data = {
        "Nbr_AvisInfos": Nbr_AvisInfos,
        "Nbr_OffreEmploi": Nbr_OffreEmploi,
        "Nbr_AppelOffre": Nbr_AppelOffre,
        "id": offre.id,
        "titre": titre,
        "description": description,
        "date_limite": offre.date_limite.strftime('%Y-%m-%d %H:%M') if offre.afficher_heures else offre.date_limite.strftime('%Y-%m-%d'),
        "lieu": lieu,
        "titre_entreprise": offre.titre_entreprise,
        "client__nom": client_nom,
        "date_mise_en_ligne" : offre.date_mise_en_ligne.strftime('%d %B %Y'),
        "client__logo": (request.build_absolute_uri(offre.client.logo.url)
                         if offre.client and offre.client.logo else None),
        "client__site_web": (offre.client.site_web 
                             if offre.client else None),
        "documents": documents_data,
        "afficher_heures": offre.afficher_heures,  # Include the setting for frontend use
        # Optionnel : on renvoie aussi la direction pour le front
        "lang": lang,
        "dir": 'rtl' if lang == 'ar' else 'ltr',
    }

    return JsonResponse(offre_data)


def liste_annoces_cleint(request):
    # Récupérer le paramètre "client" de la requête
    client_name = request.GET.get('client', None)
   


def liste_annonces_client(request):
   
    lang = request.GET.get('lang', 'fr')
    client_name = request.GET.get('client', None)
    # Filtrer les offres par client selon la langue

    if lang == "ar":
        offres_list = OffreEmploi.objects.filter(
            si_valider_ar=True,
            client__libelle_ar=client_name
        ).select_related('client')
    else:
        offres_list = OffreEmploi.objects.filter(
            si_valider=True,
            client__libelle_fr=client_name
        ).select_related('client')
    # Préparer les données selon la langue
    
    offres_data = []
    for off in offres_list:
        
        titre = off.titre_ar if lang == 'ar' and hasattr(off, 'titre_ar') else off.titre
        description = off.description_ar if lang == 'ar' and hasattr(off, 'description_ar') else off.description
        titre_entreprise = off.titre_entreprise_ar if lang == 'ar' and hasattr(off, 'titre_entreprise_ar') else off.titre_entreprise
        lieu = off.lieu_ar if lang == 'ar' and hasattr(off, 'lieu_ar') else off.lieu
        client__special = off.client.special if off.client else False
        # Date: renvoyer structure pour un formatage fiable côté front
        if off.date_limite:
            date_limite = {
                "days": [off.date_limite.day],
                "months": [off.date_limite.month],
                "year": off.date_limite.year,
                "times": [{"hour": off.date_limite.hour, "minute": off.date_limite.minute}] if off.afficher_heures else []
            }
        else:
            date_limite = None

        offres_data.append({
            "id": off.id,
            "titre": titre,
            "description": description,
            "date_limite": date_limite,
            "lieu": lieu,
            "client__special": client__special,
            # "type_s": off.type_s,
            "titre_entreprise": titre_entreprise,
            "client__nom": (off.client.libelle_ar if lang == 'ar' else off.client.libelle_fr) if off.client else None,
            "client__logo": request.build_absolute_uri(off.client.logo.url) if off.client and off.client.logo else None,
            "client__site_web": off.client.site_web if off.client else None,
            "afficher_heures": off.afficher_heures,
            "lang": lang,
            "dir": 'rtl' if lang == 'ar' else 'ltr',
        })
    return JsonResponse(offres_data, safe=False)


@csrf_exempt
def ajouter_offre(request, id):
   
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            client = Client.objects.get(id=id)

            offre = OffreEmploi.objects.create(
                client=client,
                titre=data['titre'],
                description=data['description'],
                type_offre=data['type_offre'],
                date_limite=data['date_limite'],
                lieu=data['lieu'],
                si_national=data['si_national']

            )
         
            return JsonResponse({"message": "Offre ajoutée avec succès", "offre_id": offre.id}, status=201)
        except Client.DoesNotExist:
            return JsonResponse({"error": "Client non trouvé"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)



@csrf_exempt
def update_offre_emploi(request, id):
    """
    Met à jour une offre d'emploi existante.
    """
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            offre = get_object_or_404(OffreEmploi, id=id)

            # Mise à jour des champs avec les données reçues
            for key, value in data.items():
                setattr(offre, key, value)

            offre.save()
            return JsonResponse({'message': 'Offre mise à jour avec succès'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Format JSON invalide'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

def nombre_offreemplois(request, id):
    try:
        client = get_object_or_404(Client, id=id)
        nombre_offres = OffreEmploi.objects.filter(client=client).count()

        return JsonResponse({"client_id": client.id, "nombre_offres": nombre_offres})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def nombre_offreemplois_tous(request ):
    try:
        nombre_offres = OffreEmploi.objects.count()

        return JsonResponse({ "nombre_offres": nombre_offres})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    

import json
from django.http import JsonResponse

@csrf_exempt
def modifier_type_offre(request, offre_id):
    
    offre = get_object_or_404(OffreEmploi, id=offre_id)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            nouveau_type = data.get('type_offre')

            if not nouveau_type:
                return JsonResponse({"error": "Le champ 'type_offre' est requis."}, status=400)

            offre.type_offre = nouveau_type
            offre.save()

            return JsonResponse({
                "message": "Type d'offre modifié avec succès",
                "offre": OffreEmploiSerializer(offre, context={'request': request}).data
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Données JSON invalides."}, status=400)

    return JsonResponse({"error": "Méthode non autorisée."}, status=405)



@csrf_exempt
def ajouter_document(request, offre_emploi_id):
    offre_emploi = get_object_or_404(OffreEmploi, id=offre_emploi_id)
    if request.method == 'POST' and request.FILES.get('piece_join'):
        titre_document = request.POST.get('titre_document')
        piece_join = request.FILES.get('piece_join')

        if not titre_document:
            return JsonResponse({'error': "Le champ 'titre_document' est requis"}, status=400)

        # Normaliser la langue reçue depuis le front
        langue_label = (request.POST.get('langue') or '').strip()
        langue_map = {
            'Français': 'fr',
            'Francais': 'fr',
            'fr': 'fr',
            'FR': 'fr',
            'Arabe': 'ar',
            'ar': 'ar',
            'AR': 'ar',
            # Valeur non supportée (ex: Anglais) => fallback sur 'fr'
        }
        langue_code = langue_map.get(langue_label, 'fr')

        # Remplir le champ obligatoire titre_piece_join si non fourni
        titre_piece_join = request.POST.get('titre_piece_join')
        if not titre_piece_join:
            # Par défaut: reprendre le libellé ou le nom du fichier
            titre_piece_join = titre_document or getattr(piece_join, 'name', 'document')

        try:
            document = Document(
                langue=langue_code,
                titre_document=titre_document,
                titre_piece_join=titre_piece_join,
                piece_join=piece_join,
                offre_emploi=offre_emploi
            )
            document.save()
            return JsonResponse({'success': 'Document ajouté avec succès', 'document_id': document.id}, status=200)
        except Exception as e:
            return JsonResponse({'error': f"Échec lors de l'ajout du document: {str(e)}"}, status=500)
    
    return JsonResponse({'error': 'Requête invalide ou fichier manquant'}, status=400)  # Bad request



import os
from django.http import JsonResponse
from .models import Document

def get_documents_by_offre(request, offre_id):
    """Récupère les documents d'une offre d'emploi avec extension et taille"""
    documents = Document.objects.filter(offre_emploi=offre_id)

    data = []
    for doc in documents:
        data.append({
            "id": doc.id,
            "titre_document": doc.titre_document,
            "titre_piece_join": doc.titre_piece_join,
            "extension": os.path.splitext(doc.piece_join.name)[1].lower().replace(".", ""),  # Extension
            "taille": doc.piece_join.size,  # Taille en octets
            "piece_join_url": doc.piece_join.url,  # URL du fichier
        })

    return JsonResponse({"documents": data})

@csrf_exempt  # Désactiver CSRF pour simplifier le test (à sécuriser en production)
def delete_document(request, document_id):
    """Supprime un document par son ID"""
    if request.method == "DELETE":
        try:
            document = Document.objects.get(id=document_id)
            document.delete()
            return JsonResponse({"message": "Document supprimé avec succès"}, status=200)
        except Document.DoesNotExist:
            return JsonResponse({"error": "Document non trouvé"}, status=404)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)



# @api_view(['POST'])
# def login_view(request):
#     email = request.data.get("email")
#     password = request.data.get("password")
    
#     print(f"Tentative de connexion pour l'email : {email}")

#     # Vérifier si l'utilisateur existe avec cet email
#     try:
#         user = UtilisateurPersonnalise.objects.get(email=email)
#     except UtilisateurPersonnalise.DoesNotExist:
#         return JsonResponse({"error": "Utilisateur non trouvé"}, status=400)

#     # Authentification avec username=email
#     user = authenticate(username=user.username, password=password)

#     if user is not None:
#         token, created = Token.objects.get_or_create(user=user)

#         # Vérifier le rôle et récupérer l'ID correspondant
#         role_id = None
#         if user.role == "client":
#             try:
#                 client = Client.objects.get(utilisateur=user)
#                 role_id = client.id
#             except Client.DoesNotExist:
#                 return JsonResponse({"error": "Aucun client associé à cet utilisateur."}, status=400)

#         elif user.role == "candidat":
#             try:
#                 candidat = Candidat.objects.get(utilisateur=user)
#                 role_id = candidat.id
#             except Candidat.DoesNotExist:
#                 return JsonResponse({"error": "Aucun candidat associé à cet utilisateur."}, status=400)

#         return JsonResponse({
#             "token": token.key,
#             "user_id": user.id,
#             "role_id": role_id,  # ID du client ou du candidat
#             "username": user.username,
#             "role": user.role
#         })

#     else:
#         return JsonResponse({"error": "Email ou mot de passe incorrect"}, status=400)



from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from .models import UtilisateurPersonnalise, Client, Candidat

@api_view(['POST'])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    

    # Vérifier si l'utilisateur existe avec cet email
    try:
        user = UtilisateurPersonnalise.objects.get(username=email)
    except UtilisateurPersonnalise.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé."}, status=status.HTTP_400_BAD_REQUEST)

    # Authentification avec username=email
    user = authenticate(username=user.username, password=password)

    if user is not None:
        # Vérifier si c'est un client et si son compte est validé
        if user.role.name == "client" and not user.valide:
            return Response({"message": "Votre compte client n'a pas encore été validé."}, status=status.HTTP_403_FORBIDDEN)

        token, created = Token.objects.get_or_create(user=user)

        # Vérifier le rôle et récupérer l'ID correspondant
        role_id = None
        if user.role.name == "client":
            try:
                client = Client.objects.get(utilisateur=user)
                role_id = client.id
            except Client.DoesNotExist:
                return Response({"error": "Aucun client associé à cet utilisateur."}, status=status.HTTP_400_BAD_REQUEST)

        elif user.role.name == "candidat":
            try:
                candidat = Candidat.objects.get(utilisateur=user)
                role_id = candidat.id
            except Candidat.DoesNotExist:
                return Response({"error": "Aucun candidat associé à cet utilisateur."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "token": token.key,
            "user_id": user.id,
            "role_id": role_id,
            "username": user.username,
            "role": user.role.name
        })

    else:
        return Response({"error": "Email ou mot de passe incorrect."}, status=status.HTTP_400_BAD_REQUEST)

# from .serializers import UserSerializer

@api_view(['GET'])
def get_compte_by_candidat(request, candidat_id):
    try:
        candidat = Candidat.objects.get(id=candidat_id)
        utilisateur = candidat.utilisateur
    except Candidat.DoesNotExist:
        return Response({'error': 'Candidat non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UtilisateurSerializer(utilisateur)
    return Response(serializer.data)




@api_view(['PUT'])
def update_compte_by_candidat(request, candidat_id):
    try:
        candidat = Candidat.objects.get(id=candidat_id)
        utilisateur = candidat.utilisateur
    except Candidat.DoesNotExist:
        return Response({'error': 'Candidat non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UtilisateurSerializer(utilisateur, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['PUT'])
def update_compte_by_client(request, client_id):
    
    try:
        client = Client.objects.get(id= client_id)
        utilisateur = client.utilisateur
    except Candidat.DoesNotExist:
        return Response({'error': 'Candidat non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UtilisateurSerializer(utilisateur, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UtilisateurPersonnalise

@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get("email")
    try:
        user = UtilisateurPersonnalise.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

        # Envoi de l’email
        send_mail(
            subject="Réinitialisation du mot de passe",
            message=f"Cliquez sur ce lien pour réinitialiser votre mot de passe : {reset_link}",
            from_email="noreply@monsite.com",
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Un email de réinitialisation a été envoyé."}, status=status.HTTP_200_OK)
    except UtilisateurPersonnalise.DoesNotExist:
        return Response({"error": "Aucun utilisateur trouvé avec cet email."}, status=status.HTTP_400_BAD_REQUEST)



from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def reset_password_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = UtilisateurPersonnalise.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, UtilisateurPersonnalise.DoesNotExist):
        return Response({"error": "Lien invalide."}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Token invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)

    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
        return Response({"error": "Les mots de passe ne correspondent pas."}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(new_password)
    user.save()

    return Response({"message": "Mot de passe réinitialisé avec succès."}, status=status.HTTP_200_OK)



@csrf_exempt 
@api_view(['POST'])
def increment_vue(request, offre_id):
    # try:
    #     offre = OffreEmploi.objects.get(id=offre_id)
    #     offre.nombre_vu += 1
    #     offre.save()
    #     return JsonResponse({'status': 'success', 'nombre_vu': offre.nombre_vu})
    # except OffreEmploi.DoesNotExist:
    #     return JsonResponse({'status': 'error', 'message': 'Offre non trouvée'}, status=404)

        try:
            offre = OffreEmploi.objects.get(id=offre_id)
            offre.nombre_vu = models.F('nombre_vu') + 1
            offre.save()
            offre.refresh_from_db()  # Pour obtenir la nouvelle valeur réelle
            return JsonResponse({'nombre_vu': offre.nombre_vu})
        except OffreEmploi.DoesNotExist:
            return JsonResponse({'error': 'Offre non trouvée'}, status=404)


@csrf_exempt
@permission_required(["offres_emploi.change_offreemploi", "avis_infos.add_avisinfos", "appels_offres.add_appeloffre"], raise_exception=True)
def convert_post_category_view(request, post_id):
    """Convert an offres_emploi post to another category"""
    from .conversion_service import convert_offre_to_other_category, get_conversion_options_for_offre
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            target_category = data.get('target_category')
            new_type = data.get('new_type')
            
            if not target_category or not new_type:
                return JsonResponse({
                    'success': False, 
                    'message': 'Target category and type are required'
                }, status=400)
            
            # Perform conversion
            result = convert_offre_to_other_category(
                offre_id=post_id,
                target_category=target_category,
                new_type=new_type
            )
            
            if result['success']:
                # Add redirect URL
                redirect_urls = {
                    'offres_emploi': '/offres',
                    'appels_offres': '/appels_offres/appel-offres',
                    'avis_infos': '/avis_infos/avis-infos'
                }
                result['redirect_url'] = redirect_urls.get(target_category, '/offres')
                
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Conversion failed: {str(e)}'
            }, status=500)
    
    elif request.method == 'GET':
        # Return available conversion options
        try:
            available = get_conversion_options_for_offre()
            return JsonResponse({
                'success': True,
                'categories': available,
                'current_category': 'offres_emploi'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error loading categories: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)






