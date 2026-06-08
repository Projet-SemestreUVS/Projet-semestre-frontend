import api from "./api";

export const getServices =
async (
  page:number = 1,
  search:string = "",
  categorie:string = ""
) => {

  const response =
    await api.get(
      `/services?page=${page}
      &search=${search}
      &categorie_id=${categorie}`
    );

  return response.data;
};

export const getService =
async (id:number) => {

  const response =
    await api.get(
      `/services/${id}`
    );

  return response.data;
};