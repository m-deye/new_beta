import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import './PasswordResetRequest.css'; 

import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/password_reset_confirm/${uidb64}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage("Mot de passe réinitialisé avec succès.");
      setError("");
    } catch (err) {
      setError("Erreur lors de la réinitialisation.");
      setMessage("");
    }
  };

  return (

    <div>
    <NavbarComponent />
    <div className="reset-page">
    <div className="password-reset-page d-flex justify-content-center align-items-center">
      <div className="card password-reset-card shadow-lg ">
        <div className="card-header  baccolor fs-5 fw-bold text-center bgcolor">
          Nouveau mot de passe
        </div>
        <div className="card-bod">
          <form onSubmit={handleSubmit}>
            <div className="mb-4 row align-items-center">
              <label htmlFor="newPassword" className="col-md-4 col-form-label text-md-end fw-semibold bgcolore">
                Nouveau mot de passe
              </label>
              <div className="col-md-7">
                <input
                  type="password"
                  id="newPassword"
                  className="form-control"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4 row align-items-center">
              <label htmlFor="confirmPassword" className="col-md-4 col-form-label text-md-end fw-semibold bgcolore">
                Confirmer le mot de passe
              </label>
              <div className="col-md-7">
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="text-end pe-4">
              <button type="submit" className="btn btn-primary px-4">
                Réinitialiser
              </button>
            </div>
          </form>

          {message && <div className="text-success mt-3 text-center">{message}</div>}
          {error && <div className="text-danger mt-3 text-center">{error}</div>}
        </div>
      </div>
    </div>
    <FooterComponent />
    </div>
</div>
  );
};

export default PasswordResetConfirm;
