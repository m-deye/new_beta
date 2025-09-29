import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ConseilsRH.css";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Beta_conseil = () => {
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
                {isRTL ? "تقديم بيتا-كونسيل" : "Présentation Beta-conseils"}
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
                    بيتا كونسيل (مكتب الدراسات التقنية والمساعدة)، المالك والناشر
                    لموقع Beta.mr، هو مكتب دراسات بموجب القانون الموريتاني تم
                    إنشاؤه برأس مال اجتماعي قدره 5.000.000 أوقية. مهمتنا هي تقديم
                    مساعدة تقنية عالية الجودة في المجالات التالية: 1- توفير
                    الملفات الشخصية المؤهلة: يمكن لبيتا كونسيل توفير، في فترات
                    قصيرة، ملفات شخصية مؤهلة في مجالات متنوعة (الهندسة، الاقتصاد،
                    المالية، التنمية...)، بفضل قاعدة بياناتها التي تضم أكثر من
                    3000 سيرة ذاتية عبر الإنترنت، تشمل جميع التخصصات 2- تسهيل
                    الوصول إلى المعلومات الاقتصادية والتقنية: تقدم بيتا كونسيل
                    إجابة مناسبة لاحتياجات مكاتب الدراسات الوطنية والأجنبية في
                    مجال المعلومات في إطار عروضها وأعمالها المطلوبة في موريتانيا
                    (الضرائب، بيانات السوق المحلي، البيئة، المناجم، قانون العمل،
                    قانون الجمارك، إلخ...) 3- المساعدة للشركات الجديدة: تقدم بيتا
                    كونسيل مساعدة ودعماً تقنياً للشركات الجديدة في عملياتها
                    الاستكشافية والتثبيت والبدء والتوسع. 4- المساعدة المحلية في
                    مجال اللوجستيك والدعم الميداني: تستفيد بيتا كونسيل من سمعة
                    ومعرفة البيئة التي تسمح لها بتقديم هذه المساعدة. لقد نفذت
                    بيتا كونسيل بالفعل مهام مع مكاتب ذات شهرة دولية في مجالات
                    هندسية متنوعة: أمثلة على المراجع
                  </p>
                ) : (
                  <p>
                    Beta Conseils Beta-conseils (Bureau d'Etudes Techniques et
                    d'Assistance), propriétaire et éditeur du site Beta.mr, est un
                    bureau d'études de droit Mauritanien créé avec un capital
                    social de 5.000.000 d'ouguiyas. Notre vocation est de fournir
                    une assistance technique de qualité dans des domaines suivants
                    : 1- Mise à disposition de profils qualifiés : Beta-conseils
                    peut fournir, en des délais courts, des profils qualifiés dans
                    des domaines diversifiés (ingénieries, économie, finances,
                    développement…), grâce à sa base de données de plus de 3000
                    Cvs en ligne, toutes spécialités confondues 2- Facilitation de
                    l'accès à l'information économique et technique :
                    Beta-conseils apporte une réponse adaptée aux besoins des
                    bureaux d'études nationaux et étrangers en matière
                    d'informations dans le cadre de leurs soumissions et travaux
                    lancés en Mauritanie (fiscalité, données sur le marché local,
                    environnement, mines, droit de travail, droit de douanes,
                    etc…) 3- Assistance aux nouvelles sociétés : Beta-conseils
                    fournit une assistance et un appui techniques aux nouvelles
                    sociétés dans leurs processus de prospection, d'installation,
                    de démarrage et d'extension. 4- Assistance locale en matière
                    de logistique et d'appui sur le terrain: Beta-conseils
                    bénéficie d'une renommée et d'une connaissance de
                    l'environnement lui permettant d'apporter cette assistance.
                    Beta-conseils a déjà réalisé des missions avec des bureaux de
                    renommée internationale dans divers domaines d'ingénierie :
                    Exemples de références
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

export default Beta_conseil;
