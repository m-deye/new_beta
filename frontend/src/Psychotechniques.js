import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ConseilsRH.css";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";
const Psychotechniques = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0]; // "fr" or "ar"
  const isRTL = lang === "ar";
  const underlineColor = isRTL ? "#FFD600" : "#4CAF50";

  return (
    <div>
      <Header />
      <Navbar />

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`container py-4 ${isRTL ? "rtl" : ""}`}
        style={{ background: "#fff" }}
      >
        <div className="row" style={{ fontSize: "12px" }}>
          <div className="col-md-8 textAlign">
            <h4 className="text-beta home-heading mb-0 betamr">
              <span>
                {isRTL ? "الاختبارات النفسية التقنية" : "Tests Psychotechniques"}
              </span>
              <div
                className="underline mb-3"
                style={{
                  width: "40px",
                  height: "4px",
                  backgroundColor: underlineColor,
                  marginTop: "5px",
                  marginRight: isRTL ? "0" : "auto",
                  marginLeft: isRTL ? "auto" : "0",
                }}
              />
            </h4>
            <div className="row listing-table" style={{ textAlign: isRTL ? "right" : "left" }}>
              <div className="col-12">
                {isRTL ? (
                  <p>
                    الاختبارات النفسية التقنية: بيتا كونسيل هو الممثل الحصري في
                    موريتانيا لـ Sigmund.net المتخصص في حلول الموارد البشرية، أول
                    ناشر أوروبي لاختبارات تقييم الكفاءات المهنية.
                  </p>
                ) : (
                  <p>
                    Tests psychotechniques : Beta conseils est le représentant
                    exclusif en Mauritanie de Sigmund.net spécialiste en solution
                    RH, premier éditeur Européen de tests d'évaluation des
                    compétences professionnelles.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 text-center textAlign mt-sm-3">
            <div className="card text-center bg-light">
              <div className="card-body py-5">
                <div className="text-center pb-3">
                  <img
                    className=""
                    src={
                      isRTL
                        ? "https://www.beta.mr/modules/cms/img/logo_default.png"
                        : "https://beta.mr/modules/cms/img/logo_default.png"
                    }
                    alt="Logo"
                  />
                </div>
                <a href="#" className="stretched-link text-secondary">
                  {isRTL
                    ? "مكان للافتة <br /> إعلانية."
                    : "Place pour Bannière <br /> publicitaire."}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Psychotechniques;
