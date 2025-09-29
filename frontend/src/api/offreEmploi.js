import apiClient from './apiClient';

export const getOffresEmploi = () => {
  return apiClient.get('/offres_emploi/liste/');
};

// export const getOffreEmploiById = (id) => {
//   return apiClient.get(`/offres_emploi/${id}/`);
// };

// export const createOffreEmploi = (data) => {
//   return apiClient.post('/offres_emploi/', data);
// };

// export const updateOffreEmploi = (id, data) => {
//   return apiClient.put(`/offres_emploi/${id}/`, data);
// };

// export const deleteOffreEmploi = (id) => {
//   return apiClient.delete(`/offres_emploi/${id}/`);
// };
