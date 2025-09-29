from parametres.models import Parametres
from django.http import JsonResponse
from django.db.models import Q
from .models import OffreEmploi
import json
from django.shortcuts import render, redirect, get_object_or_404

def liste_offres_special_api(request):
    # 1) Récupérer la langue demandée (fr par défaut) et groupement_id
    lang = request.GET.get('lang', 'fr')
    groupement_id = request.GET.get('groupement_id', None)
    param = Parametres.objects.last()
    limite = param.nombreoffresAr if lang == 'ar' else param.nombreoffres
    valeur_liste = request.GET.get('listes', 'noncomplet')

    # 2) Liste des offres validées, uniquement les offres principales
    if groupement_id:
        # Si groupement_id est fourni, récupérer l'offre principale et ses offres liées
        offre_principale = get_object_or_404(OffreEmploi, id=groupement_id, si_valider=True, si_principal=True)
        offres_list = (
            OffreEmploi.objects
            .filter(Q(id=groupement_id) | Q(offre_principale=offre_principale))
            .filter(si_valider=True)
            .select_related('client')
            .prefetch_related('offres_liees')
            .order_by('-date_creation')
        )
    else:
        # Sans groupement_id, récupérer uniquement les offres principales validées
        offres_list = (
            OffreEmploi.objects
            .filter(si_valider=True, si_principal=True)
            .select_related('client')
            .prefetch_related('offres_liees')
            .order_by('-date_creation')
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
            
            d = offre.date_limite
            if d:
                date_limite = {
                    "days": [d.day],
                    "months": [mois[d.month-1]],
                    "year": d.year,
                    "times": [{"hour": d.hour, "minute": d.minute}] if offre.afficher_heures else []
                }
        else:
            # Offres (seulement principales ou liées dans le cas de groupement_id)
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
        print("csd---------------------",titre)
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
                    "client__special": (o.client.special if o.client else False),
                    "client__nom": (o.client.special if o.client else False),
                     "client__nom": o.client.nom,
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