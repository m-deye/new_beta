import React, { useEffect, useState } from "react";
import axios from "axios";

import axiosInstance from "../../api/axiosInstance";

const Statistics = ({ statistics, clientId }) => {
  const [nombreOffres, setNombreOffres] = useState(0);
  const [nombreApples, setNombreApples] = useState(0);
  const [nombreAvisInfos, setNombreAvisInfos] = useState(0);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       // Récupération du nombre d'offres d'emploi
  //       const responseOffres = await fetch(`http://127.0.0.1:8000/nombre/offreemplois_tous/`);
  //       const dataOffres = await responseOffres.json();
  //       if (responseOffres.ok) {
  //         setNombreOffres(dataOffres.nombre_offres);
  //       }

  //     } catch (error) {
  //       console.error("Erreur de connexion à l'API :", error);
  //     }
  //   };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/nombre/offreemplois_tous/");
        setNombreOffres(response.data.nombre_offres);
      } catch (error) {
        console.error("Erreur de connexion à l'API :", error);
      }
    };

    fetchStats();
  }, []); // Ajout du tableau de dépendances pour éviter les appels multiples

  //   fetchStats();
  // });

  return (
    <div className="row ms-3">
      {" "}
      {/* Conteneur principal pour les cartes */}
      {/* Carte 1 : Offres d'emploi */}
      <div className="mb-4 mt-3 " style={{ fontSize: "26px" }}>
        {" "}
        Tableau de bord
      </div>
      <div className="col-md-4">
        {" "}
        {/* Chaque carte occupe 1/3 de la ligne */}
        <div
          className="card border-left-primary shadow h-20 py-1"
          style={{ width: "200px", borderLeft: ".25rem solid #4e73df" }}
        >
          <div className="card-bod">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  <a
                    href="https://beta.mr/offres"
                    style={{ textDecoration: "none", fontSize: "11px" }}
                  >
                    Offres d'emploi
                  </a>
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {nombreOffres}{" "}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-calendar fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
