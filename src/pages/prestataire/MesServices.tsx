import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import ServicesTable from "../../components/prestataire/ServicesTable";
import ServiceModal from "../../components/prestataire/ServiceModal";
import {
  createService,
  deleteService,
  getMyServices,
  toggleServiceStatus,
  updateService,
} from "../../services/prestatairesServices";
import { getCategories } from "../../services/categoryService";

declare const bootstrap: any;

const MesServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getMyServices();
      setServices(Array.isArray(data) ? data : data?.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : data?.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur lors du chargement des catégories");
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedService(null);
    const modal = new bootstrap.Modal(document.getElementById("serviceModal"));
    modal.show();
  };

  const handleOpenEditModal = (service: any) => {
    setSelectedService(service);
    const modal = new bootstrap.Modal(document.getElementById("serviceModal"));
    modal.show();
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (selectedService) {
        await updateService(selectedService.id, formData);
        toast.success("Service modifié avec succès");
      } else {
        await createService(formData);
        toast.success("Service ajouté avec succès");
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("serviceModal"));
      modal?.hide();
      await fetchServices();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Une erreur est survenue");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce service ?")) return;

    try {
      await deleteService(id);
      toast.success("Service supprimé avec succès");
      await fetchServices();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleServiceStatus(id);
      toast.success("Statut mis à jour avec succès");
      await fetchServices();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur lors du changement de statut");
    }
  };

  const filteredServices = services.filter((service: any) => {
    const text = `${service.titre || ""} ${service.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Mes services</h2>
          <p className="text-muted mb-0">Gérez vos services, leur statut et vos catégories.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          + Ajouter un service
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher un service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Chargement...</div>
      ) : (
        <ServicesTable
          services={filteredServices}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          onToggle={handleToggleStatus}
        />
      )}

      <ServiceModal
        service={selectedService}
        categories={categories}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
};

export default MesServices;
