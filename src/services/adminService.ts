import api from "./api";

export const getStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getServices = async () => {
  const response = await api.get("/admin/services");
  return response.data;
};

export const deleteUser = async (
  id:number
) => {

  return await api.delete(
    `/admin/users/${id}`
  );
};