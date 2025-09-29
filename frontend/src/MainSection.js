
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainSection.css';

const MainSection = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/offres_emploi/liste/')  // Assure-toi que cette URL est correcte
      .then(response => {
        setOffres(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des offres:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="main-container">
      {/* Section Appels d'Offres */}
      <div className="section appels-offres" style={{ backgroundColor: '#DEE7EF' }}>
        <span className="titrecol">
          <span style={{ color: '#FF9900' }}>Appels d'Offres</span>
          <br />
          <a href="https://www.beta.mr/beta/liste_offres/10">Internationaux</a>
        </span>

        <ul>
          <li className="appels-offres1">
            <a
              href="https://www.beta.mr/beta/offre/avis-de-report-mise-en-place-drsquoun-centre-drsquoappel-agrave-la-bcm/7976"
              className="titleAnn"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <div className="logo-text-container">
                <div className="logo-container">
                  <img
                    className="rounded imgCard"
                    src="https://www.beta.mr/files/emp_files/544/logo.png"
                    alt="Logo BCM"
                  />
                </div>
                <div className="post-card-content sizeBd font-weight-bold align-self-center" style={{ fontSize: '0.675rem'}}>
                                  Banque Centrale de Mauritanie (BCM)
                 </div>
              </div>

              <div className="post-card-heading sizeBd" style={{ color: '#000000', fontSize: '0.775rem' }}>
                <p>
                  <span style={{ color: 'rgb(224, 62, 45)' }}>
                    <strong>Avis de report</strong>
                  </span>
                  . Mise en place d’un centre d’appel à la BCM
                </p>
              </div>
            </a>

            <div className="post-card-limit small" style={{ fontSize: '0.5rem' }}>
              Date limite: <span className="text-danger">27 janvier 2025 10:00</span>
            </div>
          </li>
           <li className="appels-offres1">
            <a
              href="https://www.beta.mr/beta/offre/avis-de-report-mise-en-place-drsquoun-centre-drsquoappel-agrave-la-bcm/7976"
              className="titleAnn"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <div className="logo-text-container">
                <div className="logo-container">
                  <img
                    className="rounded imgCard"
                    src="https://www.beta.mr/files/emp_files/544/logo.png"
                    alt="Logo BCM"
                  />
                </div>
                <div className="post-card-content sizeBd font-weight-bold align-self-center">
                  Banque Centrale de Mauritanie (BCM)
                </div>
              </div>

              <div className="post-card-heading sizeBd" style={{ color: '#000000', fontSize: '0.775rem' }}>
                <p>
                  <span style={{ color: 'rgb(224, 62, 45)' }}>
                    <strong>Avis de report</strong>
                  </span>
                  . Mise en place d’un centre d’appel à la BCM
                </p>
              </div>
            </a>

            <div className="post-card-limit small" style={{ fontSize: '0.5rem' }}>
              Date limite: <span className="text-danger">27 janvier 2025 10:00</span>
            </div>
          </li>
        </ul>
        <div className="section-footer">
          <a
            className="btn btn-sm btn-primary shadow-sm"
            href="https://www.beta.mr/beta/liste_offres/10"
            target="_blank" rel="noopener noreferrer"
          >
            Voir la liste complète
          </a>
  </div>
      </div>

   
     
  <div className="section offres-emploi" style={{ backgroundColor: '#DEE7EF', display: 'flex', flexDirection: 'column', height: '100%' }}>
  {/* En-tête avec "Offres d'emploi" et "Consultants" */}
  <div className="offres-emploi-header">
    <div className="offres-emploi-title">
      Offres d'emploi
    </div>
    <div className="consultants-text">
      Consultants
    </div>
  </div>

  <div style={{ display: 'flex', gap: '0px' }}>
  {/* Conteneur parent avec marges gauche et droite */}
  <div style={{ marginLeft: '14px', marginRight: '14px', display: 'flex', gap: '4px' }}>
    
  <div className="card-body special-card">
  <ul style={{ padding: 0, listStyleType: 'none' }}>
    {offres.map((offre) => (
      <li 
        key={offre.id} 
        style={{ 
          marginBottom: '10px', 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          backgroundColor: '#f9f9f9' 
        }}
      >
        <a 
          href={offre.client__site_web || '#'} 
          style={{ display: 'block', textDecoration: 'none' }} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              {offre.client__logo ? (
                <img 
                  src={offre.client__logo} 
                  alt="" 
                  style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
              ) : (
                <img 
                  src="https://via.placeholder.com/50" 
                  alt="Default Logo" 
                  style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
              )}
            </div>
            <div style={{ marginLeft: '10px', fontWeight: 'bold' }}>{offre.client__nom}</div>
          </div>
          <div style={{ color: '#000000', fontSize: '0.875rem', marginTop: '10px' }}>
            <p>
              <span style={{ color: 'rgb(224, 62, 45)' }}>
                <strong>{offre.titre}</strong>
              </span>
            </p>
          </div>
        </a>

        {/* Ajout des nouvelles informations : date limite et lieu */}
        <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#555' }}>
          <span style={{ marginRight: '15px' }}>
            <i className="far fa-calendar-alt"></i> {offre.date_limite}
          </span>
          <span>
            <i className="fas fa-map-marker-alt"></i> {offre.lieu}
          </span>
        </div>
      </li>
    ))}
  </ul>
</div>





    {/* Deuxième colonne */}
    <div className="card-body special-card" style={{  marginRight: '14px', display: 'flex', gap: '4px' }}>
      <ul>
        <li className="list-container">
          <a
            href="https://www.beta.mr/beta/offre/avis-de-report-mise-en-place-drsquoun-centre-drsquoappel-agrave-la-bcm/7976"
            className="titleAnn"
            style={{ display: 'block', textDecoration: 'none' }}
          >
            <div className="logo-text-container">
              <div className="logo-container">
                <img
                  className="rounded imgCard"
                  src="https://www.beta.mr/files/emp_files/544/logo.png"
                  alt="Logo BCM"
                />
              </div>
              <div className="post-card-content sizeBd font-weight-bold align-self-center" style={{ fontSize: '0.675rem'}}>
                Banque Centrale de Mauritanie (BCM)
              </div>
            </div>

            <div className="post-card-heading sizeBd" style={{ color: '#000000', fontSize: '0.775rem' }}>
              <p>
                <span style={{ color: 'rgb(224, 62, 45)' }}>
                  <strong>Avis de report</strong>
                </span>
                . Mise en place d’un centre d’appel à la BCM
              </p>
            </div>
          </a>

          <div className="post-card-limit small my-1" style={{ fontSize: '0.5rem'}}>
            <span className="text-danger">
              <i className="far fa-clock"></i> 17 janvier 2025
            </span>
            <span className="ml-2">
              <i className="fas fa-map-marker-alt"></i> Hodh Gharbi
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>


  <div className="ben-emploi">
    <a
      className="btn btn-sm btn-primary shadow-sm"
      href="https://www.beta.mr/beta/liste_offres/10"
      target="_blank" rel="noopener noreferrer"
    >
      Voir la liste complète
    </a>
  </div>
</div>




      {/* Section Avis & Infos */}
      <div className="section avis-infos" style={{ backgroundColor: '#DEE7EF' }}>
        <span style={{ color: '#FF9900' }}>Avis & Infos</span>
        <ul>
          <li className="appels-offres2">
            <div className="logo-text-container">
              <div className="logo-container">
                <img
                  className="rounded imgCard"
                  src="https://www.beta.mr/files/emp_files/544/logo.png"
                  alt="Logo BCM"
                />
              </div>
              <div className="post-card-content sizeBd font-weight-bold align-self-center" style={{ color: '#000000', fontSize: '0.675rem' }}>
                Banque Centrale de Mauritanie (BCM)
              </div>
            </div>
            <div className="post-card-heading sizeBd" style={{ color: '#000000', fontSize: '0.775rem' }}>
              <p>
                <span style={{ color: 'rgb(224, 62, 45)' }}>
                  <strong>Avis de report</strong>
                </span>
                . Mise en place d’un centre d’appel à la BCM
              </p>
            </div>
          </li>
          <li className="appels-offres2">
            <strong>Société Mauritanienne des Produits Laitiers</strong>
            <p>Acquisition d'un véhicule 4x4...</p>
          </li>
        </ul>
        <div className="section-footer">
              <a
                className="btn btn-sm btn-primary shadow-sm"
                href="https://www.beta.mr/beta/liste_offres/10"
                target="_blank" rel="noopener noreferrer"
              >
                Voir la liste complète
              </a>
            </div>
      </div>
    </div>
  );
};

export default MainSection;