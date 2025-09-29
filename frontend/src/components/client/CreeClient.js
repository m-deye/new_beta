import React, { useState } from "react";
import Navbar from "../../Navbar";
import Header from "../../Header";
import Footer from "../../Footer";

import axios from "axios";

const ClientForm = () => {
  const [formData, setFormData] = useState({
    libelle_fr: "",
    nom: "",
    email: "",
    tel: "",
    domaine: "",
    type_organisation: "",
    adresse: "",
    site_web: "",
    lieu: "",
    fax: "",
    nom_responsable: "",
    fonction_responsable: "",
    email_responsable: "",
    tel_responsable: "",
    nom_ref1: "",
    email_ref1: "",
    nom_ref2: "",
    email_ref2: "",
    logo: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post(
        "http://localhost:8000/gestion_utilisateur/api/ajouterclient/",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Client ajouté avec succès");
      // reset form
      setFormData({
        libelle_fr: "",
        nom: "",
        email: "",
        tel: "",
        domaine: "",
        type_organisation: "",
        adresse: "",
        site_web: "",
        lieu: "",
        fax: "",
        nom_responsable: "",
        fonction_responsable: "",
        email_responsable: "",
        tel_responsable: "",
        nom_ref1: "",
        email_ref1: "",
        nom_ref2: "",
        email_ref2: "",
        logo: null,
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi");
    }
  };

  return (
    <div className="contact-page">
      <Header />
      <Navbar />
      <div className="container py-4" style={{ background: "#fff" }}>
        <div className="col-md-12" id="addForm">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <b className=" mb-3">1- Client </b>
            <br />
            <div className="row ms-2">
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Libellé *</label>
                <input
                  id="libelle"
                  name="libelle_fr"
                  value={formData.libelle_fr}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div
                className="form-group col-md-6"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2" htmlFor="logo">
                  Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Type *</label>
                <select
                  id="type_organisation"
                  name="type_organisation"
                  value={formData.type_organisation}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Selectionner...</option>
                  <option value="1">Organismes Internationaux</option>
                  <option value="2">Banques</option>
                  <option value="3">Sociétés Internationales</option>
                  <option value="4">Instituts</option>
                  <option value="5">ONGs & Associations</option>
                  <option value="6">Sociétés Locales & Bureaux d'études</option>
                  <option value="7">Projets & Administration</option>
                </select>
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Domaine *</label>
                <select
                  id="domaine"
                  name="domaine"
                  value={formData.domaine}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Selectionner</option>
                  <option value="66">Accueil</option>
                  <option value="23">Achat - Approvisionnement</option>
                  <option value="7">Administration</option>
                  <option value="54">Agriculture</option>
                  <option value="31">Agroalimentaire</option>
                  <option value="12">Vente</option>
                </select>
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Adresse *</label>
                <input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Site web</label>
                <input
                  id="site_web"
                  name="site_web"
                  value={formData.site_web}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <b>2- Interlocuteur</b>
            <br />
            <br />
            <div className="row  ms-2">
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Nom *</label>
                <input
                  id="nom_responsable"
                  name="nom_responsable"
                  value={formData.nom_responsable}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Email *</label>
                <input
                  type="email"
                  id="email_responsable"
                  name="email_responsable"
                  value={formData.email_responsable}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Téléphone *</label>
                <input
                  type="text"
                  id="tel_responsable"
                  name="tel_responsable"
                  value={formData.tel_responsable}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Fonction</label>
                <input
                  type="text"
                  id="fonction_responsable"
                  name="fonction_responsable"
                  value={formData.fonction_responsable}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <b>3- Personne de référence 1</b>
            <br />
            <br />
            <div className="row ms-2">
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Nom</label>
                <input
                  id="nom_ref1"
                  name="nom_ref1"
                  value={formData.nom_ref1}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Email</label>
                <input
                  type="email"
                  id="email_ref1"
                  name="email_ref1"
                  value={formData.email_ref1}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <b>4- Personne de référence 2</b>
            <br />
            <br />
            <div className="row ms-2">
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Nom</label>
                <input
                  id="nom_ref2"
                  name="nom_ref2"
                  value={formData.nom_ref2}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div
                className="col-md-6 form-group"
                style={{ paddingRight: "20px" }}
              >
                <label className="ms-3 mb-2">Email</label>
                <input
                  type="email"
                  id="email_ref2"
                  name="email_ref2"
                  value={formData.email_ref2}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <input
              className="btn btn-success mt-4"
              type="submit"
              value="Envoyer"
            />
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientForm;
