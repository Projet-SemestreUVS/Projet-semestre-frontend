import type { FormEvent } from "react";

interface Category {
  id: number;
  name: string;
}

interface Service {
  id?: number;
  titre?: string;
  description?: string;
  prix?: string | number;
  categorie_id?: string | number;
}

interface Props {
  service?: Service;
  categories: Category[];
  onSave: (data: FormData) => void;
}

const ServiceModal = ({ service, categories, onSave }: Props) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    onSave(formData);
  };

  const formKey = service?.id ? `edit-${service.id}` : "new";

  return (
    <div className="modal fade" id="serviceModal" tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{service ? "Modifier" : "Ajouter"} Service</h5>
          </div>

          <form key={formKey} onSubmit={handleSubmit}>
            <div className="modal-body">
              <input
                className="form-control mb-3"
                name="titre"
                placeholder="Titre"
                defaultValue={service?.titre ?? ""}
              />

              <textarea
                className="form-control mb-3"
                rows={4}
                name="description"
                placeholder="Description"
                defaultValue={service?.description ?? ""}
              />

              <input
                type="number"
                className="form-control mb-3"
                name="prix"
                placeholder="Prix"
                defaultValue={service?.prix ?? ""}
              />

              <select
                className="form-select mb-3"
                name="categorie_id"
                defaultValue={service?.categorie_id ?? ""}
              >
                <option value="">Choisir catégorie</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input type="file" className="form-control" name="image" />
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
