import { createContext, useContext, useState } from "react";
import "./Navbar.css"; // Styles
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = ({ profileData }) => {
  const location = useLocation();
  // Utiliser profileData (depuis props) si disponible, sinon location.state.profileData
  const data = profileData || location.state?.profileData || {};

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBetaOpen, setIsBetaOpen] = useState(false);
  const [isRHOpen, setIsRHOpen] = useState(false);
  const [isOutilsOpen, setIsOutilsOpen] = useState(false);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    // <div className="container">
    <nav
      dir={isRTL ? "rtl" : "ltr"} // ← bascule direction du texte
      className={`${
        isRTL ? "rtl" : ""
      } container p-0 navbar navbar-expand-lg navbar-dark bgHead navSize`}
      id="topHeader"
    >
      <div className="container-fluid ">
        {/* Bouton pour mobile */}
        <button
          className={`navbar-toggler bg-beta ${isMenuOpen ? "active" : ""}`}
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenu principal */}
        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="mainHeaderContent"
        >
          <ul
            className={`navbar-nav navbar-light ${
              isRTL ? "ms-auto" : "me-auto"
            }`}
          >
            <li className="nav-item active fw-bold">
              <Link to="/" className="nav1 " style={{ textDecoration: "none" }}>
                {t("Accueil")}
              </Link>
            </li>

            {/* Menu Beta */}
            <div className="dropdown">
              <a
                href="#"
                className="dropdown-toggle text-white nav1 nav-link-padding-left fw-bold"
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsBetaOpen(!isBetaOpen);
                  setIsRHOpen(false);
                  setIsOutilsOpen(false);
                }}
              >
                {t("Beta")}
              </a>
              <div
                className={`dropdown-menu menuDrop ${isBetaOpen ? "show" : ""}`}
              >
                <a href="beta_mr" className="dropdown-items">
                  {t("beta_mr")}
                </a>
                <a href="beta_conseil" className="dropdown-items">
                  {t("Beta_Conseils")}
                </a>
              </div>
            </div>

            {/* Menu Services RH */}
            <div className="dropdown">
              <a
                href="#"
                className="dropdown-toggle text-white nav1 nav-link-padding-left fw-bold"
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsRHOpen(!isRHOpen);
                  setIsBetaOpen(false);
                  setIsOutilsOpen(false);
                }}
              >
                {t("Services_RH")}
              </a>
              <div
                className={`dropdown-menu menuDrop ${isRHOpen ? "show" : ""}`}
              >
                <a href="Recrutement" className="dropdown-items">
                  {t("Recrutement")}
                </a>
                <a href="ConseilsRH" className="dropdown-items">
                  {t("Beta_Conseils")}
                </a>
                <a href="Assistance" className="dropdown-items">
                  {t("Assistance_emploi")}
                </a>
              </div>
            </div>

            {/* Menu Outils */}
            <div className="dropdown">
              <a
                href="#"
                className="dropdown-toggle text-white  nav1 nav-link-padding-left fw-bold"
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOutilsOpen(!isOutilsOpen);
                  setIsBetaOpen(false);
                  setIsRHOpen(false);
                }}
              >
                {t("Outils")}
              </a>
              <div
                className={`dropdown-menu menuDrop ${
                  isOutilsOpen ? "show" : ""
                }`}
              >
                <a href="basecv" className="dropdown-items">
                  {t("Base_CV")}
                </a>
                <a href="Psychotechniques" className="dropdown-items">
                  {t("Tests_psycho")}
                </a>
                <a href="TestimonialForm" className="dropdown-items">
                  {t("Témoignez")}
                </a>
              </div>
            </div>

            <li className="">
              <a
                className="dropdown-toggle text-white nav1 nav-link-padding-left fw-bold"
                style={{ textDecoration: "none", color: "" }}
                href="Contact"
              >
                {t("Contact")}
              </a>
            </li>
          </ul>

          <nav>
            {data && (data.nom || data.username) ? (
              <div className="dropdown">
                <a
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{ cursor: "pointer" }}
                >
                  <h1
                    style={{
                      display: "inline",
                      fontSize: "15px",
                      color: "#ffffff",
                    }}
                  >
                    {data.username}{" "}
                    <i className="fas fa-caret-down fa-sm ml-1"></i>
                  </h1>
                </a>
                <div
                  className={`dropdown-menu menuDrop  ${
                    isRHOpen ? "show" : ""
                  } text-center`}
                  aria-labelledby="dropdownMenuButton"
                  style={{
                    marginLeft: "-105px",
                    padding: "10px",
                    borderRadius: "10px",
                    // backgroundColor: "#343a40",
                    width: "80px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  <Link
                    to="#"
                    onClick={goBack}
                    className="nav-link text-white"
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                    }}
                  >
                    <i className="fas fa-home fa-sm fa-fw mr-2 text-gray-400"></i>
                    Espace Perso
                  </Link>

                  <a
                    className="nav-link text-white"
                    href="/Login"
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                    }}
                  >
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Déconnexion
                  </a>
                </div>
              </div>
            ) : (
              <div className="main-header-right d-flex">
                <Link
                  to="/inscription"
                  className="custom-button spacing"
                  style={{ textDecoration: "none", marginTop: "2px" }}
                >
                  {t("Pré-Inscription")}
                </Link>
                <Link
                  to="/Login"
                  className="custom-button spacing"
                  style={{ textDecoration: "none", marginTop: "2px" }}
                >
                  {t("Se_connecter")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </nav>
    // {/* </div> */}
  );
};

export default Navbar;
