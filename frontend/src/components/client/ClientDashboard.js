import React, { useState,  useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './ClientDashboard.css';
import ProfileClient from "./ProfileClient";
import OffresEmploi from "./OffresEmploi";
import AppleOffres from "./AppleOffres";
import Statistics from "./Statistics";
import AvisInfos from "./AvisInfos";
import {  Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import Navbar from '../../Navbar';
import axiosInstance from '../../api/axiosInstance';

import { FaHome,
  FaUserCircle,
  FaTachometerAlt,
  FaBriefcase,
  FaFileContract,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  import { Modal } from 'react-bootstrap';

const ClientDashboard =  ({  }) => {
  const sideBarWidthExpanded = '14rem';
  const sideBarWidthCollapsed = '6.5rem';

  const [isSmallScreen, setSmallScreen] = useState(window.matchMedia('(max-width: 768px)').matches);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSideBar = () => {
    if (!isSmallScreen) {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (event) => {
      setSmallScreen(event.matches);
      if (event.matches) {
        setIsCollapsed(false);
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const location = useLocation();
  const initialProfile = location.state?.profileData || {};
  const [profile, setProfile] = useState(initialProfile);
  const [messages, setMessages] = useState({});
  const [activeSection, setActiveSection] = useState("statistiques");
  const [showProfileButtons, setShowProfileButtons] = useState(false);

  const [statistics, setStatistics] = useState({
    nombreOffresEmploi: 12,
    nombreAppleOffres: 5,
  });

  const [offresEmploi, setOffresEmploi] = useState([]);
  const [appleOffres, setAppleOffres] = useState([]);
  const [avisInfos, setAvisInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const domaines = ["Technologie", "Santé", "Finance", "Éducation"];
  const typesOrganisation = ["Entreprise", "ONG", "Gouvernement", "Startup"];

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === "file") {
      setProfile({
        ...profile,
        [name]: files[0],
      });
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  // const handleSubmit = async (e, section) => {
  //   e.preventDefault();
  //   setMessages({ ...messages, [section]: null });
  //   const formData = new FormData();
  //   Object.entries(profile).forEach(([key, value]) => {
  //     formData.append(key, value);
  //   });
  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/client/${profile.id}/update/`,
  //       {
  //         method: "PUT",
  //         body: formData,
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       setMessages({ ...messages, [section]: "Mise à jour réussie!" });
  //     } else {
  //       setMessages({ ...messages, [section]: data.error || "Erreur lors de la mise à jour." });
  //     }
  //   } catch (error) {
  //     setMessages({ ...messages, [section]: "Erreur de connexion au serveur." });
  //   }
  // };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    setMessages((prevMessages) => ({ ...prevMessages, [section]: null }));
  
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    try {
      const response = await axiosInstance.put(
        `/api/client/${profile.id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setMessages((prevMessages) => ({
        ...prevMessages,
        [section]: "Mise à jour réussie!",
      }));
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Erreur lors de la mise à jour.";
      setMessages((prevMessages) => ({
        ...prevMessages,
        [section]: errorMsg,
      }));
    }
  };
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section !== "info" && section !== "contact" && section !== "compte") {
      setShowProfileButtons(false);
    }
  };

  // useEffect(() => {
  //   const fetchOffresEmploi = async () => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/api/client/${profile.id}/offres-emploi/`);
  //       const data = await response.json();
  //       if (response.ok) {
  //         setOffresEmploi(data);
  //       } else {
  //         console.error("Erreur lors de la récupération des offres d'emploi");
  //       }
  //     } catch (error) {
  //       console.error("Erreur de connexion au serveur", error);
  //     }
  //   };
  //   if (profile.id) {
  //     fetchOffresEmploi();
  //   }
  // }, [profile.id]);

  // useEffect(() => {
  //   const fetchAppleOffres = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/appels_offres/api/client/${profile.id}/`);
  //       const data = await response.json();
  //       if (response.ok) {
  //         setAppleOffres(data);
  //       } else {
  //         setError("Erreur lors de la récupération des offres Apple");
  //       }
  //     } catch (error) {
  //       setError("Erreur de connexion au serveur");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchAppleOffres();
  // }, [profile.id]);

  // useEffect(() => {
  //   const fetchAvisInfos = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/avis_infos/api/client/${profile.id}/`);
  //       const data = await response.json();
  //       if (response.ok) {
  //         setAvisInfos(data);
  //       } else {
  //         setError("Erreur lors de la récupération des avis et informations");
  //       }
  //     } catch (error) {
  //       setError("Erreur de connexion au serveur");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchAvisInfos();
  // }, [profile.id]);

  useEffect(() => {
    const fetchOffresEmploi = async () => {
      try {
        const response = await axiosInstance.get(`/api/client/${profile.id}/offres-emploi/`);
        setOffresEmploi(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des offres d'emploi", error);
      }
    };
  
    if (profile.id) {
      fetchOffresEmploi();
    }
  }, [profile.id]);

  useEffect(() => {
    const fetchAppleOffres = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/appels_offres/api/client/${profile.id}/`);
        setAppleOffres(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des offres Apple");
      } finally {
        setLoading(false);
      }
    };
  
    if (profile.id) {
      fetchAppleOffres();
    }
  }, [profile.id]);

  useEffect(() => {
    const fetchAvisInfos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/avis_infos/api/client/${profile.id}/`);
        setAvisInfos(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des avis et informations");
      } finally {
        setLoading(false);
      }
    };
  
    if (profile.id) {
      fetchAvisInfos();
    }
  }, [profile.id]);
  
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogoutRequest = () => {
    setShowDropdown(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/login');
  };

  const profileData = location.state?.profileData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
 

  const [compteData, setcompteData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
   
  });

  const handleCompteChange = (e) => {
    const { name, value } = e.target;
    setcompteData(prev => ({ ...prev, [name]: value }));
  };

  // const handleCompteSubmit = async (e) => {
  //   e.preventDefault();   
  //   setIsSubmitting(true);
    
  
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/compte/client/${profile.id}/update/`, {
  //       method: 'PUT',   
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
        
  //       body: JSON.stringify({ ...compteData }),
  //     });
  
  //     if (!response.ok) throw new Error('Erreur de soumission');

  //   } catch (error) {
  //     setErrors([error.message]);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleCompteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
  
    try {
      await axiosInstance.put(`/api/compte/client/${profile.id}/update/`, compteData);
    } catch (error) {
      setErrors([
        error.response?.data?.detail || "Erreur de soumission"
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <div className="dashboard">
           <header
        style={{
          left: isSmallScreen ? '0' : isCollapsed ? sideBarWidthCollapsed : sideBarWidthExpanded,
          width: isSmallScreen ? '100%' : `calc(100% - ${isCollapsed ? sideBarWidthCollapsed : sideBarWidthExpanded})`,
          transition: 'left 0.3s ease, width 0.3s ease'
        }}
        className="header"
      >
        <div className="header-content">
          {/* <a 
            className="sideBar-brand d-flex align-items-center justify-content-center" 
            href=""
          >
            <div className="sideBar-brand-icon"></div>
            <div className="sideBar-brand-text mx-3"></div>
          </a> */}
          <span className="ml-2" >
            <i className="fa fa-id-card"></i> Espace client - {profileData && profileData.username}
            </span>
          
          <div className="logo" >
          <span className="client-name" style={{ marginRight: "5px", fontSize: '10px' ,color:'#318D4C'}}>
              {profileData && profileData.username}
            </span>
            
            <div className="dropdown" ref={dropdownRef}>
              <i 
                className="fa fa-user-circle" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer', fontSize: '24px' }}
                role="button"
                aria-expanded={showDropdown}
              ></i>
              
              <ul 
                className={`dropdown-menu${showDropdown ? ' show' : ''}`} 
                style={{ right: 0, left: 'auto' }}
              >
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogoutRequest}
                  >
                    Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <Modal 
        show={showLogoutModal} 
        onHide={() => setShowLogoutModal(false)}
        backdropClassName="modal-backdrop"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          Cliquez sur "Déconnecter" ci-dessous si vous êtes prêt.
        </Modal.Body>
        
        <Modal.Footer className="d-flex justify-content-end gap-2">
  <button 
    className="btn btn-outline-secondary border-0 text-dark bg-gray-300" 
    onClick={() => setShowLogoutModal(false)}
  >
    Retourner
  </button>
  <button 
    className="btn text-white bg-primary border-0 custom-stable" 
    onClick={handleConfirmLogout}
  >
    <i className="fa fa-sign-out fa-fw me-2"></i>
    Déconnecter
  </button>
</Modal.Footer>
      </Modal>
     
  
            
         

<ul className={`navbar-nav bg-info sideBar sideBar-dark accordion ${isCollapsed ? 'collapsed' : ''}`} id="mainMenu">
  {/* En-tête */}


<Link to="/" className="sideBar-brand d-flex align-items-center justify-content-center" style={{ textDecoration: 'none', color: '#FFFFFF' }}

state={{ profileData }}>
  <div className="sideBar-brand-icon">
    <FaHome className="fa-lg" />
  </div>
  <div className="sideBar-brand-text mx-3">BETA</div> 
  {/* <Navbar profileData=   {profileData && profileData.libelle_fr} /> */}
 
 
</Link>

  {/* Contenu dynamique */}
  <li className="divider"><hr className="sideBar-divider my-0" /></li>
  <li className="nav-item">
    <button
      className={`nav-link ${activeSection === "statistiques" ? "active" : ""}`}
      onClick={() => handleSectionChange("statistiques")}
    >
      <FaTachometerAlt className="me-2" />
      <span>Tableau de bord</span>
    </button>
  </li>
  <li className="nav-item">
    <button
      className={`nav-link ${activeSection === "info" ? "active" : ""}`}
      onClick={() => {
        setActiveSection("info");
        setShowProfileButtons(true);
      }}
    >
      <FaUserCircle className="me-2" />
      <span style={{ textDecoration: 'none' }}>Mon profile</span>
    </button>
  </li>

  <li className="nav-item">
    <button
      className={`nav-link ${activeSection === "offres" ? "active" : ""}`}
      onClick={() => handleSectionChange("offres")}
    >
      <FaBriefcase className="me-2" />
      <span>Offres d'emploi</span>
    </button>
  </li>

  <li className="nav-item">
    <button
      className={`nav-link ${activeSection === "apple-offres" ? "active" : ""}`}
      onClick={() => handleSectionChange("apple-offres")}
    >
      <FaFileContract className="me-2" />
      <span>Appels d'offres</span>
    </button>
  </li>

  <li className="nav-item">
    <button
      className={`nav-link ${activeSection === "avis_infos" ? "active" : ""}`}
      onClick={() => handleSectionChange("avis_infos")}
    >
      <FaInfoCircle className="me-2" />
      <span>Avis & infos</span>
    </button>
  </li>

  {/* Séparateur et bouton de toggle */}
  <li className="divider d-none d-md-block"><hr className="sideBar-divider d-none d-md-block" /></li>
  
  <li className="toggle-button-item w-100">
    <div className="text-center d-none d-md-block">
      <button 
        className="rounded-circle border-0 mx-auto" 
        id="sideBarToggle"
        onClick={toggleSideBar}
        aria-label="Toggle side bar" 
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
    </div>
  </li>
</ul>

      <main
        style={{
          marginLeft: isSmallScreen ? '0' : isCollapsed ? sideBarWidthCollapsed : sideBarWidthExpanded,
          transition: 'margin-left 0.3s ease',
          marginTop: '80px'
        }}
        className="main-content"
      >
        {/* {showProfileButtons && (
          <div className="profile-buttons">
            <button
              className={`tab-button ${activeSection === "info" ? "active" : ""}`}
              onClick={() => handleSectionChange("info")}
            >
              Informations Générales
            </button>
            <button
              className={`tab-button ${activeSection === "contact" ? "active" : ""}`}
              onClick={() => handleSectionChange("contact")}
            >
              Contact & Responsable
            </button>
            <button
              className={`tab-button ${activeSection === "compte" ? "active" : ""}`}
              onClick={() => handleSectionChange("compte")}
            >
              Gestion de Compte
            </button>
          </div>
        )} */}

        {activeSection === "statistiques" && <Statistics statistics={statistics}  clientId={profile.id}/>}
        {activeSection === "info" && (
          <ProfileClient
            profile={profile}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            
            messages={messages}
            domaines={domaines}
            typesOrganisation={typesOrganisation}
            activeSection="info" 
            clientId={profile.id}/>
        )}

        {activeSection === "contact" && (
          <ProfileClient
            profile={profile}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            messages={messages}
            domaines={domaines}
            typesOrganisation={typesOrganisation}
            activeSection="contact"
          />
        )}

        {activeSection === "compte" && (
          <ProfileClient
            profile={profile}
            handleChange={handleChange}
            handleCompteChange={handleCompteChange}
            handleSubmit={handleSubmit}
            handleCompteSubmit={handleCompteSubmit}
            messages={messages}
            domaines={domaines}
            typesOrganisation={typesOrganisation}
            activeSection="compte"
          />
        )}
        {activeSection === "offres" && <OffresEmploi offresEmploi={offresEmploi} clientId={profile.id} />}

        {activeSection === "apple-offres" && (
          <>
            {loading && <p>Chargement des offres Apple...</p>}
            {error && <p>{error}</p>}
            <AppleOffres appleOffres={appleOffres} clientId={profile.id}/>
          </>
        )}
        {activeSection === "avis_infos" && (
          <>
            {loading && <p>Chargement des avis et informations...</p>}
            {error && <p>{error}</p>}
            <AvisInfos avisInfos={avisInfos} clientId={profile.id} />
          </>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;