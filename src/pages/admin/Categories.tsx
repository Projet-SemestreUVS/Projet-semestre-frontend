import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import CategoriesTable from "../../components/admin/CategoriesTable";
import CategoryModal from "../../components/admin/CategoryModal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

import { toast } from "react-toastify";


const Categories = () => {


const [categories,setCategories] =
useState<any[]>([]);


const [selectedCategory,setSelectedCategory] =
useState<any>(null);


const [search,setSearch] =
useState("");


const [modalKey,setModalKey] =
useState(0);





useEffect(()=>{

 fetchCategories();

},[]);






const fetchCategories = async()=>{

try{


const data =
await getCategories();


setCategories(data);



}catch(error){


toast.error(
"Erreur chargement"
);


}

};








const handleSave =
async(formData:FormData)=>{


try{


if(selectedCategory){


await updateCategory(
selectedCategory.id,
formData
);


toast.success(
"Catégorie modifiée"
);



}else{


await createCategory(
formData
);


toast.success(
"Catégorie créée"
);


}




await fetchCategories();



// vider formulaire
setModalKey(
prev=>prev+1
);


// fermer proprement
const modalElement =
document.getElementById(
"categoryModal"
);


if(modalElement){


const button =
document.querySelector(
'[data-bs-dismiss="modal"]'
) as HTMLElement;


button?.click();


}




setSelectedCategory(null);



}catch(error){


console.log(error);


toast.error(
"Erreur"
);


}



};









const handleDelete =
async(id:number)=>{


if(!confirm(
"Supprimer cette catégorie ?"
))
return;



try{


await deleteCategory(id);



toast.success(
"Catégorie supprimée"
);



fetchCategories();



}catch(error){


toast.error(
"Erreur suppression"
);


}


};









const filteredCategories =
categories.filter(
(category:any)=>

category.nom
?.toLowerCase()
.includes(
search.toLowerCase()
)

);










return (

<DashboardLayout
sidebar={<AdminSidebar/>}
>


<div className="d-flex justify-content-between mb-4">


<h2>
Gestion Catégories
</h2>



<button

className="btn btn-primary"

data-bs-toggle="modal"

data-bs-target="#categoryModal"

onClick={()=>{

setSelectedCategory(null);

}}

>

Ajouter

</button>


</div>







<input

className="form-control mb-4"

placeholder="Rechercher..."

value={search}


onChange={
e=>setSearch(
e.target.value
)
}


/>








<CategoriesTable

categories={
filteredCategories
}


onEdit={(category)=>{

setSelectedCategory(
category
);

}}


onDelete={
handleDelete
}


/>









<CategoryModal


key={modalKey}


category={
selectedCategory
}


onSave={
handleSave
}


/>






</DashboardLayout>


);


};


export default Categories;