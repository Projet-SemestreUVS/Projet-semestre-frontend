// src/services/adminService.ts
import api from './api';

// Fonctions de la version distante (avec async/await)
export const getStats = async () => {
  const response = await api.get("/admin/statistiques");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUser = async (id: number, userData: any) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

export const createService = async (data: any) => {
  const response = await api.post("/admin/services", data);
  return response.data;
};

export const updateService = async (id: number, data: any) => {
  const response = await api.put(`/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: number) => {
  const response = await api.delete(`/admin/services/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (data: any) => {
  const response = await api.post("/admin/categories", data);
  return response.data;
};

export const updateCategory = async (id: number, data: any) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

export const getReviews = async () => {
  const response = await api.get("/admin/reviews");
  return response.data;
};

export const deleteReview = async (id: number) => {
  const response = await api.delete(`/admin/reviews/${id}`);
  return response.data;
};

export const getReservations = async () => {
  const response = await api.get("/reservations");
  return response.data;
};

export const updateReservation = async (id: number, data: any) => {
  const response = await api.put(`/admin/reservations/${id}`, data);
  return response.data;
};

export const deleteReservation = async (id: number) => {
  const response = await api.delete(`/admin/reservations/${id}`);
  return response.data;
};

export const getAvis = async () => {
  const response = await api.get("/avis");
  return response.data;
};

// Export par défaut pour compatibilité
const adminService = {
  getStats,
  getUsers,
  getUser,
  createUser,
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
  getAvis,
};

export default adminService;