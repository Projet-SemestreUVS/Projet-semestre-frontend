// src/services/adminService.ts
import api from './api';

// Export individuel des fonctions
export const getUsers = () => api.get('/admin/users');
export const getUser = (id: number) => api.get(`/admin/users/${id}`);
export const updateUser = (id: number, data: any) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);

export const getServices = () => api.get('/admin/services');
export const createService = (data: any) => api.post('/admin/services', data);
export const updateService = (id: number, data: any) => api.put(`/admin/services/${id}`, data);
export const deleteService = (id: number) => api.delete(`/admin/services/${id}`);

export const getCategories = () => api.get('/admin/categories');
export const createCategory = (data: any) => api.post('/admin/categories', data);
export const updateCategory = (id: number, data: any) => api.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id: number) => api.delete(`/admin/categories/${id}`);

export const getReviews = () => api.get('/admin/reviews');
export const deleteReview = (id: number) => api.delete(`/admin/reviews/${id}`);

export const getReservations = () => api.get('/admin/reservations');
export const updateReservation = (id: number, data: any) => api.put(`/admin/reservations/${id}`, data);
export const deleteReservation = (id: number) => api.delete(`/admin/reservations/${id}`);

// Export par défaut pour compatibilité
const adminService = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getServices,
  createService,
  updateService,
  deleteService,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReviews,
  deleteReview,
  getReservations,
  updateReservation,
  deleteReservation,
};

export default adminService;


// src/services/adminService.ts
// import api from './api';

// export const adminService = {
//   // Utilisateurs
//   getUsers: () => api.get('/admin/users'),
//   getUser: (id: number) => api.get(`/admin/users/${id}`),
//   updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
//   deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  
//   // Services
//   getServices: () => api.get('/admin/services'),
//   createService: (data: any) => api.post('/admin/services', data),
//   updateService: (id: number, data: any) => api.put(`/admin/services/${id}`, data),
//   deleteService: (id: number) => api.delete(`/admin/services/${id}`),
  
//   // Catégories
//   getCategories: () => api.get('/admin/categories'),
//   createCategory: (data: any) => api.post('/admin/categories', data),
//   updateCategory: (id: number, data: any) => api.put(`/admin/categories/${id}`, data),
//   deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`),
  
//   // Avis
//   getReviews: () => api.get('/admin/reviews'),
//   deleteReview: (id: number) => api.delete(`/admin/reviews/${id}`),
  
//   // Réservations
//   getReservations: () => api.get('/admin/reservations'),
//   updateReservation: (id: number, data: any) => api.put(`/admin/reservations/${id}`, data),
//   deleteReservation: (id: number) => api.delete(`/admin/reservations/${id}`),
// };