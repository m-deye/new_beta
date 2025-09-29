import React, { useEffect, useState } from "react";
import $ from "jquery"; // Importer jQuery
import "datatables.net-bs5"; // Importer DataTables avec Bootstrap 5
import "datatables.net-responsive-bs5"; // Importer le plugin Responsive de DataTables
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css"; // Importer le CSS de DataTables Bootstrap 5
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css"; // Importer le CSS du plugin Responsive
import "bootstrap/dist/css/bootstrap.min.css"; // Importer Bootstrap CSS

const OffresEmploiSection = () => {
  const [offresEmploi, setOffresEmploi] = useState([]);

  // Récupérer les données depuis l'API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/offres_emplois/")
      .then((response) => response.json())
      .then((data) => {
        setOffresEmploi(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des données:", error));
  }, []);

  // Initialiser DataTables après que les données ont été chargées
  useEffect(() => {
    if (offresEmploi.length > 0) {
      const table = $("#offresEmploiTable").DataTable({
        responsive: true, // Activer le mode responsive
        destroy: true, // Détruire l'instance existante avant de réinitialiser
      });

      // Nettoyer DataTable lors du démontage du composant
      return () => {
        table.destroy();
      };
    }
  }, [offresEmploi]);

  return (
    <section className="container mt-4">
      <h2 className="text-center mb-4">Offres d'emploi</h2>
      <div className="text-center card shadow-sm " style={{ maxWidth: "100%" }}>
        <div className="card-bod">
          <table id="offresEmploiTable" className="table table-striped table-bordered" >
            <thead>
              <tr>
                <th>Titre</th>       
                <th>Date limite</th>
                <th>Entreprise</th>
                <th>Nom du client</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {offresEmploi.map((offre) => (
                <tr key={offre.id}>
                  <td>{offre.titre}</td>
                  <td>{offre.date_limite}</td>
                  <td>{offre.titre_entreprise}</td>
                  <td>{offre.client__nom}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default OffresEmploiSection;