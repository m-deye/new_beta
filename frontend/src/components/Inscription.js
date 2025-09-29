import React, { useState } from "react";
import "../assets/styles/Inscription.css";

import axiosInstance from "../api/axiosInstance";

import NavbarComponent from "./NavbarComponent";
import FooterComponent from "./FooterComponent";

const Inscription = () => {
  const [userType, setUserType] = useState(2); // 2 = Candidat, 3 = Client
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData({
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });
    setError("");
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Vérification des champs obligatoires
  //   if (!formData.username || !formData.email || !formData.password || !formData.passwordConfirm) {
  //     setError('Tous les champs obligatoires doivent être remplis.');
  //     return;
  //   }

  //   if (formData.password !== formData.passwordConfirm) {
  //     setError('Les mots de passe ne correspondent pas.');
  //     return;
  //   }

  //   // Détermination du rôle
  //   const role = userType === 2 ? 'candidat' : 'client';

  //   try {
  //       const response = await fetch(`http://127.0.0.1:8000/inscription/${role}/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         username: formData.username,
  //         email: formData.email,
  //         password: formData.password,
  //         role, // Ajout du rôle
  //       }),
  //     });

  //     if (response.ok) {
  //       alert(`Inscription réussie en tant que ${role}. Veuillez valider votre compte.`);
  //       setFormData({ username: '', email: '', password: '', passwordConfirm: '' });
  //       setError('');
  //     } else {
  //       const errorData = await response.json();
  //       setError(errorData.message || 'Une erreur est survenue lors de l’inscription.');
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la requête:', error);
  //     setError('Une erreur est survenue. Veuillez réessayer plus tard.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Détermination du rôle
    const role = userType === 2 ? "candidat" : "client";

    try {
      const response = await axiosInstance.post(`/inscriptions/${role}/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role, // facultatif si le backend l'infère déjà
      });

      alert(
        `Inscription réussie en tant que ${role}. Veuillez valider votre compte.`
      );
      setFormData({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
      setError("");
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
      if (error.response || error.response.data) {
        setError(error.response.data.message || "Cet utilisateur existe déjà.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
    }
  };

  return (
    <div>
      <NavbarComponent />

      <div className="inscription-container" style={{ background: "#E7EFF7" }}>
        <div className="card  cardinscript shadow mt-3">
          <div className="card-header text-center font-weight-bold text-white bg-info">
            Inscription
          </div>
          <div className="">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Choix du type d'utilisateur */}
              <div
                className="user-type-section"
                style={{
                  marginLeft: "15px",
                  marginRight: "17px",
                  marginTop: "10px",
                }}
              >
                <h6 className="user-type-label">Vous êtes?</h6>
                <div className="radio-buttons">
                  <div className="custom-radio">
                    <input
                      type="radio"
                      checked={userType === 2}
                      onChange={() => handleUserTypeChange(2)}
                      id="type_de"
                      value="2"
                      name="type_user"
                    />
                    <label htmlFor="type_de">
                      <span className="radio-mark"></span>
                      Candidat
                    </label>
                  </div>

                  <div className="custom-radio">
                    <input
                      type="radio"
                      checked={userType === 3}
                      onChange={() => handleUserTypeChange(3)}
                      id="type_emp"
                      value="3"
                      name="type_user"
                    />
                    <label htmlFor="type_emp">
                      <span className="radio-mark"></span>
                      Client
                    </label>
                  </div>
                </div>
              </div>

              <br />

              {/* Champs obligatoires */}
              <div className="form-group">
                <input
                  placeholder="Nom d'utilisateur"
                  id="username"
                  type="text"
                  className="form-controls"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Adresse email"
                  id="email"
                  type="email"
                  className="form-controls"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="password-row">
                <div className="form-group half-width">
                  <input
                    placeholder="Mot de passe"
                    id="password"
                    type="password"
                    className="form-controls"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  className="form-group half-width"
                  style={{ marginRight: "17px" }}
                >
                  <input
                    placeholder="Confirmez votre mot de passe"
                    id="password-confirm"
                    type="password"
                    className="form-controls"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group mt-3 text-right">
                <button type="submit" className="btn btns bg-info text-white">
                  Inscription
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-3 text-center">
          <span className="mr-3 mt-2">
            Vous avez déjà un compte? <a href="/login">Se connecter</a>
          </span>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default Inscription;
