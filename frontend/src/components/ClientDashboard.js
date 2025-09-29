import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import '../assets/styles/ClientDashboard.css';

const ClientDashboard = () => {
  const location = useLocation();
  const initialProfile = location.state?.profileData || {};
  const [profile, setProfile] = useState(initialProfile);
  const [messages, setMessages] = useState({});
  const [activeSection, setActiveSection] = useState("statistiques"); // Par défaut, afficher la section Statistiques
  const [showProfileButtons, setShowProfileButtons] = useState(false); // État pour afficher/masquer les boutons du profil

  // Données fictives pour les statistiques
  const [statistics, setStatistics] = useState({
    nombreOffresEmploi: 12,
    nombreAppleOffres: 5,
  });

  // Données fictives pour les offres d'emploi
  const [offresEmploi, setOffresEmploi] = useState([
    { id: 1, titre: "Développeur Frontend", description: "Développement d'interfaces utilisateur", date: "2023-10-01" },
    { id: 2, titre: "Développeur Backend", description: "Développement d'API et de services", date: "2023-10-05" },
  ]);

  // Données fictives pour les offres Apple
  const [appleOffres, setAppleOffres] = useState([
    { id: 1, titre: "Ingénieur Logiciel", description: "Développement de logiciels embarqués", date: "2023-10-10" },
    { id: 2, titre: "Designer UI/UX", description: "Conception d'interfaces utilisateur", date: "2023-10-15" },
  ]);

  // Options pour les listes déroulantes
  const domaines = ["Technologie", "Santé", "Finance", "Éducation"];
  const typesOrganisation = ["Entreprise", "ONG", "Gouvernement", "Startup"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    setMessages({ ...messages, [section]: null });

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

  // Fonction pour basculer entre les sections
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Masquer les boutons du profil si on navigue vers une autre section
    if (section !== "info" && section !== "contact" && section !== "compte") {
      setShowProfileButtons(false);
    }
  };

  // Fonction pour afficher/masquer les boutons du profil
  const toggleProfileButtons = () => {
    setShowProfileButtons(!showProfileButtons);
    // Afficher "Informations Générales" par défaut
    if (!showProfileButtons) {
      setActiveSection("info");
    }
  };

  // Définir les colonnes pour le DataTable
  const columns = [
    {
      name: 'Titre',
      selector: row => row.titre,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Date de publication',
      selector: row => row.date,
      sortable: true,
    },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Tableau de bord du client</h1>
          <div className="logo">
            <img src="/path/to/logo.png" alt="Logo" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <ul>
          <li>
              <button
                className={`sidebar-button ${activeSection === "profile" ? "active" : ""}`}
                onClick={() => {
                  setActiveSection("info"); // Afficher "Informations Générales" par défaut
                  setShowProfileButtons(true); // Afficher les boutons du profil
                }}
              >
                Profile Client
              </button>
            </li>
            
            <li>
              <button
                className={`sidebar-button ${activeSection === "statistiques" ? "active" : ""}`}
                onClick={() => handleSectionChange("statistiques")}
              >
                Tableau de bord client
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeSection === "offres" ? "active" : ""}`}
                onClick={() => handleSectionChange("offres")}
              >
                Offres d'emploi client
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${activeSection === "apple-offres" ? "active" : ""}`}
                onClick={() => handleSectionChange("apple-offres")}
              >
                Apple offre client
              </button>
            </li>
           
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Afficher les boutons du profil dans le main-content si "Profile Client" est actif */}
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

        {/* Section Statistiques */}
        {activeSection === "statistiques" && (
          <section className="statistics-section">
            <h2>Statistiques</h2>
            <div className="statistics-grid">
              <div className="statistic-card">
                <h3>Nombre d'offres d'emploi</h3>
                <p>{statistics.nombreOffresEmploi}</p>
              </div>
              <div className="statistic-card">
                <h3>Nombre d'offres Apple</h3>
                <p>{statistics.nombreAppleOffres}</p>
              </div>
            </div>
          </section>
        )}

        {/* Section Informations Générales */}
        {activeSection === "info" && (
          <FormSection title="Informations Générales" section="info" handleSubmit={handleSubmit} messages={messages}>
            <InputField label="Logo:" type="file" name="logo" onChange={handleChange} />
            <InputField label="Libellé (français)" name="libelle_fr" value={profile.libelle_fr} onChange={handleChange} />
            <InputField label="Libellé (arabe)" name="libelle_ar" value={profile.libelle_ar} onChange={handleChange} />
            <InputField label="Email" type="email" name="email" value={profile.email} onChange={handleChange} />
            <InputField label="Téléphone" name="tel" value={profile.tel} onChange={handleChange} />
            <SelectField label="Domaine" name="domaine" value={profile.domaine} onChange={handleChange} options={domaines} />
            <SelectField label="Type d'organisation" name="type_organisation" value={profile.type_organisation} onChange={handleChange} options={typesOrganisation} />
          </FormSection>
        )}

        {/* Section Contact & Responsable */}
        {activeSection === "contact" && (
          <FormSection title="Contact & Responsable" section="contact" handleSubmit={handleSubmit} messages={messages}>
            <InputField label="Lieu" name="lieu" value={profile.lieu} onChange={handleChange} />
            <InputField label="Fax" name="fax" value={profile.fax} onChange={handleChange} />
            <InputField label="Nom Responsable" name="nom_responsable" value={profile.nom_responsable} onChange={handleChange} />
            <InputField label="Fonction Responsable" name="fonction_responsable" value={profile.fonction_responsable} onChange={handleChange} />
            <InputField label="Email Responsable" type="email" name="email_responsable" value={profile.email_responsable} onChange={handleChange} />
            <InputField label="Téléphone Responsable" name="tel_responsable" value={profile.tel_responsable} onChange={handleChange} />
            <InputField label="Site Web" name="site_web" value={profile.site_web} onChange={handleChange} />
          </FormSection>
        )}

        {/* Section Gestion de Compte */}
        {activeSection === "compte" && (
          <FormSection title="Gestion de Compte" section="compte" handleSubmit={handleSubmit} messages={messages}>
            <InputField label="Nom Utilisateur" name="username" value={profile.username} onChange={handleChange} />
            <InputField label="Email" type="email" name="email" value={profile.email} onChange={handleChange} />
            <InputField label="Mot de passe" type="password" name="mot_de_passe" value={profile.mot_de_passe} onChange={handleChange} />
            <InputField label="Confirmer Mot de passe" type="password" name="confirme_mot_de_passe" value={profile.confirme_mot_de_passe} onChange={handleChange} />
          </FormSection>
        )}

        {/* Section Offres d'emploi */}
        {activeSection === "offres" && (
          <section className="offres-section">
            <h2>Offres d'emploi</h2>
            <DataTable
              columns={columns}
              data={offresEmploi}
              pagination
              highlightOnHover
            />
          </section>
        )}

        {/* Section Apple offre */}
        {activeSection === "apple-offres" && (
          <section className="apple-offres-section">
            <h2>Apple offre</h2>
            <ul className="apple-offres-list">
              {appleOffres.map((offre) => (
                <li key={offre.id} className="apple-offre-item">
                  <h3>{offre.titre}</h3>
                  <p>{offre.description}</p>
                  <p>Date de publication : {offre.date}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

const FormSection = ({ title, section, handleSubmit, messages, children }) => (
  <section id={section} className="form-section">
    <h2>{title}</h2>
    <form onSubmit={(e) => handleSubmit(e, section)}>
      {messages[section] && (
        <p className={messages[section].includes("Erreur") ? "error" : "success"}>
          {messages[section]}
        </p>
      )}
      {children}
      <button type="submit" className="submit-button">Enregistrer</button>
    </form>
  </section>
);

const InputField = ({ label, type = "text", name, value, onChange }) => (
  <div className="input-field">
    <label>{label}</label>
    <input type={type} name={name} value={value || ""} onChange={onChange} />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="input-field">
    <label>{label}</label>
    <select name={name} value={value || ""} onChange={onChange}>
      <option value="">Sélectionnez une option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default ClientDashboard;