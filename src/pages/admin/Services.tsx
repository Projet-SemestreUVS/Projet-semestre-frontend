import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from
"../../components/dashboard/DashboardLayout";

import AdminSidebar from
"../../components/dashboard/AdminSidebar";

import ServicesTable from
"../../components/prestataire/ServicesTable";

import ServiceDetailsModal from
"../../components/admin/ServiceDetailsModal";

import {
  getServices,
  deleteService,
  toggleServiceStatus,
}
from "../../services/serviceAdminService";

import { toast }
from "react-toastify";

declare var bootstrap:any;

const Services = () => {

  const [services,
    setServices] =
    useState([]);

  const [selectedService,
    setSelectedService] =
    useState<any>(null);

  const [search,
    setSearch] =
    useState("");

  useEffect(() => {

    fetchServices();

  }, []);

  const fetchServices =
  async () => {

    const data =
      await getServices();

    setServices(data);
  };

  const handleViewService = (service: any) => {
    setSelectedService(service);

    new bootstrap.Modal(
      document.getElementById("serviceDetailsModal")
    ).show();
  };

  const handleDelete =
  async (id:number) => {

    if (
      !window.confirm(
        "Supprimer ce service ?"
      )
    ) return;

    await deleteService(id);

    toast.success(
      "Service supprimé"
    );

    fetchServices();
  };

  const handleToggle =
  async (id:number) => {

    await toggleServiceStatus(id);

    toast.success(
      "Statut mis à jour"
    );

    fetchServices();
  };

  const filteredServices =
    services.filter(
      (service:any)=>
        service.titre
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <DashboardLayout
      sidebar={<AdminSidebar />}
    >

      <div
        className="d-flex
        justify-content-between
        align-items-center
        mb-4"
      >

        <h2>
          Gestion Services
        </h2>

      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Rechercher..."
        value={search}
        onChange={(e)=>
          setSearch(
            e.target.value
          )
        }
      />

      <ServicesTable
        services={filteredServices}
        onEdit={handleViewService}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />

      <ServiceDetailsModal
        service={
          selectedService
        }
      />

    </DashboardLayout>
  );
};

export default Services;