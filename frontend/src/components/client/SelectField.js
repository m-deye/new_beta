import React from "react";

const SelectField = ({ label, name, value, onChange, options }) => (
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

export default SelectField;