import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data;
};

export const createCategory = async (
  data: any
) => {
  const response = await api.post(
    "/admin/categories",
    data
  );

  return response.data;
};

export const updateCategory = async (
  id: number,
  data: any
) => {
  const response = await api.put(
    `/admin/categories/${id}`,
    data
  );

  return response.data;
};

export const deleteCategory = async (
  id: number
) => {
  return await api.delete(
    `/admin/categories/${id}`
  );
};