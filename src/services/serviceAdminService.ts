import api from "./api";

/**
 * Récupérer tous les services
 */
export const getServices = async () => {
  const response = await api.get("/auth/services");
  return response.data;
};

/**
 * Ajouter un service
 */
export const createService = async (
  data: FormData
) => {
  const response = await api.post(
    "/auth/services",
    data
  );

  return response.data;
};

/**
 * Modifier un service
 */
export const updateService = async (
  id: number,
  data: FormData
) => {
  const response = await api.post(
    `/auth/services/${id}`,
    data
  );

  return response.data;
};

/**
 * Supprimer un service
 */
export const deleteService = async (
  id: number
) => {
  const response = await api.delete(
    `/auth/services/${id}`
  );

  return response.data;
};

/**
 * Activer / Désactiver un service
 */
export const toggleServiceStatus = async (
  service: any
) => {
  const response = await api.put(
    `/auth/services/${service.id}`,
    {
      ...service,
      disponibilite:
        !service.disponibilite,
    }
  );

  return response.data;
};

/**
 * Récupérer un service par ID
 */
export const getServiceById = async (
  id: number
) => {
  const response = await api.get(
    `/auth/services/${id}`
  );

  return response.data;
};