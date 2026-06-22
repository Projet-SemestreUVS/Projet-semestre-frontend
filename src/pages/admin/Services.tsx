import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import ServicesTable from "../../components/prestataire/ServicesTable";
import ServiceDetailsModal from "../../components/admin/ServiceDetailsModal";

import {
  getServices,
  deleteService,
  toggleServiceStatus,
  createService,
} from "../../services/serviceAdminService";

import api from "../../services/api";
import { toast } from "react-toastify";

declare const bootstrap: {
  Modal: new (element: HTMLElement) => {
    show: () => void;
  };
};

interface Service {
  id: number;
  titre: string;
  photos_url?: string[];
  tarif: string | number;
  statut: string;
}

interface Category {
  id: number;
  nom: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- SERVICES ----------------
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

  // ---------------- CATEGORIES ----------------
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

  // ---------------- INIT ----------------
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices]);

  // ---------------- FILTER ----------------
  const filteredServices = services.filter((service) =>
    service.titre.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- VIEW ----------------
  const handleViewService = (service: Service) => {
    setSelectedService(service);

    const modalElement = document.getElementById("serviceDetailsModal");

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  // ---------------- DELETE ----------------
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

  // ---------------- TOGGLE ----------------
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
          onEdit={handleViewService}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}

      {/* MODAL CREATE */}
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

                    (document.querySelector(
                      "#createServiceModal .btn-close"
                    ) as HTMLButtonElement)?.click();

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

                <button type="submit" className="btn btn-success">
                  Enregistrer
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      <ServiceDetailsModal service={selectedService} />
    </DashboardLayout>
  );
};

export default Services;