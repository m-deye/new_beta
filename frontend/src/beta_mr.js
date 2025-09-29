import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ConseilsRH.css";

import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";

const Beta_mr = () => {
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
        <div className="row">
          <div className="col-md-8 textAlign">
            <h4 className="text-beta home-heading mb-0 betamr">
              <span>
                {isRTL ? "تقديم بيتا" : "Présentation du BETA"}
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
            <div className="row listing-table" style={{ fontSize: "12px", textAlign: isRTL ? "right" : "left" }}>
              <div className="col-12">
                {isRTL ? (
                  <p>
                    www.beta.mr، البوابة الأولى للتوظيف والمعلومات الاقتصادية في
                    موريتانيا، هو موقع أطلق في عام 1999 من قبل مكتب الدراسات
                    التقنية والمساعدة بيتا-كونسيل، رائد في مجال خدمات الموارد
                    البشرية عبر الإنترنت في موريتانيا، يضع www.beta.mr تحت تصرف
                    الشركات والمرشحين مجموعة من خدمات الموارد البشرية :<br></br>
                    <div className="row" style={{ direction: "rtl" }}>
                      {/* Colonne Candidats - à droite pour l'arabe */}
                      <div className="col-md-6 mb-3">
                        <h5 className="text-success" style={{ marginRight: "1rem" }}>المرشحون :</h5>
                        <ul className="list-unstyled" style={{ marginRight: "1rem" }}>
                          <li>- عروض العمل</li>
                          <li>- رفع وإدارة سيرهم الذاتية</li>
                          <li>- المساعدة في البحث عن عمل</li>
                        </ul>
                      </div>

                      {/* Colonne Entreprises - à gauche pour l'arabe */}
                      <div className="col-md-6 mb-3">
                        <h5 className="text-primary" style={{ marginRight: "1rem" }}>الشركات :</h5>
                        <ul className="list-unstyled" style={{ marginRight: "1rem" }}>
                          <li>- التواصل في الموارد البشرية (الإعلانات)</li>
                          <li>- التوظيف والبحث بالرؤوس</li>
                          <li>- استشارات الموارد البشرية</li>
                        </ul>
                      </div>
                    </div>
                    طورت بيتا أدوات محددة، وبدأت إجراءات وأقامت شراكات تسمح لها
                    بتحسين مستمر لمنتجاتها والحصول على سمعة إيجابية لدى عملائها
                    وشركائها وطالبي العمل.
                  </p>
                ) : (
                  <p>
                    www.beta.mr, Premier portail de recrutement et d'informations
                    économiques en Mauritanie, est un site lancé en 1999 par le
                    bureau d'études techniques et d'Assistance Beta-conseils,
                    Pionnier dans le domaine des services RH en ligne en
                    Mauritanie, www.beta.mr met à la disposition des entreprises
                    et des candidats une gamme des services RH :<br></br>
                    <div className="row">
                      {/* Colonne Entreprises */}
                      <div className="col-md-6 mb-3">
                        <h5 className="text-primary ms-3">Entreprises :</h5>
                        <ul className="list-unstyled ms-3">
                          <li>- Communication RH (annonces)</li>
                          <li>- Recrutement et chasse de tête</li>
                          <li>- Conseils RH</li>
                        </ul>
                      </div>

                      {/* Colonne Candidats */}
                      <div className="col-md-6 mb-3">
                        <h5 className="text-success ms-3">Candidats :</h5>
                        <ul className="list-unstyled ms-3">
                          <li>- Offres d'emploi</li>
                          <li>- Mise en ligne et gestion de leurs CV</li>
                          <li>- Assistance pour recherche d'emploi</li>
                        </ul>
                      </div>
                    </div>
                    Beta a développé des outils spécifiques, initié des actions et
                    noué des partenariats lui permettant une amélioration continue
                    des ses produits et avoir une réputation positive auprès de
                    ses clients, partenaires et demandeurs d'emploi.
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

export default Beta_mr;