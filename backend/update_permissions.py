import os
import django
from django.contrib.auth.models import Permission

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projetBeta.settings')  # Remplacez 'projetBeta.settings' par le chemin correct vers votre fichier settings.py
django.setup()


# Dictionnaire des traductions
PERMISSION_TRANSLATIONS = {
    'add_logentry': 'Peut ajouter une entrée d\'historique',
    'change_logentry': 'Peut modifier une entrée d\'historique',
    'delete_logentry': 'Peut supprimer une entrée d\'historique',
    'view_logentry': 'Peut consulter une entrée d\'historique',
    'add_appeloffre': 'Peut ajouter un appel d\'offre',
    'change_appeloffre': 'Peut modifier un appel d\'offre',
    'delete_appeloffre': 'Peut supprimer un appel d\'offre',
    'grouper_appeloffre': 'Peut grouper des appels d\'offre',
    'traduire_appeloffre': 'Peut traduire un appel d\'offre',
    'valider_appeloffre': 'Peut valider un appel d\'offre',
    'view_appeloffre': 'Peut consulter un appel d\'offre',
    'add_document': 'Peut ajouter un document',
    'change_document': 'Peut modifier un document',
    'delete_document': 'Peut supprimer un document',
    'view_document': 'Peut consulter un document',
    'add_group': 'Peut ajouter un groupe',
    'change_group': 'Peut modifier un groupe',
    'delete_group': 'Peut supprimer un groupe',
    'view_group': 'Peut consulter un groupe',
    'add_permission': 'Peut ajouter une permission',
    'change_permission': 'Peut modifier une permission',
    'delete_permission': 'Peut supprimer une permission',
    'view_permission': 'Peut consulter une permission',
    'add_token': 'Peut ajouter un jeton',
    'change_token': 'Peut modifier un jeton',
    'delete_token': 'Peut supprimer un jeton',
    'view_token': 'Peut consulter un jeton',
    'add_tokenproxy': 'Peut ajouter un jeton proxy',
    'change_tokenproxy': 'Peut modifier un jeton proxy',
    'delete_tokenproxy': 'Peut supprimer un jeton proxy',
    'view_tokenproxy': 'Peut consulter un jeton proxy',
    'add_avisinfos': 'Peut ajouter un avis/info',
    'change_avisinfos': 'Peut modifier un avis/info',
    'delete_avisinfos': 'Peut supprimer un avis/info',
    'grouper_avisinfos': 'Peut grouper des avis/infos',
    'traduire_avisinfos': 'Peut traduire un avis/info',
    'valider_avisinfos': 'Peut valider un avis/info',
    'view_avisinfos': 'Peut consulter un avis/info',
    'add_captchastore': 'Peut ajouter un magasin de captcha',
    'change_captchastore': 'Peut modifier un magasin de captcha',
    'delete_captchastore': 'Peut supprimer un magasin de captcha',
    'view_captchastore': 'Peut consulter un magasin de captcha',
    'add_contactmessage': 'Peut ajouter un message de contact',
    'change_contactmessage': 'Peut modifier un message de contact',
    'delete_contactmessage': 'Peut supprimer un message de contact',
    'view_contactmessage': 'Peut consulter un message de contact',
    'add_contenttype': 'Peut ajouter un type de contenu',
    'change_contenttype': 'Peut modifier un type de contenu',
    'delete_contenttype': 'Peut supprimer un type de contenu',
    'view_contenttype': 'Peut consulter un type de contenu',
    'add_diplome': 'Peut ajouter un diplôme',
    'change_diplome': 'Peut modifier un diplôme',
    'delete_diplome': 'Peut supprimer un diplôme',
    'view_diplome': 'Peut consulter un diplôme',
    'add_experience': 'Peut ajouter une expérience',
    'change_experience': 'Peut modifier une expérience',
    'delete_experience': 'Peut supprimer une expérience',
    'view_experience': 'Peut consulter une expérience',
    'add_candidat': 'Peut ajouter un candidat',
    'change_candidat': 'Peut modifier un candidat',
    'delete_candidat': 'Peut supprimer un candidat',
    'view_candidat': 'Peut consulter un candidat',
    'add_client': 'Peut ajouter un client',
    'change_client': 'Peut modifier un client',
    'delete_client': 'Peut supprimer un client',
    'view_client': 'Peut consulter un client',
    'add_utilisateurpersonnalise': 'Peut ajouter un utilisateur',
    'change_utilisateurpersonnalise': 'Peut modifier un utilisateur',
    'delete_utilisateurpersonnalise': 'Peut supprimer un utilisateur',
    'valider_utilisateurpersonnalise': 'Peut valider un utilisateur',
    'view_utilisateurpersonnalise': 'Peut consulter un utilisateur',
    'add_langue': 'Peut ajouter une langue',
    'change_langue': 'Peut modifier une langue',
    'delete_langue': 'Peut supprimer une langue',
    'view_langue': 'Peut consulter une langue',
    'add_offreemploi': 'Peut ajouter une offre d\'emploi',
    'change_offreemploi': 'Peut modifier une offre d\'emploi',
    'delete_offreemploi': 'Peut supprimer une offre d\'emploi',
    'fixe_offreemploi': 'Peut fixer une offre d\'emploi',
    'grouper_offreemploi': 'Peut grouper des offres d\'emploi',
    'traduire_offreemploi': 'Peut traduire une offre d\'emploi',
    'valider_offreemploi': 'Peut valider une offre d\'emploi',
    'view_offreemploi': 'Peut consulter une offre d\'emploi',
    'add_publicite': 'Peut ajouter une publicité',
    'change_publicite': 'Peut modifier une publicité',
    'delete_publicite': 'Peut supprimer une publicité',
    'view_publicite': 'Peut consulter une publicité',
    'add_parametres': 'Peut ajouter des paramètres',
    'change_parametres': 'Peut modifier des paramètres',
    'delete_parametres': 'Peut supprimer des paramètres',
    'view_parametres': 'Peut consulter des paramètres',
    'add_session': 'Peut ajouter une session',
    'change_session': 'Peut modifier une session',
    'delete_session': 'Peut supprimer une session',
    'view_session': 'Peut consulter une session',
    'add_specialisation': 'Peut ajouter une spécialisation',
    'change_specialisation': 'Peut modifier une spécialisation',
    'delete_specialisation': 'Peut supprimer une spécialisation',
    'view_specialisation': 'Peut consulter une spécialisation',
    'add_temoignage': 'Peut ajouter un témoignage',
    'change_temoignage': 'Peut modifier un témoignage',
    'delete_temoignage': 'Peut supprimer un témoignage',
    'view_temoignage': 'Peut consulter un témoignage',
}





# Mettre à jour les noms des permissions dans la base de données
def update_permission_names():
    for permission in Permission.objects.all():
        new_name = PERMISSION_TRANSLATIONS.get(permission.codename)
        if new_name and permission.name != new_name:
            permission.name = new_name
            permission.save()
            print(f"Permission {permission.codename} mise à jour : {new_name}")
        else:
            print(f"Permission {permission.codename} inchangée ou non trouvée dans les traductions")

if __name__ == "__main__":
    update_permission_names()