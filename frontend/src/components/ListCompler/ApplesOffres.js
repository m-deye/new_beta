import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "./ApplesOffres.css";

// import { format } from 'date-fns';
// import fr from 'date-fns/locale/fr';

import Header from "../../Header";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import axiosInstance from "../../api/axiosInstance";
const splitDateTime = (dateLimite) => {
  if (!dateLimite || dateLimite === "N/A") return { date: "N/A", time: "" };
  if (typeof dateLimite === "string") return { date: dateLimite, time: "" };
  const { days, months, year, times } = dateLimite;
  const daysStr = days.join(", ");
  const monthsStr = months.join(", ");
  const hasNonZeroTime = Array.isArray(times)
    ? times.some((t) => t.hour !== 0 || t.minute !== 0)
    : false;
  const timeStr = hasNonZeroTime
    ? times
        .filter((t) => t.hour !== 0 || t.minute !== 0)
        .map(
          (t) => `${t.hour.toString().padStart(2, "0")}:${t.minute
            .toString()
            .padStart(2, "0")}`
        )
        .join(", ")
    : "";
  return { date: `${daysStr} ${monthsStr} ${year}`, time: timeStr };
};
// Composant réutilisable pour une carte d'appel d'offres
const OffreCard = ({ logo, entreprise, titre, date, time, type_s, id }) => {
  return (
    <div
      className="col-sm-12 col-sm-1 col-md-6"
      style={{ marginBottom: "10px", paddingRight: "20px" }}
    >
      <div className="card post-card pb-1" style={{ height: "100%" }}>
        <div className="card-bods card-bod1" style={{ padding: "2px" }}>
          <div className="card-badges">{type_s}</div>
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
                <div className="text-beta sizeBd mb-1" titre1>
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
                  style={{ marginTop: "-15px" }}
                >
                  <span className="text-danger me-2">
                    <i className="far fa-calendar"></i> {date}
                  </span>
                  {time && (
                    <span className="text-danger">
                      <i className="far fa-clock"></i> {time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplesOffres = () => {
  const { i18n, t } = useTranslation(); // ← importer i18n + t
  const isRTL = i18n.language === "ar";
  const [offres, setOffres] = useState([]);
  const location = useLocation(); // Récupérer les paramètres de l'URL
  const isAr = i18n.language === "ar";

  // useEffect(() => {

  //   const queryParams = new URLSearchParams(location.search);
  //   const clientName = queryParams.get('client');

  //   let apiUrl =  "http://127.0.0.1:8000/appels_offres/listcompler/" ;
  //   if (clientName) {
  //     apiUrl += `?client=${encodeURIComponent(clientName)}`;
  //   }

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
  // }, [location.search]); // Déclencher un nouvel appel si les paramètres de l'URL changent

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const clientName = queryParams.get("client");

    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get(
          `/appels_offres/listcompler/?lang=${i18n.language}&listes=complet`,
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
                {t("Liste_appels_offres")}
              </h1>
            </div>
            <div className="row px-lg-4 ">
              {offres.length === 0 ? (
                <p className="text-center">{t("aucune_offre_trouvee")}</p>
              ) : (
                offres.flatMap((offre, index) => {
                  const cards = [];
                  // Carte principale (ou non groupée)
                  const mainDT = splitDateTime(offre.date_limite);
                  cards.push(
                    <OffreCard
                      key={`main-appel-${offre.id}-${index}`}
                      logo={offre.client__logo}
                      entreprise={offre.client__nom}
                      titre={offre.titre}
                      date={mainDT.date}
                      time={mainDT.time}
                      id={offre.id}
                      type_s={offre.type_s}
                    />
                  );

                  // Offres liées si appel principal
                  if (offre.si_principal && Array.isArray(offre.offres_liees) && offre.offres_liees.length > 0) {
                    offre.offres_liees.forEach((li, idx) => {
                      const linkedDT = splitDateTime(li.date_limite);
                      cards.push(
                        <OffreCard
                          key={`linked-appel-${offre.id}-${li.id}-${idx}`}
                          logo={offre.client__logo}
                          entreprise={offre.client__nom}
                          titre={li.titre}
                          date={linkedDT.date}
                          time={linkedDT.time}
                          id={li.id}
                          type_s={offre.type_s}
                        />
                      );
                    });
                  }

                  return cards;
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplesOffres;
