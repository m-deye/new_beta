import React, { useEffect, useState ,useRef} from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "./api/axiosInstance";

import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';

import { FaInfoCircle, FaList, FaShare, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const OffreCard = ({ logo, entreprise, titre, dateText, type_offre, id, lieu, isRTL, onSelect }) => {
  return (
    <div className="col-sm-12 col-md-6" style={{ marginBottom: '10px', paddingRight: '20px' }}>
      <div className="card post-card pb-1" style={{ height: '100%' }} onClick={onSelect}>
        <div className="card-bod" style={{ padding: '2px' }}>
          <div className="card-badge" style={isRTL ? { left: 0, right: 'auto' } : undefined}>{type_offre}</div>
          <div className="col-md-12">
            <div className="row pl-0">
              <div className="col-sm-2 pr-0 pl-0">
                <img className="imgAnn imgliste" src={logo} alt="logo" />
              </div>
              <div className="col-sm-10 pl-0">
                <div className="post-card-content sizeBd align-self-center entreprise" dangerouslySetInnerHTML={{ __html: entreprise }} ></div>
                <div className=" text-beta sizeBd mb-1 titre1">
                  <a href={`/DetailOffreEmploi/${id}`} className="titleAnn font-weight-bold fw-bold" onClick={(e)=>{e.preventDefault(); if (onSelect) onSelect();}}>
                    <p className="mb-0" dangerouslySetInnerHTML={{ __html: titre }}></p>
                  </a>
                </div>
                <div className=" small dateleiu">
                  <span className="text-danger" >
                    <i className="far fa-clock"></i> {dateText}
                  </span>
                  <span className="lieuappleoffre" style={{ color: '#0C74CC' }}>
                    <i className="fas fa-map-marker-alt "></i>{" "}
                    {lieu}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppelCard = ({ logo, entreprise, titre, dateText, type_s, id, isRTL, onSelect }) => {
  return (
    <div className="col-sm-12 col-md-6" style={{ marginBottom: '10px', paddingRight: '20px' }}>
      <div className="card post-card pb-1" style={{ height: '100%' }} onClick={onSelect}>
        <div className="card-bod" style={{ padding: '2px' }}>
          <div className="card-badge" style={isRTL ? { left: 0, right: 'auto' } : undefined}>{type_s}</div>
          <div className="col-md-12">
            <div className="row pl-0">
              <div className="col-sm-2 pr-0 pl-0">
                <img className="imgAnn imgliste" src={logo} alt="logo" />
              </div>
              <div className="col-sm-10 pl-0">
                <div className="post-card-content sizeBd align-self-center entreprise" dangerouslySetInnerHTML={{ __html: entreprise }} ></div>
                <div className=" text-beta sizeBd mb-1 titre1">
                  <a href={`/appel-offre/${id}`} className="titleAnn font-weight-bold fw-bold" onClick={(e)=>{e.preventDefault(); if (onSelect) onSelect();}}>
                    <p className="mb-0" dangerouslySetInnerHTML={{ __html: titre }}></p>
                  </a>
                </div>
                <div className="post-card-limit small" style={{ marginTop: '-15px', fontSize: '9.6px' }}>
                  <span className="text-danger">
                    <i className="far fa-clock"></i> {dateText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AvisCard = ({ logo, entreprise, titre, id, isRTL, onSelect }) => {
  return (
    <div className="col-sm-12 col-md-6" style={{ marginBottom: '10px', paddingRight: '20px' }}>
      <div className="card post-card pb-1" style={{ height: '100%' }} onClick={onSelect}>
        <div className="card-bod" style={{ padding: '2px' }}>
        <div className="card-badge" style={isRTL ? { left: 0, right: 'auto' } : undefined}>{isRTL ? 'مسابقات وإعلانات' : 'Avis & infos'}</div>
          <div className="col-md-12">
            <div className="row pl-0">
              <div className="col-sm-2 pr-0 pl-0">
                <img className="imgAnn imgliste" src={logo} alt="logo" />
              </div>
              <div className="col-sm-10 pl-0">
                <div className="post-card-content sizeBd align-self-center entreprise" dangerouslySetInnerHTML={{ __html: entreprise }} ></div>
                <div className="titre1 text-beta sizeBd mb-1">
                  <a href={`/avis-infos/${id}`} className="titleAnn font-weight-bold fw-bold" onClick={(e)=>{e.preventDefault(); if (onSelect) onSelect();}}>
                    <p className="mb-0" dangerouslySetInnerHTML={{ __html: titre }}></p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const ClientSpecielApple = () => {

  const [activeTab, setActiveTab] = useState('tab1');
  const [offres, setOffres] = useState([]);
  const location = useLocation(); // Récupérer les paramètres de l'URL
  const { client__nom } = useParams(); // Récupérer le paramètre depuis l'URL
  const [appels, setAppels] = useState([]);
  const [avis, setAvis] = useState([]);
  const [nbOffres, setNbOffres] = useState();
  const [nbOApples, setNbApples] = useState();
  const [nbOAvis, setNbAvis] = useState();

  const { offreId } = useParams(); // Récupérer l'ID de l'offre depuis l'URL
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { i18n, t } = useTranslation(); 
  const isRTL = i18n.language === 'ar'; 
  const [selectedDetail, setSelectedDetail] = useState(null); // { type, id }

      // Fonction de formatage jour mois année
      const formatDateSimple = isoString => {
        if (!isoString) return '';
        const date = new Date(isoString);
    
        // Choix du locale
        const locale = i18n.language === 'ar' ? 'ar-EG' : 'fr-FR';
    
    
       // On ajoute numberingSystem:'latn' pour les chiffres occidentaux en arabe
       const options = {
         day: 'numeric',
         month: 'long',
         year: 'numeric',
         numberingSystem: i18n.language === 'ar' ? 'latn' : undefined
       };
      return new Intl.DateTimeFormat(locale, options).format(date);
      };


      const hasViewed = useRef(false);

      const formatDateFromServer = (dateObj, afficherHeures) => {
        if (!dateObj) return '';
        const day = Array.isArray(dateObj.days) ? dateObj.days[0] : null;
        const month = Array.isArray(dateObj.months) ? dateObj.months[0] : null; // 1-12
        const year = dateObj.year;
        const hasTime = afficherHeures && dateObj.times && dateObj.times.length > 0;
        const hour = hasTime ? dateObj.times[0].hour : 0;
        const minute = hasTime ? dateObj.times[0].minute : 0;
        if (!day || !month || !year) return '';
        const jsDate = new Date(year, (month - 1), day, hour, minute);
        const locale = i18n.language === 'ar' ? 'ar-EG' : 'fr-FR';
        const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          numberingSystem: i18n.language === 'ar' ? 'latn' : undefined,
          ...(hasTime ? { hour: '2-digit', minute: '2-digit' } : {}),
        };
        return new Intl.DateTimeFormat(locale, options).format(jsDate);
      };
      useEffect(() => {
        const fetchOffre = async () => {
            try {
                const response = await axiosInstance.get(`/api/offres/detail/${offreId}/?lang=${i18n.language}`);
                setOffre(response.data);
    
                // ✅ On s'assure que l'incrémentation ne se fait qu'une fois
                if (!hasViewed.current) {
                    await axiosInstance.post(`/api/offres/${offreId}/incremente_vue/`);
                    hasViewed.current = true;
                }
            } catch (error) {
                setError(error.message || "Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };
    
        if (offreId) {
            fetchOffre();
        }
    }, [offreId, i18n.language]);
    


  useEffect(() => {
    if (activeTab === 'tab2') {
      axiosInstance.get(`/annonces_parclient/${client__nom}/?lang=${i18n.language}`)
      .then(res => {
        setOffres(res.data);
        setNbOffres(res.data.length);
      })
        .catch(err => console.error('Erreur lors du chargement des offres :', err));
    } else if (activeTab === 'tab3') {
      axiosInstance.get(`/appels_offres/annonces_parclient/?client=${encodeURIComponent(client__nom)}&lang=${i18n.language}`)
        .then(res => {setAppels(res.data);
          setNbApples(res.data.length);
        })
        .catch(err => console.error('Erreur lors du chargement des appels d offres :', err));
    
    } 
    else if (activeTab === 'tab1') {
      const loadDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          let url = null;
          if (selectedDetail && selectedDetail.type && selectedDetail.id) {
            if (selectedDetail.type === 'offre') {
              url = `/api/offres/detail/${selectedDetail.id}/?lang=${i18n.language}`;
            } else if (selectedDetail.type === 'appel') {
              url = `/appels_offres/detail/${selectedDetail.id}/?lang=${i18n.language}`;
            } else if (selectedDetail.type === 'avis') {
              url = `/avis_infos/detail/${selectedDetail.id}/?lang=${i18n.language}`;
            }
          } else if (offreId) {
            // par défaut on charge l'appel par id route
            url = `/appels_offres/detail/${offreId}/?lang=${i18n.language}`;
          }
          if (url) {
            const res = await axiosInstance.get(url);
            setOffre(res.data);
          }
        } catch (e) {
          console.error('Erreur chargement detail:', e);
          setError(e?.message || 'Erreur chargement detail');
        } finally {
          setLoading(false);
        }
      };
      loadDetail();
    }
     else if (activeTab === 'tab4') {
      axiosInstance.get(`/avis_infos/annonces_parclient/?client=${encodeURIComponent(client__nom)}&lang=${i18n.language}`)
        .then(res => {setAvis(res.data);
          setNbAvis(res.data.length);

        })
        .catch(err => console.error('Erreur lors du chargement des avis :', err));
    }
  }, [activeTab, i18n.language, selectedDetail, offreId]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };



  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
    <Header />
    <Navbar />
    <div className="container py-4" style={{ background: '#fff' }}>
      <div className="row">
        <div className="col-lg-12 mb-2">
          <div className="row mb-2">
            <div className="col-md-8 d-flex flex-row justify-content-center">
              <h5 className="ml-2 text-beta">
                <strong><a href="#" style={{textDecoration:'none'}}>{client__nom}</a></strong>
              </h5>
            </div>
            <div className="col-md-3 text-right">
              <h5 className="text-beta">
                <a href="/Login" style={{textDecoration:'none'}}>{isRTL ? 'حساب العميل' : 'Compte Client'}</a>
              </h5>
            </div>
          </div>

          <nav>
          <div className="nav nav-tabs main-tabs justify-content-center" role="tablist">
              <button className={`nav-item nav-link ${activeTab === 'tab1' ? 'active' : ''}`} onClick={() => handleTabClick('tab1')}>
                <FaInfoCircle />
              </button>
              <button className={`nav-item nav-link ${activeTab === 'tab2' ? 'active' : ''}`} onClick={() => handleTabClick('tab2')}>
                <FaList /> <b>{isRTL ? 'عروض الوظائف' : "Offres d'emploi"} (<span className="text-danger">{nbOffres}</span>)</b>
              </button>
              <button className={`nav-item nav-link ${activeTab === 'tab3' ? 'active' : ''}`} onClick={() => handleTabClick('tab3')}>
                <FaList /> <b>{isRTL ? 'عروض المناقصات' : "Appels d'Offres"} (<span className="text-danger">{nbOApples}</span>)</b>
              </button>
              <button className={`nav-item nav-link ${activeTab === 'tab4' ? 'active' : ''}`} onClick={() => handleTabClick('tab4')}>
                <FaList /> <b>{isRTL ? 'مسابقات وإعلانات' : 'Avis & infos'} (<span className="text-danger">{nbOAvis}</span>)</b>
              </button>
            </div>
          </nav>

          <input type="hidden" id="tabsSpecial" value="1" />

          <div className="tab-content">
            
            <div role="tabpanel" className={`tab-pane fade ${activeTab === 'tab1' ? 'show active' : ''}`} id="tab1">
            {offre && (
            <div className="row">
                    <div className="col-md-12">
                        <div className="card p-2 mt-2 mb-2" style={{ maxWidth: '100%' }}>
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <img width="120px" src={offre.client__logo} alt="Company Logo" />
                                    </div>
                                </div>
                                <div className="col-md-10 align-self-center">
                                    <span className="font-weight-bold" style={{ fontSize: '14px' }}>{offre.client__nom}</span><br />
                                    <span className="text-beta font-weight-bold" style={{ fontSize: '14px', color: '#0C96B1' }} dangerouslySetInnerHTML={{ __html: offre.titre }}></span>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <b>{t('date_limite')} : <span className="text-danger" >{formatDateSimple(offre.date_limite)}</span></b>
                                        </div>
                                       
                                       
                                    </div>
                                </div>
                            </div> <br/> <br/> <br/>
                            <div className="row" id="divText">
                            
                            <div className="col-lg-12">
                                            {/* Afficher la description de l'offre */}
                                            <p dangerouslySetInnerHTML={{ __html: offre.description }} style={{ textDecoration: 'none' }} />
                                        </div>

                                        {/* Vérifier si des documents existent */}
                                        {(offre.documents && (offre.documents.filter && offre.documents.filter(doc => !doc.langue || doc.langue === i18n.language).length > 0)) ? (
                                            <div className="col-lg-12">
                                                <br /><br />
                                                {/* <span className="titreDocument">{t('plus_d_informations')} : </span> */}
                                               <span style={{
                                                      fontSize: '14px',
                                                      fontWeight: 'bold',
                                                      color: 'rgb(99, 36, 35)'
                                                    }}>
                                                {t("plus_d_informations")} :{" "}
                                              </span>
                                              <br /><br />
                                                {(offre.documents.filter ? offre.documents.filter(document => !document.langue || document.langue === i18n.language) : offre.documents).map((document, index) => (
                                                    <a
                                                        key={index}
                                                        className="titreDoc"
                                                        href={document.piece_join} // Lien vers le document
                                                        target="_blank"
                                                        rel="noopener noreferrer" style={{ textDecoration: 'none' }}
                                                    >
                                                        <img
                                                            width="30px"
                                                            src="https://beta.mr/img/pdf.png"
                                                            alt="PDF Icon"
                                                        />
                                                        <span style={{
                                                            fontSize: '19px',
                                                            fontWeight: 'bold'
                                                          }}>
                                                            {document.titre_piece_join}
                                                          </span>{" "} <br />{/* Afficher le titre du document */}
                                                    </a>
                                                ))}
                                                <br />
                                            </div>
                                        ) : (
                                            // Masquer la section si aucun document n'existe
                                            null
                                        )}



                            </div>
                            <div className="card-footer mt-5">
                            <div className="row">
                                <div className="col-6">
                                    <b>{t('offre_en_ligne_depuis')} : </b> <span style={{color: 'red'}}>{formatDateSimple(offre.date_mise_en_ligne)}</span>
                                </div>
                                <div className="col-6 text-end">
                                    <b><i className="fa fa-share"></i> {t('partager_offre')} : </b>
                                    <a className="" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=https://beta.mr/beta/offre/un-directeur-des-finances-et-administration/8145">
                                        <i className="fab fa-facebook fa-lg" aria-hidden="true"></i>
                                    </a>
                                    <a className="mx-2" target="_blank" rel="noopener noreferrer" href="">
                                        <i className="fab fa-linkedin fa-lg" aria-hidden="true"></i>
                                    </a>
                                    <a className="" target="_blank" rel="noopener noreferrer" href="">
                                        <i className="fab fa-whatsapp text-success fa-lg" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                <a
                                            className="mr-3 btn btn-sm shadow-sm mb-1" // Suppression de btn-primary car nous définissons une couleur personnalisée
                                            href="/listcompter_OffresEmplois"
                                            style={{
                                                textDecoration: 'none', // Ajout de text-decoration: none
                                                backgroundColor: '#4E73DF', // Ajout de la couleur de fond
                                                width: '250px', // Réduction de la largeur (ajustez la valeur selon vos besoins)
                                            }}
                                        >
                                            {t('voir_liste_complete')}
                                        </a>
                                    <a
                                        className="btn btn-sm btn-primary shadow-sm mb-1" 
                                        href={`/annonces_offreemp/${offre.client__nom}`}  style={{
                                            textDecoration: 'none', // Ajout de text-decoration: none
                                            backgroundColor: '#4E73DF', // Ajout de la couleur de fond
                                            
                                        }}
                                    >
                                        {t('voir_toutes_annonces')} : 
                                        <span style={{ color: 'black', fontWeight: 'bold' }}> {offre.client__nom}</span>
                                    </a>
                                </div>
                            </div>
                          
                        </div>
                    </div>
                </div>
                )}

              {/* Facebook SDK can be optionally loaded here if needed */}
            </div>
        
            <div className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`} id="tab2">
              <div className="row px-lg-4 px-0">
                {offres.length > 0 ? (
                  offres.map((off, index) => (
                    <OffreCard
                      key={index}
                      logo={off.client__logo}
                      entreprise={off.client__nom}
                      titre={off.titre}
                      dateText={formatDateFromServer(off.date_limite, off.afficher_heures)}
                      id={off.id}
                      type_offre={off.type_offre}
                      lieu={off.lieu}
                      isRTL={isRTL}
                      onSelect={() => { setSelectedDetail({ type: 'offre', id: off.id }); handleTabClick('tab1'); }}
                    />
                  ))
                ) : (
                  <p>{isRTL ? 'لا توجد عروض وظائف متاحة.' : "Aucune offre d'emploi disponible."}</p>
                )}
              </div>
            </div>

            <div className={`tab-pane fade ${activeTab === 'tab3' ? 'show active' : ''}`} id="tab3">
              <div className="row px-lg-4 px-0">
                {appels.length > 0 ? (
                  appels.map((ap, index) => (
                    <AppelCard
                      key={index}
                      logo={ap.client__logo}
                      entreprise={ap.client__nom}
                      titre={ap.titre}
                      dateText={formatDateFromServer(ap.date_limite, ap.afficher_heures)}
                      id={ap.id}
                      type_s={ap.type_s}
                      isRTL={isRTL}
                      onSelect={() => { setSelectedDetail({ type: 'appel', id: ap.id }); handleTabClick('tab1'); }}
                    />
                  ))
                ) : (
                  <p>{isRTL ? 'لا توجد عروض مناقصات متاحة.' : "Aucun appel d'offres disponible."}</p>
                )}
              </div>
            </div>
            <div className={`tab-pane fade ${activeTab === 'tab4' ? 'show active' : ''}`} id="tab4">
              <div className="row px-lg-4 px-0">
                {avis.length > 0 ? (
                  avis.map((item, index) => (
                    <AvisCard
                      key={index}
                      logo={item.client__logo}
                      entreprise={item.client__nom}
                      titre={item.titre}
                      id={item.id}
                      isRTL={isRTL}
                      onSelect={() => { setSelectedDetail({ type: 'avis', id: item.id }); handleTabClick('tab1'); }}
                    />
                  ))
                ) : (
                  <p>{isRTL ? 'لا توجد مسابقات أو إعلانات متاحة.' : 'Aucun avis ou information disponible.'}</p>
                )}
              </div>
            </div>
       
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ClientSpecielApple;
