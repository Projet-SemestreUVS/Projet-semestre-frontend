
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import ReviewsTable from "../../components/admin/ReviewsTable";
import ReviewDetailsModal from "../../components/admin/ReviewDetailsModal";
import {
  getReviews,
  deleteReview,
} from "../../services/reviewAdminService";

interface Avis {
  id: number;
  user: {
    name: string;
    email: string;
  };
  service: {
    titre: string;
  };
  note: number;
  commentaire: string;
  created_at: string;
}

const Avis = () => {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAvis, setSelectedAvis] = useState<Avis | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      setLoading(true);

      const data = await getReviews();

      setAvis(data);
    } catch (error) {
      console.error("Erreur chargement avis :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet avis ?"
    );

    if (!confirmed) return;

    try {
      await deleteReview(id);

      setAvis((prevAvis) =>
        prevAvis.filter((item) => item.id !== id)
      );

      alert("Avis supprimé avec succès");
    } catch (error) {
      console.error("Erreur suppression :", error);
      alert("Impossible de supprimer cet avis");
    }
  };

  const handleViewDetails = (avisItem: Avis) => {
    setSelectedAvis(avisItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAvis(null);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Gestion des Avis
          </h1>

          <button
            onClick={fetchAvis}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Actualiser
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            Chargement des avis...
          </div>
        ) : avis.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Aucun avis disponible
          </div>
        ) : (
          <ReviewsTable
            reviews={avis}
            onDelete={handleDelete}
            onView={handleViewDetails}
          />
        )}
      </div>

      {isModalOpen && selectedAvis && (
        <ReviewDetailsModal
          review={selectedAvis}
          onClose={closeModal}
        />
      )}
    </DashboardLayout>
  );
};

export default Avis;
