import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";
import NavbarComponent from "./NavbarComponent";
import FooterComponent from "./FooterComponent";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // ✅ State pour "Restez connecté"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginRes = await axiosInstance.post("/api/login/", {
        email,
        password,
      });
      const data = loginRes.data;

      console.log("Réponse de l'API login:", data);

      // ✅ Stockage selon la case "Restez connecté"
      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("user_token", data.token);
      storage.setItem("user_role", data.role);
      storage.setItem("user_id", data.user_id);

      let profileUrl = "";
      let dashboardRoute = "";

      if (data.role === "client") {
        storage.setItem("client_id", data.role_id);
        profileUrl = `/api/client/${data.role_id}/profile/`;
      } else if (data.role === "candidat") {
        storage.setItem("candidat_id", data.role_id);
        profileUrl = `/api/candidat/${data.role_id}/profile/`;
      } else {
        setError("Rôle non reconnu.");
        return;
      }

      const profileRes = await axiosInstance.get(profileUrl, {
        headers: {
          Authorization: `Token ${data.token}`,
        },
      });

      const profileData = profileRes.data;
      console.log("Profil récupéré:", profileData);

      if (data.role === "client") {
        dashboardRoute = `/client-dashboard/${profileData.username}`;
      } else if (data.role === "candidat") {
        dashboardRoute = `/candidat-dashboard/${profileData.username}`;
      }

      navigate(dashboardRoute, { state: { profileData } });
    } catch (error) {
      console.error("Erreur lors du login:", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Votre compte client n'a pas encore été validé.");
      }
    }
  };

  return (
    <div>
      <NavbarComponent />

      <div className="py-1" id="appMain" style={{ background: "#E7EFF7" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="row">
                <div className="col-lg-12">
                  <div className="carde shadow-lg">
                    <div className="p-0">
                      <div className="px-5 pt-5 pb-3">
                        <div className="text-center">
                          <h1 className="h4 text-gray-900 mb-4">CONNEXION</h1>
                          {error && <p className="text-danger">{error}</p>}
                        </div>
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label
                              htmlFor="email"
                              className="control-label d-none"
                            >
                              Utilisateur
                            </label>
                            <input
                              placeholder="Utilisateur"
                              id="email"
                              type="text"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              autoFocus
                            />
                          </div>
                          <div className="form-group">
                            <label
                              htmlFor="password"
                              className="control-label d-none"
                            >
                              Mot de passe
                            </label>
                            <input
                              placeholder="Mot de passe"
                              id="password"
                              type="password"
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <div className="checkbox">
                              <label>
                                <input
                                  type="checkbox"
                                  name="remember"
                                  checked={remember}
                                  onChange={(e) =>
                                    setRemember(e.target.checked)
                                  }
                                />{" "}
                                Restez connecté
                              </label>
                            </div>
                          </div>
                          <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-info btn-block"
                            >
                              Connexion
                            </button>
                          </div>
                        </form>
                        <div className="text-center mt-4">
                          <a className="text-body" href="PasswordResetRequest">
                            Mot de passe oublié?
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    Nouvel utilisateur?{" "}
                    <a href="/inscription">Créer un compte!</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default Login;
