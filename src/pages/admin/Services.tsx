import { useEffect, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import ServicesTable from "../../components/prestataire/ServicesTable";
import ServiceDetailsModal from "../../components/admin/ServiceDetailsModal";

import {
  getServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} from "../../services/serviceAdminService";

import { getCategories } from "../../services/categoryService";

import { toast } from "react-toastify";

declare var bootstrap: any;

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    titre: "",
    description: "",
    tarif: "",
    categorie_id: "",
    statut: "active",
    disponibilite: true,
    photos: null,
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  // ✅ SERVICES
  const fetchServices = async () => {
    try {
      const data = await getServices();

      setServices(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      toast.error("Erreur chargement services");
    }
  };

  // ✅ CATEGORIES
  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ VIEW SERVICE
  const handleViewService = (service: any) => {
    setSelectedService(service);

    const modal = document.getElementById("serviceDetailsModal");
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  };

  // ✅ ADD
  const handleAdd = () => {
    setEditingService(null);

    setFormData({
      titre: "",
      description: "",
      tarif: "",
      categorie_id: "",
      statut: "active",
      disponibilite: true,
      photos: null,
    });

    setShowFormModal(true);
  };

  // ✅ EDIT
  const handleEdit = (service: any) => {
    setEditingService(service);

    setFormData({
      titre: service.titre || "",
      description: service.description || "",
      tarif: service.tarif || "",
      categorie_id: service.categorie_id || "",
      statut: service.statut || "active",
      disponibilite: service.disponibilite ?? true,
      photos: null,
    });

    setShowFormModal(true);
  };

  // ✅ SAVE (CREATE / UPDATE)
  const handleSave = async () => {
    if (!formData.categorie_id) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    try {
      const data = new FormData();

      data.append("titre", formData.titre);
      data.append("description", formData.description);
      data.append("tarif", formData.tarif);
      data.append("categorie_id", formData.categorie_id);
      data.append("statut", formData.statut);
      data.append(
  "disponibilite",
  formData.disponibilite ? "1" : "0"
);

      if (formData.photos) {
        for (let i = 0; i < formData.photos.length; i++) {
          data.append("photos[]", formData.photos[i]);
        }
      }

      if (editingService) {
        data.append("_method", "PUT");
        await updateService(editingService.id, data);
        toast.success("Service modifié");
      } else {
        await createService(data);
        toast.success("Service ajouté");
      }

      setShowFormModal(false);
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer ce service ?")) return;

    try {
      await deleteService(id);
      toast.success("Service supprimé");
      fetchServices();
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  // ✅ TOGGLE STATUS
  const handleToggle = async (id: number) => {
    try {
      const service = services.find((s: any) => s.id === id);
      if (!service) return;

      await toggleServiceStatus(service);
      toast.success("Statut modifié");
      fetchServices();
    } catch (error) {
      toast.error("Erreur changement statut");
    }
  };

  const filteredServices = services.filter((service) =>
    service.titre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Services</h2>

        <button className="btn btn-primary" onClick={handleAdd}>
          Ajouter Service
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ServicesTable
        services={filteredServices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
        onView={handleViewService}
      />

      <ServiceDetailsModal service={selectedService} />

      {showFormModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>
                  {editingService ? "Modifier Service" : "Ajouter Service"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowFormModal(false)}
                />
              </div>

              <div className="modal-body">

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Titre"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                />

                <textarea
                  className="form-control mb-3"
                  rows={4}
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Tarif"
                  value={formData.tarif}
                  onChange={(e) =>
                    setFormData({ ...formData, tarif: e.target.value })
                  }
                />

                <select
                  className="form-control mb-3"
                  value={formData.categorie_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categorie_id: e.target.value,
                    })
                  }
                >
                  <option value="">Sélectionner une catégorie</option>

                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </select>

                <input
  type="file"
  multiple
  className="form-control mb-3"
  onChange={(e) =>
    setFormData({
      ...formData,
      photos: e.target.files,
    })
  }
/>

                <select
                  className="form-control mb-3"
                  value={formData.statut}
                  onChange={(e) =>
                    setFormData({ ...formData, statut: e.target.value })
                  }
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>

                <select
                  className="form-control"
                  value={formData.disponibilite ? "1" : "0"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      disponibilite: e.target.value === "1",
                    })
                  }
                >
                <option value="1">
    Disponible
  </option>

  <option value="0">
    Indisponible
  </option>
                </select>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowFormModal(false)}
                >
                  Annuler
                </button>

                <button className="btn btn-primary" onClick={handleSave}>
                  Enregistrer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Services;