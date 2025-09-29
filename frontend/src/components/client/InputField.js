import React from "react";

const InputField = ({ label, type = "text", name, value, onChange }) => (
  <div className="input-field">
    <label>{label}</label>
    <input type={type} name={name} value={value || ""} onChange={onChange} />
  </div>
);

export default InputField;