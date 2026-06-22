import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import { createService } from "../../services/serviceAdminService";
import { toast } from "react-toastify";

const CreateService = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categorie_id: "",
    titre: "",
    description: "",
    tarif: "",
    disponibilite: true,
  });

  const [photos, setPhotos] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append(
        "categorie_id",
        formData.categorie_id
      );

      data.append(
        "titre",
        formData.titre
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "tarif",
        formData.tarif
      );

      data.append(
        "disponibilite",
        String(formData.disponibilite)
      );

      if (photos) {
        for (
          let i = 0;
          i < photos.length;
          i++
        ) {
          data.append(
            "photos[]",
            photos[i]
          );
        }
      }

      await createService(data);

      toast.success(
        "Service ajouté avec succès"
      );

      navigate("/services");

    } catch (error) {
      console.error(error);

      toast.error(
        "Erreur lors de l'ajout"
      );
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="card">
        <div className="card-body">

          <h2 className="mb-4">
            Ajouter un service
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>
                Catégorie
              </label>

              <input
                type="number"
                name="categorie_id"
                className="form-control"
                value={formData.categorie_id}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>
                Titre
              </label>

              <input
                type="text"
                name="titre"
                className="form-control"
                value={formData.titre}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>
                Tarif
              </label>

              <input
                type="number"
                name="tarif"
                className="form-control"
                value={formData.tarif}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>
                Photos
              </label>

              <input
                type="file"
                multiple
                className="form-control"
                onChange={(e) =>
                  setPhotos(
                    e.target.files
                  )
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Enregistrer
            </button>

          </form>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateService;