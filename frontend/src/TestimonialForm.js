import React, { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import { useTranslation } from "react-i18next";

const TestimonialForm = () => {
  const navigate = useNavigate(); // ✅ Ici c'est bon
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0]; // "fr" or "ar"
  const isRTL = lang === "ar";
  const underlineColor = isRTL ? "#FFD600" : "#4CAF50";

  const [formData, setFormData] = useState({
    nom: "",
    poste: "",
    fichier: null,
    description: "",
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors('');
  //   setLoading(true);
  //   setSuccess(false);

  //   const data = new FormData();
  //   data.append('nom', formData.nom);
  //   data.append('poste', formData.poste);
  //   data.append('fichier', formData.fichier);
  //   data.append('description', formData.description);

  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/temoignage/api/temoignages/create/', {
  //       method: 'POST',
  //       body: data,
  //     });

  //     if (!response.ok) throw new Error("Erreur lors de l'envoi du formulaire");

  //     setSuccess(true);
  //     setFormData({ nom: '', poste: '', fichier: null, description: '' });
  //     navigate('/'); // ✅ Appel ici est maintenant correct
  //   } catch (error) {
  //     setErrors(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);
    setSuccess(false);

    const data = new FormData();
    data.append("nom", formData.nom);
    data.append("poste", formData.poste);
    data.append("fichier", formData.fichier);
    data.append("description", formData.description);

    try {
      const response = await axiosInstance.post(
        "/temoignage/api/temoignages/create/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      setFormData({ nom: "", poste: "", fichier: null, description: "" });
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
      if (error.response?.data) {
        setErrors(JSON.stringify(error.response.data));
      } else {
        setErrors("Erreur réseau");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <Header />
      <Navbar />

      <main
        dir={isRTL ? "rtl" : "ltr"}
        className={`container py-4 ${isRTL ? "rtl" : ""}`}
        style={{ background: "#fff" }}
      >
        <div className="col-md-12" id="formTemoi">
          <h2 style={{ textAlign: isRTL ? "right" : "left" }}>
            {isRTL
              ? "أخبرنا كيف ساعدتك بيتا كونسيل"
              : "Dites-nous comment BETA Conseils vous a aidé"}
          </h2>
          <h5 style={{ textAlign: isRTL ? "right" : "left" }}>
            {isRTL
              ? "هل ساعدتك بيتا كونسيل في الحصول على تدريب، وظيفة، مهمة أو حتى مرشح ممتاز؟ شارك تجربتك."
              : "BETA Conseils vous a aidé à obtenir un stage, un emploi, une mission ou encore un excellent candidat ? Partagez votre expérience."}
          </h5>
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="_token"
              value="8pTLzLXLFQpYldJzbOn1rBYetX814DgPAxL3Eflb"
            />
            <div className="row mb-2">
              <div className="col-md-12 form-group">
                <label htmlFor="nom" className={isRTL ? "me-3" : "ms-3"}>
                  {isRTL ? "الاسم" : "Nom"}{" "}
                  <span
                    className=""
                    data-toggle="tooltip"
                    data-placement="right"
                    title={isRTL ? "حقل إجباري" : "champ obligatoire"}
                  >
                    *
                  </span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  required
                  className="form-control"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12 form-group">
                <label htmlFor="poste" className={isRTL ? "me-3" : "ms-3"}>
                  {isRTL ? "المنصب الحالي" : "Poste actuel"}{" "}
                  <span
                    data-toggle="tooltip"
                    data-placement="right"
                    title={isRTL ? "حقل إجباري" : "champ obligatoire"}
                  >
                    *
                  </span>
                </label>
                <input
                  id="poste"
                  name="poste"
                  required
                  className="form-control"
                  value={formData.poste}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 form-group">
                <label htmlFor="fichier" className={isRTL ? "me-3" : "ms-3"}>
                  {isRTL ? "صورتك" : "Votre photo"}{" "}
                  <span
                    data-toggle="tooltip"
                    data-placement="right"
                    title={isRTL ? "حقل إجباري" : "champ obligatoire"}
                  >
                    *
                  </span>
                </label>
                <input
                  type="file"
                  id="fichier"
                  name="fichier"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12 form-group">
                <label htmlFor="description" className={isRTL ? "me-3" : "ms-3"}>
                  {isRTL ? "الوصف" : "Description"}{" "}
                  <span
                    data-toggle="tooltip"
                    data-placement="right"
                    title={isRTL ? "حقل إجباري" : "champ obligatoire"}
                  >
                    *
                  </span>
                </label>
                <textarea
                  id="contenu"
                  name="description"
                  required
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="col-md-12">
              <div className={isRTL ? "text-start" : "text-end"}>
                <button
                  type="submit"
                  className="btn btn-success btn-icon-split"
                  container="formTemoi"
                >
                  <span className="icon text-white-50">
                    <i className="main-icon fas fa-save"></i>
                    <span
                      className="spinner-border spinner-border-sm "
                      style={{ display: "none" }}
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <i
                      className="answers-well-saved text-success fa fa-check"
                      style={{ display: "none" }}
                      aria-hidden="true"
                    ></i>
                  </span>
                  <span className={`text ${isRTL ? "me-2" : "ms-2"}`}>
                    {isRTL ? "إضافة" : "Ajouter"}
                  </span>
                </button>
                <div id="form-errors" className={isRTL ? "text-right" : "text-left"}></div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestimonialForm;
