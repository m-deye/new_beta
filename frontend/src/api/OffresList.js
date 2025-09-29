import React, { useState, useEffect } from 'react';

import axios from 'axios';

const OffresList = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000//offres_emploi/liste/')  // Assure-toi que cette URL est correcte
      .then(response => {
        setOffres(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des offres:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement des offres...</p>;
  }

  return (
    <div>
      <h2>Liste des offres d'emploi</h2>
      <ul>
        {offres.map(offre => (
          <li key={offre.id}>
            <h3>{offre.titre}</h3>
            <p>{offre.description}</p>
            <p><strong>Lieu :</strong> {offre.lieu}</p>
            <p><strong>Date limite :</strong> {offre.date_limite}</p>
            <p><strong>Nombre de vues :</strong> {offre.nombre_vu}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OffresList;
