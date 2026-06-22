import api from "./api";

/**
 * Liste des services
 */
export const getServices = async () => {
  try {
    const response = await api.get("/auth/services");
    return response.data;
  } catch (error) {
    console.error("Erreur getServices :", error);
    throw error;
  }
};

/**
 * Détail d'un service
 */
export const getServiceById = async (
  id: number
) => {
  try {
    const response = await api.get(
      `/auth/services/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erreur getServiceById :",
      error
    );
    throw error;
  }
};

/**
 * Création d'un service
 */
export const createService = async (
  serviceData: FormData
) => {
  try {
    const response = await api.post(
      "/auth/services",
      serviceData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erreur createService :",
      error
    );
    throw error;
  }
};

/**
 * Mise à jour d'un service
 */
export const updateService = async (
  id: number,
  serviceData: FormData
) => {
  try {
    const response = await api.post(
      `/auth/services/${id}?_method=PUT`,
      serviceData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erreur updateService :",
      error
    );
    throw error;
  }
};

/**
 * Suppression d'un service
 */
export const deleteService = async (
  id: number
) => {
  try {
    const response = await api.delete(
      `/auth/services/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erreur deleteService :",
      error
    );
    throw error;
  }
};

/**
 * Changer le statut
 */
export const toggleServiceStatus =
  async (id: number) => {
    try {
      const response = await api.patch(
        `/auth/services/${id}/status`
      );

      return response.data;
    } catch (error) {
      console.error(
        "Erreur toggleServiceStatus :",
        error
      );
      throw error;
    }
  };

/**
 * Services du prestataire connecté
 */
export const getMyServices =
  async () => {
    try {
      const response = await api.get(
        "/auth/mes-services"
      );

      return response.data;
    } catch (error) {
      console.error(
        "Erreur getMyServices :",
        error
      );
      throw error;
    }
  };