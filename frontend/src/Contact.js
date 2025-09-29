import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./contact.css";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axiosInstance from "./api/axiosInstance";

const Contact = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0]; // "fr" or "ar"
  const isRTL = lang === "ar";
  const underlineColor = isRTL ? "#FFD600" : "#4CAF50";

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    description: "",
    captcha: "",
  });

  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");

  const fetchCaptcha = () => {
    axiosInstance
      .get("/api/captcha/")
      .then((res) => {
        setCaptchaImage(res.data.captcha_image);
        setCaptchaToken(res.data.captcha_token);
        setFormData((prev) => ({ ...prev, captcha: "" }));
      })
      .catch((err) => {
        console.error("Erreur chargement captcha", err);
      });
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post("/api/sendMessage/", {
        ...formData,
        captcha_token: captchaToken,
      })
      .then((res) => {
        alert(res.data.message);
        fetchCaptcha(); // Recharge captcha après succès
        setFormData({
          nom: "",
          email: "",
          sujet: "",
          description: "",
          captcha: "",
        });
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Erreur lors de l'envoi");
        fetchCaptcha(); // Recharge captcha après erreur aussi
      });
  };

  return (
    <div className="contact-page">
      <Header />
      <Navbar />

      <main
        dir={isRTL ? "rtl" : "ltr"}
        className={`container py-5 ${isRTL ? "rtl" : ""}`}
        style={{ background: "#fff" }}
      >
        <div className="row g-4" id="divContact">
          {/* Formulaire de contact */}
          <div className="col-md-8">
            <h5 className="mb-4" style={{ textAlign: isRTL ? "right" : "left" }}>
              {isRTL ? "أرسل لنا رسالة" : "Envoyez-nous un message"}
            </h5>
            <form onSubmit={handleSubmit}>
              {/* <div className="row">
                <div className="col-md-6 mb-3"  style={{ paddingRight: '20px' }}>
                  <label htmlFor="nom" className="form-label ms-3">
                    Nom <span className="" title="Champ obligatoire">*</span>
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    className="form-control ms-3"
                    required
                    value={formData.nom}
                    onChange={handleChange} 
                  />
                </div>

                <div className="col-12 col-md-6 mb-3 ps-3 ps-md-0 "  style={{ paddingRight: '9px' }}>
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger" title="Champ obligatoire">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                </div>


                <div className="col-12  mb-3">
                  <label htmlFor="sujet" className="form-label ">
                    Sujet <span className="" title="Champ obligatoire">*</span>
                  </label>
                  <input
                    id="sujet"
                    name="sujet"
                    type="text"
                    className="form-control"
                    required
                    value={formData.sujet}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12  mb-3">
                  <label htmlFor="description" className="form-label ">
                    Message <span className="" title="Champ obligatoire">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="5"
                    required
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 ms-3">
                  <div className="captcha d-flex align-items-center mb-3">
                    <img src={captchaImage} alt="Captcha" className="captcha-img" />
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      id="refresh-captcha"
                      onClick={fetchCaptcha}
                    >
                      ↻
                    </button>
                  </div>
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    className="form-control"
                    placeholder="Saisir le captcha"
                    required
                    value={formData.captcha}
                    onChange={handleChange} 
                  />
                </div>
              </div> */}
              <div className="row gx-4 gy-3">
                {/* Champ Nom */}
                <div className="col-12 col-md-6 mb-3 ps-3  pe-3">
                  <label htmlFor="nom" className="form-label">
                    {isRTL ? "الاسم" : "Nom"}{" "}
                    <span className="text-danger" title={isRTL ? "حقل إجباري" : "Champ obligatoire"}>
                      *
                    </span>
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    className="form-control"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>

                {/* Champ Email */}
                <div className="col-12 col-md-6 mb-3 ps-3  pe-3">
                  <label htmlFor="email" className="form-label">
                    {isRTL ? "البريد الإلكتروني" : "Email"}{" "}
                    <span className="text-danger" title={isRTL ? "حقل إجباري" : "Champ obligatoire"}>
                      *
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Champ Sujet */}
                <div className="col-12 mb-3 ps-3  pe-3">
                  <label htmlFor="sujet" className="form-label">
                    {isRTL ? "الموضوع" : "Sujet"}{" "}
                    <span className="text-danger" title={isRTL ? "حقل إجباري" : "Champ obligatoire"}>
                      *
                    </span>
                  </label>
                  <input
                    id="sujet"
                    name="sujet"
                    type="text"
                    className="form-control"
                    required
                    value={formData.sujet}
                    onChange={handleChange}
                  />
                </div>

                {/* Champ Message */}
                <div className="col-12 mb-3 ps-3  pe-3">
                  <label htmlFor="description" className="form-label">
                    {isRTL ? "الرسالة" : "Message"}{" "}
                    <span className="text-danger" title={isRTL ? "حقل إجباري" : "Champ obligatoire"}>
                      *
                    </span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="5"
                    required
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Champ Captcha */}
                <div className="col-12 col-md-6 mb-3 ps-3  pe-3">
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={captchaImage}
                      alt="Captcha"
                      className="captcha-img"
                    />
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      id="refresh-captcha"
                      onClick={fetchCaptcha}
                    >
                      ↻
                    </button>
                  </div>
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    className="form-control"
                    placeholder={isRTL ? "أدخل الكابتشا" : "Saisir le captcha"}
                    required
                    value={formData.captcha}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success mt-3">
                {isRTL ? "إرسال" : "Envoyer"}
              </button>
            </form>

            {/* Lien pour nouveau client */}
            <a
              className={`btn btn-info mt-3 ${isRTL ? "float-start" : "float-end"}`}
              href="/CreeClient"
              style={{ textDecoration: "none" }}
            >
              {isRTL ? "عميل جديد" : "Nouveau client"}
            </a>
          </div>

          {/* Informations de contact */}
          <div className="col-md-4 contact-info p-4 border rounded">
            <p>
              <i className={`fas fa-map-marker-alt ${isRTL ? "ms-2" : "me-2"}`}></i>
              {isRTL ? (
                <>
                  بيتا كونسيل قطعة ت، لوت 48
                  <br />
                  شارع الحاج عمر تال (شارع ديغول سابقاً)
                </>
              ) : (
                <>
                  Beta-conseils Ilot T, lot 48
                  <br />
                  Avenue El hadj Oumar Tall (ex Avenue De Gaulle)
                </>
              )}
            </p>
            <p>
              <i className={`fa fa-phone-square ${isRTL ? "ms-2" : "me-2"}`} aria-hidden="true"></i>
              (222) 45 25 79 15 - (222) 47 08 04 74
            </p>
            <p>
              <i className={`far fa-envelope ${isRTL ? "ms-2" : "me-2"}`}></i>
              beta@beta.mr
            </p>
            <h6>{isRTL ? "معلومات العملاء" : "Informations clients"}</h6>
            <p>
              Yéro Amadou Sall
              <br />
              <i className={`far fa-envelope ${isRTL ? "ms-2" : "me-2"}`}></i> infos@beta.mr
              <br />
              (222) 34.01.19.88
            </p>
            <h6>{isRTL ? "تجاري" : "Commercial"}</h6>
            <p>
              Ely Cheikh Ould Boukhary
              <br />
              <i className={`far fa-envelope ${isRTL ? "ms-2" : "me-2"}`}></i> commercial@beta.mr
            </p>
            <h6>{isRTL ? "التنسيق" : "Coordination"}</h6>
            <p>
              Massamba Kane
              <br />
              <i className={`far fa-envelope ${isRTL ? "ms-2" : "me-2"}`}></i> massamba@beta.mr
            </p>
            <h6>{isRTL ? "المدير العام" : "Directeur Général"}</h6>
            <p>
              Sidi Mohamed Ould Bouh
              <br />
              <i className={`far fa-envelope ${isRTL ? "ms-2" : "me-2"}`}></i> ouldbouh@beta.mr
            </p>
          </div>
        </div>

        {/* Carte Google Maps */}
        <div className="map-container my-5 border rounded overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15170.553533878443!2d-15.9778611!3d18.0882878!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb518e06f640d2344!2sBeta%20Conseils!5e0!3m2!1sen!2s!4v1572106466960!5m2!1sen!2s"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            title="Beta Conseils Location"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
