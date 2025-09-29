# import os
# import django

# # Spécifiez le module de configuration de Django
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "beta.settings")  # Remplacez "backend" par le nom réel de votre projet

# # Initialiser Django
# django.setup()

# # Maintenant, vous pouvez importer vos modèles
# from offres_emploi.models import Client, OffreEmploi
# from appels_offres.models import AppelOffre
# from avis_infos.models import AvisInfos

# from django.utils import timezone
# import random
# from datetime import timedelta

# # Vérifier qu'il y a au moins un client existant
# clients = Client.objects.all()
# if not clients.exists():
#     print("Veuillez créer au moins un client avant d'exécuter ce script.")
# else:
#     clients = list(clients)

#     def generate_deadline():
#         return timezone.now() + timedelta(days=random.randint(10, 60))

#     # Création de 5 Offres d'Emploi
#     for i in range(5):
#         OffreEmploi.objects.create(
#             titre=f"Offre d'Emploi {i+1}",
#             type_offre="OFFRE_EMPLOI",
#             description="Description de l'offre d'emploi générée automatiquement.",
#             client=random.choice(clients),
#             date_limite=generate_deadline(),
#             lieu="Lieu aléatoire",
#             si_publier=random.choice([True, False]),
#             si_valider=random.choice([True, False])
#         )

#     # Création de 5 Appels d'Offre
#     for i in range(5):
#         AppelOffre.objects.create(
#             titre=f"Appel d'Offre {i+1}",
#             type_offre="APPEL_OFFRE",
#             type_s=random.choice(['internationaux', 'consultations', 'locaux', 'manifestations']),
#             description="Description de l'appel d'offre générée automatiquement.",
#             client=random.choice(clients),
#             date_limite=generate_deadline(),
#             lieu="Lieu aléatoire",
#             si_publier=random.choice([True, False]),
#             si_valider=random.choice([True, False]),
#             categorie=random.choice(['standard', 'autre']),
#             groupement_spacial=random.choice(['oui', 'non']),
#         )

#     # Création de 5 Avis d'Informations
#     for i in range(5):
#         AvisInfos.objects.create(
#             titre=f"Avis d'Information {i+1}",
#             description="Description de l'avis d'information générée automatiquement.",
#             client=random.choice(clients),
#             date_limite=generate_deadline(),
#             lieu="Lieu aléatoire",
#             si_publier=random.choice([True, False]),
#             si_valider=random.choice([True, False]),
#             categorie=random.choice(['standard', 'autre']),
#             groupement_spacial=random.choice(['oui', 'non']),
#         )

#     print("Données générées avec succès !")
import os
import django
import random
from datetime import timedelta
from django.utils import timezone

# Charger Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "beta.settings")  # Remplace "Quiz" par le nom de ton projet Django
django.setup()

from offres_emploi.models import OffreEmploi, Client  # Remplace "Quiz_App" par le nom réel de ton application Django

# 🔹 1️⃣ Vérifier et récupérer le client "ahmedou"
client, created = Client.objects.get_or_create(
    utilisateur__email="ahmedou@gmail.com",
    defaults={"nom": "Ahmedou"}  # Si le client n'existe pas, il sera créé avec ce nom
)

if created:
    print("✅ Le client 'ahmedou' a été créé.")
else:
    print("ℹ️ Le client 'ahmedou' existe déjà.")

# 🔹 2️⃣ Liste de titres et de lieux pour les offres
titres = [
    "Développeur Web Full Stack",
    "Ingénieur DevOps",
    "Analyste Data",
    "Chef de Projet IT",
    "Administrateur Système",
    "Consultant Cybersécurité",
    "Designer UX/UI",
    "Spécialiste SEO",
    "Ingénieur IA",
    "Développeur Mobile"
]

lieux = ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Nantes", "Strasbourg", "Lille", "Nice", "Rennes"]

# 🔹 3️⃣ Génération de 100 offres d'emploi
offres_creees = []
mois_aleatoire = random.randint(0, 11)  # Sélectionner un mois entre 0 et 11 mois en arrière
jours_aleatoires = random.randint(1, 28)  # Assurer que le jour est valide pour tous les mois
date_creation = timezone.now() - timedelta(days=(mois_aleatoire * 30) + jours_aleatoires)
for i in range(100):
    titre = random.choice(titres)
    lieu = random.choice(lieux)

    # Répartir les offres sur deux mois (mois actuel et mois précédent)
    mois_offset = random.choice([0, 1])
    date_creation = timezone.now() - timedelta(days=random.randint(0, 30) + mois_offset * 30)
    date_limite = date_creation + timedelta(days=random.randint(15, 45))  # Date limite entre 15 et 45 jours après

    offre = OffreEmploi.objects.create(
        titre=titre,
        type_offre="consultants",
        description=f"Offre pour un poste de {titre} basé à {lieu}. Expérience requise de 2 ans minimum.",
        client=client,
        date_mise_en_ligne=date_creation.date(),
        date_limite=date_limite,
        lieu=lieu,
        nombre_vu=random.randint(10, 500),  # Générer un nombre aléatoire de vues
        si_valider=random.choice([True, False]),  # Offres validées ou non
        date_creation=date_creation,

    )
    offres_creees.append(offre)

print(f"✅ {len(offres_creees)} offres d'emploi créées avec succès pour le client 'ahmedou'.")

# from django.contrib.auth.models import Permission
# from django.contrib.contenttypes.models import ContentType
# # Liste des permissions avec leurs traductions
# permissions_to_update = [
#     {"codename": "add_candidat", "name": "Peut ajouter un candidat"},
#     {"codename": "change_candidat", "name": "Peut modifier un candidat"},
#     {"codename": "delete_candidat", "name": "Peut supprimer un candidat"},
#     {"codename": "view_candidat", "name": "Peut voir un candidat"},
    
#     {"codename": "add_client", "name": "Peut ajouter un client"},
#     {"codename": "change_client", "name": "Peut modifier un client"},
#     {"codename": "delete_client", "name": "Peut supprimer un client"},
#     {"codename": "view_client", "name": "Peut voir un client"},
    
#     {"codename": "add_utilisateurpersonnalise", "name": "Peut ajouter un utilisateur"},
#     {"codename": "change_utilisateurpersonnalise", "name": "Peut modifier un utilisateur"},
#     {"codename": "delete_utilisateurpersonnalise", "name": "Peut supprimer un utilisateur"},
#     {"codename": "view_utilisateurpersonnalise", "name": "Peut voir un utilisateur"},
# ]

# # Boucle pour mettre à jour chaque permission
# for perm_data in permissions_to_update:
#     try:
#         perm = Permission.objects.get(codename=perm_data["codename"], content_type__app_label='gestion_utilisateur')
#         perm.name = perm_data["name"]
#         perm.save()
#         print(f"Permission '{perm.codename}' mise à jour : {perm.name} (ID: {perm.id})")
#     except Permission.DoesNotExist:
#         print(f"La permission '{perm_data['codename']}' n'existe pas dans 'gestion_utilisateur'.")