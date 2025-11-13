import json
import os
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import permission_required
from .serializers import AppelOffreSerializer
from .forms import *
from django.forms import modelformset_factory
from django.contrib import messages
from django.db.models import Count, Q
from .models import *
from avis_infos.models import *
from offres_emploi.models import *
from .forms import *
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms import formset_factory, inlineformset_factory
from django.utils.html import strip_tags
from .decorators import has_any_permission_for_model


def traduction_appel_offre(request):
    # Récupérer toutes les offres d'emploi avec le nombre d'offres publiées du client
    offres = AppelOffre.objects.annotate(
        nombre_offres_publiees=Count('client__appels_offres', filter=Q(client__offres_emploi__si_valider=True))
    )
    
    # Actions de l'administrateur
    if request.method == 'POST':
        action = request.POST.get('action')
        offre_id = request.POST.get('offre_id')

        if action and offre_id:
            offre = get_object_or_404(AppelOffre, id=offre_id)

            # if action == 'publier':
            #     if offre.si_valider:  # Vérifier si l'offre est validée
            #         offre.si_publier = True
            #         offre.save()
            #         messages.success(request, f"L'offre '{offre.titre}' a été publiée.")
            #     else:
            #         messages.error(request, f"L'offre '{offre.titre}' ne peut pas être publiée car elle n'est pas validée.")
            # elif action == 'depublier':
            #     offre.si_publier = False
            #     offre.save()
            #     messages.success(request, f"L'offre '{offre.titre}' a été dépubliée.")
            if action == 'valider':
                if request.user.has_perm('appels_offres.valider_appeloffre'):
                    offre.si_valider = True
                    offre.valider_par = request.user
                    # Only set date_mise_en_ligne if not already set
                    if not offre.date_mise_en_ligne:
                        offre.date_mise_en_ligne = timezone.now()
                    offre.save()
                    
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été validée.")
                
            elif action == 'invalider':
                if request.user.has_perm('appels_offres.valider_appeloffre'):
                    offre.si_valider = False
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été invalidée et dépubliée.")
            elif action == 'supprimer':
                if request.user.has_perm('appels_offres.delete_appeloffre'):
                    offre.delete()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été supprimée.")
            elif action == 'modifier':
                if request.user.has_perm('appels_offres.change_appeloffre'):
                    return redirect('modifier_appels_offres', offre_id=offre.id)
            elif action == 'details':
                if request.user.has_perm('appels_offres.valider_appeloffre'):
                    return redirect('detail_offre', offre_id=offre.id)
            elif action == 'groupement':
                return redirect('groupement_offres', offre_id=offre.id)

    return render(request, 'traduction.html', {
        'offres': offres,
    })
    
# @login_required
# @permission_required('offres_emploi.change_offreemploi', raise_exception=True)
def traduire_offre(request, offre_id):
    offre = get_object_or_404(AppelOffre, id=offre_id)

    # --- Suppression d’un document existant ---
    if request.method == 'POST' and request.POST.get('action') == 'supprimer':
        doc_id = request.POST.get('delete_doc_id')

        try:
            doc = Document.objects.get(id=doc_id, appels_offres=offre)
            doc.delete()
            messages.success(request, "Document supprimé avec succès.")
        except Document.DoesNotExist:
            messages.error(request, "Document introuvable ou non autorisé.")
        return redirect('traduire_appel_offre', offre_id=offre.id)

    # Form de traduction et formset new (reste inchangé)…
    form_offre = TraductionAppelOffre(request.POST or None, instance=offre)
    DocumentFormSet = inlineformset_factory(
        AppelOffre, Document,
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
        return redirect('appels_offres')

    docs_exist = offre.documents.all()
    return render(request, 'traduction_appels_offres.html', {
        'form':        form_offre,
        'formset_new': formset_new,
        'docs_exist':  docs_exist,
        'offre':       offre,
    })

@permission_required("appels_offres.add_appeloffre", raise_exception=True)
def creer_appels_offres(request):
    DocumentFormSet = formset_factory(DocumentForm, extra=0)  # Formulaire dynamique pour les documents

    if request.method == 'POST':
        offre_form = AppelOffreForm(request.POST)
        document_formset = DocumentFormSet(request.POST, request.FILES)

        if offre_form.is_valid():
            # Enregistrer d'abord l'Appel d'Offre
            appel_offre = offre_form.save()

            # Associer chaque document à cet Appel d'Offre
            if document_formset.is_valid():
                for form in document_formset:
                    document = form.save(commit=False)
                    document.appels_offres = appel_offre  # Associer au nouvel appel d'offre
                    document.save()

            messages.success(request, "L'appel d'offre a été créé avec succès !")
            return redirect('appels_offres')

    else:
        offre_form = AppelOffreForm()
        document_formset = DocumentFormSet()

    return render(request, 'creer_appels_offres.html', {
        'offre_form': offre_form,
        'document_formset': document_formset
    })

@login_required
# @permission_required("appels_offres.view_appeloffre", raise_exception=True)
@has_any_permission_for_model('AppelOffre','appels_offres')
def admin_appels_offres(request):
    if(request.user.role.name != 'admin'):
    # Récupérer toutes les offres d'emploi avec le nombre d'offres publiées du client
        offres = AppelOffre.objects.annotate(
            nombre_offres_publiees=Count('client__appels_offres', filter=Q(client__appels_offres__si_valider=True))
        ).filter(a_traduire=True).order_by('-date_creation')
    else:
        offres = AppelOffre.objects.annotate(
            nombre_offres_publiees=Count('client__appels_offres', filter=Q(client__appels_offres__si_valider=True))
        ).order_by('-date_creation')

    # Actions de l'administrateur
    if request.method == 'POST':
        action = request.POST.get('action')
        offre_id = request.POST.get('offre_id')

        if action and offre_id:
            offre = get_object_or_404(AppelOffre, id=offre_id)

            # if action == 'publier':
            #     if offre.si_valider:  # Vérifier si l'offre est validée
            #         offre.si_publier = True
            #         offre.save()
            #         messages.success(request, f"L'offre '{offre.titre}' a été publiée.")
            #     else:
            #         messages.error(request, f"L'offre '{offre.titre}' ne peut pas être publiée car elle n'est pas validée.")
            # elif action == 'depublier':
            #     offre.si_publier = False
            #     offre.save()
            #     messages.success(request, f"L'offre '{offre.titre}' a été dépubliée.")
            # if action == 'valider':
            #     if request.user.has_perm('appels_offres.valider_appeloffre'):
            #         offre.si_valider = True
            #         offre.valider_par = request.user
            #         # Only set date_mise_en_ligne if not already set
            #         if not offre.date_mise_en_ligne:
            #             offre.date_mise_en_ligne = timezone.now()
            #         offre.save()
                    
            #         messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été validée.")
                
            # elif action == 'invalider':
            #     if request.user.has_perm('appels_offres.valider_appeloffre'):
            #         offre.si_valider = False
            #         # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
            #         offre.save()
            #         messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été invalidée et dépubliée.")
            
            if action == 'valider_fr' and request.user.has_perm('appels_offres.valider_appeloffre'):
                offre.si_valider = True
                offre.valider_par = request.user
                if not offre.date_mise_en_ligne:
                    offre.date_mise_en_ligne = timezone.now()
                offre.save()
                messages.success(request, f"L'appel d'offres '{strip_tags(offre.titre)}' a été validé (Français).")
            elif action == 'invalider_fr' and request.user.has_perm('appels_offres.valider_appeloffre'):
                offre.si_valider = False
                offre.save()
                messages.success(request, f"L'appel d'offres '{strip_tags(offre.titre)}' a été invalidé (Français).")
            elif action == 'valider_ar' and request.user.has_perm('appels_offres.valider_ar_appeloffre'):
                if not offre.titre_ar or not offre.description_ar:
                    messages.error(request, f"L'appel d'offres '{strip_tags(offre.titre)}' ne peut pas être validé en arabe car les champs de traduction sont manquants.")
                else:
                    offre.si_valider_ar = True
                    offre.valider_par = request.user
                    if not offre.date_mise_en_ligne:
                        offre.date_mise_en_ligne = timezone.now()
                    offre.save()
                    messages.success(request, f"L'appel d'offres '{strip_tags(offre.titre)}' a été validé (Arabe).")
            elif action == 'invalider_ar' and request.user.has_perm('appels_offres.valider_ar_appeloffre'):
                offre.si_valider_ar = False
                offre.save()
                messages.success(request, f"L'appel d'offres '{strip_tags(offre.titre)}' a été invalidé (Arabe).")
                
            elif action == 'Valide_a_traduire':
                if request.user.has_perm('appels_offres.traduire_appeloffre'):
                    offre.a_traduire = True
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' pres a traduire")
            elif action == 'Invalider_a_traduire':
                if request.user.has_perm('appels_offres.traduire_appeloffre'):
                    offre.a_traduire = False
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    offre.save()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' n'est pas pres a traduire")
            elif action == 'supprimer':
                if request.user.has_perm('appels_offres.delete_appeloffre'):
                    offre.delete()
                    messages.success(request, f"L'offre '{strip_tags(offre.titre)}' a été supprimée.")
            elif action == 'modifier':
                if request.user.has_perm('appels_offres.change_appeloffre'):
                    return redirect('modifier_appels_offres', offre_id=offre.id)
            elif action == 'details':
                if request.user.has_perm('appels_offres.valider_appeloffre'):
                    return redirect('detail_offre', offre_id=offre.id)
            elif action == 'groupement':
                return redirect('groupement_offres', offre_id=offre.id)

    return render(request, 'appels_offres.html', {
        'offres': offres,
    })
    


@permission_required("appels_offres.change_appeloffre", raise_exception=True)
def modifier_appels_offres(request, offre_id):
    offre = get_object_or_404(AppelOffre, id=offre_id)
    
    offres_disponibles = AppelOffre.objects.none()
    offres_liees = AppelOffre.objects.none()

    if request.method == 'POST':
        offre_form = AppelOffreForm(request.POST, instance=offre)
        document_formset = DocumentFormSetModifier(request.POST, request.FILES, queryset=Document.objects.filter(appels_offres=offre), prefix='documents')
        
        offres_groupees = request.POST.get("offres_groupees", "")  # Récupérer les IDs sous forme de chaîne
        offres_ids = offres_groupees.split(",") if offres_groupees else []

        
        if offre_form.is_valid() and document_formset.is_valid():
            offre_form.save()
            documents = document_formset.save(commit=False)
            for document in documents:
                document.appels_offres = offre  # Assigner l'offre au document
                document.save()
            # Supprimer les documents marqués pour suppression
            for document in document_formset.deleted_objects:
                document.delete()

            document_formset.save_m2m()
        return redirect('appels_offres')

            
    else:
        offre_form = AppelOffreForm(instance=offre)
        document_formset = DocumentFormSetModifier(queryset=Document.objects.filter(appels_offres=offre), prefix='documents')
    if offre.si_principal:
        offres_liees = offre.get_offres_liees()
        offres_disponibles = AppelOffre.objects.filter(
            client=offre.client, 
            si_groupement=False, 
            
            ).exclude(id=offre.id)
    elif not offre.si_groupement:
        offres_disponibles = AppelOffre.objects.filter(
            client=offre.client, 
            si_groupement=False, 
            
            ).exclude(id=offre.id)
        
    return render(request, 'modifier_appels_offres.html', {
        'offre': offre,
        'offre_form': offre_form,
        'document_formset': document_formset,
        'offres_disponibles': offres_disponibles,
        'offres_liees': offres_liees,
    })
    
@permission_required("appels_offres.delete_appeloffre", raise_exception=True)
def supprimer_document(request, document_id):
    # Récupérer le document à supprimer
    document = get_object_or_404(Document, id=document_id)

    # Vérifier que l'utilisateur est un client et que le document appartient à une de ses offres
    if hasattr(request.user, 'client') :
        if document.appels_offres.client != request.user.client:
            return redirect('accueil')  # Rediriger si l'utilisateur n'est pas autorisé
    else:
        # Supprimer le document
        document.delete()
        return redirect('modifier_appels_offres', offre_id=document.appels_offres.id)

@permission_required("appels_offres.view_appeloffre", raise_exception=True) 
def get_appels_offres_details(request, offre_id):
    # Récupérer l'offre en fonction de son ID
    offre = get_object_or_404(AppelOffre, id=offre_id)
    
    # Récupérer les documents associés à l'offre
    documents = Document.objects.filter(appels_offres=offre)
    
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
                'piece_join': doc.piece_join.url if doc.piece_join else None  # URL du document si le fichier existe
            }
            for doc in documents
        ]
    }
    
    # Renvoyer les données au format JSON
    return JsonResponse(data)

@csrf_exempt
@permission_required("appels_offres.grouper_appeloffre", raise_exception=True)
def ajouter_au_groupe_appels_offre(request):
    if request.method == 'POST':
        # Logique pour ajouter l'offre au groupe
        try:
            current_offer_id = request.POST.get('current_offer_id')
            offer_id = request.POST.get('offer_id')

            # Récupérer les objets Offre correspondants
            offre_principale = AppelOffre.objects.get(pk=current_offer_id)
            offre_a_modifier = AppelOffre.objects.get(pk=offer_id)

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
@permission_required("appels_offres.grouper_appeloffre", raise_exception=True)
def retirer_du_groupe_appels_offre(request):
    if request.method == 'POST':
        # Logique pour retirer l'offre du groupe
        try:
            current_offer_id = request.POST.get('current_offer_id')
            offer_id = request.POST.get('offer_id')
            offre_principale = AppelOffre.objects.get(pk=current_offer_id)
            offre_a_modifier = AppelOffre.objects.get(pk=offer_id)

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


# def liste_appels_offres(request):
#     offres = AppelOffre.objects.all().select_related('client').values(
#         'id',
#         'titre',
#         'description',
#         'date_limite',
#         'lieu',
#         'titre_entreprise',
#         'libelle_fr',
#         'client__logo',  # Contient le chemin de l'image
#         'client__site_web',
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

from django.http import JsonResponse

def listcompler_appels_offres(request):
    offres_list = AppelOffre.objects.filter(si_valider=True).order_by('-date_limite').select_related('client')
                
    offres_data = [
        {
            "id": off.id,
            'titre': off.titre,
            'description': off.description,
            'type_s': off.type_s,
            'date_limite': off.date_limite,  # Utiliser la méthode formatée
            'lieu': off.lieu,
            "type_s": off.type_s,
            'titre_entreprise': off.titre_entreprise,
            'client__nom': off.client.libelle_fr if off.client else None,
            'client__logo': request.build_absolute_uri(off.client.logo.url) if off.client.logo else None,
            'client__site_web': off.client.site_web if off.client else None,
        }
        for off in offres_list
    ]
    return JsonResponse(offres_data, safe=False)



# def liste_appels_offres(request):
#     lang = request.GET.get('lang', 'fr')
#     mois_fr = [
#         "janvier","février","mars","avril","mai","juin",
#         "juillet","août","septembre","octobre","novembre","décembre"
#     ]
#     mois_ar = [
#         "يناير","فبراير","مارس","أبريل","مايو","يونيو",
#         "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
#     ]
#     mois = mois_ar if lang == 'ar' else mois_fr

#     # 3) Récupération des appels d'offres validés
#     appels = (
#         AppelOffre.objects
#           .filter(si_valider=True)
#           .filter(Q(si_principal=True) | Q(offre_principale__isnull=True))
#           .select_related('client')
#           .prefetch_related('offres_liees')
#            .order_by('-date_mise_en_ligne')
#     )

#     data = []
#     for appel in appels:
#         liés = appel.get_offres_liees().filter(si_valider=True)

#         # 4) Construction de date_limite_grouped
#         if appel.si_principal and liés:
#             dates = sorted(
#                 [appel.date_limite] + [o.date_limite for o in liés if o.date_limite]
#             )
#             days   = sorted({d.day   for d in dates})
#             months_idx = sorted({d.month for d in dates})
#             years  = sorted({d.year  for d in dates})
#             times  = sorted({(d.hour,d.minute) for d in dates})

#             if len(years) == 1:
#                 date_limite = {
#                     "days":   days,
#                     "months": [mois[m-1] for m in months_idx],
#                     "year":   years[0],
#                     "times":  [{"hour": h, "minute": m} for h,m in times]
#                 }
#             else:
#                 parts = []
#                 for (j,mn,yr,hh,mi) in sorted({(d.day,d.month,d.year,d.hour,d.minute) for d in dates}):
#                     suffix = f" {hh:02d}:{mi:02d}" if (hh or mi) else ""
#                     parts.append(f"{j} {mois[mn-1]} {yr}{suffix}")
#                 date_limite = ", ".join(parts)
#         else:
#             d = appel.date_limite
#             if d:
#                 date_limite = {
#                     "days":   [d.day],
#                     "months": [mois[d.month-1]],
#                     "year":   d.year,
#                     "times":  [{"hour": d.hour, "minute": d.minute}]
#                 }
#             else:
#                 date_limite = "N/A"

#         # 5) Sélection des champs selon la langue
#         titre       = appel.titre_ar       if lang=='ar' else appel.titre
#         description = appel.description_ar if lang=='ar' else appel.description
#         lieu        = appel.lieu_ar        if lang=='ar' else appel.lieu
#         type_s = appel.type_s       if lang=='ar' else appel.type_s
#         client_nom  = (
#             appel.client.libelle_ar if appel.client and lang=='ar'
#             else appel.client.libelle_fr if appel.client
#             else None
#         )

#         # 6) Assemblage de l'objet JSON
#         data.append({
#             "id":               appel.id,
#             "client__special":  appel.client.special if appel.client else False,
#             "titre":            titre,
#             "description":      description,
#             "date_limite":      date_limite,
#             "lieu":             lieu,
#              "type_s":type_s,
#             "titre_entreprise": appel.titre_entreprise,
#             "client__nom":      client_nom,
#             "client__logo":     (request.build_absolute_uri(appel.client.logo.url)
#                                   if appel.client and appel.client.logo else None),
#             "client__site_web": appel.client.site_web if appel.client else None,
#             "si_principal":     appel.si_principal,
#             "offres_liees":     [
#                 {
#                     "id":          o.id,
#                     "titre":       (o.titre_ar if lang=='ar' else o.titre),
#                     "date_limite": {
#                         "days":   [o.date_limite.day],
#                         "months": [mois[o.date_limite.month-1]],
#                         "year":   o.date_limite.year,
#                         "times":  [{"hour": o.date_limite.hour, "minute": o.date_limite.minute}]
#                     } if o.date_limite else "N/A",
#                     "lieu":        (o.lieu_ar if lang=='ar' else o.lieu)
#                 }
#                 for o in liés
#             ] if appel.si_principal else [],
#             # Indication pour le front : sens d’écriture
#             "lang": lang,
#             "dir":  'rtl' if lang=='ar' else 'ltr'
#         })
        
#     return JsonResponse(data, safe=False)

from parametres.models import Parametres

def liste_appels_offres(request):
    lang = request.GET.get('lang', 'fr')
    valeur_liste = request.GET.get('listes', 'noncomplet')
    

    mois_fr = ["janvier","février","mars","avril","mai","juin",
               "juillet","août","septembre","octobre","novembre","décembre"]
    mois_ar = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
               "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
    mois = mois_ar if lang == 'ar' else mois_fr

    # ✅ Récupération du nombre limite d'appels depuis Parametres
    param = Parametres.objects.last()
    limite = param.nombreapplesAr if lang == 'ar' else param.nombreapples

    # ✅ Récupération des appels d’offres validés, limités
    if lang == 'fr' :
        appels = (
            AppelOffre.objects
            .filter(si_valider=True)
            .filter(Q(si_principal=True) | Q(offre_principale__isnull=True))
            .select_related('client')
            .prefetch_related('offres_liees')
            .order_by('-date_mise_en_ligne')[:limite]
        )
    else:
        appels = (
            AppelOffre.objects
            .filter(si_valider_ar=True)
            .filter(Q(si_principal=True) | Q(offre_principale__isnull=True))
            .select_related('client')
            .prefetch_related('offres_liees')
            .order_by('-date_mise_en_ligne')[:limite]
        )

    data = []
    for appel in appels:
        liés = appel.get_offres_liees().filter(si_valider=True)

        if appel.si_principal and liés:
            dates = sorted([appel.date_limite] + [o.date_limite for o in liés if o.date_limite])
            days = sorted({d.day for d in dates})
            months_idx = sorted({d.month for d in dates})
            years = sorted({d.year for d in dates})
            times = sorted({(d.hour, d.minute) for d in dates})
            if valeur_liste == 'noncomplet':
                if len(years) == 1:
                    date_limite = {
                        "days": days,
                        "months": [mois[m-1] for m in months_idx],
                        "year": years[0],
                        "times": [{"hour": h, "minute": m} for h, m in times] if appel.afficher_heures else []
                    }
                else:
                    date_limite = ", ".join(
                        f"{j} {mois[mn-1]} {yr}{f' {hh:02d}:{mi:02d}' if (hh or mi) and appel.afficher_heures else ''}"
                        for (j, mn, yr, hh, mi) in sorted({(d.day, d.month, d.year, d.hour, d.minute) for d in dates})
                    )
            else:
                b = appel.date_limite
                if b:
                    date_limite = {
                        "days": [b.day],
                        "months": [mois[b.month-1]],
                        "year": b.year,
                        "times": [{"hour": b.hour, "minute": b.minute}] if appel.afficher_heures else []
                    }
        else:
            d = appel.date_limite
            if d:
                date_limite = {
                    "days": [d.day],
                    "months": [mois[d.month-1]],
                    "year": d.year,
                    "times": [{"hour": d.hour, "minute": d.minute}] if appel.afficher_heures else []
                }
            else:
                date_limite = "N/A"

        titre       = appel.titre_ar if lang == 'ar' else appel.titre
        description = appel.description_ar if lang == 'ar' else appel.description
        lieu        = appel.lieu_ar if lang == 'ar' else appel.lieu
        type_s      = appel.type_s if lang == 'ar' else appel.type_s
        client_nom  = appel.client.libelle_ar if lang == 'ar' and appel.client else \
                      appel.client.libelle_fr if appel.client else None
        

        data.append({
            "id": appel.id,
            "client__special": appel.client.special if appel.client else False,
            "titre": titre,
            "description": description,
            "date_limite": date_limite,
            "lieu": lieu,
            "type_s": type_s,
            "titre_entreprise": appel.titre_entreprise,
            "client__nom": client_nom,
            "client__logo": request.build_absolute_uri(appel.client.logo.url) if appel.client and appel.client.logo else None,
            "client__site_web": appel.client.site_web if appel.client else None,
            "si_principal": appel.si_principal,
            "offres_liees": [
                {
                    "id": o.id,
                    "titre": o.titre_ar if lang == 'ar' else o.titre,
                    "date_limite": {
                        "days": [o.date_limite.day],
                        "months": [mois[o.date_limite.month-1]],
                        "year": o.date_limite.year,
                        "times": [{"hour": o.date_limite.hour, "minute": o.date_limite.minute}] if o.afficher_heures else []
                    } if o.date_limite else "N/A",
                    "lieu": o.lieu_ar if lang == 'ar' else o.lieu,
                    "client__special" : o.client.special if o.client else False
                }
                for o in liés
            ] if appel.si_principal else [],
            "lang": lang,
            "dir": "rtl" if lang == 'ar' else "ltr"
        })

    return JsonResponse(data, safe=False)


def detail_apple_offre_api(request, apple_id):

    lang = request.GET.get('lang', 'fr')
    appel = get_object_or_404(AppelOffre, id=apple_id)
    documents = appel.documents.all()
    if lang == "ar":
        Nbr_AppelOffre = AppelOffre.objects.filter(si_valider_ar=True,client__libelle_ar=(appel.client.libelle_ar if appel.client else None)).select_related('client').count()
        Nbr_AvisInfos = AvisInfos.objects.filter(si_valider_ar=True,client__libelle_ar=(appel.client.libelle_ar if appel.client else None)).select_related('client').count()
        Nbr_OffreEmploi = OffreEmploi.objects.filter(si_valider_ar=True,client__libelle_ar=(appel.client.libelle_ar if appel.client else None)).select_related('client').count()
    else:
        Nbr_AppelOffre = AppelOffre.objects.filter(si_valider=True,client__libelle_fr=(appel.client.libelle_fr if appel.client else None)).select_related('client').count()
        Nbr_AvisInfos = AvisInfos.objects.filter(si_valider=True,client__libelle_fr=(appel.client.libelle_fr if appel.client else None)).select_related('client').count()
        Nbr_OffreEmploi = OffreEmploi.objects.filter(si_valider=True,client__libelle_fr=(appel.client.libelle_fr if appel.client else None)).select_related('client').count()


    # 3. Préparer les données des documents (inchangé)
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
        titre       = appel.titre_ar            # suppose que vous avez un champ titre_ar
        description = appel.description_ar      # idem pour description_ar
        lieu        = appel.lieu_ar             # et lieu_ar
        client_nom  = (appel.client.libelle_ar 
                       if appel.client else None)
    else:
        titre       = appel.titre            # champ titre_fr pour le français
        description = appel.description
        lieu        = appel.lieu
        client_nom  = (appel.client.libelle_fr 
                       if appel.client else None)

    # 5. Construire la réponse JSON
    offre_data = {
        "Nbr_AvisInfos": Nbr_AvisInfos,
        "Nbr_OffreEmploi": Nbr_OffreEmploi,
        "Nbr_AppelOffre": Nbr_AppelOffre,
        "id": appel.id,
        "titre": titre,
        "description": description,
        "date_limite": appel.date_limite.strftime('%Y-%m-%d %H:%M') if appel.afficher_heures and appel.date_limite else (appel.date_limite.strftime('%Y-%m-%d') if appel.date_limite else None),
        "lieu": lieu,
        "titre_entreprise": appel.titre_entreprise,
        "client__nom": client_nom,
        "date_mise_en_ligne": appel.date_mise_en_ligne.isoformat() if appel.date_mise_en_ligne else None,
        "client__logo": (request.build_absolute_uri(appel.client.logo.url)
                         if appel.client and appel.client.logo else None),
        "client__site_web": (appel.client.site_web 
                             if appel.client else None),
        "documents": documents_data,
        "afficher_heures": appel.afficher_heures,  # Include the setting for frontend use
        # Optionnel : on renvoie aussi la direction pour le front
        "lang": lang,
        "dir": 'rtl' if lang == 'ar' else 'ltr',
    }

    return JsonResponse(offre_data)





from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AppelOffre

@csrf_exempt
def liste_appels_offres_partype(request):
    type_offre = request.GET.get('type', None)
    lang = request.GET.get('lang', 'fr')
    if type_offre:
        if lang == "ar":
            offres = AppelOffre.objects.filter(
            type_s__iexact=type_offre ,si_valider_ar=True
            ).select_related('client').prefetch_related('offres_liees').order_by('date_limite')
        else:
            offres = AppelOffre.objects.filter(
            type_s__iexact=type_offre ,si_valider=True
            ).select_related('client').prefetch_related('offres_liees').order_by('date_limite')
        
        
    # else:
    #     offres = AppelOffre.objects.all()

    # Vérifie si le QuerySet est vide
    if not offres.exists():
        return JsonResponse({"message": "Aucune offre trouvée"}, safe=False, status=404)

    offres_data = [
        {
            "id": offre.id,
            "titre": offre.titre_ar       if lang=='ar' else offre.titre,
            "date_limite": offre.date_limite.strftime('%d %B %Y'),
            "client_nom" : offre.client.libelle_ar if lang=='ar' else offre.client.libelle_fr ,
            "titre_entreprise": offre.titre_entreprise,
            'client__logo': request.build_absolute_uri(offre.client.logo.url) if offre.client and offre.client.logo else None,
        }
        for offre in offres  # Boucle bien sur les objets du QuerySet
    ]

    return JsonResponse(offres_data, safe=False)


from django.views.decorators.http import require_GET
@require_GET
def apple_offres_par_client(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        offres = AppelOffre.objects.filter(client=client)
        
        offres_data = []
        for offre in offres:
            # Récupération des documents pour chaque offre individuellement
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
                'titre': offre.titre,
                'description': offre.description,
                'date_limite': offre.date_limite.strftime('%Y-%m-%d'),
                'lieu': offre.lieu,
                'type_s': offre.type_s,
                'titre_entreprise': offre.titre_entreprise,
                'client__nom': client.libelle_fr,  # Utilisation directe du client déjà récupéré
                'client__logo': request.build_absolute_uri(client.logo.url) if client.logo else None,
                'client__site_web': client.site_web,
                'documents': documents_data,
            }
            offres_data.append(offre_data)
        
        return JsonResponse(offres_data, safe=False)
    
    except Client.DoesNotExist:
        return JsonResponse({'error': 'Client non trouvé'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def liste_annoces_cleint(request):
    lang = request.GET.get('lang', 'fr')
    client_name = request.GET.get('client', None)
    # Filtrer les offres par client selon la langue
    if lang == "ar":
        offres_list = AppelOffre.objects.filter(
            si_valider_ar=True,
            client__libelle_ar=client_name
        ).select_related('client')
    else:
        offres_list = AppelOffre.objects.filter(
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
            "type_s": off.type_s,
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

            offre = AppelOffre.objects.create(
                client=client,
                titre=data['titre'],
                description=data['description'],
                type_offre=data['type_offre'],
                date_limite=data['date_limite'],
                lieu=data['lieu'],
                

            )

            return JsonResponse({"message": "Offre ajoutée avec succès", "offre_id": offre.id}, status=201)
        except Client.DoesNotExist:
            return JsonResponse({"error": "Client non trouvé"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

def nombre_apples_offres(request, id):
    try:
        client = get_object_or_404(Client, id=id)
        nombre_apples = AppelOffre.objects.filter(client=client).count()

        return JsonResponse({"client_id": client.id, "nombre_apples": nombre_apples})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def update_AppelOffre(request, id):
    """
    Met à jour une offre d'emploi existante.
    """
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            offre = get_object_or_404(AppelOffre, id=id)

            # Mise à jour des champs avec les données reçues
            for key, value in data.items():
                setattr(offre, key, value)

            offre.save()
            return JsonResponse({'message': 'Offre mise à jour avec succès'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Format JSON invalide'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

    
@csrf_exempt
def ajouter_document(request, offre_emploi_id):
    
    offre_emploi = get_object_or_404(AppelOffre, id=offre_emploi_id)
    if request.method == 'POST' and request.FILES.get('piece_join'):
        titre_document = request.POST.get('titre_document')
        piece_join = request.FILES.get('piece_join')

        document = Document(
            titre_document=titre_document,
            piece_join=piece_join,
           appels_offres=offre_emploi 
        )
        document.save()
        return JsonResponse({'success': 'Document ajouté avec succès'}, status=200)
    
    return JsonResponse({'error': 'Requête invalide ou fichier manquant'}, status=400)  # Bad request



def get_documents_by_applesoffre(request, offre_id):
    """Récupère les documents d'une offre d'emploi avec extension et taille"""
    documents = Document.objects.filter(appels_offres=offre_id)

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


@csrf_exempt  
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


@csrf_exempt
def modifier_type_offre(request, offre_id):
    
    offre = get_object_or_404(AppelOffre, id=offre_id)

    if request.method == "PUT":
        try:
            # Charger les données JSON depuis la requête
            data = json.loads(request.body)
            nouveau_type = data.get('type_offre')

            if not nouveau_type:
                return JsonResponse({"error": "Le champ 'type_offre' est requis."}, status=400)

            # Modifiez le type de l'offre
            offre.type_offre = nouveau_type
            offre.save()

            return JsonResponse({"message": "Type d'offre modifié avec succès", "offre": AppelOffreSerializer(offre).data})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Données JSON invalides."}, status=400)
        



from rest_framework.decorators import api_view     
@csrf_exempt  # si tu ne veux pas gérer CSRF ici (ou utiliser DRF avec authentication)
@api_view(['POST'])
def increment_vue(request, offre_id):
        try:
            offre =AppelOffre.objects.get(id=offre_id)
            offre.nombre_vu = models.F('nombre_vu') + 1
            offre.save()
            offre.refresh_from_db()  # Pour obtenir la nouvelle valeur réelle
            return JsonResponse({'nombre_vu': offre.nombre_vu})
        except AppelOffre.DoesNotExist:
            return JsonResponse({'error': 'Offre non trouvée'}, status=404)


@csrf_exempt
@permission_required("appels_offres.change_appeloffre", raise_exception=True)
def convert_post_category_view(request, post_id):
    """Convert an appels_offres post to another category"""
    from .conversion_service import convert_appel_to_other_category, get_conversion_options_for_appel
    
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
            result = convert_appel_to_other_category(
                appel_id=post_id,
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
                result['redirect_url'] = redirect_urls.get(target_category, '/appels_offres/appel-offres')
                
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
            available = get_conversion_options_for_appel()
            return JsonResponse({
                'success': True,
                'categories': available,
                'current_category': 'appels_offres'
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

        






