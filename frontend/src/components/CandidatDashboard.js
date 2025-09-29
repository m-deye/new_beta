import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import '../assets/styles/ClientDashboard.css';
import ProfileSection from "./ProfileSection";
import OffresEmploiSection from "./OffresEmploiSection";
import StatisticsSection from "./StatisticsSection";

const CandidatDashboard = () => {
  const location = useLocation();
  const initialProfile = location.state?.profileData || {};
  const [profile, setProfile] = useState(initialProfile);
  const [messages, setMessages] = useState({});
  const [activeSection, setActiveSection] = useState("statistiques");
  const [showProfileButtons, setShowProfileButtons] = useState(false);

  const [statistics, setStatistics] = useState({
    nombreOffresEmploi: 12,
  });

  const [offresEmploi, setOffresEmploi] = useState([
    { id: 1, titre: "Développeur Frontend", description: "Développement d'interfaces utilisateur", date: "2023-10-01" },
    { id: 2, titre: "Développeur Backend", description: "Développement d'API et de services", date: "2023-10-05" },
  ]);

  const domaines = ["Technologie", "Santé", "Finance", "Éducation"];
  const typesOrganisation = ["Entreprise", "ONG", "Gouvernement", "Startup"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    setMessages({ ...messages, [section]: null });

    if (section === "compte" && profile.mot_de_passe !== profile.confirme_mot_de_passe) {
      setMessages({ ...messages, [section]: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/client/${profile.id}/update/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMessages({ ...messages, [section]: "Mise à jour réussie!" });
      } else {
        setMessages({ ...messages, [section]: data.error || "Erreur lors de la mise à jour." });
      }
    } catch (error) {
      setMessages({ ...messages, [section]: "Erreur de connexion au serveur." });
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section !== "info" && section !== "contact" && section !== "compte") {
      setShowProfileButtons(false);
    }
  };

  const toggleProfileButtons = () => {
    setShowProfileButtons((prev) => !prev);
    if (!showProfileButtons) {
      setActiveSection("info");
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>Tableau de bord du client</h1>
          <div className="logo">
            <img src="/path/to/logo.png" alt="Logo" />
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <button
                className={`sidebar-button ${activeSection === "profile" ? "active" : ""}`}
                onClick={() => {
                  setActiveSection("info");
                  setShowProfileButtons(true);
                }}
              >
               Mon Profile 
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeSection === "statistiques" ? "active" : ""}`}
                onClick={() => handleSectionChange("statistiques")}
              >
                Statistiques
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeSection === "offres" ? "active" : ""}`}
                onClick={() => handleSectionChange("offres")}
              >
                Offres d'emploi
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {showProfileButtons && (
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
        )}

        {activeSection === "statistiques" && <StatisticsSection statistics={statistics} />}
        {activeSection === "offres" && <OffresEmploiSection offresEmploi={offresEmploi} />}
        {activeSection === "info" && (
          <ProfileSection
            profile={profile}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            messages={messages}
            domaines={domaines}
            typesOrganisation={typesOrganisation}
          />
        )}
      </main>
    </div>
  );
};

export default CandidatDashboard;