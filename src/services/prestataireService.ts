// src/services/prestataireService.ts

import api from "./api";

export const getDashboardStats =
async () => {

  const response =
    await api.get(
      "/prestataire/dashboard"
    );

  return response.data;
};