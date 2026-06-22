// src/pages/admin/ReservationsAdmin.tsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import ReservationForm from "./ReservationForm";
import api from "../../services/api";

// ----- DONNÉES DE TEST -----
const mockReservations = [
  {
    id: 8,
    service_id: 101,
    demandeur_id: 5,
    prestataire_id: 2,
    date_debut: "2026-03-11 10:00:00",
    statut: "confirmee",
    commentaire: null,
    created_at: "2026-03-11 08:30:00",
    service: { id: 101, nom: "Coiffure homme", prix: 2500 },
    demandeur: { id: 5, nom: "Gueye", prenom: "Daba", email: "daba@test.com", telephone: "776666666" },
    prestataire: { id: 2, nom: "Fall", prenom: "Ahmadou" }
  },
  {
    id: 7,
    service_id: 102,
    demandeur_id: 6,
    prestataire_id: 3,
    date_debut: "2026-03-11 14:30:00",
    statut: "en_attente",
    commentaire: "À confirmer",
    created_at: "2026-03-11 09:00:00",
    service: { id: 102, nom: "Massage", prix: 5000 },
    demandeur: { id: 6, nom: "Gueye", prenom: "Fallou", email: "fallou@test.com", telephone: "777950491" },
    prestataire: { id: 3, nom: "Diop", prenom: "Mamadou" }
  },
  {
    id: 6,
    service_id: 103,
    demandeur_id: 7,
    prestataire_id: 4,
    date_debut: "2026-03-10 08:00:00",
    statut: "terminee",
    commentaire: "Terminé",
    created_at: "2026-03-10 07:45:00",
    service: { id: 103, nom: "Manucure", prix: 1500 },
    demandeur: { id: 7, nom: "Mbaye", prenom: "Diodio", email: "diodio@test.com", telephone: "789665302" },
    prestataire: { id: 4, nom: "Sow", prenom: "Fatou" }
  },
  {
    id: 5,
    service_id: 104,
    demandeur_id: 8,
    prestataire_id: 2,
    date_debut: "2026-03-09 16:00:00",
    statut: "annulee",
    commentaire: "Annulé par le client",
    created_at: "2026-03-09 15:20:00",
    service: { id: 104, nom: "Soin visage", prix: 3500 },
    demandeur: { id: 8, nom: "Ndiaye", prenom: "Aida Habibe", email: "aida@test.com", telephone: "770000000" },
    prestataire: { id: 2, nom: "Fall", prenom: "Ahmadou" }
  },
  {
    id: 3,
    service_id: 105,
    demandeur_id: 9,
    prestataire_id: 5,
    date_debut: "2026-03-08 11:30:00",
    statut: "confirmee",
    commentaire: null,
    created_at: "2026-03-08 10:00:00",
    service: { id: 105, nom: "Coiffure femme", prix: 3000 },
    demandeur: { id: 9, nom: "Soumaré", prenom: "Oumar", email: "oumar@test.com", telephone: "709344994" },
    prestataire: { id: 5, nom: "Ndiaye", prenom: "Aminata" }
  },
  {
    id: 2,
    service_id: 106,
    demandeur_id: 10,
    prestataire_id: 3,
    date_debut: "2026-03-07 09:00:00",
    statut: "en_attente",
    commentaire: "En attente de paiement",
    created_at: "2026-03-07 08:30:00",
    service: { id: 106, nom: "Massage aux pierres chaudes", prix: 6000 },
    demandeur: { id: 10, nom: "Ndiaye", prenom: "Habibe", email: "habibe@test.com", telephone: "770977939" },
    prestataire: { id: 3, nom: "Diop", prenom: "Mamadou" }
  },
  {
    id: 1,
    service_id: 107,
    demandeur_id: 11,
    prestataire_id: 4,
    date_debut: "2026-03-06 13:00:00",
    statut: "terminee",
    commentaire: null,
    created_at: "2026-03-06 12:30:00",
    service: { id: 107, nom: "Épilation", prix: 2000 },
    demandeur: { id: 11, nom: "Gueye", prenom: "Abdoulaye", email: "abdoulaye@test.com", telephone: "763162164" },
    prestataire: { id: 4, nom: "Sow", prenom: "Fatou" }
  }
];

// ----- COMPOSANT -----
const ReservationsAdmin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    // Remplacer par un appel API pour les vraies données
    // Mais ici on utilise les données mock pour tester l'affichage
    setReservations(mockReservations);
    setLoading(false);
    setError(null);

    /* === Pour utiliser l'API, décommentez le code ci-dessous et commentez les lignes ci-dessus ===
    fetchReservations();
    */
  }, []);

  // fonction réelle pour l'API (conservée mais non utilisée pour l'instant)
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/auth/reservations");
      let data = response.data?.data || response.data || [];
      setReservations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setEditingReservation(null);
    setShowForm(true);
  };

  const handleEdit = (reservation: any) => {
    setFormMode('edit');
    setEditingReservation(reservation);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    // Rafraîchir avec l'API ou mock
    setReservations(mockReservations); // Si on veut rafraîchir avec les mock
    showNotification('Opération réussie', 'success');
  };

  const handleDelete = (id: number) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    setReservations(prev => prev.filter(r => r.id !== id));
    showNotification("Réservation supprimée", "success");
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case "confirmee": return "status-confirmee";
      case "terminee": return "status-terminee";
      case "annulee": return "status-annulee";
      default: return "status-en-attente";
    }
  };

  const getStatutTexte = (statut: string) => {
    const map: Record<string, string> = {
      confirmee: "Confirmée",
      terminee: "Terminée",
      annulee: "Annulée",
      en_attente: "En attente"
    };
    return map[statut] || statut;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const filtered = reservations.filter(r => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      r.id.toString().includes(term) ||
      `${r.demandeur?.prenom || ""} ${r.demandeur?.nom || ""}`.toLowerCase().includes(term) ||
      (r.demandeur?.telephone || "").includes(term) ||
      (r.service?.nom || "").toLowerCase().includes(term) ||
      r.statut.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="loading-container"><div className="spinner"/><p>Chargement...</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="reservations-container">
        {notification && (
          <div className={`notification ${notification.type}`}>
            <span>{notification.message}</span>
          </div>
        )}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* En-tête */}
        <div className="header">
          <h1>📋 Gestion des Réservations</h1>
        </div>

        {/* Barre de recherche + Ajouter */}
        <div className="toolbar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm("")}>
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
          <button className="btn-add" onClick={handleCreate}>
            <i className="bi bi-plus-circle"></i> Ajouter
          </button>
        </div>

        {/* Tableau */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Service</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    <i className="bi bi-inbox"></i>
                    <p>Aucune réservation</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="id-cell">{r.id}</td>
                    <td>{r.demandeur?.prenom} {r.demandeur?.nom}</td>
                    <td>{r.demandeur?.telephone || "-"}</td>
                    <td>{r.service?.nom || "-"}</td>
                    <td>{formatDate(r.date_debut)}</td>
                    <td>
                      <span className={`status-badge ${getStatutClass(r.statut)}`}>
                        {getStatutTexte(r.statut)}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-edit" onClick={() => handleEdit(r)} title="Modifier">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(r.id)} title="Supprimer">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau */}
        <div className="table-footer">
          <span>
            Affichage de <strong>{filtered.length}</strong> réservation{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        <ReservationForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
          reservation={editingReservation}
          mode={formMode}
        />
      </div>

      {/* Styles (inchangés) */}
      <style>{`
        .reservations-container {
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 14px 24px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          z-index: 10000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease;
        }
        .notification.success { background: #10b981; }
        .notification.error { background: #ef4444; }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .error-banner {
          background: #fef3c7;
          border-left: 4px solid #d97706;
          padding: 12px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          color: #92400e;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        .spinner {
          width: 44px;
          height: 44px;
          border: 3px solid #e2e8f0;
          border-top-color: #4a6cf7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1a2332;
          margin-bottom: 24px;
        }
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50px;
          padding: 6px 16px;
          flex: 1;
          max-width: 380px;
          transition: all 0.3s;
        }
        .search-box:focus-within {
          border-color: #4a6cf7;
          box-shadow: 0 0 0 3px rgba(74,108,247,0.12);
        }
        .search-box i {
          color: #94a3b8;
          font-size: 16px;
          margin-right: 10px;
        }
        .search-box input {
          border: none;
          background: transparent;
          padding: 10px 0;
          font-size: 14px;
          width: 100%;
          outline: none;
          color: #1a2332;
        }
        .search-box input::placeholder { color: #aab7cc; }
        .clear-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px 6px;
          font-size: 14px;
        }
        .btn-add {
          background: #4a6cf7;
          color: white;
          border: none;
          padding: 11px 26px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .btn-add:hover {
          background: #3a5cd9;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74,108,247,0.35);
        }
        .btn-add i { font-size: 18px; }
        .table-wrapper {
          background: white;
          border-radius: 14px;
          border: 1px solid #e9edf4;
          overflow: hidden;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        thead {
          background: #f8fafd;
          border-bottom: 2px solid #e9edf4;
        }
        thead th {
          text-align: left;
          padding: 14px 18px;
          font-weight: 600;
          color: #4a5b74;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        tbody tr {
          border-bottom: 1px solid #f0f3f8;
          transition: background 0.15s;
        }
        tbody tr:hover { background: #f8fafd; }
        tbody td { padding: 14px 18px; color: #1a2332; }
        .id-cell { font-weight: 700; color: #4a6cf7; }
        .status-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }
        .status-confirmee { background: #dcfce7; color: #0d9b6c; }
        .status-en-attente { background: #fef3c7; color: #b45309; }
        .status-annulee { background: #fde8e8; color: #d14545; }
        .status-terminee { background: #e8edf5; color: #4a5b74; }
        .actions { display: flex; gap: 10px; }
        .actions button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .btn-edit { color: #4a6cf7; }
        .btn-edit:hover { background: #eef2ff; transform: scale(1.1); }
        .btn-delete { color: #e74c5e; }
        .btn-delete:hover { background: #fde8ea; transform: scale(1.1); }
        .empty-cell {
          text-align: center !important;
          padding: 40px !important;
          color: #94a3b8;
        }
        .empty-cell i { font-size: 32px; display: block; margin-bottom: 8px; }
        .empty-cell p { margin: 0; }
        .table-footer {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
          font-size: 14px;
          color: #6a7b94;
        }
        .table-footer strong { color: #1a2332; }
        @media (max-width: 768px) {
          .reservations-container { padding: 1rem; }
          .toolbar { flex-direction: column; align-items: stretch; }
          .search-box { max-width: 100%; }
          .btn-add { justify-content: center; }
          .header h1 { font-size: 20px; }
          table { font-size: 13px; }
          thead th, tbody td { padding: 10px 12px; }
          .actions { gap: 6px; }
        }
      `}</style>
    </DashboardLayout>
  );
};

// N'oubliez pas de définir l'interface Reservation (ou importez-la)
interface Reservation {
  id: number;
  service_id: number;
  demandeur_id: number;
  prestataire_id: number;
  date_debut: string;
  date_fin?: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  prix_total?: number;
  created_at: string;
  service?: { id: number; nom: string; prix: number };
  demandeur?: { id: number; nom: string; prenom: string; email: string; telephone: string };
  prestataire?: { id: number; nom: string; prenom: string };
}

export default ReservationsAdmin;