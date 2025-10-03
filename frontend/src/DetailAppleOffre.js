import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // Importation de useParams
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";
import axiosInstance from "./api/axiosInstance";
const DetailAppleOffre = () => {
  const { id } = useParams(); // Récupérer l'ID depuis l'URL
  const [appel, setAppel] = useState(null);
  const { i18n, t } = useTranslation();

  const isRTL = i18n.language === "ar";
  // Fonction de formatage jour mois année avec ou sans heure selon afficher_heures
  const formatDateSimple = (isoString, afficherHeures = false) => {
    if (!isoString) return "";
    const date = new Date(isoString);

    // Choix du locale
    const locale = i18n.language === "ar" ? "ar-EG" : "fr-FR";

    // On ajoute numberingSystem:'latn' pour les chiffres occidentaux en arabe
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      numberingSystem: i18n.language === "ar" ? "latn" : undefined,
    };

    // Ajouter l'heure si afficher_heures est true
    if (afficherHeures) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }

    return new Intl.DateTimeFormat(locale, options).format(date);
  };
  const hasViewed = useRef(false);
  useEffect(() => {
    const fetchAppelDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `/appels_offres/detail/${id}/?lang=${i18n.language}`
        );
        setAppel(response.data);
        if (!hasViewed.current) {
          await axiosInstance.post(
            `/appels_offres/incremente/${id}/incremente_vue/`
          );
          hasViewed.current = true;
        }
        console.log("✅ Détail de l'appel d'offre :", response.data);
      } catch (error) {
        console.error("❌ Erreur de chargement :", error);
      }
    };

    if (id) {
      fetchAppelDetail();
    }
  }, [id, i18n.language]);

  //   useEffect(() => {
  //     // Charger les détails de l'offre depuis l'API
  //     fetch(`http://127.0.0.1:8000/appels_offres/detail/${id}/?lang=${i18n.language}`)
  //       .then(response => response.json())
  //       .then(data => setAppel(data))
  //       .catch(error => console.error("Erreur de chargement:", error));
  //   }, [id,i18n.language]);

  if (!appel) return <p>Chargement...</p>;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"} // ← handle direction
      className={isRTL ? "rtl" : ""} // ← pour css spécifique
    >
      <Header />
      <Navbar />
      <div className="container bg-white">
        <div className="row">
          <div className="col-md-12">
            <div className="card p-2 mt-2 mb-2" style={{ maxWidth: "100%" }}>
              <div className="row">
                <div className="col-md-2 text-center">
                  <img width="120px" src={appel?.client__logo} alt="LOGO" />
                </div>
                <div className="col-md-10 align-self-center">
                  {/* <span className="font-weight-bold" style={{ fontSize: '14px' }}  dangerouslySetInnerHTML={{ __html: appel?.titres }}></span> */}
                  <span
                    className="text-beta font-weight-bold mb-0"
                    style={{ fontSize: "14px", color: "#000000" }}
                    dangerouslySetInnerHTML={{ __html: appel?.client__nom }}
                  ></span>

                  <span
                    className="text-beta font-weight-bold mb-0"
                    style={{ fontSize: "14px", color: "#0C96B1" }}
                    dangerouslySetInnerHTML={{ __html: appel?.titre }}
                  ></span>
                  <b>
                    {t("date_limite")} :{" "}
                    <span className="text-danger">
                      {formatDateSimple(appel.date_limite, appel.afficher_heures)}
                    </span>
                  </b>
                  {/* <span className="fw-bold" style={{ fontSize: '14px', marginLeft: '3px', color: '#E74A3B' }}>
                    {appel.date_limite ? format(new Date(appel.date_limite), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                  </span> */}
                </div>
              </div>
              <br />
              <br />
              <br />
              <div className="row" id="divText">
                <div className="col-lg-12">
                  {/* Afficher la description de l'offre */}
                  <p
                    style={{ textDecoration: "none" }}
                    dangerouslySetInnerHTML={{ __html: appel.description }}
                  />
                </div>

                {/* Vérifier si des documents existent */}
                {(appel.documents && (appel.documents.filter && appel.documents.filter(doc => !doc.langue || doc.langue === i18n.language).length > 0)) ? (
                  <div className="col-lg-12">
                    <br />
                    <br />
                    <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'rgb(99, 36, 35)'
                          }}>
                      {t("plus_d_informations")} :{" "}
                    </span>
                    <br />
                    <br />
                    {(appel.documents.filter ? appel.documents.filter(document => !document.langue || document.langue === i18n.language) : appel.documents).map((document, index) => (
                      <a
                        key={index}
                        className="titreDoc"
                        href={document.piece_join} // Lien vers le document
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <img
                          width="30px"
                          src="https://beta.mr/img/pdf.png"
                          alt="PDF Icon"
                        />
                        <span style={{
                              fontSize: '19px',
                              fontWeight: 'bold'
                            }}>
                              {document.titre_piece_join}
                            </span>{" "} <br />
                        {/* Afficher le titre du document */}
                      </a>
                    ))}
                    <br />
                  </div>
                ) : null}
              </div>
              <div className="card-footer mt-5">
                <div className="row">
                  <div className="col-6">
                    {/* <b>{t('offre_en_ligne_depuis')} : </b> <span style={{color: 'red'}}>12 février 2025</span> */}
                    <b>{t("offre_en_ligne_depuis")} : </b>{" "}
                    <span style={{ color: "red" }}>
                      {formatDateSimple(appel.date_mise_en_ligne, appel.afficher_heures)}
                    </span>
                  </div>
                  <div className="col-6 text-end">
                    <b>
                      <i className="fa fa-share"></i> {t("partager_offre")}{" "}
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
                      href="https://www.linkedin.com/shareArticle?mini=true&amp;url=https://beta.mr/beta/offre/un-directeur-des-finances-et-administration/8145"
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
                    className="mr-3 btn btn-sm shadow-sm mb-1" // Suppression de btn-primary car nous définissons une couleur personnalisée
                    href="/listcompter_appeloffre"
                    style={{
                      textDecoration: "none", // Ajout de text-decoration: none
                      backgroundColor: "#4E73DF", // Ajout de la couleur de fond
                      width: "250px", // Réduction de la largeur (ajustez la valeur selon vos besoins)
                    }}
                  >
                    {t("voir_liste_complete")}
                  </a>
                  <a
                    className="btn btn-sm btn-primary shadow-sm mb-1"
                    href={`/annonces_appleoffre/${appel.client__nom}`}
                    style={{
                      textDecoration: "none", // Ajout de text-decoration: none
                      backgroundColor: "#4E73DF", // Ajout de la couleur de fond
                    }}
                  >
                    {t("voir_toutes_annonces")} :
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      {" "}
                      {appel.client__nom}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailAppleOffre;
