import React from "react";

const AppelsOffres = () => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 max-w-lg">
      {/* Titre principal */}
      <h2 className="text-orange-500 font-bold text-lg mb-4">
        Appels d'Offres
      </h2>

      {/* Liens principaux */}
      <div className="space-y-2">
        <a
          href="https://www.beta.mr/beta/liste_offres/3"
          className="block text-blue-600 hover:underline text-sm"
        >
          Internationaux
        </a>
        <a
          href="https://www.beta.mr/beta/liste_offres/5"
          className="block text-blue-600 hover:underline text-sm"
        >
          Consultations
        </a>
        <a
          href="https://www.beta.mr/beta/liste_offres/4"
          className="block text-blue-600 hover:underline text-sm"
        >
          Locaux
        </a>
        <a
          href="https://www.beta.mr/beta/liste_offres/6"
          className="block text-blue-600 hover:underline text-sm"
        >
          Manifestations d'Intérêts
        </a>
      </div>

      {/* Cartes des offres */}
      <div className="mt-4 space-y-4">
        {/* Première carte */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-start space-x-3">
            <img
              src="https://www.beta.mr/files/emp_files/544/logo.png"
              alt="Logo BCM"
              className="w-10 h-10 rounded"
            />
            <div>
              <h3 className="text-sm font-bold">
                Banque Centrale de Mauritanie (BCM)
              </h3>
              <p className="text-sm text-gray-700">
                <span className="text-red-500 font-bold">Avis de report</span>.
                Mise en place d’un centre d’appel à la BCM
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Date limite:{" "}
                <span className="text-red-600 font-bold">
                  27 janvier 2025 10:00
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Deuxième carte */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-start space-x-3">
            <img
              src="https://www.beta.mr/files/emp_files/543/logo.png"
              alt="Logo Qatar Charity"
              className="w-10 h-10 rounded"
            />
            <div>
              <h3 className="text-sm font-bold">
                QATAR CHARITY (قطر الخيرية)
              </h3>
              <p className="text-sm text-gray-700">
                إعلان مناقصة لبناء مركز متعدد الخدمات
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Date limite:{" "}
                <span className="text-red-600 font-bold">
                  30 janvier 2025
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton Voir Plus */}
      <div className="mt-4 text-center">
        <a
          href="https://www.beta.mr/beta/liste_offres/10"
          className="bg-blue-500 text-white text-sm py-2 px-4 rounded shadow hover:bg-blue-600 inline-block w-full"
        >
          Voir la liste complète
        </a>
      </div>
    </div>
  );
};

export default AppelsOffres;
