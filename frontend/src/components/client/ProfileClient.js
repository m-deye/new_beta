import React, { useState, useRef, useEffect } from "react";
import FormSection from "./FormSection";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ProfileClient = ({
  profile,
  handleChange,
  // handleSubmit,
  // messages,
  domaines,
  typesOrganisation,
  clientId,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [isHovering, setIsHovering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const [errors, setErrors] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: "info", label: "Informations Générales", icon: "fa-info-circle" },
    { id: "contact", label: "Contact & Responsable", icon: "fa-address-card" },
    { id: "compte", label: "Gestion de Compte", icon: "fa-user" },
  ];

  const handleDeleteLogo = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/gestion_utilisateur/api/client/${profile.id}/deletelogo/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Échec de la suppression du logo");

      const data = await response.json();
      console.log("Logo supprimé :", data);

      // Réinitialise l’aperçu et le logo du profil
      setPreviewUrl(null);
      // setProfile(prev => ({
      //   ...prev,
      //   logo: null
      // }));

      alert("Logo supprimé avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du logo");
    }
  };

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
      const response = await fetch(
        `http://127.0.0.1:8000/gestion_utilisateur/api/client/${clientId}/updatelogo/`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Échec du téléchargement");

      const data = await response.json();
      console.log("Réponse API:", data);

      if (data.logo_url) {
        // Met à jour previewUrl pour afficher le nouveau logo
        setPreviewUrl(data.logo_url);
        // Met à jour profile.logo si nécessaire
        // setProfile(prev => ({
        //   ...prev,
        //   logo: data.logo_url
        // }));
      } else {
        console.log("Aucune URL renvoyée par l'API.");
      }

      // Ferme le modal après mise à jour
      setShowModal(false);
    } catch (error) {
      setErrors([error.message || "Échec du téléchargement de l'image"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Afficher l'aperçu avant l'upload
    }
  };

  const fetchCompte = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/client/${clientId}/profile/`
      );
      const data = await response.json();
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

  const [compteData, setcompteData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleCompteChange = (e) => {
    const { name, value } = e.target;
    setcompteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/compte/client/${profile.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ ...compteData }),
        }
      );
      setMessage("Votre compte modifié avec succès !");
      setTimeout(() => setMessage(""), 10000);
      if (!response.ok) throw new Error("Erreur de soumission");
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [messages, setMessages] = useState({});

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    setMessages({ ...messages, [section]: null });
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/client/${profile.id}/update/`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessages({ ...messages, [section]: "Mise à jour réussie!" });
      } else {
        setMessages({
          ...messages,
          [section]: data.error || "Erreur lors de la mise à jour.",
        });
      }
    } catch (error) {
      setMessages({
        ...messages,
        [section]: "Erreur de connexion au serveur.",
      });
    }
  };

  return (
    <div className="card ms-3" style={{ maxWidth: "1000px" }}>
      <nav>
        <ul className="nav nav-tabs main-tabs">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            >
              <a
                href={`#${tab.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }}
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              >
                <i className={`fa ${tab.icon}`}></i> {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`${tab.id}`}
            className={`tab-pane fade ${
              activeTab === tab.id ? "show active" : ""
            }`}
          >
            {tab.id === "info" && (
              <div
                className="tab-pane fade show active"
                role="tabpanel"
                aria-labelledby="tab17"
              >
                {/* Affichage du message de retour */}
                {/* {messages && (
                <div className="message mb-3">
                  {typeof messages === 'string' ? (
                    messages
                  ) : Array.isArray(messages) ? (
                    messages.map((msg, idx) => <div key={idx}>{msg}</div>)
                  ) : typeof messages === 'object' ? (
                    Object.values(messages).map((msg, idx) => <div key={idx}>{msg}</div>)
                  ) : null}
                </div>
              )} */}

                <div className="row mb-2 d-flex align-items-start">
                  {/* Colonne pour l'image */}
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
                        alt="avatar"
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
                  </div>

                  {/* Colonne pour le formulaire */}
                  <div className="col-md-10">
                    <Form onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Libellé (français) */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <Form.Label className="ms-3">
                            Libellé (français) <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="libelle_fr"
                            value={profile.libelle_fr || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Libellé (arabe) */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <Form.Label className="ms-3">
                            Libellé (arabe) <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="libelle_ar"
                            value={profile.libelle_ar || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Email */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <Form.Label className="ms-3">
                            Email <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profile.email || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Téléphone */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <Form.Label className="ms-3">
                            Téléphone <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="tel"
                            value={profile.tel || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Domaine */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <Form.Label className="ms-3">
                            Domaine <span className="required_field">*</span>
                          </Form.Label>
                          <Form.Select
                            name="domaine"
                            value={profile.domaine || ""}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Sélectionner</option>
                            {domaines.map((domaine, index) => (
                              <option key={index} value={domaine}>
                                {domaine}
                              </option>
                            ))}
                          </Form.Select>
                        </div>

                        {/* Type d'organisation */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <Form.Label className="ms-3">
                            Type d'organisation <span className="">*</span>
                          </Form.Label>
                          <Form.Select
                            name="type_organisation"
                            value={profile.type_organisation || ""}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Sélectionner</option>
                            {typesOrganisation.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </Form.Select>
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

            <Modal show={showModal} onHide={closeModal} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  Modification de la photo du candidat :{" "}
                  <span className="text-primary">client</span>
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
                        <div key={index} className="d-flex align-items-center">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </Form>
              </Modal.Body>
            </Modal>

            {tab.id === "contact" && (
              <div
                className="tab-pane fade show active"
                role="tabpanel"
                aria-labelledby="tab-contact"
              >
                {messages[tab.id] && (
                  <div className="alert alert-success mb-3" role="alert">
                    {messages[tab.id]}
                  </div>
                )}

                <div className="row mb-2">
                  <div className="col-md-12">
                    <Form onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Lieu */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingRight: "20px" }}
                        >
                          <Form.Label className="ms-3">
                            Lieu <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="lieu"
                            value={profile.lieu || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Fax */}
                        <div className="col-md-6 mb-4">
                          <Form.Label className="ms-3">
                            Fax<span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="fax"
                            value={profile.fax || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Nom Responsable */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingRight: "20px" }}
                        >
                          <Form.Label className="ms-3">
                            Nom Responsable<span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="nom_responsable"
                            value={profile.nom_responsable || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Fonction Responsable */}
                        <div className="col-md-6 mb-4">
                          <Form.Label className="ms-3">
                            Fonction Responsable<span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="fonction_responsable"
                            value={profile.fonction_responsable || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Email Responsable */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingRight: "20px" }}
                        >
                          <Form.Label className="ms-3">
                            Email Responsable <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email_responsable"
                            value={profile.email_responsable || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Téléphone Responsable */}
                        <div className="col-md-6 mb-4">
                          <Form.Label className="ms-3">
                            Téléphone Responsable <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="tel_responsable"
                            value={profile.tel_responsable || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Site Web */}
                        <div
                          className="col-md-6 mb-4"
                          style={{ paddingRight: "20px" }}
                        >
                          <Form.Label className="ms-3">
                            Site Web <span className="">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="site_web"
                            value={profile.site_web || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Bouton Enregistrer */}
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

            {tab.id === "compte" && (
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
                          <Form.Label className="ms-3">
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
                          <Form.Label className="ms-3">
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
                          <Form.Label className="ms-3">
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
                          <Form.Label className="ms-3">
                            Confirmer le mot de passe{" "}
                            <span className="">*</span>
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
        ))}
      </div>
    </div>
  );
};

export default ProfileClient;
