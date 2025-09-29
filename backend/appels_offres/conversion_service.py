"""
Simple conversion service for changing post categories from appels_offres
"""

from django.db import transaction

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
def convert_appel_to_other_category(appel_id, target_category, new_type):
    """Convert an appels_offres post to another category"""
    try:
        from .models import AppelOffre, Document as AppelDocument
        
        # Get source object
        source_appel = AppelOffre.objects.get(id=appel_id)
        
        # Prepare common data
        common_data = {
            'titre': source_appel.titre,
            'titre_ar': source_appel.titre_ar,
            'titre_entreprise': source_appel.titre_entreprise,
            'titre_entreprise_ar': source_appel.titre_entreprise_ar,
            'description': source_appel.description,
            'description_ar': source_appel.description_ar,
            'client': source_appel.client,
            'date_mise_en_ligne': source_appel.date_mise_en_ligne,
            'date_limite': source_appel.date_limite,
            'lieu': source_appel.lieu,
            'lieu_ar': source_appel.lieu_ar,
            'nombre_vu': source_appel.nombre_vu,
            'si_archiver': source_appel.si_archiver,
            'si_valider': source_appel.si_valider,
            'valider_par': source_appel.valider_par,
            'si_fixe': source_appel.si_fixe,
            'date_creation': source_appel.date_creation,
            'afficher_heures': source_appel.afficher_heures,
        }
        
        # Create target object based on category
        if target_category == 'avis_infos':
            from avis_infos.models import AvisInfos, Document as AvisDocument
            
            new_object = AvisInfos.objects.create(**common_data)
            
            # Convert documents
            for doc in AppelDocument.objects.filter(appels_offres=source_appel):
                AvisDocument.objects.create(
                    langue=doc.langue,
                    titre_document=doc.titre_document,
                    titre_piece_join=doc.titre_piece_join,
                    piece_join=doc.piece_join,
                    avis_infos=new_object,
                    date_creation=doc.date_creation
                )
        
        elif target_category == 'offres_emploi':
            from offres_emploi.models import OffreEmploi, Document as OffreDocument
            
            target_data = common_data.copy()
            target_data.update({
                'type_offre': new_type,
                'si_national': True,
                'categorie': 'standard',
            })
            
            new_object = OffreEmploi.objects.create(**target_data)
            
            # Convert documents
            for doc in AppelDocument.objects.filter(appels_offres=source_appel):
                OffreDocument.objects.create(
                    langue=doc.langue,
                    titre_document=doc.titre_document,
                    titre_piece_join=doc.titre_piece_join,
                    piece_join=doc.piece_join,
                    offre_emploi=new_object,
                    date_creation=doc.date_creation
                )
        
        # Delete source object
        source_appel.delete()
        
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

def get_conversion_options_for_appel():
    """Get available conversion options excluding appels_offres"""
    all_categories = get_available_categories()
    return {k: v for k, v in all_categories.items() if k != 'appels_offres'}