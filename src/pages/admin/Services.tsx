import { useCallback, useEffect, useState } from "react";
import { Modal } from "bootstrap";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import ServicesTable from "../../components/prestataire/ServicesTable";
import ServiceDetailsModal from "../../components/admin/ServiceDetailsModal";
import {
  getServices,
  deleteService,
  toggleServiceStatus,
  createService,
  updateService,
} from "../../services/serviceAdminService";
import api from "../../services/api";
import { toast } from "react-toastify";

interface Service {
  id: number;
  categorie_id?: number;
  titre: string;
  description?: string;
  photos_url?: string[];
  tarif: string | number;
  disponibilite?: boolean;
  statut: string;
}

interface Category {
  id: number;
  nom: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getServices();
      if (Array.isArray(response)) {
        setServices(response);
      } else if (response?.data) {
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur chargement services");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/auth/categories");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur chargement catégories");
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices]);

  const filteredServices = services.filter((service) =>
    service.titre.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditService = (service: Service) => {
    console.log("handleEditService appelé", service);

    setEditingService(service);

    setTimeout(() => {
      const modalElement = document.getElementById("editServiceModal");

      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    }, 100);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer ce service ?")) return;
    try {
      await deleteService(id);
      toast.success("Service supprimé");
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error("Erreur suppression");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleServiceStatus(id);
      toast.success("Statut mis à jour");
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error("Erreur mise à jour");
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Services</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createServiceModal"
        >
          Ajouter un service
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      ) : (
        <ServicesTable
          services={filteredServices}
          onEdit={handleEditService}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}

      <div className="modal fade" id="createServiceModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter un service</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  try {
                    await createService(formData);
                    toast.success("Service ajouté avec succès");
                    fetchServices();
                    (document.querySelector("#createServiceModal .btn-close") as HTMLButtonElement)?.click();
                    e.currentTarget.reset();
                  } catch (error) {
                    console.error(error);
                    toast.error("Erreur ajout service");
                  }
                }}
              >
                <div className="mb-3">
                  <label className="form-label">Catégorie</label>
                  <select name="categorie_id" className="form-select" required>
                    <option value="">Choisir une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label>Titre</label>
                  <input type="text" name="titre" className="form-control" required />
                </div>

                <div className="mb-3">
                  <label>Description</label>
                  <textarea name="description" rows={4} className="form-control" required />
                </div>

                <div className="mb-3">
                  <label>Tarif</label>
                  <input type="number" name="tarif" className="form-control" required />
                </div>

                <div className="mb-3">
                  <label>Photos</label>
                  <input type="file" name="photos[]" multiple className="form-control" />
                </div>

                <div className="mb-3">
                  <label>Disponibilité</label>
                  <select name="disponibilite" className="form-select" defaultValue="1">
                    <option value="1">Disponible</option>
                    <option value="0">Indisponible</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Statut</label>
                  <select name="statut" className="form-select" defaultValue="active">
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-success">
                  Enregistrer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editServiceModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modifier un service</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              {editingService && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    try {
                      await updateService(editingService.id, formData);
                      toast.success("Service modifié avec succès");
                      fetchServices();
                      (document.querySelector("#editServiceModal .btn-close") as HTMLButtonElement)?.click();
                    } catch (error) {
                      console.error(error);
                      toast.error("Erreur modification");
                    }
                  }}
                >
                  <div className="mb-3">
                    <label>Catégorie</label>
                    <select
                      name="categorie_id"
                      className="form-select"
                      defaultValue={editingService.categorie_id}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Titre</label>
                    <input
                      type="text"
                      name="titre"
                      className="form-control"
                      defaultValue={editingService.titre}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      className="form-control"
                      defaultValue={editingService.description}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Tarif</label>
                    <input
                      type="number"
                      name="tarif"
                      className="form-control"
                      defaultValue={editingService.tarif}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Disponibilité</label>
                    <select
                      name="disponibilite"
                      className="form-select"
                      defaultValue={editingService.disponibilite ? "1" : "0"}
                    >
                      <option value="1">Disponible</option>
                      <option value="0">Indisponible</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Statut</label>
                    <select
                      name="statut"
                      className="form-select"
                      defaultValue={editingService.statut}
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Photos</label>
                    <input type="file" name="photos[]" multiple className="form-control" />
                  </div>

                  <button type="submit" className="btn btn-warning">
                    Modifier
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <ServiceDetailsModal service={selectedService} />
    </DashboardLayout>
  );
};

export default Services;
