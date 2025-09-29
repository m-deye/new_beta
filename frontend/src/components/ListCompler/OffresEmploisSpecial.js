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

const splitDateTime = (dateLimite) => {
  // Retourne { date: '...', time: '...' } ; time peut être ''
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
          (t) => `${t.hour.toString().padStart(2, "0")}:${t.minute.toString().padStart(2, "0")}`
        )
        .join(", ")
    : "";
  return { date: `${daysStr} ${monthsStr} ${year}`, time: timeStr };
};

const OffreCard = ({ logo, entreprise, titre, date, time, type, id, lieu, groupement_spacial, titre_groupement_cpacial, client__special, client__nom }) => {
  const { t } = useTranslation();
  return (
    <div
      className="col-sm-12 col-md-6"
      style={{ marginBottom: "10px", paddingRight: "20px" }}
    >
      <div className="card post-card pb-1" style={{ height: "100%" }}>
        <div className="card-bod card-bod1" style={{ padding: "2px" }}>
          <div className="card-badge">
            {type === "OFFRE_EMPLOI" ? t("offres_emploi") : t("consultants")}
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
                <div className="text-beta sizeBd">
                  <a
                    href={
                      client__special
                        ? `/ClientSpeciele/${encodeURIComponent(client__nom)}/${id}`
                        : `/DetailOffreEmploi/${id}`
                    }
                    className="titleAnn font-weight-bold fw-bold titre1"
                  >
                    <p
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: titre,
                      }}
                    ></p>
                  </a>
                </div>
                <div className="small dateleiu">
                  <span className="text-danger me-2">
                    <i className="far fa-calendar"></i> {date}
                  </span>
                  {time && (
                    <span className="text-danger me-2">
                      <i className="far fa-clock"></i> {time}
                    </span>
                  )}
                  <span className="lieuappleoffre" style={{ color: "#0C74CC" }}>
                    <i className="fas fa-map-marker-alt"></i> {lieu}
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

const OffresEmploisSpecial = () => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [offres, setOffres] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const clientName = queryParams.get("client");
    const groupementId = queryParams.get("groupement_id");

    const fetchOffres = async () => {
      try {
        const params = {};
        if (clientName) params.client = clientName;
        if (groupementId) params.groupement_id = groupementId;

        const response = await axiosInstance.get(
          `/offres_emploi/liste/special/?lang=${i18n.language}&listes=complet`,
          { params }
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
                {t("offres_emploi")}
              </h1>
            </div>
            <div className="row px-lg-4 px-0">
              {offres.length === 0 ? (
                <p className="text-center">{t("aucune_offre_trouvee")}</p>
              ) : (
                offres.flatMap((offre, index) => {
                  const cards = [];
                  // Afficher uniquement si c'est une offre principale
                  if (offre.si_principal) {
                    const mainDT = splitDateTime(offre.date_limite);
                    cards.push(
                      <OffreCard
                        key={`main-${offre.id}-${index}`}
                        logo={offre.client__logo}
                        entreprise={offre.titre_entreprise ? offre.titre_entreprise : offre.client__nom}
                        titre={offre.titre}
                        date={mainDT.date}
                        time={mainDT.time}
                        type={offre.type_offre}
                        id={offre.id}
                        lieu={offre.lieu}
                        client__special={offre.client__special}
                        client__nom={offre.client__nom}
                        groupement_spacial={offre.groupement_spacial}
                        titre_groupement_cpacial={offre.titre_groupement_cpacial}
                      />
                    );

                    // Afficher les offres liées seulement si elles existent
                    if (Array.isArray(offre.offres_liees) && offre.offres_liees.length > 0) {
                      offre.offres_liees.forEach((li, idx) => {
                        const linkedDT = splitDateTime(li.date_limite);
                        cards.push(
                          <OffreCard
                            key={`linked-${offre.id}-${li.id}-${idx}`}
                            logo={offre.client__logo}
                            entreprise={offre.titre_entreprise ? offre.titre_entreprise : offre.client__nom}
                            titre={li.titre}
                            date={linkedDT.date}
                            time={linkedDT.time}
                            type={offre.type_offre}
                            id={li.id}
                            lieu={li.lieu}
                            client__special={offre.client__special} // Use offre.client__special
                            client__nom={offre.client__nom} // Use offre.client__nom
                            groupement_spacial="non"
                            titre_groupement_cpacial={null}
                          />
                        );
                      });
                    }
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

export default OffresEmploisSpecial;