import api from "./api";

export const getAvis = async () => {
  const response = await api.get("/avis");
  return response.data;
};

export const deleteAvis = async (id: number) => {
 return await api.delete(`/avis/${id}`);
};