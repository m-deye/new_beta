import React from "react";

const FormSection = ({ title, section, handleSubmit, messages, children }) => (
  <section id={section} className="form-section">
    <h2>{title}</h2>
    <form onSubmit={(e) => handleSubmit(e, section)}>
      {messages[section] && (
        <p className={messages[section].includes("Erreur") ? "error" : "success"}>
          {messages[section]}
        </p>
      )}
      {children}
      <button type="submit" className="submit-button">Enregistrer</button>
    </form>
  </section>
);

export default FormSection;