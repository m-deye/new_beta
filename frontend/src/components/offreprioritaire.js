import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/Offreprioritaire.css";

const Offreprioritaire = () => {
  return (
    <div className=" py-1 px-1">
      <Carousel indicators={false} interval={null}>
        <Carousel.Item>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-2 text-center">
                <img
                  style={{ width: "70px", height: "70px" }}
                  src="https://beta.mr/files/emp_files/128/logo.png"
                  alt="Logo 1"
                />
              </div>
              <div className="col-md-9 pb-2 d-flex flex-column justify-content-center">
                <a
                  href="https://beta.mr/beta/offre/prestataires-pour-la-mission-drsquoaudit-financier-et-comptable-du-projet-de-lrsquoeacutetude-drsquoun-corridor-eacuteconomique-entre-nouadhibou-nouakchott-rosso-dakar/8046"
                  style={{ fontSize: "12px" }}
                  className="titleAnn font-weight-bold mb-1"
                >
                  <p>
                    Prestataires pour la mission d’audit financier et comptable
                    du Projet de l’étude d’un corridor économique entre
                    Nouadhibou-Nouakchott-Rosso-Dakar
                  </p>
                </a>
                <span>Projet de construction du pont de Rosso</span>
                <span className="text-danger mt-1">
                  Date limite: 4 mars 2025 10:30
                </span>
              </div>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-2 text-center">
                <img
                  style={{ width: "70px", height: "70px" }}
                  src="https://beta.mr/files/emp_files/126/logo.png"
                  alt="Logo 2"
                />
              </div>
              <div className="col-md-9 pb-2 d-flex flex-column justify-content-center">
                <a
                  href="https://beta.mr/beta/offre/seacutelection-de-cabinet-pour-leacutetude-de-marcheacute-et-de-preacutequalification-des-fournisseurs-de-biens-et-de-services/8035"
                  style={{ fontSize: "12px" }}
                  className="titleAnn font-weight-bold mb-1"
                >
                  <p>
                    Sélection de cabinet pour l'étude de marché et de
                    préqualification des fournisseurs de biens et de services
                    ...
                  </p>
                </a>
                <span>Organisation mondiale de la Santé (OMS)</span>
                <span className="text-danger mt-1">
                  Date limite: 3 février 2025
                </span>
              </div>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-2 text-center">
                <img
                  style={{ width: "70px", height: "70px" }}
                  src="https://beta.mr/files/emp_files/168/logo.png"
                  alt="Logo 3"
                />
              </div>
              <div className="col-md-9 pb-2 d-flex flex-column justify-content-center">
                <a
                  href="https://beta.mr/beta/offre/une-consultante-nationale-pour-la-reacutealisation-drsquoune-cartographie-institutionnelle-et-meacutethodologie-de-calcul-du-budget/8026"
                  style={{ fontSize: "12px" }}
                  className="titleAnn font-weight-bold mb-1"
                >
                  <p>
                    Un(e) Consultant(e) national(e) pour la Réalisation d’une
                    cartographie institutionnelle et méthodologie de calcul du
                    budget ...
                  </p>
                </a>
                <span>Fonds des Nations Unies pour l'Enfance (UNICEF)</span>
                <span className="text-danger mt-1">
                  Date limite: 5 février 2025
                </span>
              </div>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Offreprioritaire;
