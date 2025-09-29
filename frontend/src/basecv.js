import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { Modal, Button, Image } from "react-bootstrap";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axiosInstance from "./api/axiosInstance";
import { useTranslation } from "react-i18next";

const CVFinder = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0]; // "fr" or "ar"
  const isRTL = lang === "ar";
  const underlineColor = isRTL ? "#FFD600" : "#4CAF50";

  const [candidatsData, setCandidatsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSpecialisation, setSelectedSpecialisation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [show, setShow] = useState(false);
  const [errors, setError] = useState([]);
  const [cvUrl, setCvUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [filters, setFilters] = useState({
    domaine: "all",
    niv_etude: "all",
    niv_exp: "all",
    genre: "all",
    langue: "all",
  });
  const [filterOptions, setFilterOptions] = useState({
    domaines: [{ value: "all", label: "Tous" }],
    niveaux_etude: [{ value: "all", label: "Tous" }],
    experiences: [{ value: "all", label: "Tous" }],
    genres: [{ value: "all", label: "Tous" }],
    langues: [{ value: "all", label: "Tous" }],
  });
  const tableRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setSelectedSpecialisation(null);
    setProfile(null);
    setCandidate(null);
    setCvUrl(null);
    setPreviewUrl("");
  };

  const fetchCvUrl = async (candidatId) => {
    try {
      const response = await axiosInstance.get(
        `/api/candidat/${candidatId}/getcv/`
      );

      const data = response.data;
      if (data.cv_url) {
        setCvUrl(data.cv_url);
        setPreviewUrl(data.cv_url);
      } else {
        setError([isRTL ? "لا يوجد سيرة ذاتية متاحة لهذا المرشح." : "Aucun CV disponible pour ce candidat."]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'URL du CV :", error);
      setError([isRTL ? "تعذر تحميل السيرة الذاتية. يرجى المحاولة مرة أخرى." : "Impossible de charger le CV. Veuillez réessayer."]);
    }
  };

  const handleOpenDetailModal = (specialisation, candidat) => {
    if (!candidat) {
      setError([isRTL ? "خطأ: لم يتم العثور على مرشح لهذا التخصص." : "Erreur: Candidat non trouvé pour cette spécialisation."]);
      return;
    }
    setSelectedSpecialisation(specialisation);
    const profil = {
      id: candidat.id,
      nom: candidat.nom,
      prenom: candidat.prenom,
      telephone: candidat.telephone,
      logo: candidat.logo,
    };
    setProfile(profil);
    setCandidate(candidat);
    setShow(true);
    fetchCvUrl(candidat.id);
  };

  const handleDownloadCv = async (e) => {
    e.preventDefault();
    if (!cvUrl) {
      setError([isRTL ? "لا يوجد سيرة ذاتية متاحة للتحميل." : "Aucun CV disponible pour le téléchargement."]);
      return;
    }
    try {
      const response = await fetch(cvUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error("Le fichier CV n'est pas accessible.");
      }
      window.open(cvUrl, "_blank");
    } catch (error) {
      console.error("Erreur lors de l'ouverture du Scherif :", error);
      setError([isRTL ? "تعذر فتح السيرة الذاتية. يرجى المحاولة مرة أخرى." : "Impossible d'ouvrir le CV. Veuillez réessayer."]);
    }
  };

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // useEffect(() => {
  //   fetch(`http://127.0.0.1:8000/gestion_utilisateur/api/candidat/all/`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCandidatsData(data);

  //       const uniqueDomaines = [
  //         ...new Set(data.flatMap(c => c.specialisations?.map(spec => spec.domaine) || []))
  //       ].map(domaine => ({ value: domaine, label: domaine }));
  //       const uniqueNiveauxEtude = [
  //         ...new Set(data.flatMap(c => c.specialisations?.map(spec => spec.niveaux_etude) || []))
  //       ].map(niveau => ({ value: niveau, label: niveau }));
  //       const uniqueExperiences = [
  //         ...new Set(data.flatMap(c => c.experiences?.map(exp => exp.poste) || []))
  //       ].map(exp => ({ value: exp, label: exp }));
  //       const uniqueGenres = [
  //         ...new Set(data.map(c => c.genre).filter(genre => genre))
  //       ].map(genre => ({ value: genre, label: genre }));
  //       const uniqueLangues = [
  //         ...new Set(data.flatMap(c => c.langues?.map(lang => lang.langue) || []))
  //       ].map(langue => ({ value: langue, label: langue }));

  //       setFilterOptions({
  //         domaines: [{ value: 'all', label: 'Tous' }, ...uniqueDomaines],
  //         niveaux_etude: [{ value: 'all', label: 'Tous' }, ...uniqueNiveauxEtude],
  //         experiences: [{ value: 'all', label: 'Tous' }, ...uniqueExperiences],
  //         genres: [{ value: 'all', label: 'Tous' }, ...uniqueGenres],
  //         langues: [{ value: 'all', label: 'Tous' }, ...uniqueLangues],
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de la récupération des candidats :", error);
  //       setError(["Erreur lors de la récupération des données. Veuillez réessayer."]);
  //     });
  // }, []);

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        const response = await axiosInstance.get(
          "/gestion_utilisateur/api/candidat/all/"
        );
        const data = response.data;
        setCandidatsData(data);

        const uniqueDomaines = [
          ...new Set(
            data.flatMap(
              (c) => c.specialisations?.map((spec) => spec.domaine) || []
            )
          ),
        ].map((domaine) => ({ value: domaine, label: domaine }));

        const uniqueNiveauxEtude = [
          ...new Set(
            data.flatMap(
              (c) => c.specialisations?.map((spec) => spec.niveaux_etude) || []
            )
          ),
        ].map((niveau) => ({ value: niveau, label: niveau }));

        const uniqueExperiences = [
          ...new Set(
            data.flatMap((c) => c.experiences?.map((exp) => exp.poste) || [])
          ),
        ].map((exp) => ({ value: exp, label: exp }));

        const uniqueGenres = [
          ...new Set(data.map((c) => c.genre).filter((genre) => genre)),
        ].map((genre) => ({ value: genre, label: genre }));

        const uniqueLangues = [
          ...new Set(
            data.flatMap((c) => c.langues?.map((lang) => lang.langue) || [])
          ),
        ].map((langue) => ({ value: langue, label: langue }));

        setFilterOptions({
          domaines: [{ value: "all", label: isRTL ? "الكل" : "Tous" }, ...uniqueDomaines],
          niveaux_etude: [
            { value: "all", label: isRTL ? "الكل" : "Tous" },
            ...uniqueNiveauxEtude,
          ],
          experiences: [{ value: "all", label: isRTL ? "الكل" : "Tous" }, ...uniqueExperiences],
          genres: [{ value: "all", label: isRTL ? "الكل" : "Tous" }, ...uniqueGenres],
          langues: [{ value: "all", label: isRTL ? "الكل" : "Tous" }, ...uniqueLangues],
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des candidats :", error);
        setError([
          isRTL ? "خطأ في استرجاع البيانات. يرجى المحاولة مرة أخرى." : "Erreur lors de la récupération des données. Veuillez réessayer.",
        ]);
      }
    };

    fetchCandidats();
  }, []);

  useEffect(() => {
    let dataAvecInfos = [];
    candidatsData.forEach((candidat) => {
      const langues =
        candidat.langues?.map((lang) => lang.langue).join(", ") || "Non défini";
      // Ensure candidat has specialisations before mapping
      if (candidat.specialisations && Array.isArray(candidat.specialisations)) {
        candidat.specialisations.forEach((spec) => {
          dataAvecInfos.push({
            ...spec,
            genre: candidat.genre || "Non défini",
            poste:
              candidat.experiences?.length > 0
                ? candidat.experiences[0].poste
                : "Non défini",
            langues: langues,
            candidat_id: candidat.id,
            candidat: candidat, // Ensure candidat is attached
          });
        });
      }
    });
    setFilteredData(dataAvecInfos);
  }, [candidatsData]);

  useEffect(() => {
    if (filteredData.length > 0) {
      $.fn.dataTable.ext.errMode = "none";
      const table = $("#specialisationsTable").DataTable({
        responsive: true,
        destroy: true,
        data: filteredData,
        columns: [
          { data: null, render: (data, type, row, meta) => meta.row + 1 },
          { data: "titre_specialisation" },
          { data: "domaine" },
          { data: "niveaux_etude" },
          { data: "poste" },
          { data: "genre" },
          { data: "langues" },
          {
            data: null,
            render: () => `
              <div class="text-center">
                <button class="btn btn-sm view-btn" style="background-color: #5A5C69; color: white; max-width:50px;">
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
        error: (settings, helpPage, message) => {
          console.error("DataTables error:", message);
          setError([
            isRTL ? "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى." : "Une erreur est survenue lors du chargement des données. Veuillez réessayer.",
          ]);
        },
      });

      tableRef.current = table;

      $("#specialisationsTable tbody").on("click", ".view-btn", function () {
        const rowData = table.row($(this).parents("tr")).data();
        if (!rowData || !rowData.candidat) {
          console.error("Row data or candidat is undefined:", rowData);
          setError([isRTL ? "خطأ: تعذر تحميل تفاصيل المرشح." : "Erreur: Impossible de charger les détails du candidat."]);
          return;
        }
        handleOpenDetailModal(rowData, rowData.candidat);
      });

      return () => table.destroy();
    }
  }, [filteredData]);

  useEffect(() => {
    if (tableRef.current) {
      const table = tableRef.current;
      table
        .column(2)
        .search(
          filters.domaine === "all" ? "" : `^${filters.domaine}$`,
          true,
          false
        );
      table
        .column(3)
        .search(
          filters.niv_etude === "all" ? "" : `^${filters.niv_etude}$`,
          true,
          false
        );
      table
        .column(4)
        .search(
          filters.niv_exp === "all" ? "" : `^${filters.niv_exp}$`,
          true,
          false
        );
      table
        .column(5)
        .search(
          filters.genre === "all" ? "" : `^${filters.genre}$`,
          true,
          false
        );
      table
        .column(6)
        .search(filters.langue === "all" ? "" : filters.langue, true, false);
      table.draw();
    }
  }, [filters]);

  return (
    <div className="contact-page">
      <Header />
      <Navbar />
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className={`container mt-4 mb-3 ${isRTL ? "rtl" : ""}`}
      >
        <h2 className="mb-4" style={{ color: "#0C96B1", fontSize: "24px", textAlign: isRTL ? "right" : "left" }}>
          {isRTL ? "ابحث عن الملف الشخصي الذي تحتاجه" : "Trouvez le profil qui vous faut"}
          {/* <span className="recruitment-pages" style={{arginTop:'-100px'}}></span> */}
        </h2>

        {errors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {errors.join(" ")}
          </div>
        )}

        <div className="card shadow-sm" style={{ maxWidth: "100%" }}>
          <div
            className="card-header"
            style={{ background: "#F8F9FC", color: "#0C96B1" }}
          >
            <div className="filter">
              <div className="row">
                <div className="col-sm-6 col-md-4 filters-item">
                  <div
                    className={`filters-label mb-2 ${isRTL ? "me-3" : "ms-3"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    <i className="fa fa-filter"></i> {isRTL ? "المجالات" : "Domaines"}
                  </div>
                  <div className="position-relative">
                    <select
                      id="domaine"
                      name="domaine"
                      value={filters.domaine}
                      onChange={handleFilterChange}
                      className="form-control"
                      style={{ paddingRight: "30px" }}
                    >
                      {filterOptions.domaines.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                        pointerEvents: "none",
                        color: "#0C96B1",
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-2 filters-item">
                  <div
                    className={`filters-label mb-2 ${isRTL ? "me-3" : "ms-3"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    <i className="fa fa-filter"></i> {isRTL ? "مستويات الدراسة" : "Niveaux d'études"}
                  </div>
                  <div className="position-relative">
                    <select
                      id="niv_etude"
                      name="niv_etude"
                      value={filters.niv_etude}
                      onChange={handleFilterChange}
                      className="form-control"
                      style={{ paddingRight: "30px" }}
                    >
                      {filterOptions.niveaux_etude.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                        pointerEvents: "none",
                        color: "#0C96B1",
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-2 filters-item">
                  <div
                    className={`filters-label mb-2 ${isRTL ? "me-3" : "ms-3"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    <i className="fa fa-filter"></i> {isRTL ? "الخبرات" : "Expériences"}
                  </div>
                  <div className="position-relative">
                    <select
                      id="niv_exp"
                      name="niv_exp"
                      value={filters.niv_exp}
                      onChange={handleFilterChange}
                      className="form-control"
                      style={{ paddingRight: "30px" }}
                    >
                      {filterOptions.experiences.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                        pointerEvents: "none",
                        color: "#0C96B1",
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-2 filters-item">
                  <div
                    className={`filters-label mb-2 ${isRTL ? "me-3" : "ms-3"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    <i className="fa fa-filter"></i> {isRTL ? "الجنس" : "Genre"}
                  </div>
                  <div className="position-relative">
                    <select
                      id="genre"
                      name="genre"
                      value={filters.genre}
                      onChange={handleFilterChange}
                      className="form-control"
                      style={{ paddingRight: "30px" }}
                    >
                      {filterOptions.genres.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                        pointerEvents: "none",
                        color: "#0C96B1",
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-2 filters-item">
                  <div
                    className={`filters-label mb-2 ${isRTL ? "me-3" : "ms-3"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    <i className="fa fa-filter"></i> {isRTL ? "اللغة" : "Langue"}
                  </div>
                  <div className="position-relative">
                    <select
                      id="langue"
                      name="langue"
                      value={filters.langue}
                      onChange={handleFilterChange}
                      className="form-control"
                      style={{ paddingRight: "30px" }}
                    >
                      {filterOptions.langues.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                        pointerEvents: "none",
                        color: "#0C96B1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-bod">
            <div className="table-responsive">
              <table
                id="specialisationsTable"
                className="table table-striped table-bordered"
              >
                <thead>
                  <tr>
                    <th>{isRTL ? "المرجع" : "Réf"}</th>
                    <th>{isRTL ? "التخصص" : "Spécialité"}</th>
                    <th>{isRTL ? "المجال" : "Domaine"}</th>
                    <th>{isRTL ? "مستوى الدراسة" : "Niveau d'étude"}</th>
                    <th>{isRTL ? "المنصب" : "Poste"}</th>
                    <th>{isRTL ? "الجنس" : "Genre"}</th>
                    <th>{isRTL ? "اللغات" : "Langues"}</th>
                    <th>{isRTL ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          centered
          aria-labelledby="candidate-profile-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{isRTL ? "الملف الشخصي" : "Profil"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-6 bg-white">
            {profile && candidate && (
              <div id="cv-to-print">
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
                    <span>{isRTL ? "تحميل" : "Télécharger"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn text-white ms-1 text-xs font-medium px-2 py-1 rounded-md flex items-center space-x-1"
                    style={{ backgroundColor: "#1CC88A", width: "150px" }}
                  >
                    <i className="fas fa-file-pdf text-sm"></i>
                    <span>{isRTL ? "طباعة" : "Imprimer"}</span>
                  </button>
                </div>
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {isRTL ? "المرجع" : "Réf"} : <span className="font-normal">{profile.id}</span>
                </h5>
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {isRTL ? "الحالة المدنية" : "État Civil"}
                </h5>
                <div
                  className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                  style={{ background: "#DCE3F9" }}
                >
                  <div className="row">
                    <div className="col-2 p-0">
                      <Image
                        src={candidate.logo}
                        alt=""
                        className="rounded-full w-20 h-20 object-cover"
                      />
                    </div>
                    <div className="col-lg-10">
                      <p className="mb-1">
                        <strong>{isRTL ? "تاريخ الميلاد" : "Date de naissance"} :</strong>{" "}
                        {candidate.date_naissance}
                      </p>
                      <p className="mb-1">
                        <strong>{isRTL ? "الجنس" : "Genre"} :</strong> {candidate.genre}
                      </p>
                      <p className="mb-1">
                        <strong>{isRTL ? "البلد" : "Pays"} :</strong> {candidate.pays}
                      </p>
                    </div>
                  </div>
                </div>
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {isRTL ? "البيانات الشخصية" : "Données personnelles"}
                </h5>
                <div
                  className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-4 shadow-sm"
                  style={{ background: "#DCE3F9" }}
                >
                  <p className="mb-1">
                    <strong>{isRTL ? "الاسم" : "Nom"} :</strong> {profile.nom} {profile.prenom}
                  </p>
                  <p className="mb-1">
                    <strong>{isRTL ? "الهاتف" : "Téléphone"} :</strong> {profile.telephone}
                  </p>
                </div>
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {isRTL ? "الخيار أو التخصص" : "Option ou spécialisation"}
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
                        <strong>{isRTL ? "المجال" : "Domaine"} :</strong> {spec.domaine}
                      </p>
                    </div>
                  ))}
                </div>
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {isRTL ? "الشهادات والتدريب" : "Diplômes et Formations"}
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
                      <strong>{isRTL ? "المؤسسة" : "Établissement"} :</strong> {edu.etablissement}
                    </p>
                    <p className="mb-1">
                      <strong>
                        {edu.date_debut} - {edu.date_fin}
                      </strong>
                    </p>
                  </div>
                ))}
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {isRTL ? "الخبرات المهنية" : "Expériences professionnelles"}
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
                      <strong>{isRTL ? "الشركة" : "Entreprise"} :</strong> {exp.nom_entreprise}
                    </p>
                    <p className="mb-1">
                      <strong>
                        {exp.date_debut} -{" "}
                        {exp.en_cours ? (isRTL ? "جاري" : "En cours") : exp.date_fin}
                      </strong>
                    </p>
                    <p className="mb-1">
                      <strong>{isRTL ? "الوصف" : "Description"} :</strong> {exp.description}
                    </p>
                  </div>
                ))}
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {isRTL ? "اللغات المحكية" : "Langues Parlées"}
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
            )}
          </Modal.Body>
        </Modal>
      </section>
      <Footer />
    </div>
  );
};

export default CVFinder;
