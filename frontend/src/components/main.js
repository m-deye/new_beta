// main.js
import React from 'react';
import '../assets/styles/main.css'; // Assurez-vous que le chemin est correct

const MainComponent = () => {
  return (
    <div className="container"  style={{ background: '#000',  paddingTop: '0px' , paddingBottom:' 0px'}}>
      <div className="row divIndex">
        {/* Colonne de gauche */}
        <div className="col-md-3" style={{ padding: '0px' }}>
          <div className="card" style={{ padding: '5px' }}>
            <div className="card-bod pr-1 pl-2 bgCard pt-0">
              <span className="titrecol">
                Appels d'Offres
                <a href="https://www.beta.mr/beta/liste_offres/10"></a>
              </span>
              {/* Contenu des appels d'offres */}
              <div className="d-block mt-2">
                <a className="titre_size d-block mb-2" href="https://www.beta.mr/beta/liste_offres/3">
                  Internationaux
                </a>
                <a className="titre_size d-block mb-2" href="https://www.beta.mr/beta/liste_offres/5">
                  Consultations
                </a>
                <a className="titre_size d-block mb-2" href="https://www.beta.mr/beta/liste_offres/4">
                  Locaux
                </a>
                <a className="titre_size d-block mb-2" href="https://www.beta.mr/beta/liste_offres/6">
                  Manifestations d'Intérêts
                </a>
              </div>
              {/* Ajoutez d'autres éléments ici */}
            </div>
          </div>
        </div>

        {/* Colonne centrale */}
        <div className="col-md-6 bgCard" >
          <div className="">
            <div className=" card-bod pr-2 pl-0 " style={{ backgroundColor: '#efefff' , width: '100%'}}>
              <div className="row">
                <div className="col-6 titrecol font-weight-bold">
                  Offres d'emploi
                  <a href="https://www.beta.mr/beta/liste_offres/1"></a>
                </div>
                <div className="col-6 text-right">
                  <a href="https://www.beta.mr/beta/liste_offres/2" className="titrecol titleAnn">
                    Consultants <span className="titreCard"></span>
                  </a>
                </div>
              </div>
              {/* Contenu des offres d'emploi */}
              <div className="row">
                <div className="col-6 p-0" style={{ marginBottom: '2px' }}>
                  <div className="card post-card pb-1 mb-1" style={{ height: '100%' }}>
                    <div className="card-bod" style={{ padding: '3px ' }}>
                      <a
                        href="https://www.beta.mr/beta/offre/recrutement-drsquoun-responsable-drsquousine/8017"
                        className="titleAnn font-weight-bold"
                      >
                        <div className="row" style={{ marginLeft: '1px' }}>
                          <div style={{ width: '41px !important' }} className="pl-0 pr-0 text-center align-self-center">
                            <img className="imgCard" src="https://www.beta.mr/files/emp_files/102/logo.png" alt="logo" />
                          </div>
                          <div className="col-sm-9 pl-0 d-flex flex-wrap">
                            <div
                              className="post-card-content font-weight-lighter align-self-center"
                              style={{ color: '#000000 !important' }}
                            >
                              Société de la place
                            </div>
                          </div>
                        </div>
                        <div className="post-card-heading mb-1 sizeBd">
                          <p>Recrutement d’un Responsable d’usine</p>
                        </div>
                      </a>
                      <div className="post-card-limit small">
                        <span className="text-danger">
                          <i className="far fa-clock"></i>
                          10 février 2025
                        </span>
                        <span className="ml-2">
                          <i className="fas fa-map-marker-alt"></i>
                          Nouakchott
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Ajoutez d'autres offres d'emploi ici */}
              </div>
              <a
                style={{ width: '100%' }}
                className="mt-3 btn btn-sm btn-primary shadow-sm"
                href="https://www.beta.mr/beta/liste_offres/11"
              >
                Voir la liste complète
              </a>
              <br />
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="col-md-3" style={{ padding: '0px' }}>
          <div className="card" style={{ padding: '5px' }}>
            <div className="card-bod pr-2 pl-1 pt-0 bgCard" style={{ backgroundColor: '#efefff' }}>
              <span className="titrecol">
                Avis &amp; infos
                <a style={{ width: '100%' }} href="https://www.beta.mr/beta/liste_offres/7"></a>
              </span>
              {/* Contenu des avis et infos */}
              <div className="card post-card" style={{ width: '100%', marginBottom: '2px' }}>
                <div className="card-bod" style={{ padding: '1px !important' }}>
                  <a href="https://techghil.mr/cms/search/offres" target="_blank" rel="noopener noreferrer">
                    <div className="col-md-12">
                      <div className="row pl-0">
                        <div style={{ width: '38px !important' }} className="pr-0 text-center align-self-center">
                          <img
                            className="rounded imgCard"
                            src="https://www.beta.mr/files/emp_files/1468/logo.png"
                            alt="logo"
                          />
                        </div>
                        <div className="col-sm-9 pr-0 pl-1 d-flex flex-wrap">
                          <div className="post-card-content sizeBd align-self-center font-weight-bold">
                            Agence Nationale pour l’Emploi - TECHGHIL
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="post-card-heading sizeBd" style={{ color: '#000000 !important' }}>
                      <p>
                        <span style={{ color: 'rgb(186, 55, 42)' }}>
                          <strong>SMT - AFRICA</strong>
                        </span>
                        , recrute <strong>Site Manager – Mining</strong>
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              {/* Ajoutez d'autres avis et infos ici */}
              <a
                style={{ width: '100%' }}
                className="btn btn-sm btn-primary shadow-sm"
                href="https://www.beta.mr/beta/liste_offres/7"
              >
                Voir la liste complète
              </a>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;