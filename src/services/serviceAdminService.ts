import api from "./api";

export const getServices = async () => {
  const response = await api.get("/admin/services");
  return response.data;
};

export const deleteService = async (
  id: number
) => {
  return await api.delete(
    `/admin/services/${id}`
  );
};

export const toggleServiceStatus = async (
  id: number
) => {
  return await api.patch(
    `/admin/services/${id}/status`
  );
};