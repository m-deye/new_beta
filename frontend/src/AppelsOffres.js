import React from 'react';
import './App.css';

function AppelsOffres() {
  return (
    <div className="card" style={{ padding: '-30px' }}>
      <div className="card-body pr-1 pl-3 bgCard pt-0">
        <span className="titrecol">
          Appels d'Offres
          <a href="https://www.beta.mr/beta/liste_offres/10"></a>
        </span>
        <span className="d-block">
          <a className="titre_size" href="https://www.beta.mr/beta/liste_offres/3">Internationaux</a>
          <a className="titreCard" href="https://www.beta.mr/beta/liste_offres/3"></a>
        </span>
        <span className="d-block">
          <a className="titre_size" href="https://www.beta.mr/beta/liste_offres/5">Consultations</a>
          <a className="titreCard" href="https://www.beta.mr/beta/liste_offres/5"></a>
        </span>
        <span className="d-block">
          <a className="titre_size" href="https://www.beta.mr/beta/liste_offres/4">Locaux</a>
          <a className="titreCard" href="https://www.beta.mr/beta/liste_offres/4"></a>
        </span>
        <span className="d-block">
          <a className="titre_size" href="https://www.beta.mr/beta/liste_offres/6">Manifestations d'Intérêts</a>
          <a className="titreCard" href="https://www.beta.mr/beta/liste_offres/6"></a>
        </span>
        <div className="card post-card" style={{ width: '100%', marginBottom: '2px' }}>
          <div className="card-body" style={{ padding: '1px' }}>
            <div className="col-md-12">
              <div className="row pl-0">
                <div style={{ width: '38px' }} className="pl-0 pr-0 text-center align-self-center">
                  <img className="rounded imgCard" src="https://www.beta.mr/files/emp_files/1187/logo.png" alt="Logo" />
                </div>
                <div className="col-sm-9 pl-1 pr-0 d-flex flex-wrap">
                  <div className="post-card-content titleAnn sizeBd font-weight-bold">
                    Etablissement Portuaire de la Baie du Repos (EPBR)
                  </div>
                </div>
              </div>
            </div>
            <div className="post-card-heading small">
              <a href="https://www.beta.mr/beta/offre/1-recrutement-des-bureaux-qui-seront-chargeacutes-de-reacutealiser-lrsquoeacutetude-du-projet-de-reacuteameacutenagement-de-lrsquoepbr/7941" style={{ color: '#040404' }} className="sizeBd appelText">
                <p><strong><span style={{ color: 'rgb(224, 62, 45)', backgroundColor: 'rgb(171, 249, 236)' }}>1</span>-</strong> Recrutement des bureaux qui seront chargés de réaliser l’étude du Projet de Réaménagement de l’EPBR</p>
              </a>
              <br />
              <a href="https://www.beta.mr/beta/offre/2-recrutement-des-bureaux-qui-seront-chargeacutes-de-reacutealiser-un-diagnostic-geacuteneacuteral-des-ouvrages-au-port-artisanal-de-nouadhibounbsp/7942" style={{ color: '#040404' }} className="sizeBd appelText">
                <p><strong><span style={{ color: 'rgb(224, 62, 45)', backgroundColor: 'rgb(171, 249, 236)' }}>2</span>-</strong> Recrutement des bureaux qui seront chargés de réaliser un Diagnostic général des ouvrages au port artisanal de Nouadhibou&nbsp;</p>
              </a>
            </div>
            <div className="post-card-limit small">
              Date limite:
              <span className="text-danger">
                13, 14 janvier 2025
              </span>
            </div>
          </div>
        </div>
        <a style={{ width: '100%' }} className="btn btn-sm btn-primary shadow-sm" href="https://www.beta.mr/beta/liste_offres/10">Voir la liste complète</a><br />
      </div>
    </div>
  );
}

export default AppelsOffres;
