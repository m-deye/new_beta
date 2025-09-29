import React, { useState, useEffect } from "react";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axiosInstance from "./api/axiosInstance";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [publicites, setPublicites] = useState([]);
  const lang = i18n.language.split("-")[0];
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/publicites/")
      .then((response) => setPublicites(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des publicités :", error)
      );
  }, []);

  const handleLanguageChange = (newLang) => {
    i18n.changeLanguage(newLang);
    navigate("/");
  };

  return (
    <header
      className={`container bg-white ${isRTL ? "rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Première ligne : Logo, Carrousel et Réseaux sociaux */}
      <div className="row align-items-center">
        {/* Colonne 1 : Logo (masqué sur mobile) */}
        <div className="col-md-2 pt-2 d-none d-md-block">
          <img
            className="img_logo"
            src="https://beta.mr/modules/cms/img/logo_beta.jpg"
            alt="Logo"
          />
        </div>

        {/* Colonne 2 : Carrousel */}
        <div className="col-md-8 col-12 pt-1">
          <div
            id="carouselExampleFade"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
          >
            {/* Contenu du carrousel */}
            <div className="carousel-inner">
              {publicites.map((pub, index) => (
                <div
                  key={pub.id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img src={pub.image} className="carousel-img" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Indicateurs du carrousel (placés sous le carrousel) */}
          <div className="text-center mt-2">
            <ol
              className="carousel-indicators"
              style={{
                position: "static",
                marginTop: "10px",
              }}
            >
              {publicites.map((pub, index) => (
                <li
                  key={pub.id}
                  data-target="#carouselExampleFade"
                  data-slide-to={index}
                  className={index === 0 ? "active" : ""}
                ></li>
              ))}
            </ol>
          </div>
        </div>

        {/* Colonne 3 : Réseaux sociaux (masqué sur mobile) */}
        <div className="col-md-2 text-center d-none d-md-block">
          <div>{t("suivez_nous")}</div>
          <div>
            <a
              href="//www.facebook.com/Betamr-101236631486169"
              target="_blank"
              rel="noreferrer"
              className="social-link text-dark"
            >
              <i className="fab fa-facebook" style={{ color: "#0c88ef" }}></i>
            </a>
            <a
              href="//www.linkedin.com/company/beta-mr/"
              target="_blank"
              rel="noreferrer"
              className="social-link text-dark"
            >
              <i className="fab fa-linkedin" style={{ color: "#0a66c2" }}></i>
            </a>
          </div>
          <div className="top-header-right text-center mt-2">
            {lang === "fr" && (
              <a
                onClick={() => handleLanguageChange("ar")}
                className="font-weight-bold"
                style={{
                  fontSize: "20px",
                  color: "#0c96b1",
                  cursor: "pointer",
                }}
              >
                العربية
              </a>
            )}
            {lang === "ar" && (
              <a
                onClick={() => handleLanguageChange("fr")}
                className="font-weight-bold"
                style={{
                  fontSize: "20px",
                  color: "#0c96b1",
                  cursor: "pointer",
                }}
              >
                Français
              </a>
            )}
          </div>
          <div className="top-header-right text-center mt-1">
            <a
              href="//www.beta-conseils.com"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "18px", color: "#0c96b1" }}
            >
              beta 2
            </a>
          </div>
        </div>
      </div>

      {/* Deuxième ligne : Liens sociaux pour mobile */}
      <div className="row d-md-none mt-3">
        <div className="col-12 text-center">
          <div className="d-flex justify-content-center align-items-center">
            <span className="mr-2">Suivez-nous</span>
            <a
              href="//www.facebook.com/Betamr-101236631486169"
              target="_blank"
              rel="noreferrer"
              className="social-link text-dark"
            >
              <i className="fab fa-facebook" style={{ color: "#0c88ef" }}></i>
            </a>
            <a
              href="//www.linkedin.com/company/beta-mr/"
              target="_blank"
              rel="noreferrer"
              className="social-link text-dark"
            >
              <i className="fab fa-linkedin" style={{ color: "#0a66c2" }}></i>
            </a>
            <button
              onClick={() => handleLanguageChange("ar")}
              style={{ fontSize: "20px", color: "#0c96b1", cursor: "pointer" }}
            >
              العربية
            </button>
            <button
              onClick={() => handleLanguageChange("fr")}
              style={{ fontSize: "20px", color: "#0c96b1", cursor: "pointer" }}
            >
              Français
            </button>
          </div>
        </div>
      </div>

      {/* Bandeau final */}
      <div className="col-md-12 mt-3 text-center">
        <h5 style={{ color: "#233a94" }}>
          <b>{t("titre")}</b>
        </h5>
        <img
          src="https://beta.mr/img/header1.jpg"
          className="bandeau-img"
          alt="Bandeau"
        />
      </div>
    </header>
  );
};

export default Header;