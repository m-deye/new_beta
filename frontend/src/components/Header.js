import React from "react";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Header = () => {
  return (
    <header className="container bg-white">
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
           
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  id="avatar"
                  src="https://beta.mr/pub/41.gif"
                  className="carousel-img"
                  alt="Bannière"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne 3 : Réseaux sociaux (masqué sur mobile) */}
        <div className="col-md-2 text-center d-none d-md-block">
          <div>Suivez-nous</div>
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
            <a
              href="https://beta.mr/lang/ar"
              className="font-weight-bold"
              style={{ fontSize: "20px", color: "#0c96b1" }}
            >
              العربية
            </a>
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
            <a
              href="https://beta.mr/lang/ar"
              className="font-weight-bold mx-3"
              style={{ fontSize: "20px", color: "#0c96b1" }}
            >
              العربية
            </a>
            <a
              href="//www.beta-conseils.com"
              style={{ fontSize: "18px", color: "#0c96b1" }}
              target="_blank"
              rel="noreferrer"
            >
              beta 2
            </a>
          </div>
        </div>
      </div>

      {/* Bandeau final */}
      <div className="col-md-12 mt-3 text-center">
        <h5 style={{ color: "#233a94" }}>
          <b>أول بوابة موريتانية للتوظيف والاخبار الاقتصادية</b>
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
