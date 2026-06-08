import api from "./api";

export const getDashboard =
async () => {

  const response =
    await api.get(
      "/demandeur/dashboard"
    );

  return response.data;
};