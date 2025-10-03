import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OffreEmploi.css";
import { useParams } from "react-router-dom";
import fr from "date-fns/locale/fr";

import Header from "../../Header";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosInstance";

// Composant réutilisable pour une carte d'appel d'offres
const OffreCard = ({ logo, entreprise, titre, dateText, type_offre, id, lieu, isRTL, t }) => {
  return (
    <div
      className="col-sm-12 col-md-6"
      style={{ marginBottom: "10px", paddingRight: "20px" }}
    >
      <div className="card post-card pb-1" style={{ height: "100%" }}>
        <div className="card-bod" style={{ padding: "2px" }}>
          <div
            className="card-badge"
            style={isRTL ? { left: 0, right: 'auto' } : undefined}
          >
            {type_offre === "OFFRE_EMPLOI" ? t("offres_emploi") : t("consultants")}
          </div>
          <div className="col-md-12">
            <div className="row pl-0">
              <div className="col-sm-2 pr-0 pl-0">
                <img className="imgAnn imgliste" src={logo} alt="logo" />
              </div>
              <div className="col-sm-10 pl-0">
                <div
                  className="post-card-content sizeBd align-self-center entreprise"
                  dangerouslySetInnerHTML={{ __html: entreprise }}
                ></div>
                <div className=" text-beta sizeBd mb-1 titre1">
                  <a
                    href={`/DetailOffreEmploi/${id}`}
                    className="titleAnn font-weight-bold fw-bold"
                  >
                    <p
                      className="mb-0"
                      dangerouslySetInnerHTML={{ __html: titre }}
                    ></p>
                  </a>
                </div>
                <div className=" small dateleiu">
                  <span className="text-danger">
                    <i className="far fa-clock"></i> {dateText}
                  </span>
                  <span className="lieuappleoffre" style={{ color: "#0C74CC" }}>
                    <i className="fas fa-map-marker-alt "></i> {lieu}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OffreEmploi = () => {
  const [offres, setOffres] = useState([]);
  const location = useLocation(); // Récupérer les paramètres de l'URL
  const { client__nom } = useParams(); // Récupérer le paramètre depuis l'URL
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  

  const formatDateFromServer = (dateObj, afficherHeures) => {
    if (!dateObj) return "";
    const day = Array.isArray(dateObj.days) ? dateObj.days[0] : null;
    const month = Array.isArray(dateObj.months) ? dateObj.months[0] : null; // 1-12
    const year = dateObj.year;
    const hasTime = afficherHeures && dateObj.times && dateObj.times.length > 0;
    const hour = hasTime ? dateObj.times[0].hour : 0;
    const minute = hasTime ? dateObj.times[0].minute : 0;

    if (!day || !month || !year) return "";
    const jsDate = new Date(year, (month - 1), day, hour, minute);
    const locale = i18n.language === "ar" ? "ar-EG" : "fr-FR";
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      numberingSystem: i18n.language === "ar" ? "latn" : undefined,
      ...(hasTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    };
    return new Intl.DateTimeFormat(locale, options).format(jsDate);
  };


  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get(
          `/annonces_parclient/${client__nom}/?lang=${i18n.language}`
        );
        setOffres(response.data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    if (client__nom) {
      fetchOffres();
    }
  }, [client__nom, i18n.language]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <Navbar />
      <div className="container py-4" style={{ background: "#fff" }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-beta" style={{ color: "#0C96B1" }}>
                Offres d'emploi
              </h1>
            </div>
            <div className="row px-lg-4 px-0">
              {offres.map((offre, index) => (
                <OffreCard
                  key={index}
                  logo={offre.client__logo}
                  entreprise={offre.client__nom}
                  titre={offre.titre}
                  dateText={formatDateFromServer(offre.date_limite, offre.afficher_heures)}
                  badgeText={offre.badgeText}
                  id={offre.id}
                  type_offre={offre.type_offre}
                  lieu={offre.lieu}
                  isRTL={isRTL}
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OffreEmploi;
