import React, { createContext, useContext, useState } from 'react';

// Créez un contexte d'authentification
const AuthContext = createContext();

// Créez un provider pour le contexte
export const AuthProvider = ({ children }) => {
  const [client, setClient] = useState(null); // Stockez les informations du client ici

  // Simulez l'authentification (dans la vraie vie, récupérez ces infos via une API)
  const login = (clientData) => {
    setClient(clientData);
  };

  const logout = () => {
    setClient(null);
  };

  return (
    <AuthContext.Provider value={{ client, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Créez un hook personnalisé pour consommer le contexte
export const useAuth = () => {
  return useContext(AuthContext);
};
