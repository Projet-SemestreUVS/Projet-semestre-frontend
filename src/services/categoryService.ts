import api from "./api";


// Récupérer toutes les catégories
export const getCategories = async () => {

  const response =
    await api.get("/auth/categories");

  return response.data;

};





// Créer une catégorie avec image
export const createCategory = async (data:any) => {

  try {


    console.log(
      "Données envoyées :",
      data
    );


    const response =
      await api.post(
        "/auth/categories",
        data,
        {
          headers:{
            "Content-Type":
            "multipart/form-data",
          },
        }
      );


    return response.data;



  } catch(error:any) {


    console.log(
      "Erreur Laravel :",
      error.response?.data
    );


    throw error;

  }

};







// Modifier une catégorie avec image
export const updateCategory = async (
  id:number,
  data:any
) => {


  try{


    const response =
      await api.post(
        `/auth/categories/${id}?_method=PUT`,
        data,
        {
          headers:{
            "Content-Type":
            "multipart/form-data",
          },
        }
      );


    return response.data;



  }catch(error:any){


    console.log(
      "Erreur modification :",
      error.response?.data
    );


    throw error;


  }


};







// Supprimer une catégorie
export const deleteCategory = async (
 id:number
) => {


 const response =
   await api.delete(
    `/auth/categories/${id}`
   );


 return response.data;


};