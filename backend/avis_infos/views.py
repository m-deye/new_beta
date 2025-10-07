import datetime
import json
import os
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.forms import modelformset_factory
from django.contrib import messages
from django.db.models import Count, Q
from .models import *
from .forms import *
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms import formset_factory, inlineformset_factory
from django.utils.html import strip_tags
from appels_offres.decorators import has_any_permission_for_model
from django.contrib.auth.decorators import permission_required
from .serializers import AvisInfosSerializer

def traduction_avis_infos(request):
    # Récupérer toutes les avis d'emploi avec le nombre d'avis publiées du client
    avi_s = AvisInfos.objects.annotate(
        nombre_avis_publiees=Count('client__avis_infos', filter=Q(client__avis_infos__si_valider=True))
    )

    # Actions de l'administrateur
    if request.method == 'POST':
        action = request.POST.get('action')
        avis_id = request.POST.get('avis_id')

        if action and avis_id:
            avis = get_object_or_404(AvisInfos, id=avis_id)

            # if action == 'publier':
            #     if avis.si_valider:  # Vérifier si l'avis est validée
            #         avis.si_publier = True
            #         avis.save()
            #         messages.success(request, f"L'avis '{avis.titre}' a été publiée.")
            #     else:
            #         messages.error(request, f"L'avis '{avis.titre}' ne peut pas être publiée car elle n'est pas validée.")
            # elif action == 'depublier':
            #     avis.si_publier = False
            #     avis.save()
            #     messages.success(request, f"L'avis '{avis.titre}' a été dépubliée.")
            if action == 'valider':
                if request.user.has_perm('avis_infos.valider_avisinfos'):
                    avis.si_valider = True
                    avis.valider_par = request.user
                    # Only set date_mise_en_ligne if not already set
                    if not avis.date_mise_en_ligne:
                        avis.date_mise_en_ligne = timezone.now()
                    avis.save()
                    
                    messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été validée.")
            elif action == 'invalider':
                if request.user.has_perm('avis_infos.valider_avisinfos'):
                    avis.si_valider = False
                    # avis.si_publier = False  # Dépublier l'avis si elle est invalidée
                    avis.save()
                    messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été invalidée et dépubliée.")
            elif action == 'supprimer':
                if request.user.has_perm('avis_infos.delete_avisinfos'):
                    avis.delete()
                    messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été supprimée.")
            elif action == 'modifier':
                if request.user.has_perm('avis_infos.change_avisinfos'):
                    return redirect('modifier_avis_infos', avis_id=avis.id)
            elif action == 'details':
                if request.user.has_perm('avis_infos.view_avisinfos'):
                    return redirect('detail_avis', avis_id=avis.id)
            elif action == 'groupement':
                if request.user.has_perm('avis_infos.grouper_avisinfos'):
                    return redirect('groupement_avis', avis_id=avis.id)

    return render(request, 'traduction.html', {
        'avi_s': avi_s,
    })
# @login_required
# @permission_required('offres_emploi.change_offreemploi', raise_exception=True)
def traduire_avis(request, offre_id):
    offre = get_object_or_404(AvisInfos, id=offre_id)

    # --- Suppression d'un document existant ---
    if request.method == 'POST' and request.POST.get('action') == 'supprimer':
        doc_id = request.POST.get('delete_doc_id')

        try:
            doc = Document.objects.get(id=doc_id, avis_infos=offre)
            doc.delete()
            messages.success(request, "Document supprimé avec succès.")
        except Document.DoesNotExist:
            messages.error(request, "Document introuvable ou non autorisé.")
        return redirect('traduire_avis_infos', offre_id=offre.id)

    # Form de traduction et formset new
    form_offre = TraductionAvisInfos(request.POST or None, instance=offre)
    DocumentFormSet = inlineformset_factory(
        AvisInfos, Document,
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
        return redirect('avis_infos')

    docs_exist = offre.documents.all()
    return render(request, 'traduction_avis_infos.html', {
        'form':        form_offre,
        'formset_new': formset_new,
        'docs_exist':  docs_exist,
        'offre':       offre,
    })
    
@has_any_permission_for_model('AvisInfos','avis_infos')
def admin_avis_infos(request):
    # Récupérer toutes les avis d'emploi avec le nombre d'avis publiées du client
    if(request.user.role.name != 'admin'):
        avi_s = AvisInfos.objects.annotate(
            nombre_avis_publiees=Count('client__avis_infos', filter=Q(client__avis_infos__si_valider=True))
        ).filter(a_traduire=True).order_by('-date_creation')
    else:
        avi_s = AvisInfos.objects.annotate(
        nombre_avis_publiees=Count('client__avis_infos', filter=Q(client__avis_infos__si_valider=True))
        ).order_by('-date_creation')
    # Actions de l'administrateur
    if request.method == 'POST':
        action = request.POST.get('action')
        avis_id = request.POST.get('avis_id')

        if action and avis_id:
            avis = get_object_or_404(AvisInfos, id=avis_id)

            # if action == 'publier':
            #     if avis.si_valider:  # Vérifier si l'avis est validée
            #         avis.si_publier = True
            #         avis.save()
            #         messages.success(request, f"L'avis '{avis.titre}' a été publiée.")
            #     else:
            #         messages.error(request, f"L'avis '{avis.titre}' ne peut pas être publiée car elle n'est pas validée.")
            # elif action == 'depublier':
            #     avis.si_publier = False
            #     avis.save()
            #     messages.success(request, f"L'avis '{avis.titre}' a été dépubliée.")
            # if action == 'valider':
            #     if request.user.has_perm('avis_infos.valider_avisinfos'):
            #         avis.si_valider = True
            #         avis.valider_par = request.user
            #         # Only set date_mise_en_ligne if not already set
            #         if not avis.date_mise_en_ligne:
            #             avis.date_mise_en_ligne = timezone.now()
            #         avis.save()
                    
            #         messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été validée.")
            # elif action == 'invalider':
            #     if request.user.has_perm('avis_infos.valider_avisinfos'):
            #         avis.si_valider = False
            #         # avis.si_publier = False  # Dépublier l'avis si elle est invalidée
            #         avis.save()
            #         messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été invalidée et dépubliée.")
            
            if action == 'valider_fr' and request.user.has_perm('avis_infos.valider_avisinfos'):
                avis.si_valider = True
                avis.valider_par = request.user
                if not avis.date_mise_en_ligne:
                    avis.date_mise_en_ligne = timezone.now()
                avis.save()
                messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été validé (Français).")
            elif action == 'invalider_fr' and request.user.has_perm('avis_infos.valider_avisinfos'):
                avis.si_valider = False
                avis.save()
                messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été invalidé (Français).")
            elif action == 'valider_ar' and request.user.has_perm('avis_infos.valider_ar_avisinfos'):
                if not avis.titre_ar or not avis.description_ar:
                    messages.error(request, f"L'avis '{strip_tags(avis.titre)}' ne peut pas être validé en arabe car les champs de traduction sont manquants.")
                else:
                    avis.si_valider_ar = True
                    avis.valider_par = request.user
                    if not avis.date_mise_en_ligne:
                        avis.date_mise_en_ligne = timezone.now()
                    avis.save()
                    messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été validé (Arabe).")
            elif action == 'invalider_ar' and request.user.has_perm('avis_infos.valider_ar_avisinfos'):
                avis.si_valider_ar = False
                avis.save()
                messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été invalidé (Arabe).")
            elif action == 'Valide_a_traduire':
                if request.user.has_perm('avis_infos.traduire_avisinfos'):
                    avis.a_traduire = True
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    avis.save()
                    messages.success(request, f"L'avis '{strip_tags(avis.titre)}' pres a traduire")
            elif action == 'Invalider_a_traduire':
                if request.user.has_perm('avis_infos.traduire_avisinfos'):
                    avis.a_traduire = False
                    # offre.si_publier = False  # Dépublier l'offre si elle est invalidée
                    avis.save()
                    messages.success(request, f"L'avis '{strip_tags(avis.titre)}' n'est pas pres a traduire")
                    
            elif action == 'supprimer':
                if request.user.has_perm('avis_infos.delete_avisinfos'):
                    avis.delete()
                    messages.success(request, f"L'avis '{strip_tags(avis.titre)}' a été supprimée.")
            elif action == 'modifier':
                if request.user.has_perm('avis_infos.change_avisinfos'):
                    return redirect('modifier_avis_infos', avis_id=avis.id)
            elif action == 'details':
                if request.user.has_perm('avis_infos.view_avisinfos'):
                    return redirect('detail_avis', avis_id=avis.id)
            elif action == 'groupement':
                if request.user.has_perm('avis_infos.grouper_avisinfos'):
                    return redirect('groupement_avis', avis_id=avis.id)

    return render(request, 'avis_infos.html', {
        'avi_s': avi_s,
    })
    
@permission_required("avis_infos.add_avisinfos", raise_exception=True)
def creer_avis_infos(request):
    DocumentFormSet = formset_factory(DocumentForm, extra=0)  # Formulaire dynamique pour les documents

    if request.method == 'POST':
        avis_form = AvisInfosForm(request.POST)
        document_formset = DocumentFormSet(request.POST, request.FILES)

        if avis_form.is_valid():
            # Enregistrer d'abord l'Appel d'avis
            avis_infos = avis_form.save()

            # Associer chaque document à cet Appel d'avis
            if document_formset.is_valid():
                for form in document_formset:
                    document = form.save(commit=False)
                    document.avis_infos = avis_infos  # Associer au nouvel appel d'avis
                    document.save()

            messages.success(request, "L'appel d'avis a été créé avec succès !")
            return redirect('avis_infos')

    else:
        avis_form = AvisInfosForm()
        document_formset = DocumentFormSet()

    return render(request, 'creer_avis_infos.html', {
        'avis_form': avis_form,
        'document_formset': document_formset
    })

@permission_required("avis_infos.view_avisinfos", raise_exception=True)
def get_avis_infos_details(request, avis_id):
    # Récupérer l'avis en fonction de son ID
    avis = get_object_or_404(AvisInfos, id=avis_id)
    
    # Récupérer les documents associés à l'avis
    documents = Document.objects.filter(avis_infos=avis)
    
    # Préparer les données à renvoyer au format JSON
    data = {
        'titre': strip_tags(avis.titre),
        'description': avis.description,
        'date_limite': avis.date_limite.strftime('%Y-%m-%d'),  # Formater la date
        'lieu': avis.lieu,
        'si_valider': avis.si_valider,
        'documents': [
            {
                'titre_document': doc.titre_document,
                'piece_join': doc.piece_join.url if doc.piece_join else None  # URL du document si le fichier existe
            }
            for doc in documents
        ]
    }
    print(data)
    # Renvoyer les données au format JSON
    return JsonResponse(data)

@permission_required("avis_infos.change_avisinfos", raise_exception=True)
def modifier_avis_infos(request, avis_id):
    avis = get_object_or_404(AvisInfos, id=avis_id)
    
    avis_disponibles = AvisInfos.objects.none()
    avis_liees = AvisInfos.objects.none()

    if request.method == 'POST':
        avis_form = AvisInfosForm(request.POST, instance=avis)
        document_formset = DocumentFormSetModifier(request.POST, request.FILES, queryset=Document.objects.filter(avis_infos=avis), prefix='documents')
        


        
        if avis_form.is_valid() and document_formset.is_valid():
            avis_form.save()
            documents = document_formset.save(commit=False)
            for document in documents:
                document.avis_infos = avis  # Assigner l'avis au document
                document.save()
            # Supprimer les documents marqués pour suppression
            for document in document_formset.deleted_objects:
                document.delete()

            document_formset.save_m2m()
        return redirect('avis_infos')

            
    else:
        avis_form = AvisInfosForm(instance=avis)
        document_formset = DocumentFormSetModifier(queryset=Document.objects.filter(avis_infos=avis), prefix='documents')
    if avis.si_principal:
        avis_liees = avis.get_avis_liees()
        avis_disponibles = AvisInfos.objects.filter(
            client=avis.client, 
            si_groupement=False, 
            
            ).exclude(id=avis.id)
    elif not avis.si_groupement:
        avis_disponibles = AvisInfos.objects.filter(
            client=avis.client, 
            si_groupement=False, 
            
            ).exclude(id=avis.id)
    
    return render(request, 'modifier_avis_infos.html', {
        'avis': avis,
        'avis_form': avis_form,
        'document_formset': document_formset,
        'avis_disponibles': avis_disponibles,
        'avis_liees': avis_liees,
    })
    
@permission_required("avis_infos.delete_avisinfos", raise_exception=True)
def supprimer_document(request, document_id):
    # Récupérer le document à supprimer
    document = get_object_or_404(Document, id=document_id)

    # Vérifier que l'utilisateur est un client et que le document appartient à une de ses aviss
    if hasattr(request.user, 'client') :
        if document.avis_infos.client != request.user.client:
            return redirect('accueil')  # Rediriger si l'utilisateur n'est pas autorisé
    else:
        # Supprimer le document
        document.delete()
        return redirect('modifier_avis_infos', avis_id=document.avis_infos.id)
    
    
@csrf_exempt
@permission_required("avis_infos.grouper_avisinfos", raise_exception=True)
def ajouter_au_groupe_avis_infos(request):
    if request.method == 'POST':
        # Logique pour ajouter l'avis au groupe
        try:
            current_avis_id = request.POST.get('current_avis_id')
            avis_id = request.POST.get('avis_id')

            # Récupérer les objets avis correspondants
            avis_principale = AvisInfos.objects.get(pk=current_avis_id)
            avis_a_modifier = AvisInfos.objects.get(pk=avis_id)

            # Associer l'avis à modifier à l'avis principale
            avis_a_modifier.avis_principale = avis_principale
            avis_a_modifier.si_groupement = True 
            avis_a_modifier.save()
            if not avis_principale.si_principal:
                avis_principale.si_principal = True
                avis_principale.si_groupement = True
                avis_principale.save()
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée'})

@csrf_exempt
@permission_required("avis_infos.grouper_avisinfos", raise_exception=True)
def retirer_du_groupe_avis_infos(request):
    if request.method == 'POST':
        # Logique pour retirer l'avis du groupe
        try:
            current_avis_id = request.POST.get('current_avis_id')
            avis_id = request.POST.get('avis_id')
            avis_principale = AvisInfos.objects.get(pk=current_avis_id)
            avis_a_modifier = AvisInfos.objects.get(pk=avis_id)

            # Associer l'avis à modifier à l'avis principale
            avis_a_modifier.avis_principale = None
            avis_a_modifier.si_groupement = False 
            avis_a_modifier.save()
            
            if(avis_principale.nombre_avis_liees() == 0):
                avis_principale.si_principal = False
                avis_principale.si_groupement = False
                avis_principale.save()
            
            
            
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée'})

from django.db.models import Q
from django.http import JsonResponse
import locale
from .models import AvisInfos

def listcompler_avis_infos(request):
    offres_list = AvisInfos.objects.filter(si_valider=True).order_by('-date_limite').select_related('client')
                    
    offres_data = [
        {
            "id": off.id,
            'titre': off.titre,
            'description': off.description,
            'date_limite': off.date_limite_fr(),  # Formater la date
            'lieu': off.lieu,
            'titre_entreprise': off.titre_entreprise,
            'client__nom': off.client.libelle_fr if off.client else None,  # Accéder au nom du client
            'client__logo': request.build_absolute_uri(off.client.logo.url) if off.client.logo else None,

            'client__site_web': off.client.site_web if off.client else None,
        }
        for off in offres_list
    ]
    return JsonResponse(offres_data, safe=False)

from parametres.models import Parametres

def liste_avis_infos(request):
    # 1) Récupérer la langue demandée (fr par défaut)
    lang = request.GET.get('lang', 'fr')

    # 2) Tableaux de mois FR / AR
    if lang == 'fr' :
        avis_list = AvisInfos.objects.filter(
            si_valider=True
        ).filter(
            Q(si_principal=True) | Q(avis_principale__isnull=True)
        ).select_related('client').prefetch_related('avis_liees').order_by('-date_creation')
    else:
        avis_list = AvisInfos.objects.filter(
            si_valider_ar=True
        ).filter(
            Q(si_principal=True) | Q(avis_principale__isnull=True)
        ).select_related('client').prefetch_related('avis_liees').order_by('-date_creation')
        
    mois_fr = [
        "janvier","février","mars","avril","mai","juin",
        "juillet","août","septembre","octobre","novembre","décembre"
    ]
    mois_ar = [
        "يناير","فبراير","مارس","أبريل","مايو","يونيو",
        "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
    ]
    mois = mois_ar if lang == 'ar' else mois_fr


    param = Parametres.objects.last()
    limite = param.nombreavisAr if lang == 'ar' else param.nombreavis
    # 3) Filtrer les avis
    if lang == 'fr' :
        avis_list = (
            AvisInfos.objects
                    .filter(si_valider=True)
                    .filter(Q(si_principal=True) | Q(avis_principale__isnull=True))
                    .select_related('client')
                    .prefetch_related('avis_liees').order_by('-date_mise_en_ligne')[:limite]
        )
    else:
        avis_list = (
            AvisInfos.objects
                    .filter(si_valider_ar=True)
                    .filter(Q(si_principal=True) | Q(avis_principale__isnull=True))
                    .select_related('client')
                    .prefetch_related('avis_liees').order_by('-date_mise_en_ligne')[:limite]
        )

    avis_data = []
    for avis in avis_list:
        liés = avis.get_avis_liees().filter(si_valider=True)

        # 4) Construire date_limite_grouped (même logique que pour les offres)
        if avis.si_principal and liés:
            dates = sorted(d for d in ([avis.date_limite] + [a.date_limite for a in liés])
                           if d)
            days      = sorted({d.day   for d in dates})
            months_idx= sorted({d.month for d in dates})
            years     = sorted({d.year  for d in dates})
            times     = sorted({(d.hour,d.minute) for d in dates})

            if len(years) == 1:
                date_limite = {
                    "days":   days,
                    "months": [mois[m-1] for m in months_idx],
                    "year":   years[0],
                    "times":  [{"hour": h, "minute": m} for h,m in times]
                }
            else:
                parts = []
                for j,mn,yr,hh,mi in sorted({(d.day,d.month,d.year,d.hour,d.minute) for d in dates}):
                    tstr = f" {hh:02d}:{mi:02d}" if (hh or mi) else ""
                    parts.append(f"{j} {mois[mn-1]} {yr}{tstr}")
                date_limite = ", ".join(parts)
        else:
            d = avis.date_limite
            if d:
                date_limite = {
                    "days":   [d.day],
                    "months": [mois[d.month-1]],
                    "year":   d.year,
                    "times":  [{"hour": d.hour, "minute": d.minute}]
                }
            else:
                date_limite = "N/A"

        # 5) Choisir les bons champs FR vs AR
        titre       = avis.titre_ar       if lang == 'ar' else avis.titre
        description = avis.description_ar if lang == 'ar' else avis.description
        lieu        = avis.lieu_ar        if lang == 'ar' else avis.lieu
        client_nom  = (
            avis.client.libelle_ar if avis.client and lang == 'ar'
            else avis.client.libelle_fr if avis.client
            else None
        )

        # 6) Construire la réponse JSON
        avis_data.append({
            "id":              avis.id,
            "client__special": avis.client.special if avis.client else False,
            "titre":           titre,
            "description":     description,
            "date_limite":     date_limite,
            "lieu":            lieu,
            "titre_entreprise": avis.titre_entreprise,
            "client__nom":     client_nom,
            "client__logo":    (request.build_absolute_uri(avis.client.logo.url)
                                 if avis.client and avis.client.logo else None),
            "client__site_web": avis.client.site_web if avis.client else None,
            "si_principal":    avis.si_principal,
            "avis_liees": [
                {
                    "id":          a.id,
                    "titre":       a.titre_ar       if lang == 'ar' else a.titre,
                    "date_limite": {
                        "days":   [a.date_limite.day],
                        "months": [mois[a.date_limite.month-1]],
                        "year":   a.date_limite.year,
                        "times":  [{"hour": a.date_limite.hour, "minute": a.date_limite.minute}]
                    } if a.date_limite else "N/A",
                    "lieu":        a.lieu_ar        if lang == 'ar' else a.lieu,
                    "client__special": avis.client.special if avis.client else False,
                }
                for a in liés
            ] if avis.si_principal else [],
            # Indication de direction pour le front
            "lang": lang,
            "dir":  'rtl' if lang == 'ar' else 'ltr'
        })

    return JsonResponse(avis_data, safe=False)

def detail_avis_infos(request, avis_id):
    print("-------------------","detail_avis_infos")
    lang = request.GET.get('lang', 'fr')
    appel = get_object_or_404(AvisInfos, id=avis_id)
    documents = appel.documents.all()

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
        "id": appel.id,
        "titre": titre,
        "description": description,
        "date_limite": appel.date_limite.strftime('%Y-%m-%d'),
        "lieu": lieu,
        "titre_entreprise": appel.titre_entreprise,
        "client__nom": client_nom,
        "date_mise_en_ligne" : appel.date_mise_en_ligne.strftime('%d %B %Y'),
        "client__logo": (request.build_absolute_uri(appel.client.logo.url)
                         if appel.client and appel.client.logo else None),
        "client__site_web": (appel.client.site_web 
                             if appel.client else None),
        "documents": documents_data,
        # Optionnel : on renvoie aussi la direction pour le front
        "lang": lang,
        "dir": 'rtl' if lang == 'ar' else 'ltr',
    }

    return JsonResponse(offre_data)


from django.views.decorators.http import require_GET
@require_GET
def apple_offres_par_client(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        offres = AvisInfos.objects.filter(client=client)
        
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




# def liste_annoces_cleint(request):
#     # Récupérer le paramètre "client" de la requête
#     client_name = request.GET.get('client', None)

#     # Filtrer les offres par client si le paramètre est présent
#     offres_list = AvisInfos.objects.all().select_related('client')
#     if client_name:
#         offres_list = offres_list.filter(libelle_fr=client_name)

#     # Préparer les données à renvoyer
#     offres_data = [
#         {
#             "id": off.id,
#             'titre': off.titre,
#             'description': off.description,
#             'date_limite': off.date_limite.strftime('%Y-%m-%d') if off.date_limite else None,  # Formater la date
#             'lieu': off.lieu,
#             'titre_entreprise': off.titre_entreprise,
#             'client__nom': off.client.libelle_fr if off.client else None,  # Accéder au nom du client
#             'client__logo': request.build_absolute_uri(off.client.logo.url) if off.client and off.client.logo else None,
#             'client__site_web': off.client.site_web if off.client else None,
#         }
#         for off in offres_list
#     ]

#     return JsonResponse(offres_data, safe=False)



def liste_annoces_cleint(request):
    # Récupérer le paramètre "client" de la requête
    lang = request.GET.get('lang', 'fr')
    client_name = request.GET.get('client', None)
    
    if lang == "ar":
        offres_list = AvisInfos.objects.filter(
            si_valider_ar=True,
            client__libelle_ar=client_name
        ).select_related('client')
    else:
        offres_list = AvisInfos.objects.filter(
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

    print(offres_data)
    return JsonResponse(offres_data, safe=False)

@csrf_exempt
def ajouter_offre(request, id):
    print(id)
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            client = Client.objects.get(id=id)

            offre = AvisInfos.objects.create(
                client=client,
                titre=data['titre'],
                description=data['description'],
                date_limite=data['date_limite'],
                si_fixe=data['si_fixe'],
                lien=data.get('lien', None),  # Éviter KeyError si 'lien' est absent
            )

            return JsonResponse({"message": "Offre ajoutée avec succès", "offre_id": offre.id}, status=201)

        except ValueError as ve:  # Mauvais format de date
            return JsonResponse({"error": f"Format de date invalide: {str(ve)}"}, status=400)
        except Client.DoesNotExist:
            return JsonResponse({"error": "Client non trouvé"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)



def nombre_avis_infos(request, id):
    try:
        client = get_object_or_404(Client, id=id)
        nombre_avis_infos = AvisInfos.objects.filter(client=client).count()

        return JsonResponse({"client_id": client.id, "nombre_avis_infos": nombre_avis_infos})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


@csrf_exempt
def update_offre_emploi(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            offre = get_object_or_404(AvisInfos, id=id)

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
    offre_emploi = get_object_or_404(AvisInfos, id=offre_emploi_id)
    if request.method == 'POST' and request.FILES.get('piece_join'):
        titre_document = request.POST.get('titre_document')
        piece_join = request.FILES.get('piece_join')

        document = Document(
            titre_document=titre_document,
            piece_join=piece_join,
            avis_infos=offre_emploi 
        )
        document.save()
        return JsonResponse({'success': 'Document ajouté avec succès'}, status=200)
    
    return JsonResponse({'error': 'Requête invalide ou fichier manquant'}, status=400)  # Bad request


def get_documents_by_avisifos(request, offre_id):
    """Récupère les documents d'une offre d'emploi avec extension et taille"""
    documents = Document.objects.filter(avis_infos=offre_id)

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
    print("id offre", offre_id)
    offre = get_object_or_404(AvisInfos, id=offre_id)

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

            return JsonResponse({"message": "Type d'offre modifié avec succès", "offre": AvisInfosSerializer(offre).data})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Données JSON invalides."}, status=400)
        


    
from rest_framework.decorators import api_view     
@csrf_exempt  # si tu ne veux pas gérer CSRF ici (ou utiliser DRF avec authentication)
@api_view(['POST'])
def increment_vue(request, offre_id):
        try:
            offre =AvisInfos.objects.get(id=offre_id)
            offre.nombre_vu = models.F('nombre_vu') + 1
            offre.save()
            offre.refresh_from_db()  # Pour obtenir la nouvelle valeur réelle
            return JsonResponse({'nombre_vu': offre.nombre_vu})
        except AvisInfos.DoesNotExist:
            return JsonResponse({'error': 'Offre non trouvée'}, status=404)


@csrf_exempt
@permission_required(["avis_infos.change_avisinfos", "offres_emploi.add_offreemploi", "appels_offres.add_appeloffre"], raise_exception=True)
def convert_post_category_view(request, post_id):
    """Convert an avis_infos post to another category"""
    from .conversion_service import convert_avis_to_other_category, get_conversion_options_for_avis
    
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
            result = convert_avis_to_other_category(
                avis_id=post_id,
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
                result['redirect_url'] = redirect_urls.get(target_category, '/avis_infos/avis-infos')
                
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
            available = get_conversion_options_for_avis()
            return JsonResponse({
                'success': True,
                'categories': available,
                'current_category': 'avis_infos'
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
        




    






