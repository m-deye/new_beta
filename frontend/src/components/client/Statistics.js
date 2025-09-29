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
  //       const responseOffres = await fetch(`http://127.0.0.1:8000/nombre/offreemplois/${clientId}/`);
  //       const dataOffres = await responseOffres.json();
  //       if (responseOffres.ok) {
  //         setNombreOffres(dataOffres.nombre_offres);
  //       }

  //       // Récupération du nombre d'appels d'offres
  //       const responseApples = await fetch(`http://127.0.0.1:8000/appels_offres/nombre/apples_offres/${clientId}/`);
  //       const dataApples = await responseApples.json();
  //       if (responseApples.ok) {
  //         setNombreApples(dataApples.nombre_apples);
  //       }

  //       // Récupération du nombre d'avis et infos
  //       const responseAvisInfos = await fetch(`http://127.0.0.1:8000/avis_infos/nombre/avis_infos/${clientId}/`);
  //       const dataAvisInfos = await responseAvisInfos.json();
  //       if (responseAvisInfos.ok) {
  //         setNombreAvisInfos(dataAvisInfos.nombre_avis_infos);
  //       }
  //     } catch (error) {
  //       console.error("Erreur de connexion à l'API :", error);
  //     }
  //   };

  //   fetchStats();
  // }, [clientId]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [offresRes, appelsRes, avisInfosRes] = await Promise.all([
          axiosInstance.get(`/nombre/offreemplois/${clientId}/`),
          axiosInstance.get(`/appels_offres/nombre/apples_offres/${clientId}/`),
          axiosInstance.get(`/avis_infos/nombre/avis_infos/${clientId}/`),
        ]);

        setNombreOffres(offresRes.data.nombre_offres);
        setNombreApples(appelsRes.data.nombre_apples);
        setNombreAvisInfos(avisInfosRes.data.nombre_avis_infos);
      } catch (error) {
        console.error("Erreur de connexion à l'API :", error);
      }
    };

    if (clientId) {
      fetchStats();
    }
  }, [clientId]);

  return (
    <div className="row  ms-3">
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
                <div className=" fw-bold text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                <i
                  className="fas fa-calendar fa-2x text-gray-300"
                  style={{ color: "#dddfeb" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Carte 2 : Apples offres */}
      <div className="col-md-4">
        <div
          className="card border-left-success shadow h-20 py-1"
          style={{ width: "200px", borderLeft: ".25rem solid #4e73df" }}
        >
          <div className="card-bod">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className=" fw-bold text-xs font-weight-bold text-success text-uppercase mb-1">
                  <a
                    href="https://beta.mr/apples"
                    style={{ textDecoration: "none", fontSize: "11px" }}
                  >
                    Apples offres
                  </a>
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {nombreApples}
                </div>
              </div>
              <div className="col-auto">
                <i
                  className="fas fa-apple-alt fa-2x text-gray-300"
                  style={{ color: "#dddfeb" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Carte 3 : Avis et infos */}
      <div className="col-md-4">
        <div
          className="card border-left-warning shadow h-20 py-1"
          style={{ width: "200px", borderLeft: ".25rem solid #1cc88a" }}
        >
          <div className="card-bod">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold fw-bold text-warning text-uppercase mb-1">
                  <a
                    href="https://beta.mr/avis"
                    style={{ textDecoration: "none", fontSize: "11px" }}
                  >
                    Avis et infos
                  </a>
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {nombreAvisInfos}
                </div>
              </div>
              <div className="col-auto">
                <i
                  className="fas fa-info-circle fa-2x text-gray-300"
                  style={{ color: "#dddfeb" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
