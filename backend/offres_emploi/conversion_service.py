"""
Simple conversion service for changing post categories from offres_emploi
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
def convert_offre_to_other_category(offre_id, target_category, new_type):
    """Convert an offres_emploi post to another category"""
    try:
        from .models import OffreEmploi, Document as OffreDocument
        
        # Get source object
        source_offre = OffreEmploi.objects.get(id=offre_id)
        
        # Prepare common data
        common_data = {
            'titre': source_offre.titre,
            'titre_ar': source_offre.titre_ar,
            'titre_entreprise': source_offre.titre_entreprise,
            'titre_entreprise_ar': source_offre.titre_entreprise_ar,
            'description': source_offre.description,
            'description_ar': source_offre.description_ar,
            'client': source_offre.client,
            'date_mise_en_ligne': source_offre.date_mise_en_ligne,
            'date_limite': source_offre.date_limite,
            'lieu': source_offre.lieu,
            'lieu_ar': source_offre.lieu_ar,
            'nombre_vu': source_offre.nombre_vu,
            'si_archiver': source_offre.si_archiver,
            'si_valider': source_offre.si_valider,
            'valider_par': source_offre.valider_par,
            'si_fixe': source_offre.si_fixe,
            'date_creation': source_offre.date_creation,
            'afficher_heures': source_offre.afficher_heures,
        }
        
        # Create target object based on category
        if target_category == 'avis_infos':
            from avis_infos.models import AvisInfos, Document as AvisDocument
            
            new_object = AvisInfos.objects.create(**common_data)
            
            # Convert documents
            for doc in OffreDocument.objects.filter(offre_emploi=source_offre):
                AvisDocument.objects.create(
                    langue=doc.langue,
                    titre_document=doc.titre_document,
                    titre_piece_join=doc.titre_piece_join,
                    piece_join=doc.piece_join,
                    avis_infos=new_object,
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
            for doc in OffreDocument.objects.filter(offre_emploi=source_offre):
                AppelDocument.objects.create(
                    langue=doc.langue,
                    titre_document=doc.titre_document,
                    titre_piece_join=doc.titre_piece_join,
                    piece_join=doc.piece_join,
                    appels_offres=new_object,
                    date_creation=doc.date_creation
                )
        
        # Delete source object
        source_offre.delete()
        
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

def get_conversion_options_for_offre():
    """Get available conversion options excluding offres_emploi"""
    all_categories = get_available_categories()
    return {k: v for k, v in all_categories.items() if k != 'offres_emploi'}