import api from "./api";

export const getReservations = async () => {
  const response = await api.get(
    "/admin/reservations"
  );

  return response.data;
};

export const updateReservationStatus =
async (
  id:number,
  status:string
) => {

  return await api.patch(
    `/admin/reservations/${id}/status`,
    { status }
  );
};

export const deleteReservation =
async (id:number) => {

  return await api.delete(
    `/admin/reservations/${id}`
  );
};