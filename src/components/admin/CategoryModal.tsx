import {
useEffect,
useState
} from "react";


interface Props{

category?:any;

onSave:(data:FormData)=>void;

}



const CategoryModal = ({
category,
onSave

}:Props)=>{


const [nom,setNom]=useState("");

const [description,setDescription]=useState("");

const [icone,setIcone]=useState<File|null>(null);





useEffect(()=>{


if(category){

setNom(
category.nom
);

setDescription(
category.description || ""
);


}else{


setNom("");

setDescription("");

setIcone(null);


}


},[category]);








const submit=(e:any)=>{


e.preventDefault();



const data =
new FormData();



data.append(
"nom",
nom
);



data.append(
"description",
description
);




if(icone){

data.append(
"icone",
icone
);

}



onSave(data);



};






return (

<div

className="modal fade"

id="categoryModal"

tabIndex={-1}

>



<div className="modal-dialog">


<div className="modal-content">



<form onSubmit={submit}>


<div className="modal-header">


<h5>
Catégorie
</h5>



<button

type="button"

className="btn-close"

data-bs-dismiss="modal"

/>


</div>






<div className="modal-body">





<input

className="form-control mb-3"

placeholder="Nom"

value={nom}

onChange={
e=>setNom(
e.target.value
)
}

/>







<textarea

className="form-control mb-3"

placeholder="Description"

value={description}

onChange={
e=>setDescription(
e.target.value
)
}

/>






<input

type="file"

className="form-control"

accept="image/*"

onChange={
e=>setIcone(
e.target.files?.[0] || null
)
}

/>




</div>







<div className="modal-footer">



<button

type="submit"

className="btn btn-primary"

>

Enregistrer

</button>



</div>





</form>



</div>


</div>


</div>


);


};


export default CategoryModal;