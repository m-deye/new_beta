import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "datatables.net";
import "./ProfileCandidat.css";
import { Modal, Button, Form, ProgressBar, Image } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import axiosInstance from "../../api/axiosInstance";

const ProfileCandidat = ({ candidatId, onHide, candidateName, candidate }) => {
  const cvRef = useRef();
  const [activeTab, setActiveTab] = useState("tab11");
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();
  const initialProfile = location.state?.profileData || {};
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const tabs = [
    { id: "tab11", label: "Info" },
    { id: "tab12", label: "Option ou spécialisation" },
    { id: "tab13", label: "Diplomes" },
    { id: "tab14", label: "Langues" },
    { id: "tab15", label: "Expériences professionnelles" },
    { id: "tab16", label: "Compte" },
  ];

  // use
  const [profile, setProfile] = useState({
    prenom: "",
    nom: "",
    tel1: "",
    pays: "Mauritanie",
    adresse: "",
    email: "recrut@beta.mr",
    username: "",
    prenom_ar: "",
    nom_ar: "",
    date_naissance: "",
    lieu_naissance: "Trarza",
    genre: "Homme",
    cv: null,
    lettre_motivation: null,
  });

  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les données du candidat au montage
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/api/candidat/${candidatId}/profile/`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setProfile((prev) => ({
  //           ...prev,
  //           ...data
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Erreur de chargement du profil :", error);
  //     }
  //   };
  //   fetchProfile();
  // }, [candidatId]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/candidat/${candidatId}/profile/`
        );
        setProfile((prev) => ({
          ...prev,
          ...response.data,
        }));
      } catch (error) {
        console.error("Erreur de chargement du profil :", error);
      }
    };

    if (candidatId) {
      fetchProfile();
    }
  }, [candidatId]);

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Envoi du formulaire
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessages(null);

  //   const formData = new FormData();
  //   Object.entries(profile).forEach(([key, value]) => {
  //     if (value !== null) {
  //       formData.append(key, value);
  //     }
  //   });

  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/candidat/${candidatId}/update/`, {
  //       method: "PUT",
  //       body: formData
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setMessages({ type: "success", text: "Mise à jour réussie!" });
  //     } else {
  //       setMessages({ type: "error", text: data.error || "Erreur lors de la mise à jour." });
  //     }
  //   } catch (error) {
  //     setMessages({ type: "error", text: "Erreur de connexion au serveur." });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessages(null);

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      const response = await axiosInstance.put(
        `/api/candidat/${candidatId}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages({ type: "success", text: "Mise à jour réussie!" });
    } catch (error) {
      const message =
        error.response?.data?.error || "Erreur lors de la mise à jour.";
      setMessages({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  // model photo
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  // Ouvre le modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Afficher l'aperçu avant l'upload
    }
  };

  // const handleSubmitphoto = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setErrors([]);

  //   if (!selectedFile) {
  //     setErrors(['Veuillez sélectionner un fichier à télécharger']);
  //     setIsLoading(false);
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('logo', selectedFile);

  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/candidat/${candidatId}/updatelogo/`, {
  //       method: 'PUT',
  //       body: formData,
  //     });

  //     if (!response.ok) throw new Error('Échec du téléchargement');

  //     const data = await response.json();
  //     console.log("Réponse API:", data);

  //     if (data.logo_url) {
  //       // Met à jour previewUrl pour afficher le nouveau logo
  //       setPreviewUrl(data.logo_url);
  //       // Met à jour profile.logo si nécessaire
  //       setProfile(prev => ({
  //         ...prev,
  //         logo: data.logo_url
  //       }));
  //     } else {
  //       console.log("Aucune URL renvoyée par l'API.");
  //     }

  //     // Ferme le modal après mise à jour
  //     setShowModal(false);

  //   } catch (error) {
  //     setErrors([error.message || 'Échec du téléchargement de l\'image']);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmitphoto = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    if (!selectedFile) {
      setErrors(["Veuillez sélectionner un fichier à télécharger"]);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedFile);

    try {
      const response = await axiosInstance.put(
        `/api/candidat/${candidatId}/updatelogo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      console.log("Réponse API:", data);

      if (data.logo_url) {
        setPreviewUrl(data.logo_url);
        setProfile((prev) => ({
          ...prev,
          logo: data.logo_url,
        }));
      } else {
        console.log("Aucune URL renvoyée par l'API.");
      }

      setShowModal(false);
    } catch (error) {
      setErrors([
        error.response?.data?.detail || "Échec du téléchargement de l'image",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleDeleteLogo = async () => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/candidat/${candidatId}/deletelogo/`, {
  //       method: 'DELETE',
  //     });

  //     if (!response.ok) throw new Error('Échec de la suppression du logo');

  //     const data = await response.json();
  //     console.log("Logo supprimé :", data);

  //     // Réinitialise l’aperçu et le logo du profil
  //     setPreviewUrl(null);
  //     setProfile(prev => ({
  //       ...prev,
  //       logo: null
  //     }));

  //     alert("Logo supprimé avec succès !");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Erreur lors de la suppression du logo");
  //   }
  // };

  const handleDeleteLogo = async () => {
    try {
      const response = await axiosInstance.delete(
        `/api/candidat/${candidatId}/deletelogo/`
      );

      console.log("Logo supprimé :", response.data);

      // Réinitialise l’aperçu et le logo du profil
      setPreviewUrl(null);
      setProfile((prev) => ({
        ...prev,
        logo: null,
      }));

      alert("Logo supprimé avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du logo");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // modal cv
  const [showModalcv, setShowModalcv] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const abortControllerRef = useRef(null);
  const [cvUrl, setCvUrl] = useState(null);

  // useEffect(() => {
  //   const fetchCvUrl = async () => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/api/candidat/${candidatId}/getcv/`);
  //       if (!response.ok) {
  //         throw new Error("Erreur lors de la récupération du CV.");
  //       }
  //       const data = await response.json();
  //       if (data.cv_url) {
  //         setCvUrl(data.cv_url); // Stocke l'URL pour le téléchargement
  //         setPreviewUrl(data.cv_url); // Stocke l'URL pour la prévisualisation
  //       } else {
  //         setError("Aucun CV disponible pour ce candidat.");
  //       }
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération de l'URL du CV :", error);
  //       setError("Impossible de charger le CV. Veuillez réessayer.");
  //     }
  //   };
  //   fetchCvUrl();
  // }, [candidatId]);

  // Ouvre le modal

  useEffect(() => {
    const fetchCvUrl = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/candidat/${candidatId}/getcv/`
        );

        if (response.data.cv_url) {
          setCvUrl(response.data.cv_url); // Pour le téléchargement
          setPreviewUrl(response.data.cv_url); // Pour la prévisualisation
        } else {
          setError("Aucun CV disponible pour ce candidat.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'URL du CV :", error);
        setError("Impossible de charger le CV. Veuillez réessayer.");
      }
    };

    fetchCvUrl();
  }, [candidatId]);

  const handleShowModalcv = (e) => {
    e.preventDefault();
    setShowModalcv(true);
  };

  // Ferme le modal
  const handleCloseModalcv = () => {
    setShowModalcv(false);
    handleRemoveFile(); // Réinitialise le fichier lors de la fermeture
  };

  // Gère le changement de fichier
  const handleFileChangecv = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setError("");
      } else {
        setError("Veuillez sélectionner un fichier PDF.");
        setFile(null);
        setPreviewUrl(null);
      }
    }
  };

  // Supprime le fichier sélectionné
  const handleRemoveFilecv = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Gestion du téléversement du CV
  // const handleUpload = async () => {
  //   if (!file) {
  //     setError("Aucun fichier sélectionné.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("cv", file);

  //   try {
  //     setUploadProgress(10);
  //     const response = await fetch(`http://127.0.0.1:8000/api/candidat/${candidatId}/updatecv/`, {
  //       method: "PUT",
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setCvUrl(data.cv_url); // Met à jour l'URL pour le téléchargement
  //       setPreviewUrl(data.cv_url); // Met à jour l'URL pour la prévisualisation
  //       setUploadProgress(100);
  //       setTimeout(() => {
  //         alert("Fichier enregistré avec succès !");
  //         handleCloseModalcv();
  //       }, 500);
  //     } else {
  //       throw new Error(data.error || "Erreur lors du téléchargement.");
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //     setUploadProgress(0);
  //   }
  // };

  const handleUpload = async () => {
    if (!file) {
      setError("Aucun fichier sélectionné.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    try {
      setUploadProgress(10);

      const response = await axiosInstance.put(
        `/api/candidat/${candidatId}/updatecv/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      const data = response.data;
      setCvUrl(data.cv_url); // Mise à jour de l'URL pour téléchargement
      setPreviewUrl(data.cv_url); // Mise à jour de l'URL pour prévisualisation
      setUploadProgress(100);

      setTimeout(() => {
        alert("Fichier enregistré avec succès !");
        handleCloseModalcv();
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du téléchargement.");
      setUploadProgress(0);
    }
  };

  // Gestion du téléchargement du CV
  const handleDownloadCv = async (e) => {
    e.preventDefault();
    if (!cvUrl) {
      alert("Aucun CV disponible pour le téléchargement.");
      return;
    }

    try {
      // Vérifier si l'URL est accessible
      const response = await fetch(cvUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error("Le fichier CV n'est pas accessible.");
      }

      // Ouvre l'URL du CV dans un nouvel onglet
      window.open(cvUrl, "_blank");
    } catch (error) {
      console.error("Erreur lors de l'ouverture du CV :", error);
      alert("Impossible d'ouvrir le CV. Veuillez réessayer.");
    }
  };

  // Ouvre le fichier en zoom
  const handleZoom = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handlePrint = () => {
    const content = document.getElementById("cv-to-print");
    const printWindow = window.open("", "", "width=1000,height=800");

    const styles = `
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
      <style>
        body {
          padding: 20px;
          background-color: white;
        }
  
        /* Si tu veux ajouter des styles spécifiques à l'impression */
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
  
          .no-print {
            display: none;
          }
        }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>CV du Candidat</title>
          ${styles}
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    // Attendre que le contenu charge bien (par ex. images)
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // tab 12

  const [specialization, setSpecialization] = useState({
    titre: "",
    niveaux_etude: "",
    experience: "",
    domaine: "",
  });

  // Gestionnaire de changement pour la spécialisation
  const handleSpecializationChange = (e) => {
    const { name, value } = e.target;
    setSpecialization((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire de spécialisation
  // const handleSpecializationSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessages(null);

  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/specialisation/api/specialisation/${candidatId}/addspecialisation/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //         // 'X-CSRF-TOKEN': '...' si besoin
  //       },
  //       body: JSON.stringify(specialization)
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setMessage("Spécialisation ajoutée avec succès !");
  //       setTimeout(() => setMessage(""), 10000);
  //     } else {
  //       setMessages({ type: 'error', text: data.error || 'Erreur lors de la mise à jour.' });
  //     }
  //   } catch (error) {
  //     setMessages({ type: 'error', text: 'Erreur de connexion au serveur.' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSpecializationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessages(null);

    try {
      const response = await axiosInstance.post(
        `/specialisation/api/specialisation/${candidatId}/addspecialisation/`,
        specialization
      );

      setMessage("Spécialisation ajoutée avec succès !");
      setTimeout(() => setMessage(""), 10000);
    } catch (error) {
      setMessages({
        type: "error",
        text: error.response?.data?.error || "Erreur lors de la mise à jour.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Options complètes
  const niveauxEtudeOptions = [
    { value: "CAP", label: "CAP" },
    { value: "BEPC", label: "BEPC" },
    { value: "BAC", label: "BAC" },
    { value: "BT", label: "BT" },
    { value: "BTS", label: "BTS" },
    { value: "DUT", label: "DUT" },
    { value: "DEUG", label: "DEUG" },
    { value: "DEA", label: "DEA" },
    { value: "Licence 1", label: "Licence 1" },
    { value: "Licence 2", label: "Licence 2" },
    { value: "Licence 3", label: "Licence 3" },
    { value: "Master 2", label: "Master 2" },
    { value: "Maîtrise", label: "Maîtrise" },
    { value: "Doctorat", label: "Doctorat" },
  ];

  const niveauxExperienceOptions = [
    { value: "1", label: "Sans expérience" },
    { value: "2", label: "Moins d’un an d’expérience" },
    { value: "3", label: "2 ans d’expériences" },
    { value: "4", label: "3 ans d’expériences" },
    { value: "5", label: "4 ans d’expériences" },
    { value: "6", label: "5 - 10 ans d’expériences" },
    { value: "7", label: "10 - 15 ans d’expériences" },
    { value: "8", label: "Plus de 15 ans d’expériences" },
  ];

  const domaineOptions = [
    { value: "Accueil", label: "Accueil" },
    { value: "Achat-Approvisionnement", label: "Achat - Approvisionnement" },
    { value: "Administration", label: "Administration" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Agroalimentaire", label: "Agroalimentaire" },
    { value: "Architectureintérieur", label: "Architecture d`intérieur" },
    { value: "Assistance", label: "Assistance" },
    { value: "Assurances", label: "Assurances" },
    { value: "contrôlegestion", label: "Audit et contrôle de gestion" },
    { value: "Automobile", label: "Automobile" },
    { value: "Autre", label: "Autre" },
    { value: "Banque", label: "Banque" },
    { value: "Centresappels", label: "Centres d`appels" },
    { value: "Chauffeur", label: "Chauffeur" },
    {
      value: "Chauffeurpersonnel",
      label: "Chauffeur personnel maires de keidi",
    },
    {
      value: "Chauffeurpersonnel",
      label: "Chauffeur personnel maires de keidi",
    },
    { value: "télécommunications", label: "Chimie , télécommunications" },
    { value: "73", label: "Chimie , télécommunications" },
    { value: "6", label: "Commerce" },
    { value: "9", label: "Comptabilité" },
    { value: "25", label: "Construction" },
    { value: "40", label: "Construction métallique" },
    { value: "17", label: "Consulting" },
    { value: "38", label: "Contrôle Qualité" },
    { value: "30", label: "Développement des affaires" },
    { value: "53", label: "Direction" },
    { value: "33", label: "Distribution" },
    { value: "60", label: "Droit" },
    { value: "61", label: "Droit" },
    { value: "78", label: "Économie" },
    { value: "64", label: "Économie publique" },
    { value: "55", label: "Electricien" },
    { value: "24", label: "Electricité" },
    { value: "21", label: "Electronique" },
    { value: "84", label: "Élevage" },
    { value: "18", label: "Enseignement" },
    { value: "49", label: "Environnement- Développement durable" },
    { value: "52", label: "Études statistiques" },
    { value: "13", label: "Finance" },
    { value: "15", label: "Formation" },
    { value: "44", label: "GAZ & PETROLE" },
    { value: "76", label: "Géologie" },
    { value: "77", label: "Géologie" },
    { value: "69", label: "Géologie, recherche et développement" },
    { value: "81", label: "Géomatique" },
    { value: "11", label: "Gestion" },
    { value: "46", label: "Gestion intégrée des ressources naturelles" },
    { value: "56", label: "Gouvernance territoriale et Développement local" },
    { value: "34", label: "Hôtellerie et Tourisme" },
    { value: "26", label: "Immobilier" },
    { value: "3", label: "Industrie" },
    { value: "67", label: "Infographie" },
    { value: "1", label: "Informatique" },
    { value: "85", label: "Informatique, Réseau et Télécommunications" },
    { value: "86", label: "Informatique, Réseau et Télécommunications" },
    { value: "5", label: "Ingénierie" },
    { value: "27", label: "Installation-Entretien" },
    { value: "42", label: "Juridique" },
    { value: "74", label: "Maintenance industriel" },
    { value: "92", label: "Maintenance informatique et reseaux" },
    {
      value: "87",
      label:
        "Management et gestion de projets, consulting, économie et gestion",
    },
    { value: "47", label: "Management et Gestion Projets" },
    { value: "48", label: "Management et Gestion Projets" },
    {
      value: "65",
      label:
        "Management international, Commercial, Gestion des Ressources Humaines",
    },
    { value: "57", label: "Manager Transport & Logistique" },
    { value: "4", label: "Marketing" },
    { value: "22", label: "Mécanique" },
    { value: "51", label: "Médecine" },
    { value: "41", label: "Media-Journalisme" },
    { value: "68", label: "Monnaie, Banque et Finance" },
    { value: "63", label: "Nutritionist" },
    { value: "88", label: "Ong ADICOR" },
    { value: "89", label: "ONG ADICOR,ACF,ARDM,ACOR,OXFAM" },
    { value: "62", label: "Pêche" },
    { value: "36", label: "Pharmaceutiques" },
    { value: "50", label: "Physique" },
    { value: "20", label: "Ressources humaines" },
    { value: "28", label: "Sante" },
    { value: "80", label: "sapeur-pompier" },
    { value: "75", label: "Sciences Humaines" },
    { value: "14", label: "Services à la clientèle" },
    { value: "35", label: "Stratégie-Planification" },
    { value: "70", label: "Technicien supérieur" },
    { value: "71", label: "Technicien supérieur" },
    { value: "91", label: "Technique télécom" },
    { value: "8", label: "Technologie de l`information" },
    { value: "10", label: "Télécommunications Emploi Design" },
    { value: "29", label: "Textile" },
    { value: "79", label: "traducteur du langue chinois arab francais" },
    { value: "59", label: "Traduction (arabe, français et l'anglais" },
    { value: "32", label: "Transport" },
    { value: "12", label: "Vente" },
  ];

  //T13

  const [selectedDiplome, setSelectedDiplome] = useState(null);

  const [formData, setFormData] = useState({
    diplome: "",
    etablissement: "",
    date_debut: "",
    date_fin: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChangeDiplom = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleSubmitdiplom = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const response = await fetch(`http://localhost:8000/diplom/api/candidat/${candidatId}/addDiplome/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //         // 'X-CSRF-TOKEN': '...' si besoin
  //       },
  //       body: JSON.stringify(formData)
  //     });

  //     if (!response.ok) throw new Error('Erreur de soumission');
  //     setMessage("Diplome ajoutée avec succès !");
  //     setTimeout(() => setMessage(""), 10000);
  //     setIsSuccess(true);
  //     setTimeout(() => {
  //       fetchDiplomes();
  //       setShowForm(false);
  //       setIsSuccess(false);
  //     }, 2000);
  //   } catch (error) {
  //     setErrors([error.message]);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitdiplom = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        `/diplom/api/candidat/${candidatId}/addDiplome/`,
        formData
      );

      setMessage("Diplôme ajouté avec succès !");
      setTimeout(() => setMessage(""), 10000);
      setIsSuccess(true);

      setTimeout(() => {
        fetchDiplomes();
        setShowForm(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      setErrors([error.response?.data?.error || "Erreur de soumission"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [diplomes, setDiplomes] = useState([]);

  useEffect(() => {
    const fetchDiplomes = async () => {
      try {
        const response = await axiosInstance.get(
          `/diplom/api/candidat/${candidatId}/diplomes/`
        );
        setDiplomes(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des diplômes :", error);
      }
    };

    fetchDiplomes();
  }, [candidatId]);

  useEffect(() => {
    if (activeTab === "tab13") {
      const table = $("#diplomes").DataTable({
        responsive: true,
        destroy: true,
      });

      return () => {
        table.destroy();
      };
    }
  }, [activeTab]);

  const handleDelete = async (diplomeId) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce diplôme ?"
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/diplom/api/diplome/${diplomeId}/delete/`);

      // Actualise la liste après suppression
      fetchDiplomes();
      setMessage("Diplôme supprimé avec succès !");
      setTimeout(() => setMessage(""), 10000);
      setDiplomes(diplomes.filter((d) => d.id !== diplomeId));
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  // const fetchDiplomes = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/diplom/api/candidat/${candidatId}/diplomes/`);
  //     const data = await response.json();
  //     setDiplomes(data);  // Assure-toi que l'état des diplômes soit mis à jour
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des diplômes :', error);
  //   }
  // };

  const fetchDiplomes = async () => {
    try {
      const response = await axiosInstance.get(
        `/diplom/api/candidat/${candidatId}/diplomes/`
      );
      setDiplomes(response.data); // Mets à jour l'état avec les données récupérées
    } catch (error) {
      console.error("Erreur lors du chargement des diplômes :", error);
    }
  };

  const handleEditDiplome = (diplome) => {
    setSelectedDiplome(diplome); // On garde le diplôme sélectionné
    setFormData({
      diplome_id: diplome.id,
      diplome: diplome.diplome,
      etablissement: diplome.etablissement,
      date_debut: diplome.date_debut,
      date_fin: diplome.date_fin,
    });
    setMode("edit"); // Passage en mode "modifier"
    setShowForm(true); // Affichage du formulaire
  };

  const [selectedDiplomeId, setSelectedDiplomeId] = useState(null);

  const handleSubmitdiplomEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `/diplom/api/diplome/${formData.diplome_id}/update/`,
        { ...formData, candidat: candidatId }
      );

      if (response.status === 200) {
        fetchDiplomes();
        setShowForm(false);
        setSelectedDiplomeId(null);
        setMessage("Diplome modifié avec succès !");
        setTimeout(() => setMessage(""), 10000);
        setErrors([]);
      }
    } catch (error) {
      console.error("Erreur :", error);
      setErrors([
        error.response?.data?.error || "Erreur lors de la mise à jour.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [langues, setLangues] = useState([]);
  const [langueData, setLangueData] = useState({
    langue: "",
    niveau: "",
  });

  const fetchLangues = async () => {
    try {
      const response = await axiosInstance.get(
        `/langue/api/candidat/${candidatId}/langues/`
      );
      setLangues(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des langues :", error);
    }
  };

  useEffect(() => {
    fetchLangues();
  }, []);

  useEffect(() => {
    if (activeTab === "tab14") {
      const table = $("#langues").DataTable({
        responsive: true,
        destroy: true, // pour éviter les conflits lors des re-rendus
      });

      return () => {
        table.destroy();
      };
    }
  }, [activeTab]);

  const handleDeleteLangue = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette langue ?"
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/langue/api/langues/${id}/delete/`);

      fetchLangues(); // recharge la liste après suppression
      setMessage("Langue supprimée avec succès !");
      setTimeout(() => setMessage(""), 10000);
      setLangues((prevLangues) => prevLangues.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const [mode, setMode] = useState("add"); // 'add' ou 'edit'
  const [showForm, setShowForm] = useState(false);
  const [selectedLangue, setSelectedLangue] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLangueData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleSubmitLangueAdd = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const response = await fetch(`http://localhost:8000/langue/api/candidat/${candidatId}/addLangue/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(langueData)
  //     });

  //     if (!response.ok) throw new Error('Erreur de soumission');

  //     setIsSuccess(true);
  //     setTimeout(() => {
  //       fetchLangues();  // Pour récupérer les nouvelles langues ajoutées
  //       setShowForm(false);  // Fermer le formulaire après soumission
  //       setIsSuccess(false);
  //       setMessage("Langue ajoutée avec succès !");
  //       setTimeout(() => setMessage(""), 10000);
  //     }, 2000);
  //   } catch (error) {
  //     setErrors([error.message]);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitLangueAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.post(
        `/langue/api/candidat/${candidatId}/addLangue/`,
        langueData
      );

      setIsSuccess(true);
      setTimeout(() => {
        fetchLangues(); // recharge la liste des langues
        setShowForm(false); // ferme le formulaire
        setIsSuccess(false);
        setMessage("Langue ajoutée avec succès !");
        setTimeout(() => setMessage(""), 10000);
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erreur de soumission";
      setErrors([errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLangues = (langue) => {
    setSelectedLangue(langue);
    setLangueData({
      id: langue.id,
      langue: langue.langue,
      niveau: langue.niveau,
    });
    setMode("edit");
    setShowForm(true);
  };

  const handleSubmitLangueEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(
        `/langue/api/langue/${langueData.id}/update/`,
        {
          ...langueData,
          candidat: candidatId,
        }
      );

      if (response.status !== 200) throw new Error("Erreur de soumission");

      setIsSuccess(true);
      setTimeout(() => {
        fetchLangues(); // Pour récupérer les langues mises à jour
        setShowForm(false); // Fermer le formulaire après soumission
        setIsSuccess(false);
        setMessage("Langue modifiée avec succès !");
        setTimeout(() => setMessage(""), 10000);
      }, 2000);
    } catch (error) {
      setErrors([error.message || "Erreur lors de la soumission"]);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [experiences, setExperiences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [experienceData, setExperienceData] = useState({
    nom_entreprise: "",
    poste: "",
    date_debut: "",
    date_fin: "",
    en_cours: false,
    description: "",
  });

  const fetchExperiences = async () => {
    try {
      const response = await axiosInstance.get(
        `/experience/api/candidat/${candidatId}/experiences/`
      );
      setExperiences(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des expériences :", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (activeTab === "tab15") {
      const table = $("#experiences").DataTable({
        responsive: true,
        destroy: true,
      });
      return () => table.destroy();
    }
  }, [activeTab]);

  const handleDeleteExperience = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette expérience ?"
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/experience/api/experience/${id}/delete/`);

      fetchExperiences(); // recharge la liste après suppression
      setMessage("Expérience supprimée avec succès !");
      setTimeout(() => setMessage(""), 10000);
      setExperiences((prevExperiences) =>
        prevExperiences.filter((e) => e.id !== id)
      );
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const [selectedExperience, setSelectedExperience] = useState(null);

  const handleInputChangeexperciance = (e) => {
    const { name, value, type, checked } = e.target;
    setExperienceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleSubmitAdd = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const response = await fetch(`http://localhost:8000/experience/api/candidat/${candidatId}/addExperience/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(experienceData)
  //     });

  //     if (!response.ok) throw new Error('Erreur de soumission');

  //     setIsSuccess(true);
  //     setTimeout(() => {
  //       fetchExperiences(); // Pour récupérer les nouvelles langues ajoutées
  //       setShowForm(false);  // Fermer le formulaire après soumission
  //       setIsSuccess(false);
  //       setMessage("Experience ajoutée avec succès !");
  //       setTimeout(() => setMessage(""), 10000);
  //     }, 2000);
  //   } catch (error) {
  //     setErrors([error.message]);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        `/experience/api/candidat/${candidatId}/addExperience/`,
        experienceData
      );

      if (response.status !== 201) throw new Error("Erreur de soumission");

      setIsSuccess(true);
      setTimeout(() => {
        fetchExperiences(); // Pour récupérer les nouvelles expériences ajoutées
        setShowForm(false); // Fermer le formulaire après soumission
        setIsSuccess(false);
        setMessage("Expérience ajoutée avec succès !");
        setTimeout(() => setMessage(""), 10000);
      }, 2000);
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmitEdit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const response = await fetch(`http://localhost:8000/experience/api/experience/${selectedId}/updatecv/`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },

  //       body: JSON.stringify({ ...experienceData, candidat: candidatId }),
  //     });

  //     if (!response.ok) throw new Error('Erreur de soumission');

  //     setIsSuccess(true);
  //     setTimeout(() => {
  //       fetchExperiences();  // Pour récupérer les langues mises à jour
  //       setShowForm(false);  // Fermer le formulaire après soumission
  //       setIsSuccess(false);
  //       setMessage("Experience modifié avec succès !");
  //       setTimeout(() => setMessage(""), 10000);
  //     }, 2000);
  //   } catch (error) {
  //     setErrors([error.message]);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(
        `/experience/api/experience/${selectedId}/update/`,
        {
          ...experienceData,
          candidat: candidatId,
        }
      );

      if (response.status !== 200) throw new Error("Erreur de soumission");

      setIsSuccess(true);
      setTimeout(() => {
        fetchExperiences(); // Pour récupérer les expériences mises à jour
        setShowForm(false); // Fermer le formulaire après soumission
        setIsSuccess(false);
        setMessage("Expérience modifiée avec succès !");
        setTimeout(() => setMessage(""), 10000);
      }, 2000);
    } catch (error) {
      setErrors([error.message || "Erreur lors de la soumission"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setExperienceData({
      nom_entreprise: "",
      poste: "",
      date_debut: "",
      date_fin: "",
      en_cours: false,
      description: "",
      candidat: candidatId,
    });
    setShowForm(false);
    setMode("add");
    setSelectedId(null);
    setErrors([]);
  };

  const handleEditClick = (experience) => {
    setExperienceData(experience);
    setMode("edit");
    setSelectedId(experience.id);
    setShowForm(true);
  };

  //tab 16

  const [compteData, setcompteData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // const fetchCompte = async () => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/candidat/${candidatId}/profile/`);
  //     const data = await response.json();
  //     setcompteData({
  //       username: data.username || '',
  //       email: data.email || '',
  //       password: '',
  //       passwordConfirm: ''
  //     });

  //   } catch (err) {
  //     console.error("Erreur lors du chargement du compte :", err);
  //   }
  // };

  const fetchCompte = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/candidat/${candidatId}/profile/`
      );
      const data = response.data;

      setcompteData({
        username: data.username || "",
        email: data.email || "",
        password: "",
        passwordConfirm: "",
      });
    } catch (err) {
      console.error("Erreur lors du chargement du compte :", err);
    }
  };

  useEffect(() => {
    fetchCompte();
  }, []);

  const handleCompteChange = (e) => {
    const { name, value } = e.target;
    setcompteData((prev) => ({ ...prev, [name]: value }));
  };

  // useEffect(() => {
  //   // Récupération du compte utilisateur lié au candidat
  //   const fetchCompte = async () => {
  //     try {
  //       const res = await fetch(`http://localhost:8000/api/compte/candidat/${candidatId}/`);
  //       const data = await res.json();
  //       setcompteData({
  //         username: data.username || '',
  //         email: data.email || '',
  //         password: '',
  //         passwordConfirm: ''
  //       });
  //     } catch (err) {
  //       console.error("Erreur lors du chargement du compte :", err);
  //     }
  //   };

  //   if (activeTab === 'tab16') {
  //     fetchCompte();
  //   }
  // }, [activeTab, candidatId]);

  useEffect(() => {
    // Récupération du compte utilisateur lié au candidat
    const fetchCompte = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/compte/candidat/${candidatId}/`
        );
        const data = response.data;

        setcompteData({
          username: data.username || "",
          email: data.email || "",
          password: "",
          passwordConfirm: "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement du compte :", err);
      }
    };

    if (activeTab === "tab16") {
      fetchCompte();
    }
  }, [activeTab, candidatId]);

  // const handleCompteSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const response = await fetch(`http://localhost:8000/api/compte/candidat/${candidatId}/update/`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },

  //       body: JSON.stringify({ ...compteData, candidat: candidatId }),
  //     });

  //     if (!response.ok) throw new Error('Erreur de soumission');

  //     setIsSuccess(true);
  //     setMessage("Votre compte modifié avec succès !");
  //     setTimeout(() => setMessage(""), 10000);
  //   } catch (error) {
  //     setErrors([error.message]);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // valider

  const handleCompteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(
        `/api/compte/candidat/${candidatId}/update/`,
        {
          ...compteData,
          candidat: candidatId,
        }
      );

      if (response.status !== 200) throw new Error("Erreur de soumission");

      setIsSuccess(true);
      setMessage("Votre compte modifié avec succès !");
      setTimeout(() => setMessage(""), 10000);
    } catch (error) {
      setErrors([error.message || "Erreur lors de la soumission"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = (e) => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir valider votre CV ?"
    );
    if (!confirmation) {
      e.preventDefault(); // annule la navigation si refusé
    }
  };

  const handleOpenModal = () => {
    handleShow();
    // fetchcv();
  };

  if (!candidate) {
    return <div>Chargement du profil...</div>;
  }

  return (
    <div>
      <div
        className="d-sm-flex align-items-center mb-4"
        style={{ gap: "10px", justifyContent: "space-between" }}
      >
        <h1 className="h3 text-gray-500">
          <div id="btn_valide"></div>
        </h1>
        <a
          href=""
          className="btn btn-sm btn-info"
          style={{
            textDecoration: "none",
            marginRight: "0px",
            width: "100px",
            color: "inherit",
          }}
          onClick={handleClick}
        >
          <i className="fa fa-fw fa-check"></i> Valider
        </a>

        <Button
          variant="primary"
          onClick={handleOpenModal}
          className=""
          style={{
            backgroundColor: "#1CC88A",
            width: "150px",
            marginRight: "20px",
          }}
        >
          Visualiser le CV
        </Button>
      </div>

      <div className=" ms-3" style={{ maxWidth: "1000px", height: "auto" }}>
        <div className="card-bod ">
          <div className="row">
            <div className="col-lg-12" id="de-page">
              <nav>
                <div className="nav nav-tabs main-tabs" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`nav-item nav-link ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i
                        className={`fa ${
                          tab.id === "tab13" || tab.id === "tab15"
                            ? "fa-graduation-cap"
                            : tab.id === "tab14"
                            ? "fas fa-language"
                            : "fa-info-circle"
                        }`}
                      ></i>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="tab-content" style={{ zIndex: 10000 }}>
                {activeTab === "tab11" && (
                  <div className="tab-pane fade show active">
                    <div className="row d-flex align-items-start">
                      {/* Photo de profil (col-3) */}
                      <div className="col-md-2 p-0 ">
                        <div
                          className="text-center profile-pic"
                          style={{ width: "100%", position: "relative" }}
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          <img
                            id="avatar"
                            src={
                              profile.logo ||
                              previewUrl ||
                              "https://beta.mr/img/avatar_2x.png"
                            }
                            style={{
                              height: "180px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            className="avatared img-circle img-thumbnail"
                            alt=""
                          />
                          {/* Bouton Éditer */}
                          {isHovering && (
                            <div
                              className="edit"
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                              }}
                            >
                              <a
                                href="#edit"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowModal(true);
                                }}
                              >
                                <i className="fa fa-edit fa-lg text-dark p-1 rounded"></i>
                              </a>
                            </div>
                          )}

                          {/* Bouton Supprimer */}
                          {isHovering && (
                            <div
                              className="remove"
                              style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                              }}
                            >
                              <a href="#remove" onClick={handleDeleteLogo}>
                                <i className="fa fa-trash fa-lg text-danger p-1 rounded"></i>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* CV Upload */}
                        <div className="mt-2">
                          <ul className="list-group">
                            <li className="list-group-item px-2 profile-pic d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-2">
                                <i className="fa fa-file-pdf"></i>
                                <a
                                  id="cv_candidat"
                                  href="#"
                                  onClick={handleDownloadCv}
                                  className="text-decoration-none"
                                >
                                  CV
                                </a>
                              </div>
                              <div className="edit ms-auto">
                                <a
                                  href="#"
                                  onClick={handleShowModalcv}
                                  className="text-decoration-none"
                                >
                                  <i className="fa fa-edit fa-lg text-primary"></i>
                                </a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-10">
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            {/* Première colonne */}
                            <div
                              className="col-md-6"
                              style={{
                                paddingRight: "10px",
                                paddingLeft: "10px",
                              }}
                            >
                              {[
                                {
                                  label: "Prénom",
                                  id: "prenom",
                                  required: true,
                                },
                                { label: "Nom", id: "nom", required: true },
                                {
                                  label: "Téléphone",
                                  id: "telephone",
                                  type: "number",
                                },
                                {
                                  label: "Pays de naissance",
                                  id: "pays",
                                  type: "select",
                                  options: ["Mauritanie", "France", "Autre"],
                                },
                                { label: "Adresse", id: "adresse" },
                                {
                                  label: "Email",
                                  id: "email",
                                  type: "email",
                                  readOnly: true,
                                  value: profile.email,
                                  onChange: { handleFileChange },
                                },
                              ].map((field) => (
                                <div key={field.id} className="form-group">
                                  <label htmlFor={field.id} className=" mb-2">
                                    {field.label}
                                    {field.required}
                                  </label>{" "}
                                  <span className="">*</span>
                                  {field.type === "select" ? (
                                    <select
                                      id={field.id}
                                      className="form-control selectpicker"
                                      value={profile[field.id]}
                                      onChange={handleChange}
                                    >
                                      {field.options.map((option, index) => (
                                        <option key={index} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      id={field.id}
                                      type={field.type || "text"}
                                      className="form-control "
                                      required={field.required}
                                      readOnly={field.readOnly || false}
                                      value={
                                        field.readOnly
                                          ? field.value
                                          : profile[field.id]
                                      }
                                      onChange={handleChange}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Deuxième colonne */}
                            <div className="col-md-6">
                              {[
                                { label: "Prénom en arabe", id: "prenom_ar" },
                                { label: "Nom arabe", id: "nom_ar" },
                                {
                                  label: "Date de naissance",
                                  id: "date_naissance",
                                  type: "date",
                                  required: true,
                                },
                                {
                                  label: "Lieu de naissance",
                                  id: "lieu_naissance",
                                  type: "select",
                                  options: ["Trarza", "Nouakchott", "Autre"],
                                },
                                {
                                  label: "Genre",
                                  id: "genre",
                                  type: "select",
                                  options: ["Homme", "Femme"],
                                },
                                {
                                  label: "Lettre de motivation",
                                  id: "lettre_motivation",
                                  type: "file",
                                },
                              ].map((field) => (
                                <div key={field.id} className="form-group">
                                  <label htmlFor={field.id} className=" mb-2">
                                    {field.label}
                                    {field.required}
                                  </label>{" "}
                                  <span className="">*</span>
                                  {field.type === "select" ? (
                                    <select
                                      id={field.id}
                                      className="form-control selectpicker"
                                      value={profile[field.id]}
                                      onChange={handleChange}
                                    >
                                      {field.options.map((option, index) => (
                                        <option key={index} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      id={field.id}
                                      type={field.type || "text"}
                                      className="form-control"
                                      required={field.required}
                                      value={profile[field.id]}
                                      onChange={handleChange}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Bouton Enregistrer */}
                            <div className=" text-right mt-3">
                              {/* <button className="btn btn-success" type="submit" disabled={loading}  style={{
                                    width: "2500px",           // largeur réduite
                                    backgroundColor: "#1CC88A", // couleur de fond personnalisée
                                    borderColor: "#1CC88A"      // couleur de bordure personnalisée
                                  }}
                                >
                              {loading ? "Enregistrement..." : (
                                <>
                                   <i className="fas fa-save me-1"></i> Enregistrer
                                </>
                              )}
                            </button> */}
                              <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{
                                  width: "120px", // largeur réduite
                                  backgroundColor: "#1CC88A", // couleur de fond personnalisée
                                  borderColor: "#1CC88A", // couleur de bordure personnalisée
                                }}
                              >
                                {loading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-1"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Enregistrement...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save me-1"></i>
                                    Enregistrer
                                  </>
                                )}
                              </Button>
                            </div>

                            {/* Messages de succès ou erreur */}
                            {messages && (
                              <div
                                className={`alert mt-3 ${
                                  messages.type === "success"
                                    ? "alert-success"
                                    : "alert-danger"
                                }`}
                              >
                                {messages.text}
                              </div>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>{" "}
                    {/* Fin row principale */}
                  </div>
                )}

                <Modal show={showModal} onHide={closeModal} size="lg" centered>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      Modification de la photo du candidat :{" "}
                      <span className="text-primary">{candidateName}</span>
                    </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Form id="formImage" onSubmit={handleSubmitphoto}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Logo</Form.Label>

                        <div className="file-input-ajax-new">
                          <div className="file-preview">
                            <div className="file-drop-zone">
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  className="img-fluid rounded shadow-sm"
                                  alt="Preview"
                                  style={{
                                    maxHeight: "40vh",
                                    width: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              ) : (
                                <div className="file-drop-zone-title py-5 text-center">
                                  <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                  <p className="mb-0">
                                    Glissez et déposez votre fichier ici ...
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="input-group mt-3">
                            <input
                              type="text"
                              className="form-control border-start-0"
                              placeholder="Sélectionner un fichier..."
                              value={selectedFile?.name || ""}
                              readOnly
                            />

                            <div className="input-group-append d-flex align-items-center gap-1">
                              {selectedFile && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm px-2 py-1"
                                  onClick={handleRemoveFile}
                                  style={{ minWidth: "80px" }}
                                >
                                  <i className="fas fa-times-circle me-1"></i>
                                  Retirer
                                </button>
                              )}

                              <label
                                className="btn btn-success btn-sm px-2 py-1 mb-0"
                                style={{ minWidth: "100px" }}
                              >
                                <i className="fas fa-folder-open fa-xs me-1"></i>
                                Parcourir
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  accept="image/*"
                                  hidden
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </Form.Group>

                      <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isLoading || !selectedFile}
                          style={{
                            width: "120px", // largeur réduite
                            backgroundColor: "#1CC88A", // couleur de fond personnalisée
                            borderColor: "#1CC88A", // couleur de bordure personnalisée
                          }}
                        >
                          {isLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-1"></i>
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </div>

                      {errors.length > 0 && (
                        <div className="alert alert-danger mt-3">
                          {errors.map((error, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center"
                            >
                              <i className="fas fa-exclamation-triangle me-2"></i>
                              {error}
                            </div>
                          ))}
                        </div>
                      )}
                    </Form>
                  </Modal.Body>
                </Modal>

                <div>
                  {/* Modal onSubmit={handleUpload} */}
                  <Modal
                    show={showModalcv}
                    onHide={handleCloseModalcv}
                    size="lg"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Changer le CV de :{" "}
                        <span className="text-primary">{candidateName}</span>
                      </Modal.Title>
                    </Modal.Header>
                    <div className="modal-content">
                      <div className="modal-header-body">
                        <div className="modal-body">
                          <div className="row">
                            <div className="col-lg-12">
                              <div id="image-modal">
                                <form
                                  id="formImage"
                                  encType="multipart/form-data"
                                >
                                  <input
                                    type="hidden"
                                    name="_token"
                                    value="LBoxQX8aZZ3WkjF4JZjmNqhq5EUkHmYzwW9xeE74"
                                  />
                                  <input
                                    type="hidden"
                                    name="id"
                                    value="13138"
                                  />
                                  <div className="col-md-12">
                                    <label htmlFor="cv_profile">
                                      Changer le CV
                                    </label>
                                    <div className="file-input file-input-ajax-new">
                                      <div className="file-preview">
                                        <div className="file-drop-zone">
                                          {previewUrl ? (
                                            <div
                                              className="file-preview-frame krajee-default kv-preview-thumb"
                                              data-template="pdf"
                                              title={file?.name}
                                            >
                                              <div className="kv-file-content">
                                                <embed
                                                  className="kv-preview-data file-preview-pdf"
                                                  src={previewUrl}
                                                  type="application/pdf"
                                                  style={{
                                                    width: "100%",
                                                    height: "160px",
                                                  }}
                                                />
                                              </div>
                                              <div className="file-thumbnail-footer">
                                                <div
                                                  className="file-footer-caption"
                                                  title={file?.name}
                                                >
                                                  <div className="file-caption-info">
                                                    {file?.name}
                                                  </div>
                                                  <div className="file-size-info">
                                                    <samp>
                                                      (
                                                      {Math.round(
                                                        file?.size / 1024
                                                      )}{" "}
                                                      KB)
                                                    </samp>
                                                  </div>
                                                </div>
                                                {uploadProgress > 0 &&
                                                  uploadProgress < 100 && (
                                                    <div className="file-thumb-progress">
                                                      <div className="progress">
                                                        <div
                                                          className="progress-bar bg-success progress-bar-striped active"
                                                          role="progressbar"
                                                          style={{
                                                            width: `${uploadProgress}%`,
                                                          }}
                                                        >
                                                          {uploadProgress}%
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                <div
                                                  className="file-upload-indicator"
                                                  title="Pas encore transféré"
                                                >
                                                  <i className="glyphicon glyphicon-plus-sign text-warning" />
                                                </div>
                                                <div className="file-actions">
                                                  <div className="file-footer-buttons">
                                                    <button
                                                      type="button"
                                                      className="kv-file-upload btn btn-sm btn-kv btn-default"
                                                      title="Transférer le fichier"
                                                      onClick={handleUpload}
                                                      style={{ width: "30px" }} // Ajusté pour visibilité
                                                    >
                                                      <i className="glyphicon glyphicon-upload" />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="kv-file-remove btn btn-sm btn-kv btn-default btn-outline-secondary"
                                                      title="Supprimer le fichier"
                                                      onClick={
                                                        handleRemoveFilecv
                                                      }
                                                      style={{ width: "30px" }} // Ajusté pour visibilité
                                                    >
                                                      <i className="glyphicon glyphicon-trash" />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="kv-file-zoom btn btn-sm btn-kv btn-default btn-outline-secondary"
                                                      title="Voir les détails"
                                                      onClick={handleZoom}
                                                      style={{ width: "30px" }} // Ajusté pour visibilité
                                                    >
                                                      <i className="glyphicon glyphicon-zoom-in" />
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="file-preview-thumbnails">
                                              <div className="file-preview-status text-center text-success">
                                                Aucun fichier sélectionné
                                              </div>
                                              <div className="file-drop-zone-title">
                                                Glissez et déposez les fichiers
                                                ici…
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div
                                        className={`kv-upload-progress ${
                                          uploadProgress === 0
                                            ? "kv-hidden"
                                            : ""
                                        }`}
                                      >
                                        <div className="progress">
                                          <div
                                            className="progress-bar bg-success progress-bar-success progress-bar-striped active"
                                            role="progressbar"
                                            aria-valuenow={uploadProgress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            style={{
                                              width: `${uploadProgress}%`,
                                            }}
                                          >
                                            {uploadProgress}%
                                          </div>
                                        </div>
                                      </div>
                                      <div className="clearfix" />
                                      {error && (
                                        <div className="kv-fileinput-error file-error-message text-danger">
                                          {error}
                                        </div>
                                      )}
                                      <div className="input-group file-caption-main">
                                        <div
                                          className="file-caption form-control kv-fileinput-caption"
                                          tabIndex="500"
                                        >
                                          <span className="file-caption-icon">
                                            <i className="glyphicon glyphicon-file" />
                                          </span>
                                          <input
                                            className="file-caption-name"
                                            readOnly
                                            onKeyDown={() => false}
                                            onPaste={() => false}
                                            placeholder="Sélectionner le(s) fichier..."
                                            value={file?.name || ""}
                                            title={file?.name || ""}
                                          />
                                        </div>
                                        <div className="input-group-btn input-group-append">
                                          {file && (
                                            <button
                                              type="button"
                                              tabIndex="500"
                                              className="btn btn-danger btn-sm fileinput-remove fileinput-remove-button"
                                              title="Retirer les fichiers sélectionnés"
                                              onClick={handleRemoveFilecv}
                                            >
                                              <i className="glyphicon glyphicon-trash" />{" "}
                                              <span className="hidden-xs">
                                                Retirer
                                              </span>
                                            </button>
                                          )}
                                          <div
                                            tabIndex="500"
                                            className="btn btn-primary btn-file"
                                          >
                                            <i className="glyphicon glyphicon-folder-open" />{" "}
                                            <span className="hidden-xs">
                                              Parcourir…
                                            </span>
                                            <input
                                              type="file"
                                              id="cv_profile"
                                              name="cv"
                                              onChange={handleFileChangecv}
                                              ref={fileInputRef}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    style={{ marginTop: "5px" }}
                                    className="col-md-12"
                                  >
                                    <button
                                      className="btn btn-success float-right"
                                      onClick={handleUpload}
                                      disabled={!file || uploadProgress > 0}
                                      style={{
                                        width: "120px",
                                        backgroundColor: "#1CC88A",
                                        borderColor: "#1CC88A",
                                      }}
                                    >
                                      Enregistrer
                                    </button>
                                    {uploadProgress > 0 &&
                                      uploadProgress < 100 && (
                                        <i
                                          className="form-loading fa fa-refresh fa-spin fa-2x fa-fw float-right"
                                          aria-hidden="true"
                                        />
                                      )}
                                    {uploadProgress === 100 && (
                                      <i
                                        className="answers-well-saved text-success fa fa-check fa-2x fa-fw float-right"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </div>
                                  <div className="clearfix" />
                                  <div id="form-errors" className="text-danger">
                                    {error}
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>

                <Modal
                  show={show}
                  onHide={handleClose}
                  size="lg"
                  centered
                  aria-labelledby="candidate-profile-modal"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Profil</Modal.Title>
                  </Modal.Header>

                  <Modal.Body className="p-6 bg-white">
                    <div
                      className="flex px-6 pt-4 mb-3 space-x-2 bg-white"
                      style={{ marginLeft: "450px" }}
                    >
                      <button
                        onClick={handleDownloadCv}
                        className="btn text-white text-xs ms-3 font-medium px-2 py-1 rounded-md flex items-center space-x-1"
                        style={{
                          backgroundColor: "#515C69",
                          width: "150px",
                          marginLeft: "100px",
                        }}
                      >
                        <i className="fas fa-download text-sm"></i>
                        <span>Télécharger</span>
                      </button>

                      <button
                        onClick={handlePrint}
                        className="btn text-white ms-1 text-xs font-medium px-2 py-1 rounded-md flex items-center space-x-1"
                        style={{ backgroundColor: "#1CC88A", width: "150px" }}
                      >
                        <i className="fas fa-file-pdf text-sm"></i>
                        <span>Imprimer</span>
                      </button>
                    </div>

                    <div id="cv-to-print" style={{ fontSize: "12px" }}>
                      <h5 className="text-lg font-bold text-gray-800 mb-3">
                        Réf : <span className="font-normal">{profile.id}</span>
                      </h5>

                      {/* État Civil */}
                      <h5 className="text-lg font-bold text-gray-800 mb-3">
                        État Civil
                      </h5>
                      <div
                        className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                        style={{ background: "#DCE3F9" }}
                      >
                        <div className="row">
                          <div className="col-2 p-0">
                            <Image
                              src={profile.logo}
                              alt="Avatar"
                              className="rounded-full  h-20 object-cover"
                              style={{ width: "110px" }}
                            />
                          </div>
                          <div className="col-lg-10">
                            <p className="mb-1">
                              <strong>Date de naissance :</strong>{" "}
                              {candidate.date_naissance}
                            </p>
                            <p className="mb-1">
                              <strong>Genre :</strong> {candidate.genre}
                            </p>
                            <p className="mb-1">
                              <strong>Pays :</strong> {candidate.pays}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Données personnelles */}
                      <h5 className="text-lg font-bold text-gray-800 mb-3">
                        Données personnelles
                      </h5>
                      <div
                        className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                        style={{ background: "#DCE3F9" }}
                      >
                        <p className="mb-1">
                          <strong>Nom :</strong> {profile.nom} {profile.prenom}
                        </p>
                        <p className="mb-1">
                          <strong>Téléphone :</strong> {profile.telephone}
                        </p>
                      </div>

                      {/* Option ou spécialisation */}
                      <h5 className="text-lg font-bold text-gray-800 mb-3">
                        Option ou spécialisation
                      </h5>
                      <div
                        className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                        style={{ background: "#DCE3F9" }}
                      >
                        {candidate.specialisations?.map((spec, index) => (
                          <div key={index}>
                            <p className="mb-1">
                              <strong>{spec.titre_specialisation}</strong>
                            </p>
                            <p className="mb-1">
                              <strong>
                                {spec.niveaux_etude} - {spec.experience}
                              </strong>
                            </p>
                            <p className="mb-1">
                              <strong>Domaine :</strong> {spec.domaine}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Diplômes et Formations */}
                      <h5 className="text-lg font-bold text-gray-800 mb-3">
                        Diplômes et Formations
                      </h5>
                      {candidate.diplomes?.map((edu, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                          style={{ background: "#DCE3F9" }}
                        >
                          <p className="mb-1">
                            <strong>{edu.diplome}</strong>
                          </p>
                          <p className="mb-1">
                            <strong>Établissement :</strong> {edu.etablissement}
                          </p>
                          <p className="mb-1">
                            <strong>
                              {edu.date_debut} - {edu.date_fin}
                            </strong>
                          </p>
                        </div>
                      ))}

                      {/* Expériences professionnelles */}
                      <h5 className="text-lg font-bold text-gray-800 mb-3">
                        Expériences professionnelles
                      </h5>
                      {candidate.experiences?.map((exp, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                          style={{ background: "#DCE3F9" }}
                        >
                          <p className="mb-1">
                            <strong>{exp.poste}</strong>
                          </p>
                          <p className="mb-1">
                            <strong>Entreprise :</strong> {exp.nom_entreprise}
                          </p>
                          <p className="mb-1">
                            <strong>
                              {exp.date_debut} -{" "}
                              {exp.en_cours ? "En cours" : exp.date_fin}
                            </strong>
                          </p>
                          <p className="mb-1">
                            <strong>Description :</strong> {exp.description}
                          </p>
                        </div>
                      ))}

                      {/* Langues Parlées */}
                      <h5 className="text-lg font-bold text-gray-800 mb-3">
                        Langues Parlées
                      </h5>
                      <div
                        className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                        style={{ background: "#DCE3F9" }}
                      >
                        {candidate.langues?.map((lang, index) => (
                          <p key={index} className="mb-1">
                            <strong>{lang.langue} :</strong> {lang.niveau}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>

                {/* Autres onglets */}

                {activeTab === "tab12" && (
                  <div
                    className="tab-pane fade show active"
                    role="tabpanel"
                    aria-labelledby="tab12"
                  >
                    {message && <div className="message">{message}</div>}
                    <div className="row mb-2">
                      <div className="col-md-12" id="tab2">
                        <Form onSubmit={handleSpecializationSubmit}>
                          <div className="row ">
                            {/* Titre de spécialisation */}
                            <div
                              className="col-md-6  mb-4"
                              style={{ paddingRight: "20px" }}
                            >
                              <Form.Label className="">
                                Titre de votre spécialisation{" "}
                                <span className="">*</span>
                              </Form.Label>
                              <Form.Control
                                id="titre_specialisation"
                                name="titre_specialisation"
                                value={
                                  specialization.titre_specialisation || ""
                                }
                                onChange={handleSpecializationChange}
                                required
                              />
                            </div>

                            {/* Niveau d'étude avec icône personnalisée */}
                            <div className="col-md-6 mb-4">
                              <Form.Label className="">
                                Niveau d'étude <span className="">*</span>
                              </Form.Label>
                              <div className="custom-select-wrapper">
                                <Form.Control
                                  as="select"
                                  id="niveaux_etude"
                                  name="niveaux_etude"
                                  value={specialization.niveaux_etude || ""}
                                  onChange={handleSpecializationChange}
                                  required
                                  className="form-control-select"
                                >
                                  <option value="">Sélectionner</option>
                                  {niveauxEtudeOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </Form.Control>
                              </div>
                            </div>

                            {/* Niveau d'expérience avec icône personnalisée */}
                            <div
                              className="col-md-6 mb-2"
                              style={{ paddingRight: "20px" }}
                            >
                              <Form.Label className=" ">
                                Niveau d'expérience <span className="">*</span>
                              </Form.Label>
                              <div className="custom-select-wrapper">
                                <Form.Control
                                  as="select"
                                  id="experience"
                                  name="experience"
                                  value={specialization.experience || ""}
                                  onChange={handleSpecializationChange}
                                  required
                                  className="form-control-select"
                                >
                                  <option value="">Sélectionner</option>
                                  {niveauxExperienceOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </Form.Control>
                              </div>
                            </div>

                            {/* Domaine avec icône personnalisée */}
                            <div className="col-md-6 mb-2">
                              <Form.Label className="">
                                Domaine <span className="">*</span>
                              </Form.Label>
                              <div className="custom-select-wrapper">
                                <Form.Control
                                  as="select"
                                  id="domaine"
                                  name="domaine"
                                  value={specialization.domaine || ""}
                                  onChange={handleSpecializationChange}
                                  required
                                  className="form-control-select"
                                >
                                  <option value="">Sélectionner</option>
                                  {domaineOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </Form.Control>
                              </div>
                              <Form.Control
                                type="text"
                                id="new_domaine"
                                name="new_domaine"
                                style={{ display: "none" }}
                                onChange={handleSpecializationChange}
                              />
                            </div>

                            {/* Bouton d'enregistrement */}
                            <div className="col-md-12 text-end">
                              <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{
                                  width: "120px", // largeur réduite
                                  backgroundColor: "#1CC88A", // couleur de fond personnalisée
                                  borderColor: "#1CC88A", // couleur de bordure personnalisée
                                }}
                              >
                                {loading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-1"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Enregistrement...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save me-1"></i>
                                    Enregistrer
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "tab13" && (
                  <div>
                    <section className="container mt-4">
                      <div>
                        {message && <div className="message">{message}</div>}
                        <div className="d-flex justify-content-end mb-3">
                          <button
                            onClick={() => {
                              setShowForm(true);
                              setMode("add"); // Passage en mode "ajouter"
                            }}
                            className="btn btn-primary btn-sm shadow-sm"
                            style={{
                              width: "130px",
                              minWidth: "120px",
                              padding: "0.25rem 0.5rem",
                              display: "flex",
                              alignItems: "center",
                              color: "#ffffff",
                            }}
                          >
                            <i className="fas fa-plus fa-sm text-white-50"></i>
                            <span>New diplome</span>
                          </button>
                        </div>

                        {showForm && mode === "add" && (
                          <div
                            className="card shadow mb-3 divSpecEtab"
                            style={{ maxWidth: "1000px" }}
                          >
                            <div
                              className="card-header d-flex justify-content-between align-items-center"
                              style={{
                                background: "#F8F9FC",
                                color: "#858796",
                              }}
                            >
                              Ajouter un nouveau diplome
                              <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="close"
                                style={{
                                  background: "#F8F9FC",
                                  color: "#858796",
                                  maxWidth: "100px",
                                  border: "none",
                                  boxShadow: "none",
                                  padding: "0.5rem",
                                }}
                              >
                                <span aria-hidden="true">x</span>
                              </button>
                            </div>

                            <div className="card-bod">
                              <form onSubmit={handleSubmitdiplom}>
                                <div className="row">
                                  <div className="form-group col-lg-6">
                                    <label className=" mb-2">
                                      Diplome <span className="">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="diplome"
                                      className="form-control"
                                      required
                                      value={formData.diplome}
                                      onChange={handleInputChangeDiplom}
                                    />
                                  </div>

                                  <div className="form-group col-lg-6">
                                    <label className="mb-2">
                                      Etablissement <span className="">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="etablissement"
                                      className="form-control"
                                      required
                                      value={formData.etablissement}
                                      onChange={handleInputChangeDiplom}
                                    />
                                  </div>

                                  <div className="form-group col-lg-6">
                                    <label className=" mb-2">
                                      Date début <span className="">*</span>
                                    </label>
                                    <input
                                      type="date"
                                      name="date_debut"
                                      className="form-control"
                                      value={formData.date_debut}
                                      onChange={handleInputChangeDiplom}
                                    />
                                  </div>

                                  <div className="form-group col-lg-6">
                                    <label className="mb-2">
                                      Date fin <span className="">*</span>
                                    </label>
                                    <input
                                      type="date"
                                      name="date_fin"
                                      className="form-control"
                                      value={formData.date_fin}
                                      onChange={handleInputChangeDiplom}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-12 text-end">
                                  <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                      width: "120px", // largeur réduite
                                      backgroundColor: "#1CC88A", // couleur de fond personnalisée
                                      borderColor: "#1CC88A", // couleur de bordure personnalisée
                                    }}
                                  >
                                    {loading ? (
                                      <>
                                        <span
                                          className="spinner-border spinner-border-sm me-1"
                                          role="status"
                                          aria-hidden="true"
                                        ></span>
                                        Enregistrement...
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-save me-1"></i>
                                        Enregistrer
                                      </>
                                    )}
                                  </Button>
                                </div>

                                {errors.length > 0 && (
                                  <div className="alert alert-danger mt-3">
                                    {errors.map((error, index) => (
                                      <div key={index}>{error}</div>
                                    ))}
                                  </div>
                                )}
                              </form>
                            </div>
                          </div>
                        )}
                      </div>

                      {showForm && mode === "edit" && (
                        <div
                          className="card shadow mb-3 divSpecEtab"
                          style={{ maxWidth: "1000px" }}
                        >
                          <div
                            className="card-header d-flex justify-content-between align-items-center"
                            style={{ background: "#F8F9FC", color: "#858796" }}
                          >
                            Modifier un diplôme
                            <button
                              type="button"
                              onClick={() => setShowForm(false)}
                              className="close"
                              style={{
                                background: "#F8F9FC",
                                color: "#858796",
                                maxWidth: "100px",
                                border: "none",
                                boxShadow: "none",
                                padding: "0.5rem",
                              }}
                            >
                              <span aria-hidden="true">x</span>
                            </button>
                          </div>

                          <div className="card-bod">
                            <form onSubmit={handleSubmitdiplomEdit}>
                              <div className="row">
                                <div className="form-group col-lg-6">
                                  <label className="ms-3 mb-2">
                                    Diplôme{" "}
                                    <span className="required_field">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="diplome"
                                    className="form-control"
                                    value={formData.diplome}
                                    required
                                    onChange={handleInputChangeDiplom}
                                  />
                                </div>

                                <div className="form-group col-lg-6">
                                  <label className="ms-3 mb-2">
                                    Établissement{" "}
                                    <span className="required_field">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="etablissement"
                                    className="form-control"
                                    value={formData.etablissement}
                                    required
                                    onChange={handleInputChangeDiplom}
                                  />
                                </div>

                                <div className="form-group col-lg-6">
                                  <label className="ms-3 mb-2">
                                    Date début{" "}
                                    <span className="required_field">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    name="date_debut"
                                    className="form-control"
                                    value={formData.date_debut}
                                    onChange={handleInputChangeDiplom}
                                  />
                                </div>

                                <div className="form-group col-lg-6">
                                  <label className="ms-3 mb-2">
                                    Date fin{" "}
                                    <span className="required_field">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    name="date_fin"
                                    className="form-control"
                                    value={formData.date_fin}
                                    onChange={handleInputChangeDiplom}
                                  />
                                </div>
                              </div>

                              <div className="col-md-12 text-end">
                                <Button
                                  variant="primary"
                                  type="submit"
                                  disabled={loading}
                                  style={{
                                    width: "120px",
                                    backgroundColor: "#1CC88A",
                                    borderColor: "#1CC88A",
                                  }}
                                >
                                  {loading ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      Enregistrement...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-save me-1"></i>
                                      Enregistrer
                                    </>
                                  )}
                                </Button>
                              </div>

                              {errors.length > 0 && (
                                <div className="alert alert-danger mt-3">
                                  {errors.map((error, index) => (
                                    <div key={index}>{error}</div>
                                  ))}
                                </div>
                              )}
                            </form>
                          </div>
                        </div>
                      )}

                      <div
                        className="text-center card shadow mt-4"
                        style={{ maxWidth: "100%" }}
                      >
                        <div className="card-bod">
                          <table
                            id="diplomes"
                            className="table table-striped table-bordered"
                          >
                            <thead>
                              <tr>
                                <th>Diplôme</th>
                                <th>Établissement</th>
                                <th>Date début</th>
                                <th>Date fin</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {diplomes.map((diplome) => (
                                <tr key={diplome.id}>
                                  <td>{diplome.diplome}</td>
                                  <td>{diplome.etablissement}</td>
                                  <td>{diplome.date_debut}</td>
                                  <td>{diplome.date_fin}</td>
                                  <td className="d-flex justify-content-center gap-2">
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Modifier</Tooltip>}
                                    >
                                      <Button
                                        className=""
                                        onClick={() =>
                                          handleEditDiplome(diplome)
                                        }
                                        style={{
                                          padding: "5px 2px 2px 2px",
                                          fontSize: "10px",
                                          width: "23px",
                                          backgroundColor: "#5A5C69",
                                          borderRadius: "4px",
                                          border: "none",
                                          boxShadow: "none",
                                          outline: "none",
                                        }}
                                      >
                                        <i className="fa fa-fw fa-pencil-alt"></i>
                                      </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Supprimer</Tooltip>}
                                    >
                                      <Button
                                        className="btn-sm"
                                        style={{
                                          padding: "5px 2px 2px 2px",
                                          fontSize: "10px",
                                          width: "23px",
                                          backgroundColor: "#e74a3b",
                                          borderRadius: "4px",
                                          border: "none",
                                          boxShadow: "none",
                                          outline: "none",
                                        }}
                                        onClick={() => handleDelete(diplome.id)}
                                      >
                                        <i className="fa fa-fw fa-trash"></i>
                                      </Button>
                                    </OverlayTrigger>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "tab14" && (
                  <section className="container mt-4">
                    {message && <div className="message">{message}</div>}
                    <div>
                      <div className="d-flex justify-content-end mb-3">
                        <button
                          onClick={() => {
                            setShowForm(true);
                            setMode("add"); // Passage en mode "ajouter"
                          }}
                          className="btn btn-primary btn-sm shadow-sm"
                          style={{
                            width: "130px",
                            minWidth: "170px",
                            padding: "0.25rem 0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <i className="fas fa-plus fa-sm text-white-50"></i>
                          <span>Ajouter une langue</span>
                        </button>
                      </div>

                      {showForm && mode === "add" && (
                        <div
                          className="card shadow mb-3"
                          style={{ maxWidth: "1000px" }}
                        >
                          <div
                            className="card-header d-flex justify-content-between align-items-center"
                            style={{ background: "#F8F9FC", color: "#858796" }}
                          >
                            Ajouter une nouvelle langue
                            <button
                              type="button"
                              onClick={() => setShowForm(false)}
                              className="close"
                              style={{
                                background: "#F8F9FC",
                                color: "#858796",
                                maxWidth: "100px",
                                border: "none",
                                boxShadow: "none",
                                padding: "0.5rem",
                              }}
                            >
                              <span aria-hidden="true">x</span>
                            </button>
                          </div>

                          <div className="card-bod">
                            <form onSubmit={handleSubmitLangueAdd}>
                              <div className="row">
                                <div className="form-group col-lg-6">
                                  <label className=" mb-2">
                                    Langue <span className="">*</span>
                                  </label>
                                  <select
                                    name="langue"
                                    className="form-control"
                                    value={langueData.langue}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Sélectionner</option>
                                    <option value="Arabe">Arabe</option>
                                    <option value="Français">Français</option>
                                    <option value="Anglais">Anglais</option>
                                  </select>
                                </div>

                                <div className="form-group col-lg-6">
                                  <label className=" mb-2">
                                    Niveau <span className="">*</span>
                                  </label>
                                  <select
                                    name="niveau"
                                    className="form-control"
                                    value={langueData.niveau}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Sélectionner</option>
                                    <option value="Bien">Bien</option>
                                    <option value="Très bien">Très bien</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Maternelle">
                                      Maternelle
                                    </option>
                                  </select>
                                </div>
                              </div>

                              <div className="col-md-12 text-end">
                                <Button
                                  variant="primary"
                                  type="submit"
                                  disabled={loading}
                                  style={{
                                    width: "120px",
                                    backgroundColor: "#1CC88A",
                                    borderColor: "#1CC88A",
                                  }}
                                >
                                  {loading ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      Enregistrement...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-save me-1"></i>
                                      Enregistrer
                                    </>
                                  )}
                                </Button>
                              </div>

                              {errors.length > 0 && (
                                <div className="alert alert-danger mt-3">
                                  {errors.map((error, index) => (
                                    <div key={index}>{error}</div>
                                  ))}
                                </div>
                              )}
                            </form>
                          </div>
                        </div>
                      )}

                      {showForm && mode === "edit" && (
                        <div
                          className="card shadow mb-3"
                          style={{ maxWidth: "1000px" }}
                        >
                          <div
                            className="card-header d-flex justify-content-between align-items-center"
                            style={{ background: "#F8F9FC", color: "#858796" }}
                          >
                            Modifier une langue
                            <button
                              type="button"
                              onClick={() => setShowForm(false)}
                              className="close"
                              style={{
                                background: "#F8F9FC",
                                color: "#858796",
                                maxWidth: "100px",
                                border: "none",
                                boxShadow: "none",
                                padding: "0.5rem",
                              }}
                            >
                              <span aria-hidden="true">x</span>
                            </button>
                          </div>

                          <div className="card-bod">
                            <form onSubmit={handleSubmitLangueEdit}>
                              <div className="row">
                                <div className="form-group col-lg-6">
                                  <label className="ms-3 mb-2">
                                    Langue <span className="">*</span>
                                  </label>
                                  <select
                                    name="langue"
                                    className="form-control"
                                    value={langueData.langue}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Sélectionner</option>
                                    <option value="Arabe">Arabe</option>
                                    <option value="Français">Français</option>
                                    <option value="Anglais">Anglais</option>
                                  </select>
                                </div>

                                <div className="form-group col-lg-6">
                                  <label className="ms-3 mb-2">
                                    Niveau <span className="">*</span>
                                  </label>
                                  <select
                                    name="niveau"
                                    className="form-control"
                                    value={langueData.niveau}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Sélectionner</option>
                                    <option value="Bien">Bien</option>
                                    <option value="Très bien">Très bien</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Maternelle">
                                      Maternelle
                                    </option>
                                  </select>
                                </div>
                              </div>

                              <div className="col-md-12 text-end">
                                <Button
                                  variant="primary"
                                  type="submit"
                                  disabled={loading}
                                  style={{
                                    width: "120px",
                                    backgroundColor: "#1CC88A",
                                    borderColor: "#1CC88A",
                                  }}
                                >
                                  {loading ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      Enregistrement...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-save me-1"></i>
                                      Enregistrer
                                    </>
                                  )}
                                </Button>
                              </div>

                              {errors.length > 0 && (
                                <div className="alert alert-danger mt-3">
                                  {errors.map((error, index) => (
                                    <div key={index}>{error}</div>
                                  ))}
                                </div>
                              )}
                            </form>
                          </div>
                        </div>
                      )}

                      <div
                        className="text-center card shadow mt-4"
                        style={{ maxWidth: "100%" }}
                      >
                        <div className="card-bod">
                          <table
                            id="langues"
                            className="table table-striped table-bordered"
                          >
                            <thead>
                              <tr>
                                <th>Langue</th>
                                <th>Niveau</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {langues.map((langue) => (
                                <tr key={langue.id}>
                                  <td>{langue.langue}</td>
                                  <td>{langue.niveau}</td>
                                  <td className="d-flex justify-content-center gap-2">
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Supprimer</Tooltip>}
                                    >
                                      <Button
                                        className="btn-sm"
                                        style={{
                                          padding: "5px 2px 2px 2px",
                                          fontSize: "10px",
                                          width: "23px",
                                          backgroundColor: "#e74a3b",
                                          borderRadius: "4px",
                                          border: "none",
                                          boxShadow: "none",
                                          outline: "none",
                                        }}
                                        onClick={() =>
                                          handleDeleteLangue(langue.id)
                                        }
                                      >
                                        <i className="fa fa-fw fa-trash"></i>
                                      </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Modifier</Tooltip>}
                                    >
                                      <Button
                                        className="btn-sm"
                                        onClick={() =>
                                          handleEditLangues(langue)
                                        }
                                        style={{
                                          padding: "5px 2px 2px 2px",
                                          fontSize: "10px",
                                          width: "23px",
                                          backgroundColor: "#5A5C69",
                                          borderRadius: "4px",
                                          border: "none",
                                          boxShadow: "none",
                                          outline: "none",
                                        }}
                                      >
                                        <i className="fa fa-fw fa-pencil-alt"></i>
                                      </Button>
                                    </OverlayTrigger>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === "tab15" && (
                  <div>
                    {message && <div className="message">{message}</div>}
                    <div className="d-flex justify-content-end mb-3">
                      <button
                        onClick={() => {
                          setShowForm(true);
                          setMode("add");
                        }}
                        className="btn btn-primary btn-sm shadow-sm"
                        style={{
                          width: "130px",
                          minWidth: "170px",
                          padding: "0.25rem 0.5rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <i className="fas fa-plus fa-sm text-white-50"></i>
                        <span>Ajouter une expérience</span>
                      </button>
                    </div>

                    {showForm && (
                      <div
                        className="card shadow mb-3"
                        style={{ maxWidth: "1000px" }}
                      >
                        <div
                          className="card-header d-flex justify-content-between align-items-center"
                          style={{ background: "#F8F9FC", color: "#858796" }}
                        >
                          {mode === "add"
                            ? "Ajouter une expérience"
                            : "Modifier une expérience"}
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="close"
                            style={{
                              background: "#F8F9FC",
                              color: "#858796",
                              maxWidth: "100px",
                              border: "none",
                              boxShadow: "none",
                              padding: "0.5rem",
                            }}
                          >
                            <span aria-hidden="true">x</span>
                          </button>
                        </div>

                        <div className="card-bod">
                          <form
                            onSubmit={
                              mode === "add"
                                ? handleSubmitAdd
                                : handleSubmitEdit
                            }
                          >
                            <div className="row">
                              <div className="form-group col-lg-6">
                                <label className="mb-2">Entreprise *</label>
                                <input
                                  type="text"
                                  name="nom_entreprise"
                                  className="form-control"
                                  value={experienceData.nom_entreprise}
                                  onChange={handleInputChangeexperciance}
                                  required
                                />
                              </div>

                              <div className="form-group col-lg-6">
                                <label className=" mb-2">Poste *</label>
                                <input
                                  type="text"
                                  name="poste"
                                  className="form-control"
                                  value={experienceData.poste}
                                  onChange={handleInputChangeexperciance}
                                  required
                                />
                              </div>

                              <div className="form-group col-lg-6">
                                <label className=" mb-2">Date de début *</label>
                                <input
                                  type="date"
                                  name="date_debut"
                                  className="form-control"
                                  value={experienceData.date_debut}
                                  onChange={handleInputChangeexperciance}
                                  required
                                />
                              </div>

                              <div className="form-group col-lg-6">
                                <label className="mb-2">Date de fin</label>
                                <input
                                  type="date"
                                  name="date_fin"
                                  className="form-control"
                                  value={experienceData.date_fin}
                                  onChange={handleInputChangeexperciance}
                                  disabled={experienceData.en_cours}
                                />
                                <div className="form-check mt-1">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="en_cours"
                                    checked={experienceData.en_cours}
                                    onChange={handleInputChangeexperciance}
                                  />
                                  <label className="form-check-label">
                                    En cours
                                  </label>
                                </div>
                              </div>

                              <div className="form-group col-lg-12">
                                <label className=" mb-2">Description</label>
                                <textarea
                                  name="description"
                                  className="form-control"
                                  value={experienceData.description}
                                  onChange={handleInputChangeexperciance}
                                ></textarea>
                              </div>
                            </div>

                            <div className="col-md-12 text-end mt-3">
                              <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{
                                  width: "120px",
                                  backgroundColor: "#1CC88A",
                                  borderColor: "#1CC88A",
                                }}
                              >
                                {loading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-1"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Enregistrement...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save me-1"></i>
                                    Enregistrer
                                  </>
                                )}
                              </Button>
                            </div>

                            {errors.length > 0 && (
                              <div className="alert alert-danger mt-3">
                                {errors.map((error, index) => (
                                  <div key={index}>{error}</div>
                                ))}
                              </div>
                            )}
                          </form>
                        </div>
                      </div>
                    )}

                    <div className="table-responsive">
                      <table id="experiences" className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>Entreprise</th>
                            <th>Poste</th>
                            <th>Date debut</th>
                            <th>Date fin</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {experiences.map((exp) => (
                            <tr key={exp.id}>
                              <td>{exp.nom_entreprise}</td>
                              <td>{exp.poste}</td>
                              <td>
                                {exp.date_debut} -{" "}
                                {exp.en_cours ? "En cours" : exp.date_fin}
                              </td>
                              <td>{exp.date_fin}</td>

                              <td className="d-flex justify-content-center gap-2">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Modifier</Tooltip>}
                                >
                                  <Button
                                    className="btn-sm"
                                    onClick={() => handleEditClick(exp)}
                                    style={{
                                      padding: "5px 2px 2px 2px",
                                      fontSize: "10px",
                                      width: "23px",
                                      backgroundColor: "#5A5C69",
                                      borderRadius: "4px",
                                      border: "none",
                                      boxShadow: "none",
                                      outline: "none",
                                    }}
                                  >
                                    <i className="fa fa-fw fa-pencil-alt"></i>
                                  </Button>
                                </OverlayTrigger>

                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Supprimer</Tooltip>}
                                >
                                  <Button
                                    className="btn-sm"
                                    style={{
                                      padding: "5px 2px 2px 2px",
                                      fontSize: "10px",
                                      width: "23px",
                                      backgroundColor: "#e74a3b",
                                      borderRadius: "4px",
                                      border: "none",
                                      boxShadow: "none",
                                      outline: "none",
                                    }}
                                    onClick={() =>
                                      handleDeleteExperience(exp.id)
                                    }
                                  >
                                    <i className="fa fa-fw fa-trash"></i>
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "tab16" && (
                  <div
                    className="tab-pane fade show active"
                    role="tabpanel"
                    aria-labelledby="tab16"
                  >
                    {message && <div className="message">{message}</div>}
                    <div className="row mb-2">
                      <div className="col-md-12">
                        <Form onSubmit={handleCompteSubmit}>
                          <div className="row">
                            {/* Nom d'utilisateur */}
                            <div
                              className="col-md-6 mb-4"
                              style={{ paddingRight: "20px" }}
                            >
                              <Form.Label className="">
                                Nom d'utilisateur <span className="">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="username"
                                name="username"
                                value={compteData.username}
                                onChange={handleCompteChange}
                                required
                              />
                            </div>

                            {/* Email */}
                            <div className="col-md-6 mb-4">
                              <Form.Label className="">
                                Email <span className="">*</span>
                              </Form.Label>
                              <Form.Control
                                type="email"
                                id="email"
                                name="email"
                                value={compteData.email}
                                onChange={handleCompteChange}
                                required
                              />
                            </div>

                            {/* Mot de passe */}
                            <div
                              className="col-md-6 mb-4"
                              style={{ paddingRight: "20px" }}
                            >
                              <Form.Label className="">
                                Mot de passe <span className="">*</span>
                              </Form.Label>
                              <Form.Control
                                type="password"
                                id="password"
                                name="password"
                                value={compteData.password}
                                onChange={handleCompteChange}
                                required
                              />
                            </div>

                            {/* Confirmation du mot de passe */}
                            <div className="col-md-6 mb-4">
                              <Form.Label className="">
                                Confirmer le mot de passe{" "}
                                <span className="required_field">*</span>
                              </Form.Label>
                              <Form.Control
                                type="password"
                                id="passwordConfirm"
                                name="passwordConfirm"
                                value={compteData.passwordConfirm}
                                onChange={handleCompteChange}
                                required
                              />
                            </div>

                            {/* Bouton de soumission */}
                            <div className="col-md-12 text-end">
                              <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                  width: "150px",
                                  backgroundColor: "#1CC88A",
                                  borderColor: "#1CC88A",
                                }}
                              >
                                {isSubmitting ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-1"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Enregistrement...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save me-1"></i>
                                    Enregistrer
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCandidat;
