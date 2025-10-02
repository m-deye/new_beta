import React, { useEffect, useState, useRef } from "react";
import "./OffresEmploi.css";
import $ from "jquery";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Card, Modal, Nav, Tab, Form, Button, Row, Col } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
// import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";

import "datatables.net-bs5";

const JobOfferModal = ({ show, handleClose, offre }) => {
  const [documents, setDocuments] = useState([]);

  const [activeTab, setActiveTab] = useState("tab1");
  const [formData, setFormData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const handleOpenAddModal = () => setShowAddModal(true);
  const tableRef = useRef(null);
  const dataTableInitialized = useRef(false); // Vérifier si DataTable est déjà initialisé
  const dataTableInstance = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  //modal ajouter document
  const [showCard, setShowCard] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const [selfile, setFile] = useState(null);
  const [seltitre_document, setTitreDocument] = useState("");
  const [sellangue, setLangue] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (offre) {
      setFormData({
        titre: offre.titre,
        type_offre: offre.type_offre,
        description: offre.description,
        date_mise_en_ligne: offre.date_mise_en_ligne,
        date_limite: offre.date_limite,
        si_national: offre.si_national,
        lieu: offre.lieu,
        // ville: offre.lieu,
        ville_ar: offre.ville_ar,
        titre_document: offre.titre_document,
        titre_entreprise: offre.titre_entreprise,
        categorie: offre.categorie,
        groupement_spacial: offre.groupement_spacial,
        titre_groupement_cpacial: offre.titre_groupement_cpacial,
        titre_groupement_special_arabe: offre.titre_groupement_special_arabe,
        id: offre.id,
        titre_ar: offre.titre_ar,
        titre_entreprise_ar: offre.titre_entreprise_ar,
        titre_documents_ar: offre.titre_documents_ar,
        description_ar: offre.description_ar,
        message_ar: offre.message_ar,
      });
    }
  }, [offre]);

  const saveJobOffer = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await axiosInstance.put(`/api/offres/${formData.id}/`, formData);
      setSaveSuccess(true);
    } catch (error) {
      setSaveError(
        "Erreur de sauvegarde: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (content, name) => {
    setFormData({ ...formData, [name]: content });
  };

  const handleSubmit = (e, tab) => {
    e.preventDefault();
    console.log(`Submitting form for ${tab}:`, formData);
    // Add API call here to submit data
  };

  const typeOptions = [
    { value: "Français", label: "Français" },
    { value: "Anglais", label: "Anglais" },
    { value: "Arabe", label: "Arabe" },
  ];

  const fetchDocuments = async () => {
    if (!offre) return;

    try {
      const response = await axiosInstance.get(`/api/documents/${offre.id}/`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [offre]);

  const handleDocumentSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    console.log(e);
    if (!selfile || !seltitre_document || !sellangue) {
      console.error("Tous les champs sont requis !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("piece_join", selfile);
      formData.append("titre_document", seltitre_document);
      formData.append("langue", sellangue);

      const response = await fetch(
        `http://localhost:8000/ajouter_document_client/${offre.id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setShowCard(false);
        fetchDocuments();
      } else {
        setMessage("Échec de l'ajout du Document.");
        setTimeout(() => setMessage(""), 20000);
      }
    } catch (error) {
      setMessage("Une erreur est survenue.");
      setTimeout(() => setMessage(""), 10000);
    }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce document ?")) return;

    try {
      const response = await axiosInstance.delete(
        `/api/documents/delete/${documentId}/`
      );

      if (response.data.error) {
        alert("Erreur : " + response.data.error);
      } else {
        alert("Document supprimé !");
        setDocuments(documents.filter((doc) => doc.id !== documentId)); // Mise à jour de l’état
        fetchDocuments();
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (activeTab === "tab3") {
      const table = $("#documentsTable").DataTable({
        responsive: true,
        destroy: true,
      });

      return () => {
        table.destroy();
      };
    }
  }, [activeTab]);

  const handleDownloadCv = async (e, documentId) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get(
        `/api/documents/${documentId}/getducument/`
      );
      const { cv_url } = response.data;

      if (!cv_url) {
        alert("Aucun CV disponible pour ce téléchargement.");
        return;
      }

      // Ouvre le CV dans un nouvel onglet
      window.open(cv_url, "_blank");
    } catch (error) {
      console.error("Erreur lors de l'ouverture du CV :", error);
      alert("Impossible de télécharger le CV. Veuillez réessayer.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <b>
            Offre d'emploi:{" "}
            <div dangerouslySetInnerHTML={{ __html: formData.titre }} />
          </b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          mountOnEnter
          unmountOnExit
        >
          <Nav variant="tabs" className="main-tabs">
            <Nav.Item>
              <Nav.Link eventKey="tab1">
                <i className="fa fa-info-circle"></i> Info
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab2">
                <i className="fa fa-language"></i> Traduction en arabe
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab3">
                <i className="far fa-file-pdf"></i> GED
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="tab1" className="p-1">
              <Form onSubmit={(e) => handleSubmit(e, "tab1")}>
                <br />
                <br />

                {/* Titre */}
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    Titre <span>*</span>
                  </Form.Label>
                  <Editor
                    apiKey="klj83yy4j4btu0s11oheti6rj6kwwgj0lnbtwunqvvqeipyf"
                    value={formData.titre}
                    init={{
                      height: 400,
                      menubar: true,
                      plugins: "table lists",
                      toolbar:
                        "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
                    }}
                    onEditorChange={(content) =>
                      handleEditorChange(content, "titre")
                    }
                  />
                </Form.Group>

                {/* Type */}
                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      style={{ paddingRight: "20px" }}
                    >
                      <Form.Label className="form-label-custom">
                        Type <span>*</span>
                      </Form.Label>
                      <Form.Select
                        name="type_offre"
                        value={formData.type_offre}
                        onChange={handleInputChange}
                      >
                        <option value="1">Offres d'emploi</option>
                        <option value="2">Consultants</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    Description <span>*</span>
                  </Form.Label>
                  <Editor
                    apiKey="klj83yy4j4btu0s11oheti6rj6kwwgj0lnbtwunqvvqeipyf"
                    value={formData.description}
                    init={{
                      height: 445,
                      menubar: true,
                      plugins: "table lists",
                      toolbar:
                        "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
                    }}
                    onEditorChange={(content) =>
                      handleEditorChange(content, "description")
                    }
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      style={{ paddingRight: "20px" }}
                    >
                      <Form.Label className="form-label-custom">
                        Date de mise en ligne <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date_mise_en_ligne"
                        value={formData.date_mise_en_ligne}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Date limite <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date_limite"
                        value={formData.date_limite}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      style={{ paddingRight: "20px" }}
                    >
                      <Form.Label className="form-label-custom">
                        Type de l'offre <span>*</span>
                      </Form.Label>
                      <Form.Select
                        name="si_national"
                        value={formData.si_national}
                        onChange={handleInputChange}
                      >
                        <option value="1">National</option>
                        <option value="2">International</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Lieu <span>*</span>
                      </Form.Label>
                      <Form.Select
                        name="lieu"
                        value={formData.lieu}
                        onChange={handleInputChange}
                      >
                        <option value="1">Hodh Charghi</option>
                        <option value="2">Hodh Gharbi</option>
                        <option value="3">Assaba</option>
                        <option value="4">Gorgol</option>
                        <option value="5">Brakna</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      style={{ paddingRight: "20px" }}
                    >
                      <Form.Label className="form-label-custom">
                        Ville Arabe <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="ville_ar"
                        value={formData.ville_ar}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      style={{ paddingRight: "20px" }}
                    >
                      <Form.Label className="form-label-custom">
                        Titre des documents <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titre_document"
                        value={formData.titre_document}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Titre entreprise <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titre_entreprise"
                        value={formData.titre_entreprise}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      style={{ paddingRight: "20px" }}
                    >
                      <Form.Label className="form-label-custom">
                        Catégorie <span>*</span>
                      </Form.Label>
                      <Form.Select
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleInputChange}
                      >
                        <option value="1">Standard</option>
                        <option value="2">Dépôt</option>
                        <option value="3">SAR</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Groupement spécial <span>*</span>
                      </Form.Label>
                      <Form.Select
                        name="groupement_spacial"
                        value={formData.groupement_spacial}
                        onChange={handleInputChange}
                      >
                        <option value="0">Non</option>
                        <option value="1">Oui</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      style={{ paddingRight: "20px" }}
                    >
                      <Form.Label className="form-label-custom">
                        Titre groupement spécial <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titre_groupement_cpacial"
                        value={formData.titre_groupement_cpacial}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Titre groupement spécial arabe <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titre_groupement_special_arabe"
                        value={formData.titre_groupement_special_arabe}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-end">
                  <Button
                    variant="success"
                    onClick={saveJobOffer}
                    disabled={isSaving}
                  >
                    {isSaving ? "Sauvegarde..." : "Enregistrer"}
                  </Button>
                </div>
              </Form>
            </Tab.Pane>

            <Tab.Pane eventKey="tab2">
              <Form onSubmit={(e) => handleSubmit(e, "tab2")}>
                {/* Titre en arabe */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Titre en arabe
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titre_ar"
                        value={formData.titre_ar}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Titre entreprise ar & Titre des documents en arabe */}
                <Row>
                  <Col md={6} className="px-2">
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Titre entreprise ar
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titre_entreprise_ar"
                        value={formData.titre_entreprise_ar}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="px-2">
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Titre des documents en arabe
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titre_documents_ar"
                        value={formData.titre_documents_ar}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Description en arabe */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Description en arabe
                      </Form.Label>
                      <Editor
                        apiKey="klj83yy4j4btu0s11oheti6rj6kwwgj0lnbtwunqvvqeipyf"
                        value={formData.description_ar}
                        init={{
                          height: 400,
                          menubar: true,
                          plugins: "table lists",
                          toolbar:
                            "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
                        }}
                        onEditorChange={(content) =>
                          handleEditorChange(content, "description_ar")
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Message Ar */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">
                        Message Ar
                      </Form.Label>
                      <Editor
                        apiKey="klj83yy4j4btu0s11oheti6rj6kwwgj0lnbtwunqvvqeipyf"
                        value={formData.message_ar}
                        init={{
                          height: 400,
                          menubar: true,
                          plugins: "table lists",
                          toolbar:
                            "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
                        }}
                        onEditorChange={(content) =>
                          handleEditorChange(content, "message_ar")
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Bouton de sauvegarde */}
                <div className="text-end">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={isSaving}
                    onClick={saveJobOffer}
                  >
                    <i className="fas fa-save"></i>{" "}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="tab3">
              <section className="container mt-4">
                <div>
                  {message && <div className="message">{message}</div>}
                  <Button
                    className="btn"
                    style={{ width: "200px" }}
                    variant="primary"
                    onClick={() => setShowCard(true)}
                  >
                    Nouveau document
                  </Button>
                </div>
                <br />
                <br />
                {showCard && (
                  <div className="d-flex justify-content-center">
                    <Card
                      className="mb-3 card shadow-sm "
                      style={{ width: "100%", maxWidth: "1000px", zIndex: 10 }}
                    >
                      <Card.Header
                        closeButton
                        className="d-flex justify-content-between align-items-center"
                        style={{ background: "#F8F9FC", color: "#858796" }}
                      >
                        <h5 className="mb-0 ms-3">Nouveau document</h5>
                        <Button
                          onClick={() => setShowCard(false)}
                          className=""
                          style={{
                            background: "#F8F9FC",
                            color: "#858796",
                            maxWidth: "100px",
                            border: "none", // Supprime la bordure
                            boxShadow: "none", // Supprime l'ombre au focus
                          }}
                        >
                          ×
                        </Button>
                      </Card.Header>
                      <Card.Body
                        className=""
                        style={{
                          width: "100%",
                          maxWidth: "1000px",
                          zIndex: 10,
                        }}
                      >
                        <Form onSubmit={handleDocumentSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label
                              className="ms-1"
                              style={{ fontSize: "16px", color: "#858796" }}
                            >
                              Fichier <span className="">*</span>
                            </Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) => setFile(e.target.files[0])}
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label
                              className="ms-1"
                              style={{ fontSize: "16px", color: "#858796" }}
                            >
                              Libellé <span className="">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={seltitre_document}
                              onChange={(e) => setTitreDocument(e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label
                              className="ms-1"
                              style={{ fontSize: "16px", color: "#858796" }}
                            >
                              Langue <span className="">*</span>
                            </Form.Label>
                            <Form.Select
                              value={sellangue}
                              onChange={(e) => setLangue(e.target.value)}
                            >
                              <option value="">Sélectionner une langue</option>
                              {typeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          <div className="text-end">
                            <Button variant="success" type="submit">
                              Ajouter
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </div>
                )}

                <div
                  className="text-center card shadow-sm"
                  style={{ maxWidth: "100%" }}
                >
                  <div className="card-bod" style={{ fontSize: "11px" }}>
                    {/* <table id="documentsTable"  className="table table-striped table-bordered"> */}

                    <table id="documentsTable" className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Libellé</th>
                          <th>langue</th>
                          <th>Extension</th>
                          <th>Taille (Octets)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.id}>
                            <td>{doc.titre_document}</td>
                            <td>{doc.langue}</td>
                            <td>{doc.extension}</td>
                            <td>{doc.taille}</td>
                            <td>
                              <div className="btn-group">
                                {/* Bouton Voir */}
                                <a
                                  onClick={(e) => handleDownloadCv(e, doc.id)}
                                  className="btn btn-sm"
                                  style={{ backgroundColor: "#5A5C69" }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Voir fichier"
                                >
                                  <i className="fa fa-fw fa-eye"></i>
                                </a>

                                {/* Bouton Supprimer */}
                                <button
                                  className="btn btn-sm "
                                  style={{
                                    backgroundColor: "#858796",
                                  }}
                                  onClick={() => deleteDocument(doc.id)}
                                  title="Supprimer"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

const AnnouncementTypeChanger = ({ showModal, handleClose, offreId }) => {
  const [selectedType, setSelectedType] = useState(null);

  const typeOptions = [
    { value: "OFFRE_EMPLOI", label: "OFFRE_EMPLOI" },
    { value: "Consultants", label: "Consultants" },
    { value: "Internationaux", label: "Appels d'offres internationaux" },
    { value: "Locaux", label: "Appels d'offres locaux" },
    { value: "Consultations", label: "Consultations" },
    { value: "Manifestations", label: "Manifestations d’Intérêts" },
    { value: "Avisinfos", label: "Avis & infos" },
  ];

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!selectedType) {
  //         alert("Veuillez sélectionner un type d'offre.");
  //         return;
  //     }

  //     try {
  //         const response = await fetch(
  //             `http://127.0.0.1:8000/offres/modifier_type/${offreId}/`,  // URL correcte
  //             {
  //                 method: "PUT",  // Changer la méthode si PATCH n'est pas souhaité
  //                 headers: {
  //                     "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //                     "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({ type_offre: selectedType.value }), // Convertir en JSON
  //             }
  //         );

  //         const data = await response.json(); // Convertir la réponse en JSON

  //         if (response.ok) {
  //             console.log("Type d'offre modifié :", data);
  //             handleClose(); // Fermer la modal si nécessaire
  //         } else {
  //             console.error("Erreur :", data);
  //         }

  //     } catch (error) {
  //         console.error("Erreur de connexion :", error);
  //     }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType) {
      alert("Veuillez sélectionner un type d'offre.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/offres/modifier_type/${offreId}/`,
        {
          type_offre: selectedType.value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Type d'offre modifié :", response.data);
      handleClose(); // Fermer la modal si nécessaire
    } catch (error) {
      if (error.response) {
        console.error("❌ Erreur API :", error.response.data);
      } else {
        console.error("❌ Erreur de connexion :", error.message);
      }
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop={false}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le type d'annonce</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Nouveau type :</Form.Label>
            <Select
              options={typeOptions}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Sélectionnez un type"
              isSearchable
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Confirmer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const OffresEmploi = ({ offresEmploi = [], clientId }) => {
  // State for modals and form inputs
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [titreContent, setTitreContent] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [typeAnnonce, setTypeAnnonce] = useState("1");
  const [lieu, setLieu] = useState("");
  const [showLieuInput, setShowLieuInput] = useState(false);
  const [selectedType, setSelectedType] = useState("1");
  const [message, setMessage] = useState("");

  const locationOptions = [
    { value: "Hodh Charghi", label: "Hodh Charghi" },
    { value: "Hodh Gharbi", label: "Hodh Gharbi" },
    { value: "Assaba", label: "Assaba" },
    { value: "Gorgol", label: "Gorgol" },
    { value: "Brakna", label: "Brakna" },
  ];

  // Modal handlers
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleOpenDetailModal = (offre) => {
    setSelectedOffre(offre);
    setShowDetailModal(true);
  };
  const handleCloseDetailModal = () => setShowDetailModal(false);

  const handleClose = () => {
    setShowModal(false);
    setSelectedOffre(null);
  };

  const handleShow = (offre) => {
    setSelectedOffre(offre);
    setShowModal(true);
  };

  // Form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = {
  //     titre: titreContent,
  //     description: descriptionContent,
  //     type_offre: typeAnnonce === '1' ? 'OFFRE_EMPLOI' : 'consultants',
  //     date_limite: new Date(document.getElementById('date_limite').value).toISOString(),
  //     lieu,
  //     si_national: selectedType === '1',
  //   };

  //   try {
  //     const response = await axios.post(
  //       `http://127.0.0.1:8000/offres/ajouter/${clientId}/`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     setMessage('Offre emplois ajoutée avec succès !');
  //     setTimeout(() => setMessage(''), 20000);
  //     handleCloseAddModal();
  //     handleOpenDetailModal(formData);
  //   } catch (error) {
  //     setMessage("Échec de l'ajout d'offre emplois.");
  //     setTimeout(() => setMessage(''), 20000);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      titre: titreContent,
      description: descriptionContent,
      type_offre: typeAnnonce === "1" ? "OFFRE_EMPLOI" : "consultants",
      date_limite: new Date(
        document.getElementById("date_limite").value
      ).toISOString(),
      lieu,
      si_national: selectedType === "1",
    };

    try {
      const response = await axiosInstance.post(
        `/offres/ajouter/${clientId}/`,
        formData
      );
      const offreId = response.data.offre_id;
      setMessage("Offre emplois ajoutée avec succès !");
      setTimeout(() => setMessage(""), 20000);
      handleCloseAddModal();
      handleOpenDetailModal({ ...formData, id: offreId });
    } catch (error) {
      setMessage("Échec de l'ajout d'offre emplois.");
      setTimeout(() => setMessage(""), 20000);
    }
  };

  const filterOffre = () => {
    const etat = $("#etat").val();
    const type = $("#type").val();
    const table = $("#offresEmploiTable").DataTable();

    // Reset all filters
    table.columns().search("").draw();

    // Filter by etat
    if (etat !== "all") {
      if (etat === "2") {
        table.column(3).search("false").draw(); // si_valider = false (pending validation)
      } else if (etat === "3") {
        table.column(3).search("true").draw(); // si_valider = true (validated)
      } else if (etat === "10") {
        table.column(4).search("true").draw(); // si_archiver = true (archived)
      }
    }

    // Filter by type
    if (type !== "all") {
      table
        .column(5)
        .search(type === "1" ? "OFFRE_EMPLOI" : "consultants")
        .draw();
    }
  };

  useEffect(() => {
    // Suppress DataTables warning alerts
    $.fn.dataTable.ext.errMode = "none";

    if (offresEmploi.length > 0) {
      // Debug data
      console.log("offresEmploi:", offresEmploi);
      console.log("Row 4:", offresEmploi[3]);

      const table = $("#offresEmploiTable").DataTable({
        responsive: true,
        destroy: true,
        data: offresEmploi,
        columns: [
          { data: "id" },
          { data: "titre" },
          { data: "type_offre" },
          { data: "date_limite" },
          { data: "client__nom" },
          {
            data: "si_valider",
            defaultContent: false,
            visible: false,
          },
          {
            data: "si_archiver",
            defaultContent: false,
            visible: false,
          },
          {
            data: "type_offre",
            defaultContent: "OFFRE_EMPLOI",
            visible: false,
          },
          {
            data: null,
            orderable: false,
            render: function (data, type, row) {
              return `
              <div style="display: flex; justify-content: center; gap: 2px;">
              <button class="btn btn-danger" style="padding: 5px 2px 2px 2px; font-size: 10px; width: 23px; border-radius: 4px 0 0 4px;" data-id="${row.id}" data-action="changer" data-toggle="tooltip" data-placement="top" title="Changer le type d'annonce">
                <i class="fa fa-info-circle"></i>
              </button>
              <button class="btn btn-secondary" style="padding: 5px 2px 2px 2px; font-size: 10px; width: 23px; background-color: #5A5C69; border-radius: 0 4px 4px 0;" data-id="${row.id}" data-action="visualiser" data-toggle="tooltip" data-placement="top" title="Visualiser">
                <i class="fa fa-eye"></i>
              </button>
            </div>
              `;
            },
          },
        ],
        language: {
          lengthMenu: '<i class="fa fa-eye fa-fw"></i> _MENU_',
          search: '<i class="fa fa-search fa-fw"></i> ',
          info: "_START_ à _END_ sur _TOTAL_ éléments",
          paginate: {
            previous: '<i class="fa fa-chevron-left fa-fw"></i>',
            next: '<i class="fa fa-chevron-right fa-fw"></i>',
          },
        },
      });

      // Log DataTables errors to console
      $("#offresEmploiTable").on(
        "error.dt",
        function (e, settings, techNote, message) {
          console.error("DataTables error:", message);
        }
      );

      // Handle button clicks
      $("#offresEmploiTable tbody").on("click", "button", function () {
        const offreId = $(this).data("id");
        const action = $(this).data("action");
        const offre = offresEmploi.find((o) => o.id === offreId);

        if (action === "changer") {
          handleShow(offre);
        } else if (action === "visualiser") {
          handleOpenDetailModal(offre);
        }
      });

      // Initialize selectpicker with a slight delay to ensure DOM readiness
      const initializeSelectpicker = () => {
        if ($.fn.selectpicker) {
          $("#etat, #type").selectpicker({
            liveSearch: true,
          });
        } else {
          console.warn(
            "Bootstrap Selectpicker not available. Falling back to native select."
          );
        }
      };

      // Wait for DOM to be fully loaded
      setTimeout(initializeSelectpicker, 100);

      return () => {
        table.destroy();
        if ($.fn.selectpicker) {
          $("#etat, #type").selectpicker("destroy");
        }
      };
    }
  }, [offresEmploi]);

  return (
    <section className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0" style={{ color: "#858796" }}>
          Offres d'emploi
        </h2>
        <Button
          variant="primary"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{ width: "170px", textDecoration: "none" }}
          onClick={handleOpenAddModal}
        >
          <FontAwesomeIcon icon={faPlus} className="fas fa-sm text-white-50" />
          Ajouter une offre
        </Button>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("succès") ? "alert-success" : "alert-danger"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <div className=" card shadow-sm  " style={{ maxWidth: "100%" }}>
        <div
          className="card-header"
          style={{ color: "#5A5C69", background: "#F8F9FC" }}
        >
          <div className="filter">
            <div className="row">
              <div className="col-sm-6 col-md-3 filters-item">
                <div
                  className="filters-label mb-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#5A5C69",
                  }}
                >
                  <i className="fa fa-filter "></i>{" "}
                  <span className=" ms-1"> État </span>
                </div>
                <div className="filters-input ">
                  <select
                    id="etat"
                    name="etat"
                    onChange={() => filterOffre()}
                    className="form-control selectpicker bordered"
                    data-live-search="true"
                  >
                    <option value="all">Tous</option>
                    <option value="2">Offre pour la validation</option>
                    <option value="3">Validée</option>
                    <option value="10">Archivée</option>
                  </select>
                  <i
                    className="fas fa-caret-down fa-sm"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#000",
                      marginLeft: "-30px",
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-6 col-md-3 filters-item">
                <div
                  className="filters-label mb-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#5A5C69",
                  }}
                >
                  <i className="fa fa-filter ms-1"></i>

                  <span className=" ms-1"> Type </span>
                </div>
                <div className="filters-input ms-3">
                  <select
                    id="type"
                    name="type"
                    onChange={() => filterOffre()}
                    className="form-control selectpicker bordered"
                    data-live-search="true"
                  >
                    <option value="all">Tous</option>
                    <option value="1">Offres d'emploi</option>
                    <option value="2">Consultants</option>
                  </select>
                  <i
                    className="fas fa-caret-down fa-sm"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#000",
                    }}
                  />
                </div>
              </div>
              <input
                type="hidden"
                value="all"
                name="employeur"
                id="employeur"
              />
              <input type="hidden" value="all" name="traduit" id="traduit" />
            </div>
          </div>
        </div>

        <div className="card-bod">
          <div className="table-responsive" style={{ fontSize: "11px" }}>
            <table
              id="offresEmploiTable"
              className="table table-striped table-bordered"
            >
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "5%" }}>ID</th>
                  <th style={{ width: "30%" }}>Intitulé</th>
                  <th style={{ width: "15%" }}>Type</th>
                  <th style={{ width: "20%" }}>Date limite</th>
                  <th style={{ width: "20%" }}>Nom du client</th>
                  <th style={{ width: "10%" }}>Action</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#858796" }}>Nouvelle Offre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "16px", color: "#858796" }}>
                Titre <span className="">*</span>
              </Form.Label>
              <Editor
                apiKey="klj83yy4j4btu0s11oheti6rj6kwwgj0lnbtwunqvvqeipyf"
                value={titreContent}
                init={{
                  height: 400,
                  plugins: "table lists",
                  toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
                }}
                onEditorChange={(content) => setTitreContent(content)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "16px", color: "#858796" }}>
                Type <span className="">*</span>
              </Form.Label>
              <Form.Select
                value={typeAnnonce}
                onChange={(e) => setTypeAnnonce(e.target.value)}
              >
                <option value="1">Offres d'emploi</option>
                <option value="2">Consultants</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "16px", color: "#858796" }}>
                Description <span className="">*</span>
              </Form.Label>
              <Editor
                apiKey="klj83yy4j4btu0s11oheti6rj6kwwgj0lnbtwunqvvqeipyf"
                value={descriptionContent}
                init={{
                  height: 400,
                  plugins: "table lists",
                  toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
                }}
                onEditorChange={(content) => setDescriptionContent(content)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3 ms-3">
                  <Form.Label style={{ fontSize: "16px", color: "#858796" }}>
                    Date limite <span className="">*</span>
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    id="date_limite"
                    defaultValue=""
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 ms-3">
                  <Form.Label
                    style={{
                      fontSize: "16px",
                      color: "#858796",
                      paddingRight: "-10px",
                    }}
                  >
                    Type de l'offre <span className="">*</span>
                  </Form.Label>
                  <Form.Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="1">National</option>
                    <option value="2">International</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "16px", color: "#858796" }}>
                Lieu <span className="">*</span>
              </Form.Label>
              <Form.Select
                value={lieu}
                onChange={(e) => {
                  setLieu(e.target.value);
                  setShowLieuInput(e.target.value === "Autre");
                }}
              >
                <option value="">Sélectionner...</option>
                {locationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
              {showLieuInput && (
                <div className="mt-3">
                  <Form.Control
                    placeholder="Ex: Paris, Bamako, Tunis"
                    className="mb-2"
                  />
                  <Form.Control
                    placeholder="Ex: باريس, باماكو, تونس"
                    dir="rtl"
                  />
                </div>
              )}
            </Form.Group>

            <div className="text-end">
              <Button variant="success" type="submit">
                Ajouter
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Detail/Edit Modal */}
      <JobOfferModal
        show={showDetailModal}
        handleClose={handleCloseDetailModal}
        offre={selectedOffre}
      />
      <AnnouncementTypeChanger
        showModal={showModal}
        handleClose={handleClose}
        offreId={selectedOffre?.id}
      />
    </section>
  );
};

export default OffresEmploi;
