// SectionCard.js
import React from "react";

const SectionCard = ({ title, links, details }) => {
  return (
    <div className="section-card">
      <div className="card-header">
        <h5>{title}</h5>
        {links && links.map((link, index) => (
          <a key={index} href={link.href} className="card-link">
            {link.text}
          </a>
        ))}
      </div>
      <div className="card-body">
        {details && details.map((detail, index) => (
          <div key={index} className="detail">
            <a href={detail.href} className="detail-title">{detail.text}</a>
            <span className="detail-extra">{detail.extra}</span>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <a href="https://www.beta.mr/beta/liste_offres/10" className="btn btn-primary">
          Voir la liste complète
        </a>
      </div>
    </div>
  );
};

export default SectionCard;
