// src/services/adminService.ts
import api from "./api";

export const getStats = async () => {
  const response = await api.get("/admin/statistiques");
  return response.data;
};

export const getUsers = async () => {
  // CORRECTION: Utiliser /users au lieu de /admin/users
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

export const getReservations = async () => {
  const response = await api.get("/reservations");
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getAvis = async () => {
  const response = await api.get("/avis");
  return response.data;
};