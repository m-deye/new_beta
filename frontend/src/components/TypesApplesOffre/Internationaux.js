import React, { useState, useEffect } from "react"; // Import useState and useEffect
import "./Internationaux.css";
import { useTranslation } from "react-i18next";
import Header from "../../Header";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import axiosInstance from "../../api/axiosInstance";

// Composant réutilisable pour une carte d'appel d'offres
const OffreCard = ({ logo, entreprise, titre, date, type, id }) => {
  return (
    <div
      className="col-sm-12 col-sm-1 col-md-6"
      style={{ marginBottom: "10px", paddingRight: "20px" }}
    >
      <div className="card post-card pb-1" style={{ height: "100%" }}>
        <div className="card-bod card-bod1" style={{ padding: "2px" }}>
          <div className="card-badge">{type}</div>
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
                <div className=" text-beta sizeBd mb-1 titre1">
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
                  style={{ marginTop: "-15px", fontSize: "9.6px" }}
                >
                  <span className="text-danger">
                    <i className="far fa-clock"></i> {date}
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

// Composant principal
const Internationaux = () => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [offres, setOffres] = useState([]); // Déclare un état pour stocker les offres
  const formatDateSimple = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);

    // Choix du locale
    const locale = i18n.language === "ar" ? "ar-EG" : "fr-FR";

    // On ajoute numberingSystem:'latn' pour les chiffres occidentaux en arabe
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      numberingSystem: i18n.language === "ar" ? "latn" : undefined,
    };
    return new Intl.DateTimeFormat(locale, options).format(date);
  };
  // useEffect(() => {
  //   // Fonction pour récupérer les offres
  //   const fetchOffres = () => {
  //     fetch("http://127.0.0.1:8000/appels_offres/liste_type/?type=Internationaux")
  //       .then((response) => response.json())
  //       .then((data) => setOffres(data)) // Met à jour l'état avec les données récupérées
  //       .catch((error) => console.error("Erreur de chargement:", error));
  //   };

  //   fetchOffres(); // Appelle la fonction au chargement du composant
  // }, []);

  useEffect(() => {
    // Fonction pour récupérer les offres
    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get(
          `/appels_offres/liste_type/?type=internationaux&lang=${i18n.language}`
        );
        setOffres(response.data); // Met à jour l'état avec les données récupérées
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    fetchOffres(); // Appelle la fonction au chargement du composant
  }, [i18n.language]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "rtl" : ""}>
      <Header />
      <Navbar />
      <div
        className="container  container1 py-4"
        style={{ background: "#fff" }}
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-beta" style={{ color: "#0C96B1" }}>
                {t("Liste_offres_internationaux")}
              </h1>
            </div>
            <div className="row px-lg-4 px-0">
              {offres.map((offre, index) => (
                <OffreCard
                  key={index}
                  logo={offre.client__logo}
                  entreprise={offre.titre_entreprise}
                  titre={offre.titre}
                  date={formatDateSimple(offre.date_limite)}
                  type={t("internationaux")}
                  id={offre.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Internationaux;
