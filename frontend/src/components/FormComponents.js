import React from "react";

export const FormSection = ({ title, section, handleSubmit, messages, children }) => (
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

export const InputField = ({ label, type = "text", name, value, onChange }) => (
  <div className="input-field">
    <label>{label}</label>
    <input type={type} name={name} value={value || ""} onChange={onChange} />
  </div>
);

export const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="input-field">
    <label>{label}</label>
    <select name={name} value={value || ""} onChange={onChange}>
      <option value="">Sélectionnez une option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);