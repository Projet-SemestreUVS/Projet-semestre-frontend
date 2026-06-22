import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Reservation {
  id: number;
  service_id: number;
  demandeur_id: number;
  prestataire_id: number;
  date_debut: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  created_at: string;

  service?: {
    id: number;
    nom: string;
    prix: number;
  };

  demandeur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };

  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
}

const ReservationsAdmin: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatut, setSelectedStatut] = useState<string>("tous");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const response = await api.get("/reservations");

      let data: Reservation[] = [];

      if (response.data?.data) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.reservations) {
        data = response.data.reservations;
      }

      setReservations(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Erreur lors du chargement des réservations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (
    id: number,
    newStatut: Reservation["statut"]
  ) => {
    try {
      setUpdating(true);

      await api.patch(`/reservations/${id}/status`, {
        statut: newStatut,
      });

      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, statut: newStatut } : r
        )
      );

      if (selectedReservation?.id === id) {
        setSelectedReservation({
          ...selectedReservation,
          statut: newStatut,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette réservation ?")) return;

    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert("Erreur suppression");
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "confirmee":
        return "Confirmée";
      case "terminee":
        return "Terminée";
      case "annulee":
        return "Annulée";
      default:
        return "En attente";
    }
  };

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case "confirmee":
        return "statut-confirmee";
      case "terminee":
        return "statut-terminee";
      case "annulee":
        return "statut-annulee";
      default:
        return "statut-attente";
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchStatut =
      selectedStatut === "tous" || r.statut === selectedStatut;

    const search = searchTerm.toLowerCase();

    const matchSearch =
      r.service?.nom?.toLowerCase().includes(search) ||
      r.demandeur?.prenom?.toLowerCase().includes(search) ||
      r.demandeur?.nom?.toLowerCase().includes(search) ||
      r.prestataire?.prenom?.toLowerCase().includes(search) ||
      r.prestataire?.nom?.toLowerCase().includes(search);

    return matchStatut && matchSearch;
  });

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <p>Chargement...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <p>{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <h1>Gestion des réservations</h1>

      <input
        placeholder="Recherche..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Service</th>
            <th>Demandeur</th>
            <th>Prestataire</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredReservations.map((r) => (
            <tr key={r.id}>
              <td>#{r.id}</td>
              <td>{r.service?.nom || "-"}</td>
              <td>
                {r.demandeur?.prenom} {r.demandeur?.nom}
              </td>
              <td>
                {r.prestataire?.prenom} {r.prestataire?.nom}
              </td>
              <td>
                <span className={getStatutClass(r.statut)}>
                  {getStatutLabel(r.statut)}
                </span>
              </td>
              <td>
                <button
                  disabled={updating}
                  onClick={() =>
                    handleUpdateStatut(r.id, "confirmee")
                  }
                >
                  Confirmer
                </button>

                <button onClick={() => handleDelete(r.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default ReservationsAdmin;