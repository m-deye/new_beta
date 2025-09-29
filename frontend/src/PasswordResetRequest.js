import React, { useState } from "react";
import "./PasswordResetRequest.css";

import axiosInstance from "./api/axiosInstance";

import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remplace cette ligne par ton axiosInstance si besoin
      await axiosInstance.post("/password_reset/", { email });
      setMessage("Un lien de réinitialisation vous a été envoyé.");
      setError("");
    } catch (err) {
      setError("Erreur lors de la demande.");
      setMessage("");
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="password-reset-page d-flex justify-content-center align-items-center">
        <div className="card password-reset-card shadow-lg">
          <div className="card-header  bgcolor baccolor fs-5 fw-bold text-center">
            Réinitialisation du mot de passe
          </div>
          <div className="card-bod">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 row align-items-center">
                <label
                  htmlFor="email"
                  className="col-md-4 col-form-label text-md-end fw-semibold bgcolor"
                >
                  Adresse email
                </label>
                <div className="col-md-7 ">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <div className="text-end pe-4">
                <button
                  type="submit"
                  className="btn btn-primary px-4 baccolorbtn"
                >
                  Envoyer le lien de réinitialisation du mot de passe
                </button>
              </div>
            </form>

            {message && (
              <div className="text-success mt-3 text-center">{message}</div>
            )}
            {error && (
              <div className="text-danger mt-3 text-center">{error}</div>
            )}
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default PasswordResetRequest;
