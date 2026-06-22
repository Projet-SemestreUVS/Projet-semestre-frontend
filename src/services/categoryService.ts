import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/auth/categories");
  return response.data;
};

export const createCategory = async (data: any) => {
  const response = await api.post(
    "/auth/categories",
    data
  );

  return response.data;
};

export const updateCategory = async (
  id: number,
  data: any
) => {
  const response = await api.post(
    `/auth/categories/${id}`,
    data
  );

  return response.data;
};

export const deleteCategory = async (
  id: number
) => {
  const response = await api.delete(
    `/auth/categories/${id}`
  );

  return response.data;
};