import { useEffect, useState } from "react";

interface Props {
  category?: any;
  onSave: (data: any) => void;
}

const CategoryModal = ({
  category,
  onSave,
}: Props) => {

  const [name, setName] =
    useState("");

  useEffect(() => {

    if (category) {
      setName(category.name);
    }

  }, [category]);

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    onSave({
      name,
    });
  };

  return (

    <div
      className="modal fade"
      id="categoryModal"
      tabIndex={-1}
    >

      <div className="modal-dialog">

        <div className="modal-content">

          <div className="modal-header">

            <h5>

              {category
                ? "Modifier"
                : "Ajouter"}

              {" "}Catégorie

            </h5>

            <button
              className="btn-close"
              data-bs-dismiss="modal"
            />

          </div>

          <form
            onSubmit={handleSubmit}
          >

            <div className="modal-body">

              <input
                type="text"
                className="form-control"
                placeholder="Nom catégorie"
                value={name}
                onChange={(e)=>
                  setName(
                    e.target.value
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

export default CategoryModal;