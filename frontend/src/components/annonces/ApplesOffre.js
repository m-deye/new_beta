import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OffreEmploi.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

import Header from "../../Header";
import Navbar from "../../Navbar";
import Footer from "../../Footer";

// Composant réutilisable pour une carte d'appel d'offres
const OffreCard = ({ logo, entreprise, titre, dateText, type_s, id, isRTL, t }) => {
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
            {type_s}
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
                    href={`/appel-offre/${id}`}
                    className="titleAnn font-weight-bold fw-bold"
                  >
                    <p
                      className="mb-0"
                      dangerouslySetInnerHTML={{ __html: titre }}
                    ></p>
                  </a>
                </div>
                <div
                  className="post-card-limit small"
                  style={{ marginTop: "-15px", fontSize: "9.6px" }}
                >
                  <span className="text-danger">
                    <i className="far fa-clock"></i> {dateText}
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

const ApplesOffre = () => {
  const [offres, setOffres] = useState([]);
  const { client__nom } = useParams(); // Récupérer le paramètre "client__nom" de l'URL
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

  // useEffect(() => {
  //   // Construire l'URL de l'API en fonction du filtre
  //   let apiUrl = `http://127.0.0.1:8000/appels_offres/annonces_parclient/?client=${encodeURIComponent(client__nom)}`;

  //   // Fonction pour récupérer les offres
  //   const fetchOffres = async () => {
  //     try {
  //       const response = await fetch(apiUrl);
  //       if (!response.ok) {
  //         throw new Error('Erreur lors de la récupération des données');
  //       }
  //       const data = await response.json();
  //       setOffres(data);
  //     } catch (error) {
  //       console.error("Erreur de chargement:", error);
  //     }
  //   };

  //   fetchOffres(); // Appelle la fonction au chargement du composant
  // }, [client__nom]); // Déclencher un nouvel appel si le paramètre de l'URL change

  useEffect(() => {
    // Construire l'URL de l'API en fonction du filtre
    const apiUrl = `/appels_offres/annonces_parclient/?client=${encodeURIComponent(
      client__nom
    )}&lang=${i18n.language}`;

    // Fonction pour récupérer les offres
    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get(apiUrl);
        setOffres(response.data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    if (client__nom) {
      fetchOffres(); // Appelle la fonction au chargement du composant
    }
  }, [client__nom, i18n.language]); // Déclencher un nouvel appel si le paramètre de l'URL change

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <Navbar />
      <div className="container py-4" style={{ background: "#fff" }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-beta" style={{ color: "#0C96B1" }}>
                {t("liste_appels_offres")}
              </h1>
            </div>
            <div className="row px-lg-4 px-0">
              {offres.map((offre, index) => (
                <OffreCard
                  key={index}
                  logo={offre.client__logo}
                  id={offre.id}
                  entreprise={offre.client__nom}
                  titre={offre.titre}
                  dateText={formatDateFromServer(offre.date_limite, offre.afficher_heures)}
                  badgeText={offre.badgeText}
                  type_s={offre.type_s}
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

export default ApplesOffre;
