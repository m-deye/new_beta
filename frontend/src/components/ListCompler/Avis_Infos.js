import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "./ApplesOffres.css";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import axiosInstance from "../../api/axiosInstance";

import Header from "../../Header";
import Navbar from "../../Navbar";
import Footer from "../../Footer";

// Fonction pour formater la date limite
const formatDateLimite = (dateLimite) => {
  if (!dateLimite || dateLimite === "N/A") return "N/A";

  // Si c'est une chaîne (cas rare avec plusieurs années)
  if (typeof dateLimite === "string") return dateLimite;

  // Cas standard : objet avec days, months, year, times
  const { days, months, year, times } = dateLimite;
  const daysStr = days.join(", ");
  const monthsStr = months.join(", ");

  // Vérifier si toutes les heures sont 00:00
  const hasNonZeroTime = times.some(
    (time) => time.hour !== 0 || time.minute !== 0
  );
  let timeStr = "";

  if (hasNonZeroTime) {
    // Formater les heures uniquement si elles ne sont pas 00:00
    timeStr = times
      .filter((time) => time.hour !== 0 || time.minute !== 0) // Filtrer 00:00
      .map(
        (time) =>
          `${time.hour.toString().padStart(2, "0")}:${time.minute
            .toString()
            .padStart(2, "0")}`
      )
      .join(", ");
  }

  return timeStr
    ? `${daysStr} ${monthsStr} ${year} à ${timeStr}`
    : `${daysStr} ${monthsStr} ${year}`;
};

// Composant réutilisable pour une carte d'appel d'offres
const OffreCard = ({ logo, entreprise, titre, date, type, id,  isRTL, client__special}) => {
  return (
    <div
      className="col-sm-12 col-sm-1 col-md-6"
      style={{ marginBottom: "10px", paddingRight: "20px" }}
    >
      <div className="card post-card pb-1" style={{ height: "100%" }}>
        <div className="card-bod card-bod1" style={{ padding: "2px" }}>
          {/* <div className="card-badge">{type}</div> */}
          <div className="card-badge"
            style={isRTL ? { left: 0, right: 'auto' } : undefined}
          >
            {type}
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
                <div className="text-beta sizeBd mb-1 titre1">
                  <a
                    href={
                      // `/avis-infos/${id}`
                      client__special ? `/ClientSpecielAvis/${encodeURIComponent(
                                    entreprise
                                  )}/${id}`
                                : `/avis-infos/${id}`
                    }
                    className="titleAnn font-weight-bold fw-bold"
                  >
                    <p
                      className="mb-0"
                      dangerouslySetInnerHTML={{ __html: titre }}
                    ></p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Avis_Infos = () => {
  const { i18n, t } = useTranslation(); // ← importer i18n + t
  const isRTL = i18n.language === "ar";
  const [offres, setOffres] = useState([]);
  const location = useLocation(); // Récupérer les paramètres de l'URL
  const isAr = i18n.language === "ar";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const clientName = queryParams.get("client");

    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get(
          `/avis_infos/liste/?lang=${i18n.language}`,
          {
            params: clientName ? { client: clientName } : {},
          }
        );
        setOffres(response.data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };

    fetchOffres();
  }, [location.search, i18n.language]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "rtl" : ""}>
      <Header />
      <Navbar />
      <div className="container container1 py-4" style={{ background: "#fff" }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-beta" style={{ color: "#0C96B1" }}>
                {t("avis_infos")}
              </h1>
            </div>
            <div className="row px-lg-4 px-0">
              {offres.map((offre, index) => (
                <OffreCard
                  key={index}
                  logo={offre.client__logo}
                  entreprise={offre.client__nom}
                  titre={offre.titre}
                  date={formatDateLimite(offre.date_limite)} // Formater la date ici
                  type={t("avis_infos")}
                  id={offre.id}
                  isRTL={isRTL}
                  client__special={offre.client__special}
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

export default Avis_Infos;
