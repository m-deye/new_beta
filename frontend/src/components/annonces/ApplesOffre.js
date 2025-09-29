import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OffreEmploi.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import Header from "../../Header";
import Navbar from "../../Navbar";
import Footer from "../../Footer";

// Composant réutilisable pour une carte d'appel d'offres
const OffreCard = ({ logo, entreprise, titre, date, type_s, id }) => {
  return (
    <div
      className="col-sm-12 col-md-6"
      style={{ marginBottom: "10px", paddingRight: "20px" }}
    >
      <div className="card post-card pb-1" style={{ height: "100%" }}>
        <div className="card-bod" style={{ padding: "2px" }}>
          <div className="card-badge">{type_s}</div>
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

const ApplesOffre = () => {
  const [offres, setOffres] = useState([]);
  const { client__nom } = useParams(); // Récupérer le paramètre "client__nom" de l'URL

  // useEffect(() => {
  //   // Construire l'URL de l'API en fonction du filtre
  //   let apiUrl = `http://127.0.0.1:8000/appels_offres/annonces_parclient/?client=${encodeURIComponent(client__nom)}`;

  //   // Fonction pour récupérer les offres
  //   const fetchOffres = async () => {
  //     try {
  //       const response = await fetch(apiUrl);
  //       if (!response.ok) {
  //         throw new Error('Erreur lors de la récupération des données');
  //       }
  //       const data = await response.json();
  //       setOffres(data);
  //     } catch (error) {
  //       console.error("Erreur de chargement:", error);
  //     }
  //   };

  //   fetchOffres(); // Appelle la fonction au chargement du composant
  // }, [client__nom]); // Déclencher un nouvel appel si le paramètre de l'URL change

  useEffect(() => {
    // Construire l'URL de l'API en fonction du filtre
    const apiUrl = `/appels_offres/annonces_parclient/?client=${encodeURIComponent(
      client__nom
    )}`;

    // Fonction pour récupérer les offres
    const fetchOffres = async () => {
      try {
        const response = await axiosInstance.get(apiUrl);
        setOffres(response.data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    if (client__nom) {
      fetchOffres(); // Appelle la fonction au chargement du composant
    }
  }, [client__nom]); // Déclencher un nouvel appel si le paramètre de l'URL change

  return (
    <div>
      <Header />
      <Navbar />
      <div className="container py-4" style={{ background: "#fff" }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-beta" style={{ color: "#0C96B1" }}>
                Liste des appels d'offres
              </h1>
            </div>
            <div className="row px-lg-4 px-0">
              {offres.map((offre, index) => (
                <OffreCard
                  key={index}
                  logo={offre.client__logo}
                  id={offre.id}
                  entreprise={offre.client__nom}
                  titre={offre.titre}
                  date={offre.date_limite}
                  badgeText={offre.badgeText}
                  type_s={offre.type_s}
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

export default ApplesOffre;
