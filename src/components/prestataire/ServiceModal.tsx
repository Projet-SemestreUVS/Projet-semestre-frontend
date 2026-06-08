import {
  useEffect,
  useState
} from "react";

interface Props {

  service?:any;

  categories:any[];

  onSave:(data:FormData)=>void;
}

const ServiceModal = ({
  service,
  categories,
  onSave
}:Props) => {

  const [titre,setTitre] =
  useState("");

  const [description,
    setDescription] =
    useState("");

  const [prix,setPrix] =
  useState("");

  const [categorieId,
    setCategorieId] =
    useState("");

  const [image,
    setImage] =
    useState<File|null>(null);

  useEffect(() => {

    if(service){

      setTitre(service.titre);

      setDescription(
        service.description
      );

      setPrix(service.prix);

      setCategorieId(
        service.categorie_id
      );
    }

  },[service]);

  const handleSubmit = (
    e:React.FormEvent
  ) => {

    e.preventDefault();

    const formData =
      new FormData();

    formData.append(
      "titre",
      titre
    );

    formData.append(
      "description",
      description
    );

    formData.append(
      "prix",
      prix
    );

    formData.append(
      "categorie_id",
      categorieId
    );

    if(image){
      formData.append(
        "image",
        image
      );
    }

    onSave(formData);
  };

  return (

    <div
      className="modal fade"
      id="serviceModal"
      tabIndex={-1}
    >

      <div className="modal-dialog modal-lg">

        <div className="modal-content">

          <div className="modal-header">

            <h5>

              {
                service
                ? "Modifier"
                : "Ajouter"
              }

              {" "}Service

            </h5>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            <div className="modal-body">

              <input
                className="form-control mb-3"
                placeholder="Titre"
                value={titre}
                onChange={(e)=>
                  setTitre(
                    e.target.value
                  )
                }
              />

              <textarea
                className="form-control mb-3"
                rows={4}
                placeholder="Description"
                value={description}
                onChange={(e)=>
                  setDescription(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Prix"
                value={prix}
                onChange={(e)=>
                  setPrix(
                    e.target.value
                  )
                }
              />

              <select
                className="form-select mb-3"
                value={categorieId}
                onChange={(e)=>
                  setCategorieId(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Choisir catégorie
                </option>

                {categories.map(
                  (cat:any)=>(
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}

              </select>

              <input
                type="file"
                className="form-control"
                onChange={(e)=>
                  setImage(
                    e.target.files?.[0]
                    || null
                  )
                }
              />

            </div>

            <div className="modal-footer">

              <button
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

export default ServiceModal;