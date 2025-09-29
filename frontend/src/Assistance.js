import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Assistance.css";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Assistance = () => {
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
              {isRTL
                ? "المساعدة في البحث عن عمل"
                : "Assistance pour la recherche d’emploi"}
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
                    يضع موقع www.beta.mr تحت تصرف الفاعلين الاقتصاديين معلومات
                    متخصصة تتعلق بتطور السوق:
                  </p>
                  <p>
                    <strong>1- الأخبار الاقتصادية:</strong> الانتقاء اليومي
                    للمعلومات التي تهم الفاعلين الاقتصاديين (مشاريع جديدة،
                    اكتشافات معدنية، تمويلات جديدة، إلخ...) وكذا المعلومات
                    المتعلقة بمنح صفقات مهمة في موريتانيا.
                  </p>
                  <p>
                    <strong>2- المناقصات:</strong> يتم نشر المناقصات المحلية
                    والدولية وتحديثها يوميا.
                  </p>
                  <p>
                    <strong>3- المواضيع المنتقاة:</strong> انتقاء المواضيع
                    المتعلقة بالاقتصاد الموريتاني والمنشورة في الصحافة المحلية
                    والدولية.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Des conseils sont fournis périodiquement sur le site de Beta
                    en ce qui concerne les techniques de recherche d'emploi
                    (confection de CVs, rédaction de lettres de motivation,
                    guide d'entretien...).
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Bannière */}
          <div className="col-md-4 d-flex justify-content-center align-items-start">
            <div
              className="card cards  bg-light w-100"
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

export default Assistance;
