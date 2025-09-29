from django.utils import timezone
from offres_emploi.models import OffreEmploi
from avis_infos.models import AvisInfos
from appels_offres.models import AppelOffre
class ArchiveExpiredOffersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Exécuter la mise à jour avant de traiter la requête
        OffreEmploi.objects.filter(
            date_limite__lt=timezone.now(),
            si_archiver=False
        ).update(
            si_archiver=True,
            si_valider=False
        )
        AppelOffre.objects.filter(
            date_limite__lt=timezone.now(),
            si_archiver=False
        ).update(
            si_archiver=True,
            si_valider=False
        )
        AvisInfos.objects.filter(
            date_limite__lt=timezone.now(),
            si_archiver=False
        ).update(
            si_archiver=True,
            si_valider=False
        )
        # Continuer le traitement de la requête
        response = self.get_response(request)
        return response