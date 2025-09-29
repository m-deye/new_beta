"""
Simple conversion service for changing post categories
"""

from django.db import transaction
from django.apps import apps

def get_available_categories():
    """Get available categories and their types"""
    return {
        'offres_emploi': {
            'name': 'Offres d\'emploi',
            'types': [
                ('OFFRE_EMPLOI', 'Offre d\'emploi'),
                ('consultants', 'Consultants'),
            ]
        },
        'appels_offres': {
            'name': 'Appels d\'offres',
            'types': [
                ('internationaux', 'Internationaux'),
                ('consultations', 'Consultations'),
                ('locaux', 'Locaux'),
                ('manifestations', 'Manifestations d\'Intérêts'),
            ]
        },
        'avis_infos': {
            'name': 'Avis et info',
            'types': [
                ('avis_general', 'Avis général'),
            ]
        }
    }

@transaction.atomic
def convert_avis_to_other_category(avis_id, target_category, new_type):
    """Convert an avis_infos post to another category"""
    try:
        from .models import AvisInfos, Document as AvisDocument
        
        # Get source object
        source_avis = AvisInfos.objects.get(id=avis_id)
        
        # Prepare common data
        common_data = {
            'titre': source_avis.titre,
            'titre_ar': source_avis.titre_ar,
            'titre_entreprise': source_avis.titre_entreprise,
            'titre_entreprise_ar': source_avis.titre_entreprise_ar,
            'description': source_avis.description,
            'description_ar': source_avis.description_ar,
            'client': source_avis.client,
            'date_mise_en_ligne': source_avis.date_mise_en_ligne,
            'date_limite': source_avis.date_limite,
            'lieu': source_avis.lieu,
            'lieu_ar': source_avis.lieu_ar,
            'nombre_vu': source_avis.nombre_vu,
            'si_archiver': source_avis.si_archiver,
            'si_valider': source_avis.si_valider,
            'valider_par': source_avis.valider_par,
            'si_fixe': source_avis.si_fixe,
            'date_creation': source_avis.date_creation,
            'afficher_heures': source_avis.afficher_heures,
        }
        
        # Create target object based on category
        if target_category == 'offres_emploi':
            from offres_emploi.models import OffreEmploi, Document as OffreDocument
            
            target_data = common_data.copy()
            target_data.update({
                'type_offre': new_type,
                'si_national': True,
                'categorie': 'standard',
            })
            
            new_object = OffreEmploi.objects.create(**target_data)
            
            # Convert documents
            for doc in AvisDocument.objects.filter(avis_infos=source_avis):
                OffreDocument.objects.create(
                    langue=doc.langue,
                    titre_document=doc.titre_document,
                    titre_piece_join=doc.titre_piece_join,
                    piece_join=doc.piece_join,
                    offre_emploi=new_object,
                    date_creation=doc.date_creation
                )
        
        elif target_category == 'appels_offres':
            from appels_offres.models import AppelOffre, Document as AppelDocument
            
            target_data = common_data.copy()
            target_data.update({
                'type_offre': 'APPEL_OFFRE',
                'type_s': new_type,
            })
            
            new_object = AppelOffre.objects.create(**target_data)
            
            # Convert documents
            for doc in AvisDocument.objects.filter(avis_infos=source_avis):
                AppelDocument.objects.create(
                    langue=doc.langue,
                    titre_document=doc.titre_document,
                    titre_piece_join=doc.titre_piece_join,
                    piece_join=doc.piece_join,
                    appels_offres=new_object,
                    date_creation=doc.date_creation
                )
        
        # Delete source object
        source_avis.delete()
        
        return {
            'success': True,
            'new_id': new_object.id,
            'message': f'Post converted successfully to {target_category}'
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Conversion failed: {str(e)}'
        }

def get_conversion_options_for_avis():
    """Get available conversion options excluding avis_infos"""
    all_categories = get_available_categories()
    return {k: v for k, v in all_categories.items() if k != 'avis_infos'}