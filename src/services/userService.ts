import api from "./api";


// récupérer utilisateurs

export const getUsers = async()=>{

    const response =
    await api.get("/auth/users");

    return response.data.data;

};



// créer utilisateur

export const createUser =
async(data:any)=>{

    const response =
    await api.post(
        "/auth/users",
        data
    );

    return response.data;

};



// modifier utilisateur

export const updateUser =
async(id:number,data:any)=>{

    const response =
    await api.put(
        `/auth/users/${id}`,
        data
    );

    return response.data;

};



// supprimer utilisateur

export const deleteUser =
async(id:number)=>{

    const response =
    await api.delete(
        `/auth/users/${id}`
    );

    return response.data;

};