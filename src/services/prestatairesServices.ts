// src/services/prestataireService.ts

import api from "./api";

export const getMyServices = async () => {

  const response =
    await api.get(
      "/prestataire/services"
    );

  return response.data;
};

export const createService = async (
  data: FormData
) => {

  const response =
    await api.post(
      "/prestataire/services",
      data,
      {
        headers:{
          "Content-Type":
          "multipart/form-data"
        }
      }
    );

  return response.data;
};

export const updateService = async (
  id:number,
  data:FormData
) => {

  const response =
    await api.post(
      `/prestataire/services/${id}?_method=PUT`,
      data
    );

  return response.data;
};

export const deleteService = async (
  id:number
) => {

  return await api.delete(
    `/prestataire/services/${id}`
  );
};

export const toggleServiceStatus =
async (id:number) => {

  return await api.patch(
    `/prestataire/services/${id}/status`
  );
};