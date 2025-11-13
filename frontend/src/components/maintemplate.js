import React, { useState, useEffect } from "react";
import "../assets/styles/maintemplate.css";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosInstance";

const Maintemplate = () => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [offres, setOffres] = useState([]);
  const [appelsOffres, setAppelsOffres] = useState([]);
  const [avisInfos, setAvisInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const marginStart = (value) => ({
    [isRTL ? "marginRight" : "marginLeft"]: value,
  });

  useEffect(() => {
    axiosInstance
      .get(`/offres_emploi/liste/?lang=${i18n.language}`)
      .then((response) => {
        setOffres(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des offres:", error);
        setLoading(false);
      });

    axiosInstance
      .get(`/appels_offres/liste/?lang=${i18n.language}`)
      .then((response) => setAppelsOffres(response.data))
      .catch((error) => console.error("Erreur appels d'offres :", error));

    axiosInstance
      .get(`/avis_infos/liste/?lang=${i18n.language}`)
      .then((response) => setAvisInfos(response.data))
      .catch((error) => console.error("Erreur avis & infos :", error));
  }, [i18n.language]);

  const formatDateLimite = (dateLimite) => {
    if (!dateLimite || dateLimite === "N/A") return "N/A";
    if (typeof dateLimite === "string") return dateLimite;
    const { days, months, year, times } = dateLimite;
    const daysStr = days.join(", ");
    const monthsStr = months.join(", ");
    const hasNonZeroTime = times.some(
      (time) => time.hour !== 0 || time.minute !== 0
    );
    let timeStr = "";
    if (hasNonZeroTime) {
      timeStr = times
        .filter((time) => time.hour !== 0 || time.minute !== 0)
        .map(
          (time) =>
            `${time.hour.toString().padStart(2, "0")}:${time.minute
              .toString()
              .padStart(2, "0")}`
        )
        .join(", ");
    }
    return timeStr
      ? `${daysStr} ${monthsStr} ${year} ${t("a")} ${timeStr}`
      : `${daysStr} ${monthsStr} ${year}`;
  };

  return (
    <div
      className={`container container_template ${isRTL ? "rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
      style={{ background: "#fff" }}
    >
      <div className="row rowmain divIndex">
        <div className="col-md-3 order-2 order-md-1">
          <div className="card Carteimprinci" style={{ padding: "5px" }}>
            <div className="pr-1 pl-2 bgCard_offre pt-0">
              <span
                className="titrecol"
                style={{
                  color: "#FF9900",
                  marginLeft: "10px",
                  fontSize: "15px",
                  fontStyle: "italic",
                }}
              >
                {t("appels_offres")}
              </span>
              <span className="d-block section_applesoffre">
                <a
                  className="titre_size"
                  href="/Internationaux"
                  style={{ textDecoration: "none" }}
                >
                  {t("internationaux")}
                </a>
              </span>
              <span className="d-block section_applesoffre">
                <a
                  className="titre_size"
                  href="/Consultations"
                  style={{ textDecoration: "none" }}
                >
                  {t("consultations")}
                </a>
              </span>
              <span className="d-block section_applesoffre">
                <a
                  className="titre_size"
                  href="/Locaux"
                  style={{ textDecoration: "none" }}
                >
                  {t("locaux")}
                </a>
              </span>
              <span className="d-block section_applesoffre">
                <a
                  className="titre_size"
                  href="/ManifestationsIntérêts"
                  style={{ textDecoration: "none" }}
                >
                  {t("manifestations_interets")}
                </a>
              </span>
              {appelsOffres.length === 0 ? (
                <p className="text-center">{t("aucun_appel_offre")}</p>
              ) : (
                <div className="row">
                  {appelsOffres.map((appel, index) => (
                    <div key={index} className="col-12">
                      <div className="card post-card pb-1 card_appleoffre">
                        <div className="card-bod" style={{ padding: "2px" }}>
                          <a
                            href={
                              appel.client__special
                                ? `/ClientSpecielApple/${encodeURIComponent(
                                    appel.client__nom
                                  )}/${appel.id}`
                                : `/appel-offre/${appel.id}`
                            }
                            style={{ textDecoration: "none" }}
                          >
                            <div className="row" style={{ marginLeft: "1px" }}>
                              <div
                                style={{ width: "38px" }}
                                className="pl-0 pr-0 text-center align-self-center mb-1"
                              >
                                <img
                                  src={appel.client__logo}
                                  alt=""
                                  className="logoappleoffre"
                                />
                              </div>
                              <div className="col-sm-9 p-0 d-flex flex-wrap">
                                <div
                                  className="fw-bold align-self-center"
                                  style={{
                                    marginBottom: "0px",
                                    fontSize: "11px",
                                    color: "#0C74CC",
                                    ...marginStart(isRTL ? "19px" : "4px"),
                                  }}
                                >
                                  {appel.client__nom}
                                </div>
                              </div>
                            </div>
                            <div className="post-card-heading sizeBd">
                              <p
                                className="titre_appleoffre toptitre"
                                dangerouslySetInnerHTML={{
                                  __html: appel.titre,
                                }}
                              />
                              {appel.si_principal &&
                                appel.offres_liees.length > 0 && (
                                  <div className="titregroupappleoffre">
                                    {appel.offres_liees.map((linked, idx) => (
                                      <span key={idx}>
                                        <a
                                          href={appel.client__special
                                                    ? `/ClientSpecielApple/${encodeURIComponent(
                                                        appel.client__nom
                                                      )}/${linked.id}`
                                                    : `/appel-offre/${linked.id}`
                                                  }
                                            // `/appel-offre/${linked.id}`}
                                          className="titre_group_apple"
                                        >
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: linked.titre,
                                            }}
                                          />
                                        </a>
                                      </span>
                                    ))}
                                  </div>
                                )}
                            </div>
                            <div className="post-card-limit small">
                              <span className="text-danger datelimitappleoffre">
                                <i className="far fa-clock"></i>{" "}
                                {formatDateLimite(appel.date_limite)}
                              </span>
                              {/* <span className="lieuappleoffre">
                                <i className="fas fa-map-marker-alt"></i>{" "}
                                {appel.lieu}
                              </span> */}
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <a
                style={{
                  background: "#4E73DF",
                  width: "94%",
                  marginLeft: "10px",
                  padding: "8px",
                  textDecoration: "none",
                }}
                className="btn btn-sm btn-primary shadow-sm mt-2 mb-0"
                href="/listcompter_appeloffre"
              >
                {t("voir_liste_complete")}
              </a>
            </div>
          </div>
        </div>


        <div className="col-md-6 order-1 order-md-2 bgCard_offre">
          <div>
            <div className="card-bod card-2">
              <div className="row" style={{ marginBottom: "0px" }}>
                <div className="col-6 titrecol font-weight-bold textemplois">
                  {t("offres_emploi")}
                </div>
                <div className="col-6 text-end" style={{ marginTop: "2px" }}>
                  <a href="" className="titrecol texconsultant">
                    {t("consultants")}
                  </a>
                </div>
              </div>
              <div className="row" style={{ marginTop: "-15px" }}>
                {offres.map((offer, index) => (
                  <div
                    key={index}
                    className="col-12 col-md-6 Col6"
                    style={{ marginBottom: "0px", padding: "0.05rem" }}
                  >
                    <div
                      className="card post-card pb-1 mb-1"
                      style={{ height: "100%" }}
                    >
                      <div className="card-bod" style={{ padding: "2px" }}>
                        <a
                          href={
                            offer.groupement_spacial === "oui"
                              ? `/listcompter_OffresEmplois_special?groupement_id=${offer.id}`
                              : offer.client__special
                              ? `/ClientSpeciele/${encodeURIComponent(
                                  offer.client__nom
                                )}/${offer.id}`
                              : `/DetailOffreEmploi/${offer.id}`
                          }
                          className="font-weight-bold"
                          style={{ textDecoration: "none" }}
                        >
                          <div className="row row1">
                            <div
                              style={{ width: "38px" }}
                              className="pl-0 pr-0 text-center align-self-center"
                            >
                              <img
                                src={offer.client__logo}
                                alt=""
                                className="logoappleoffre"
                              />
                            </div>
                            <div className="col-sm-9 p-0 d-flex flex-wrap">
                              <div
                                className="font-weight-lighter align-self-center text-dark"
                                style={{
                                  marginBottom: "0px",
                                  fontSize: "11px",
                                  ...marginStart(isRTL ? "19px" : "4px"),
                                }}
                              >
                             {offer.titre_entreprise ? offer.titre_entreprise : offer.client__nom}
                              </div>
                            </div>
                          </div>
                          <div className="post-card-content post-card-heading mb-1 sizeBd">
                            {offer.groupement_spacial === "oui" ? (
                              <p className="textemploisecard">
                                {offer.titre_groupement_cpacial}
                              </p>
                            ) : (
                              <>
                                <p
                                  className="textemploisecard toptitre"
                                  dangerouslySetInnerHTML={{
                                    __html: offer.titre,
                                  }}
                                />
                                {offer.si_principal &&
                                  offer.offres_liees.length > 0 && (
                                    <div className="textemploisecard titregroupemlois">
                                      {offer.offres_liees.map((linked, idx) => (
                                        <p key={idx}>
                                          <a
                                            href={offer.client__special
                                                    ? `/ClientSpeciele/${encodeURIComponent(
                                                        offer.client__nom
                                                      )}/${linked.id}`
                                                    : `/DetailOffreEmploi/${linked.id}`}
                                              // `/DetailOffreEmploi/${linked.id}`}
                                            className="textnone"
                                          >
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: linked.titre,
                                              }}
                                            />
                                          </a>
                                        </p>
                                      ))}
                                    </div>
                                  )}
                              </>
                            )}
                          </div>
                          <div className="post-card-limit small">
                            <span
                              className="text-danger datelimitappleoffre"
                              style={{
                                fontSize: "9.6px",
                                marginLeft: "3px",
                                lineHeight: "1",
                                marginTop: "2px"
                              }}
                            >
                              <i className="far fa-clock"></i>{" "}
                              {formatDateLimite(offer.date_limite)}
                            </span>
                            <span className="lieuappleoffre" style={{ marginTop: "2px"}}>
                              <i className="fas fa-map-marker-alt "></i>{" "}
                              {offer.lieu}
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                className="btn btn-sm btn-primary shadow-sm mt-2 mb-0 btnoffreemplois textnone"
                href="/listcompter_OffresEmplois"
              >
                {t("voir_liste_complete")}
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3 order-3 order-md-3">
          <div className="card" style={{ padding: "5px" }}>
            <div className="pr-1 pl-2 bgCard_offre pt-0">
              <span className="titrecol avisinfo">{t("avis_infos")}</span>
              {avisInfos.length === 0 ? (
                <p className="text-center">{t("aucun_avis_infos")}</p>
              ) : (
                <div className="row">
                  {avisInfos.map((avis, index) => (
                    <div key={index} className="col-12">
                      <div className="card post-card pb-1 sectionavisinfo">
                        <div className="card-bod " style={{ padding: "2px" }}>
                          <a
                            href={
                              avis.avis_fixe && avis.lien
                                ? avis.lien
                                : avis.client__special
                                ? `/ClientSpecielAvis/${encodeURIComponent(
                                    avis.client__nom
                                  )}/${avis.id}`
                                : `/avis-infos/${avis.id}`
                            }
                            className="textnone"
                            target={avis.avis_fixe ? "_blank" : "_self"} // Ouvre dans un nouvel onglet si avis_fixe est true
                            rel={avis.avis_fixe ? "noopener noreferrer" : ""}
                          >
                            <div className="row" style={{ marginLeft: "1px" }}>
                              <div
                                style={{ width: "38px" }}
                                className="pl-0 pr-0 text-center align-self-center"
                              >
                                <img
                                  src={avis.client__logo}
                                  alt=""
                                  className="logoappleoffre"
                                />
                              </div>
                              <div className="col-sm-9 p-0 d-flex flex-wrap">
                                <div
                                  className="fw-bold align-self-center"
                                  style={{
                                    marginBottom: "0px",
                                    fontSize: "11px",
                                    color: "#0C74CC",
                                    ...marginStart(isRTL ? "19px" : "4px"),
                                  }}
                                >
                                  {avis.client__nom}
                                </div>
                              </div>
                            </div>
                            <div className="post-card-heading sizeBd mbavis">
                              <div className="toptitre">
                                <p
                                  className="textavis"
                                  dangerouslySetInnerHTML={{
                                    __html: avis.titre,
                                  }}
                                />
                              </div>
                              {avis.si_principal &&
                                avis.avis_liees.length > 0 && (
                                  <div className="titregroup" style={{ marginTop: "-15px" }}>
                                    {avis.avis_liees.map((linked, idx) => (
                                      <div key={idx} style={{ marginBottom: "-15px", marginLeft: "-3px" }}>
                                        <a
                                          href={avis.client__special
                                                    ? `/ClientSpecielAvis/${encodeURIComponent(
                                                        avis.client__nom
                                                      )}/${linked.id}`
                                                    : `/avis-infos/${linked.id}`
                                                  }
                                            
                                            
                                            // `/avis-infos/${linked.id}`}
                                          className="textnone textavis"
                                        >
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: linked.titre,
                                            }}
                                          />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <a
                style={{
                  background: "#4E73DF",
                  width: "95%",
                  marginLeft: "5px",
                  padding: "8px",
                  textDecoration: "none",
                }}
                className="btn btn-sm btn-primary shadow-sm mt-2 mb-0"
                href="/listcompter_AvisInfos"
              >
                {t("voir_liste_complete")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintemplate;