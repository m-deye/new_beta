import React, { useState, useEffect } from 'react';
import './Footer.css'; // Importez le fichier CSS pour le style
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importez FontAwesome pour l'icône
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'; // Importez l'icône spécifique
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const [showButton, setShowButton] = useState(false);
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  // Fonction pour faire défiler la page vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Défilement fluide
    });
  };

  // Gestionnaire pour afficher ou masquer le bouton en fonction du défilement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : ''}>
      {/* Bouton "Retour en haut" */}
      {showButton && (
        <button
          onClick={scrollToTop}
          id="myBtn"
          title="Go to top"
          style={{
            display: 'block',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: '#4CB6EA',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}

   {/* Footer */}
<div
  id="footer"
  style={{ backgroundColor: '#cee8f9', marginTop: '20px' }} // Ajouter marginTop ici
  className="container bg-whater py-3"
>
  <div className="row">
    {/* Colonne Beta Conseils */}
    <div className="col-md-4 posiFooter">
      <h6 className="text-beta mt-3 mb-sm-1 mb-md-3">{t('Beta_Conseils')}</h6>
      <ul className="list-group">
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a className="text-foot" href="beta_mr" style={{ textDecoration:'none'}}>
          {t('beta_mr')}
          </a>
        </li>
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a className="text-foot" href="beta_conseil"  style={{ textDecoration:'none'}}>
          {t('Beta_Conseils')}
          </a>
        </li>
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a className="text-foot" href="Contact"  style={{ textDecoration:'none'}}>
          {t('contactez_nous')}
          </a>
        </li>
      </ul>
    </div>

    {/* Colonne Services RH */}
    <div className="col-md-4 posiFooter">
      <h6 className="text-beta mt-3 mb-sm-1 mb-md-3">{t('services_rh')}</h6>
      <ul className="list-group">
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a className="text-foot" href="Recrutement"  style={{ textDecoration:'none'}}>
          {t('recrutement')}
          </a>
        </li>
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a className="text-foot" href="ConseilsRH"  style={{ textDecoration:'none'}}>
          {t('conseils_rh')}
          </a>
        </li>
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a className="text-foot" href="Assistance"  style={{ textDecoration:'none'}}>
          {t('assistance_emploi')}
          </a>
        </li>
      </ul>
    </div>

    {/* Colonne Outils */}
    <div className="col-md-4 posiFooter">
      <h6 className="text-beta mt-3 mb-sm-1 mb-md-3">{t('outils')}</h6>
      <ul className="list-group">
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a href="basecv" className="text-foot"  style={{ textDecoration:'none'}}>
          {t('base_cv')}
          </a>
        </li>
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a href="Psychotechniques" className="text-foot"  style={{ textDecoration:'none'}}>
          {t('tests_psycho')}
          </a>
        </li>
        <li className="list-group-item px-0 py-1 border-0 bg-transparent">
          <a href="TestimonialForm" className="text-foot"  style={{ textDecoration:'none'}}>
          {t('temoignez')}
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>

      {/* Section Copyright et mesure d'audience */}
      <footer
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`container bg-beta py-3 ${isRTL ? 'rtl' : ''}`}
    >
        <div className="row">
          <div className="col-md-12 text-center">
            <span className="text-light mr-2">{t('copyright')} {new Date().getFullYear()} </span>
            <a href="http://www.xiti.com/xiti.asp?s=616234" title="WebAnalytics" target="_top">
              {/* <img
                width="80"
                height="15"
                border="0"
                alt=""
                src="https://logv2.xiti.com/rcg.xiti?s=616234&p=&hl=14x8x9&r=1280x720x24x24&ref="
                title="Internet Audience"
              /> */}
              <noscript>
                Mesure d'audience ROI statistique webanalytics par{' '}
                {/* <img
                  width="80"
                  height="15"
                  src="https://logv2.xiti.com/rcg.xiti?s=616234&p="
                  alt="WebAnalytics"
                /> */}
              </noscript>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;