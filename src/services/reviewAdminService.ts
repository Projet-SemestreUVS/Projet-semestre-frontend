import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth/avis";

export const getReviews = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getReview = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createReview = async (data: any) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateReview = async (id: number, data: any) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};