import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Recrutement.css";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Recrutement = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0]; // "fr" ou "ar"
  const isRTL = lang === "ar";

  // Couleurs des soulignements
  const underlineColor = isRTL ? "#FFD600" : "#4CAF50";

  return (
    <div>
      <Header />
      <Navbar />

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`recruitment-page container py-5 ${isRTL ? "rtl" : ""}`}
        style={{ background: "#fff" }}
      >
        <div className="row" style={{ fontSize: "12px" }}>
          {/* Contenu principal */}
          <div className="col-md-8">
            <h4 className="home-heading mb-3" style={{ color: "#0C96B1" }}>
              {isRTL
                ? "التوظيف والبحث بالرؤوس"
                : "Recrutement et chasse de tête"}
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
                    تقوم شركة Beta بالتوظيف لشركائها وفقًا لاحتياجاتهم: المديرين
                    التنفيذيين، المدراء المتوسطين، الفنيين، وتتولى كامل عملية
                    التوظيف.
                  </p>
                  <p>
                    <strong>التوظيف القياسي :</strong> يتضمن نشر إعلاناتكم على
                    الموقع، ما يتيح وصولًا سريعًا ومبرمجًا أمام جمهور مستهدف نشط
                    في البحث. نجري حملة تهدف إلى التحرك بسرعة وزيادة الكفاءة:
                    النشر على نسختي الموقع وإرسال رسائل قصيرة بالعربية
                    والفرنسية.
                  </p>
                  <p>
                    <strong>البحث عن الكفاءات :</strong> تُستخدم للبحث عن
                    المدراء التنفيذيين، وتهدف إلى تحديد المرشحين ذوي الإمكانيات
                    العالية في أسرع وقت.
                  </p>
                  <p>
                    <strong>تعتمد المنهجية على :</strong> قاعدة بيانات السير
                    الذاتية لدينا: أكثر من 4000 سيرة ذاتية، محدثة يوميًا، مع
                    إمكانية اختيار المرشحين بنقرة واحدة وفقًا للمعايير: التعليم،
                    الخبرة، الوظيفة، القطاع، والموقع.
                  </p>
                  <p>
                    <strong>النهج المباشر :</strong> معرفتنا التامة بالسوق
                    والمرشحين الباحثين عن عمل أو في حالة ترقب في موريتانيا أو في
                    الخارج تمكننا من استخدام هذا النهج للوظائف عالية المستوى.
                  </p>
                  <p>
                    <strong>المواهب الجديدة :</strong> مفهوم أطلقته Beta لتحديد
                    الكفاءات الشابة المتميزة من كبرى المدارس والجامعات، يتم
                    اختيارها سنويًا خلال منتدى الخريجين.
                  </p>
                  <p>
                    <strong>الشبكات والشركاء :</strong> نستفيد من شبكتنا
                    الواسعة: الجامعات، المدارس، ومراكز التعليم العالي.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Beta recrute pour ses partenaires suivant leurs besoins :
                    hauts cadres, cadres moyens, techniciens, et se charge de
                    tout le processus de recrutement.
                  </p>
                  <p>
                    <strong>Recrutement standard :</strong> Cette option
                    consiste en la mise en ligne de vos annonces. Elle permet
                    une action rapide, visible et programmée dans le temps
                    auprès d'une population ciblée, en recherche active. Nous
                    réalisons une campagne ayant pour objectif de pouvoir réagir
                    vite et de gagner en efficacité : mise en ligne sur les 2
                    versions du site et envoi par SMS en Arabe et Français.
                  </p>
                  <p>
                    <strong>Chasse de tête :</strong> Utilisée pour la recherche
                    de cadres dirigeants, cette méthode vise à identifier les
                    candidats à fort potentiel dans les meilleurs délais.
                  </p>
                  <p>
                    <strong>La méthodologie suivie repose sur :</strong> Notre
                    base de données de CVs : plus de 4000 CVs, cette base est
                    enrichie quotidiennement avec des CVs de toutes spécialités
                    et nationalités confondues, utilisant un moteur de recherche
                    multicritères, avec possibilité de sélectionner en un clic
                    les candidats correspondants à vos critères de recherche :
                    formation, expérience, fonction, secteur et localisation.
                  </p>
                  <p>
                    <strong>Approche directe :</strong> Notre parfaite
                    connaissance du marché et des candidats potentiels en
                    recherche ou en veille en Mauritanie ou résidant à
                    l’extérieur nous permet de recourir à cette approche pour
                    des postes de haut niveau.
                  </p>
                  <p>
                    <strong>Profils frais :</strong> Un concept lancé par Beta
                    qui consiste à identifier des jeunes compétences de haut
                    niveau sortant de grandes écoles ou universités, majors de
                    leurs promotions, ces profils sont sélectionnés et
                    identifiés annuellement lors du forum des lauréats organisé
                    par Beta.
                  </p>
                  <p>
                    <strong>Réseaux et partenaires :</strong> Nous pouvons
                    mettre à contribution notre vaste réseau de partenaires
                    (Universités, écoles, centres de formation supérieure).
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Bannière */}
          <div className="col-md-4 d-flex justify-content-center align-items-start">
            <div
              className="card cardrec bg-light w-100"
              style={{ maxWidth: "280px" }}
            >
              <div className="card-body text-center py-5">
                <img
                  src={
                    isRTL
                      ? "https://www.beta.mr/modules/cms/img/logo_default.png"
                      : "https://beta.mr/modules/cms/img/logo_default.png"
                  }
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

export default Recrutement;
