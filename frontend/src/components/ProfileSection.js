import React from "react";
import { FormSection, InputField, SelectField } from "./FormComponents";

const ProfileSection = ({ profile, handleChange, handleSubmit, messages, domaines, typesOrganisation }) => {
  return (
    <>
      <FormSection title="Informations Générales" section="info" handleSubmit={handleSubmit} messages={messages}>
        <InputField label="Logo:" type="file" name="logo" onChange={handleChange} />
        <InputField label="Libellé (français)" name="libelle_fr" value={profile.libelle_fr} onChange={handleChange} />
        <InputField label="Libellé (arabe)" name="libelle_ar" value={profile.libelle_ar} onChange={handleChange} />
        <InputField label="Email" type="email" name="email" value={profile.email} onChange={handleChange} />
        <InputField label="Téléphone" name="tel" value={profile.tel} onChange={handleChange} />
        <SelectField label="Domaine" name="domaine" value={profile.domaine} onChange={handleChange} options={domaines} />
        <SelectField label="Type d'organisation" name="type_organisation" value={profile.type_organisation} onChange={handleChange} options={typesOrganisation} />
      </FormSection>

      <FormSection title="Contact & Responsable" section="contact" handleSubmit={handleSubmit} messages={messages}>
        <InputField label="Lieu" name="lieu" value={profile.lieu} onChange={handleChange} />
        <InputField label="Fax" name="fax" value={profile.fax} onChange={handleChange} />
        <InputField label="Nom Responsable" name="nom_responsable" value={profile.nom_responsable} onChange={handleChange} />
        <InputField label="Fonction Responsable" name="fonction_responsable" value={profile.fonction_responsable} onChange={handleChange} />
        <InputField label="Email Responsable" type="email" name="email_responsable" value={profile.email_responsable} onChange={handleChange} />
        <InputField label="Téléphone Responsable" name="tel_responsable" value={profile.tel_responsable} onChange={handleChange} />
        <InputField label="Site Web" name="site_web" value={profile.site_web} onChange={handleChange} />
      </FormSection>

      <FormSection title="Gestion de Compte" section="compte" handleSubmit={handleSubmit} messages={messages}>
        <InputField label="Nom Utilisateur" name="username" value={profile.username} onChange={handleChange} />
        <InputField label="Email" type="email" name="email" value={profile.email} onChange={handleChange} />
        <InputField label="Mot de passe" type="password" name="mot_de_passe" value={profile.mot_de_passe} onChange={handleChange} />
        <InputField label="Confirmer Mot de passe" type="password" name="confirme_mot_de_passe" value={profile.confirme_mot_de_passe} onChange={handleChange} />
      </FormSection>
    </>
  );
};

export default ProfileSection;