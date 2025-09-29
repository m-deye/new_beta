import React, { useEffect, useState } from "react";
import $ from "jquery"; // Importer jQuery
import "datatables.net-bs5"; // Importer DataTables avec Bootstrap 5
import "datatables.net-responsive-bs5"; // Importer le plugin Responsive de DataTables
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css"; // Importer le CSS de DataTables Bootstrap 5
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css"; // Importer le CSS du plugin Responsive
import "bootstrap/dist/css/bootstrap.min.css"; // Importer Bootstrap CSS
import sanitizeHtml from "sanitize-html";
import { Modal, Button, Form } from "react-bootstrap";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faShare } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../api/axiosInstance";

const OffresEmploiSection = () => {
  const [offresEmploi, setOffresEmploi] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("all");
  const [clients, setClients] = useState([{ value: "all", label: "Tous" }]);

  const formatDateLimite = (dateString, afficherHeures = false) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    
    const options = {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    };
    
    if (afficherHeures) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleOpenDetailModal = (offre) => {
    setSelectedOffre(offre);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => setShowDetailModal(false);

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/api/offres_emplois/")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setOffresEmploi(data);
  //       setFilteredOffres(data);
  //       const uniqueClients = [...new Set(data.map(offre => offre.client__libelle_fr))]
  //         .map(client => ({
  //           value: client,
  //           label: client
  //         }));
  //       setClients([{ value: 'all', label: 'Tous' }, ...uniqueClients]);
  //     })
  //     .catch((error) => console.error("Erreur lors de la récupération des données:", error));
  // }, []);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get("/api/offres_emplois/");
        const data = response.data;

        setOffresEmploi(data);
        setFilteredOffres(data);

        const uniqueClients = [
          ...new Set(data.map((offre) => offre.client__libelle_fr)),
        ].map((client) => ({
          value: client,
          label: client,
        }));

        setClients([{ value: "all", label: "Tous" }, ...uniqueClients]);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchOffres();
  }, []);

  // Handle client filter change
  useEffect(() => {
    const filtered =
      selectedClient === "all"
        ? offresEmploi
        : offresEmploi.filter(
            (offre) => offre.client__libelle_fr === selectedClient
          );
    setFilteredOffres(filtered);
  }, [selectedClient, offresEmploi]);

  // Initialize DataTable
  useEffect(() => {
    if (filteredOffres.length > 0) {
      const table = $("#offresEmploiTable").DataTable({
        responsive: true,
        destroy: true,
        data: filteredOffres,
        columns: [
          {
            data: "titre",
            render: (data) => data,
          },
          { data: "type_offre" },
          { data: "client__libelle_fr" },
          { 
            data: "date_limite",
            render: function(data, type, row) {
              return formatDateLimite(data, row.afficher_heures);
            }
          },
          {
            data: null,
            render: (data, type, row) => `
              <div class="text-center">
                <button class="btn btn-sm" style="padding: 5px 2px 2px 2px; font-size: 10px; width: 25px; background-color: #5A5C69; border: none; box-shadow: none; outline: none;">
                  <i class="fa fa-fw fa-eye"></i>
                </button>
              </div>`,
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

      // Handle click events on view buttons
      $("#offresEmploiTable").on("click", "button", function () {
        const data = table.row($(this).parents("tr")).data();
        handleOpenDetailModal(data);
      });

      return () => {
        table.destroy();
      };
    }
  }, [filteredOffres]);

  return (
    <section className="container mt-4">
      <h2 className="mb-4" style={{ color: "#5A5C69" }}>
        Offres d'emploi
      </h2>
      <div className="text-center card shadow-sm " style={{ maxWidth: "100%" }}>
        <div
          className="card-header"
          style={{ color: "#5A5C69", background: "#F8F9FC" }}
        >
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
                <span className=" ms-1"> Client </span>
              </div>
              <div className="position-relative">
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="form-control"
                  style={{ paddingRight: "30px" }} // Espace pour l'icône
                >
                  {clients.map((client) => (
                    <option key={client.value} value={client.value}>
                      {client.label}
                    </option>
                  ))}
                </select>
                <i
                  className="fas fa-caret-down fa-sm"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none", // L'icône ne doit pas interférer avec le select
                    color: "#5A5C69",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-bod shadow-sm">
          <div className="table-responsive" style={{ fontSize: "11px" }}>
            <table
              id="offresEmploiTable"
              className="table table-striped table-bordered"
            >
              <thead className="text-center">
                <tr>
                  <th>Intitule</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Date limite</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de détail */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Détails de l'offre :{" "}
            {selectedOffre?.titre.replace(/<\/?[^>]+(>|$)/g, "")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffre && (
            <div className="col-md-12">
              <style>{`
                table { width: 100% !important; }
                #divText img { max-width: 100% !important; }
                body { font-size: 14px !important; }
              `}</style>
              <div className="container bg-white">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="card p-2 mt-2 mb-2"
                      style={{ maxWidth: "100%" }}
                    >
                      <div className="row">
                        <div className="col-md-2">
                          <div className="text-center">
                            <img
                              width="120px"
                              src={selectedOffre.client__logo}
                              alt="Company Logo"
                            />
                          </div>
                        </div>
                        <div className="col-md-10 align-self-center">
                          <span
                            className="font-weight-bold"
                            style={{ fontSize: "14px" }}
                          >
                            {selectedOffre.client__libelle_fr}
                          </span>
                          <br />
                          <span
                            className="text-beta font-weight-bold"
                            style={{ fontSize: "14px", color: "#0C96B1" }}
                            dangerouslySetInnerHTML={{
                              __html: selectedOffre.titre,
                            }}
                          ></span>
                          <div className="row">
                            <div className="col-lg-6">
                              <b>
                                Date limite :{" "}
                                <span className="text-danger">
                                  {formatDateLimite(selectedOffre.date_limite, selectedOffre.afficher_heures)}
                                </span>
                              </b>
                            </div>
                            <div className="col-lg-6 text-end">
                              <b>
                                Lieu :{" "}
                                <span
                                  className="text-danger"
                                  style={{ marginRight: "15px" }}
                                >
                                  {selectedOffre.lieu}
                                </span>
                              </b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />
                      <br />
                      <div className="row" id="divText">
                        <div className="col-lg-12">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: selectedOffre.description,
                            }}
                            style={{ textDecoration: "none" }}
                          />
                        </div>
                        {selectedOffre.documents &&
                        selectedOffre.documents.length > 0 ? (
                          <div className="col-lg-12">
                            <br />
                            <br />
                            <span className="titreDocument">
                              Pour plus d'informations, consultez le lien
                              ci-après :
                            </span>
                            <br />
                            <br />
                            {selectedOffre.documents.map((document, index) => (
                              <a
                                key={index}
                                className="titreDoc"
                                href={document.piece_join}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                              >
                                <img
                                  width="30px"
                                  src="https://beta.mr/img/pdf.png"
                                  alt="PDF Icon"
                                />
                                <span>{document.titre_document}</span>
                              </a>
                            ))}
                            <br />
                          </div>
                        ) : null}
                      </div>
                      <div className="card-footer mt-5">
                        <div className="row">
                          <div className="col-6">
                            <b>Offre en ligne depuis : </b>{" "}
                            <span style={{ color: "red" }}>
                              {selectedOffre.date_mise_en_ligne}
                            </span>
                          </div>
                          <div className="col-6 text-end">
                            <b>
                              <i className="fa fa-share"></i> Partager cette
                              offre
                            </b>
                            <a
                              className=""
                              target="_blank"
                              rel="noopener noreferrer"
                              href="https://www.facebook.com/sharer/sharer.php?u=https://beta.mr/beta/offre/un-directeur-des-finances-et-administration/8145"
                            >
                              <i
                                className="fab fa-facebook fa-lg"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <a
                              className="mx-2"
                              target="_blank"
                              rel="noopener noreferrer"
                              href="https://www.linkedin.com/shareArticle?mini=true&url=https://beta.mr/beta/offre/un-directeur-des-finances-et-administration/8145"
                            >
                              <i
                                className="fab fa-linkedin fa-lg"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <a
                              className=""
                              target="_blank"
                              rel="noopener noreferrer"
                              href="whatsapp://send?text=https://beta.mr/beta/offre/un-directeur-des-finances-et-administration/8145"
                            >
                              <i
                                className="fab fa-whatsapp text-success fa-lg"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic example"
                        >
                          <a
                            className="mr-3 btn btn-sm shadow-sm mb-1"
                            href="/listcompter_OffresEmplois"
                            style={{
                              textDecoration: "none",
                              backgroundColor: "#4E73DF",
                              width: "250px",
                            }}
                          >
                            Voir la liste complète
                          </a>
                          <a
                            className="btn btn-sm btn-primary shadow-sm mb-1"
                            href={`/annonces_offreemp/${selectedOffre.client__libelle_fr}`}
                            style={{
                              textDecoration: "none",
                              backgroundColor: "#4E73DF",
                            }}
                          >
                            Voir toutes les annonces :
                            <span
                              style={{ color: "black", fontWeight: "bold" }}
                            >
                              {" "}
                              {selectedOffre.client__libelle_fr}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default OffresEmploiSection;
