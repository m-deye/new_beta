import React from "react";

const StatisticsSection = ({ statistics }) => {
  return (
    <section className="statistics-section">
      <h2>Statistiques</h2>
      <div className="statistics-grid">
        <div className="statistic-card">
          <h3>Nombre d'offres d'emploi</h3>
          <p>{statistics.nombreOffresEmploi}</p>
        </div>
        {/* Ajoutez d'autres statistiques ici */}
      </div>
    </section>
  );
};

export default StatisticsSection;