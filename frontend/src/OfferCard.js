import React, { useState, useEffect } from "react";
import "./OfferCard.css";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import ar from "date-fns/locale/ar";
import axiosInstance from "./api/axiosInstance";
import { useTranslation } from "react-i18next";

const OfferCard = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0]; // "fr" or "ar"
  const isRTL = lang === "ar";
  const underlineColor = isRTL ? "#FFD600" : "#4CAF50";

  const [offres, setOffres] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offresRes, avisRes, appelsRes] = await Promise.all([
          axiosInstance.get(`/api/offres-fixes/?lang=${lang}`),
          axiosInstance.get(`/api/avis-fixes/?lang=${lang}`),
          axiosInstance.get(`/api/appels-fixes/?lang=${lang}`),
        ]);

        const offres = offresRes.data.map((item) => ({
          ...item,
          type: "offre",
        }));
        const avis = avisRes.data.map((item) => ({ ...item, type: "avis" }));
        const appels = appelsRes.data.map((item) => ({
          ...item,
          type: "appel",
        }));

        // Fusionner et dédupliquer par (type, id)
        const combinedOffres = [...offres, ...avis, ...appels].filter(
          (item, idx, arr) =>
            idx === arr.findIndex((x) => x.type === item.type && x.id === item.id)
        );
        setOffres(combinedOffres);

        // Afficher le nombre total d'éléments dans la console
        console.log(
          isRTL ? "العدد الإجمالي للعناصر (المؤشرات)" : "Nombre total d'éléments (indicateurs) :",
          combinedOffres.length
        );
      } catch (error) {
        console.error(
          isRTL ? "خطأ في استرجاع البيانات" : "Erreur lors de la récupération des données :",
          error
        );
      }
    };

    fetchData();
  }, [lang]); // Re-fetch data when language changes

  useEffect(() => {
    if (offres.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === offres.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [offres.length]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? offres.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === offres.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "offre":
        return "bg-primary";
      case "avis":
        return "bg-success";
      case "appel":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="cardFixed">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`card py-1 px-1 ${isRTL ? "rtl" : ""}`}
        style={{ textAlign: isRTL ? "right" : "left" }}
      >
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-inner">
            {offres.map((offre, index) => (
              <div
                key={`${offre.type}-${offre.id}`}
                className={`carousel-item ${index === activeIndex ? "active" : ""}`}
              >
                <div className="col-md-12">
                  <div className="row align-items-center">
                    <div className="col-md-2 text-center">
                      <img
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                        src={offre.client__logo || "/default-logo.png"}
                        alt="Logo"
                      />
                    </div>
                    <div className="col-md-10">
                      <div className="d-flex flex-column gap-1">
                        {(() => {
                          let link = "#";
                          if (offre.type === "avis") {
                            link = `/avis-infos/${offre.id}`;
                          } else if (offre.type === "appel") {
                            link = `/appel-offre/${offre.id}`;
                          } else if (offre.type === "offre") {
                            link = `/DetailOffreEmploi/${offre.id}`;
                          }

                          return (
                            <a
                              href={link}
                              className="fw-bold mt-1"
                              style={{
                                fontSize: "12px",
                                textDecoration: "none",
                              }}
                              dangerouslySetInnerHTML={{ __html: offre.titre }}
                            />
                          );
                        })()}
                        <span
                          className="offer-desc"
                          style={{ marginTop: "-20px", fontSize: "11px" }}
                        >
                          {offre.client_nom}
                        </span>
                        {offre.type !== "avis" && (
                          <span
                            className="text-danger"
                            style={{ fontSize: "10px" }}
                          >
                            {isRTL ? "تاريخ الانتهاء" : "Date limite"} :{" "}
                            {offre.date_limite
                              ? format(new Date(offre.date_limite), "dd/MM/yyyy", {
                                  locale: isRTL ? ar : fr,
                                })
                              : "N/A"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="row justify-content-center fixer">
          <ol className="carousel-indicators">
            {offres.map((_, index) => (
              <li
                key={index}
                className={index === activeIndex ? "active" : ""}
                onClick={() => handleIndicatorClick(index)}
              ></li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;