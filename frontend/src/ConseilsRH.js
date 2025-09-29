import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ConseilsRH.css";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ConseilsRH = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0]; // "fr" ou "ar"
  const isRTL = lang === "ar";
  const underlineColor = isRTL ? "#FFD600" : "#4CAF50";

  return (
    <div>
      <Header />
      <Navbar />

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`container py-5 ${isRTL ? "rtl" : ""}`}
        style={{ background: "#fff" }}
      >
        <div className="row" style={{ fontSize: "12px" }}>
          {/* Contenu principal */}
          <div className="col-md-8">
            <h4 className="home-heading mb-3" style={{ color: "#0C96B1" }}>
              {isRTL ? "نصائح الموارد البشرية" : "Conseils en RH"}
            </h4>
            <div
              className="underline mb-4"
              style={{
                width: "40px",
                height: "4px",
                backgroundColor: underlineColor,
                marginTop: "-10px",
              }}
            />

            <div className="text-justify">
              {isRTL ? (
                <>
                  <p>
                    بفضل المعرفة الجيدة بالبيئة المحلية بكل أبعادها وفريق من
                    المحترفين ذوي الخبرة في مجالات الموارد البشرية المختلفة،
                    تقدم بيتا المساعدة الاستشارية التي تغطي العديد من المجالات:
                    القانونية والإدارية والعلاقات العامة وغيرها.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Avec une bonne connaissance de l’environnement local dans
                    toutes ses dimensions et une équipe de professionnels
                    expérimentés dans divers volets RH, Beta offre une
                    assistance conseils couvrant plusieurs domaines : juridique,
                    administratif, relations publiques, etc…
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Bannière */}
          <div className="col-md-4 d-flex justify-content-center align-items-start">
            <div
              className="card cardconseil bg-light w-100"
              style={{ maxWidth: "280px" }}
            >
              <div className="card-body text-center py-5">
                <img
                  src="https://beta.mr/modules/cms/img/logo_default.png"
                  alt="Logo"
                  className="mb-3"
                />
                <div style={{ color: "#888", fontSize: "0.9rem" }}>
                  {isRTL
                    ? "لافتة إعلانية"
                    : "Place pour bannière publicitaire."}
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

export default ConseilsRH;
