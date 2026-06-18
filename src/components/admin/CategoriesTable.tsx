interface Props {

categories:any[];

onEdit:(category:any)=>void;

onDelete:(id:number)=>void;

}



const CategoriesTable=({
categories,
onEdit,
onDelete

}:Props)=>{


return (

<div className="table-responsive">


<table className="table table-bordered">


<thead>


<tr className="table-header">

<th>#</th>

<th>Nom</th>

<th>Description</th>

<th>Icone</th>

<th>Actions</th>


</tr>


</thead>



<tbody>


{
categories.length>0 ?

categories.map((category,index)=>(


<tr key={category.id}>


<td>
{index+1}
</td>



<td>

{category.nom}

</td>




<td>

{
category.description 
?
category.description
:
"-"
}

</td>




<td>

{
category.icone ?

<img

src={
`http://localhost:8000/storage/${category.icone}`
}

width="50"

height="50"

style={{
objectFit:"cover",
borderRadius:"8px"
}}

/>

:

"-"

}

</td>



<td>


<button

className="btn btn-warning btn-sm me-2"

onClick={()=>
onEdit(category)
}

>

Modifier

</button>




<button

className="btn btn-danger btn-sm"

onClick={()=>
onDelete(category.id)
}

>

Supprimer

</button>



</td>



</tr>


))


:

<tr>

<td colSpan={5}
className="text-center">

Aucune catégorie

</td>

</tr>


}



</tbody>


</table>


</div>


)


}



export default CategoriesTable;