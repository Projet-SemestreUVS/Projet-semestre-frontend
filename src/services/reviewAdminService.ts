import api from "./api";

export const getReviews = async () => {
  const response = await api.get(
    "/admin/reviews"
  );

  return response.data;
};

export const deleteReview = async (
  id:number
) => {

  return await api.delete(
    `/admin/reviews/${id}`
  );
};