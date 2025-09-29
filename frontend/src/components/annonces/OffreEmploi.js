import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OffreEmploi.css";
import { useParams } from "react-router-dom";

import Header from "../../Header";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import axiosInstance from "../../api/axiosInstance";

// Composant réutilisable pour une carte d'appel d'offres
const OffreCard = ({ logo, entreprise, titre, date, type_offre, id, lieu }) => {
  return (
    <div
      className="col-sm-12 col-md-6"
      style={{ marginBottom: "10px", paddingRight: "20px" }}
    >
      <div className="card post-card pb-1" style={{ height: "100%" }}>
        <div className="card-bod" style={{ padding: "2px" }}>
          <div className="card-badge">{type_offre}</div>
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
                    href={`/DetailOffreEmploi/${id}`}
                    className="titleAnn font-weight-bold fw-bold"
                  >
                    <p
                      className="mb-0"
                      dangerouslySetInnerHTML={{ __html: titre }}
                    ></p>
                  </a>
                </div>
                <div className=" small dateleiu">
                  <span className="text-danger">
                    <i className="far fa-clock"></i> {date}
                  </span>
                  <span className="lieuappleoffre" style={{ color: "#0C74CC" }}>
                    <i className="fas fa-map-marker-alt "></i> {lieu}
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

const OffreEmploi = () => {
  const [offres, setOffres] = useState([]);
  const location = useLocation(); // Récupérer les paramètres de l'URL
  const { client__nom } = useParams(); // Récupérer le paramètre depuis l'URL
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get(
          `/annonces_parclient/${client__nom}/`
        );
        setOffres(response.data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    if (client__nom) {
      fetchOffres();
    }
  }, [client__nom]);

  return (
    <div>
      <Header />
      <Navbar />
      <div className="container py-4" style={{ background: "#fff" }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-beta" style={{ color: "#0C96B1" }}>
                Offres d'emploi
              </h1>
            </div>
            <div className="row px-lg-4 px-0">
              {offres.map((offre, index) => (
                <OffreCard
                  key={index}
                  logo={offre.client__logo}
                  entreprise={offre.client__nom}
                  titre={offre.titre}
                  date={offre.date_limite}
                  badgeText={offre.badgeText}
                  id={offre.id}
                  type_offre={offre.type_offre}
                  lieu={offre.lieu}
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

export default OffreEmploi;
