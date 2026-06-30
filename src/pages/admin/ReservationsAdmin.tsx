// src/pages/admin/ReservationsAdmin.tsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";

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
    categorie?: string;
  };
  demandeur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
}

const ReservationsAdmin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatut, setSelectedStatut] = useState<string>("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "status" | "service">("date");
  const [showStats, setShowStats] = useState(true);

  // Initialisation des données
  useEffect(() => {
    try {
      const savedReservations = localStorage.getItem("reservations");
      if (savedReservations) {
        try {
          const parsed = JSON.parse(savedReservations);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReservations(parsed);
            setFilteredReservations(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Erreur de parsing:", e);
        }
      }
      initializeDefaultReservations();
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      setError("Erreur lors du chargement des réservations");
      setLoading(false);
    }
  }, []);

  const initializeDefaultReservations = () => {
    const defaultReservations: Reservation[] = [
      {
        id: 1,
        service_id: 1,
        demandeur_id: 1,
        prestataire_id: 2,
        date_debut: new Date(Date.now() + 86400000 * 2).toISOString(),
        statut: "confirmee",
        commentaire: "Première séance prévue à 14h",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        service: {
          id: 1,
          nom: "Cours de Mathématiques",
          prix: 15000,
          categorie: "Éducation"
        },
        demandeur: {
          id: 1,
          nom: "Diop",
          prenom: "Ahmadou",
          email: "ahmadou.diop@kayjob.com",
          telephone: "+221 77 123 45 67",
          avatar: "👨‍💼"
        },
        prestataire: {
          id: 2,
          nom: "Fall",
          prenom: "Fatou",
          email: "fatou.fall@kayjob.com",
          telephone: "+221 78 987 65 43",
          avatar: "👩‍🏫"
        }
      },
      {
        id: 2,
        service_id: 2,
        demandeur_id: 3,
        prestataire_id: 4,
        date_debut: new Date(Date.now() + 86400000 * 5).toISOString(),
        statut: "en_attente",
        commentaire: "Besoin d'une intervention urgente",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        service: {
          id: 2,
          nom: "Plomberie Générale",
          prix: 25000,
          categorie: "Bricolage"
        },
        demandeur: {
          id: 3,
          nom: "Ndiaye",
          prenom: "Moussa",
          email: "moussa.ndiaye@kayjob.com",
          telephone: "+221 76 456 78 90",
          avatar: "👨‍🔧"
        },
        prestataire: {
          id: 4,
          nom: "Sow",
          prenom: "Aminata",
          email: "aminata.sow@kayjob.com",
          telephone: "+221 77 789 01 23",
          avatar: "👩‍🔧"
        }
      },
      {
        id: 3,
        service_id: 3,
        demandeur_id: 5,
        prestataire_id: 6,
        date_debut: new Date(Date.now() - 86400000 * 1).toISOString(),
        statut: "terminee",
        commentaire: "Très satisfait du service",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        service: {
          id: 3,
          nom: "Cours de Yoga",
          prix: 12000,
          categorie: "Bien-être"
        },
        demandeur: {
          id: 5,
          nom: "Ba",
          prenom: "Mamadou",
          email: "mamadou.ba@kayjob.com",
          telephone: "+221 70 234 56 78",
          avatar: "👨‍💻"
        },
        prestataire: {
          id: 6,
          nom: "Diallo",
          prenom: "Mariama",
          email: "mariama.diallo@kayjob.com",
          telephone: "+221 78 345 67 89",
          avatar: "🧘‍♀️"
        }
      },
      {
        id: 4,
        service_id: 4,
        demandeur_id: 1,
        prestataire_id: 5,
        date_debut: new Date(Date.now() + 86400000 * 8).toISOString(),
        statut: "en_attente",
        commentaire: "À confirmer avant le 15",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        service: {
          id: 4,
          nom: "Couture sur Mesure",
          prix: 18000,
          categorie: "Mode"
        },
        demandeur: {
          id: 1,
          nom: "Diop",
          prenom: "Ahmadou",
          email: "ahmadou.diop@kayjob.com",
          telephone: "+221 77 123 45 67",
          avatar: "👨‍💼"
        },
        prestataire: {
          id: 5,
          nom: "Ba",
          prenom: "Mamadou",
          email: "mamadou.ba@kayjob.com",
          telephone: "+221 70 234 56 78",
          avatar: "👨‍🎨"
        }
      },
      {
        id: 5,
        service_id: 5,
        demandeur_id: 2,
        prestataire_id: 3,
        date_debut: new Date(Date.now() - 86400000 * 15).toISOString(),
        statut: "annulee",
        commentaire: "Annulé par le demandeur",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        service: {
          id: 5,
          nom: "Réparation Informatique",
          prix: 20000,
          categorie: "Technologie"
        },
        demandeur: {
          id: 2,
          nom: "Fall",
          prenom: "Fatou",
          email: "fatou.fall@kayjob.com",
          telephone: "+221 78 987 65 43",
          avatar: "👩‍💻"
        },
        prestataire: {
          id: 3,
          nom: "Ndiaye",
          prenom: "Moussa",
          email: "moussa.ndiaye@kayjob.com",
          telephone: "+221 76 456 78 90",
          avatar: "👨‍💻"
        }
      }
    ];
    setReservations(defaultReservations);
    setFilteredReservations(defaultReservations);
    localStorage.setItem("reservations", JSON.stringify(defaultReservations));
    setLoading(false);
  };

  // Filtrage et tri
  useEffect(() => {
    try {
      let result = [...reservations];

      // Recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(
          (r) =>
            r.service?.nom?.toLowerCase().includes(searchLower) ||
            r.demandeur?.prenom?.toLowerCase().includes(searchLower) ||
            r.demandeur?.nom?.toLowerCase().includes(searchLower) ||
            r.prestataire?.prenom?.toLowerCase().includes(searchLower) ||
            r.prestataire?.nom?.toLowerCase().includes(searchLower) ||
            r.service?.categorie?.toLowerCase().includes(searchLower)
        );
      }

      // Filtre par statut
      if (selectedStatut !== "tous") {
        result = result.filter((r) => r.statut === selectedStatut);
      }

      // Tri
      if (sortBy === "date") {
        result.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
      } else if (sortBy === "status") {
        const statusOrder = { en_attente: 0, confirmee: 1, terminee: 2, annulee: 3 };
        result.sort((a, b) => statusOrder[a.statut] - statusOrder[b.statut]);
      } else if (sortBy === "service") {
        result.sort((a, b) => (a.service?.nom || "").localeCompare(b.service?.nom || ""));
      }

      setFilteredReservations(result);
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  }, [searchTerm, selectedStatut, sortBy, reservations]);

  // Sauvegarde automatique
  useEffect(() => {
    if (reservations.length > 0) {
      try {
        localStorage.setItem("reservations", JSON.stringify(reservations));
      } catch (err) {
        console.error("Erreur de sauvegarde:", err);
      }
    }
  }, [reservations]);

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case "confirmee": return "statut-confirmee";
      case "terminee": return "statut-terminee";
      case "annulee": return "statut-annulee";
      default: return "statut-attente";
    }
  };

  const getStatutTexte = (statut: string) => {
    switch (statut) {
      case "confirmee": return "Confirmée";
      case "terminee": return "Terminée";
      case "annulee": return "Annulée";
      default: return "En attente";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "confirmee": return "✅";
      case "terminee": return "🏁";
      case "annulee": return "❌";
      default: return "⏳";
    }
  };

  const handleUpdateStatut = async (id: number, newStatut: string) => {
    try {
      setUpdating(true);
      
      setReservations(prev =>
        prev.map(r =>
          r.id === id ? { ...r, statut: newStatut as any } : r
        )
      );
      
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation({ ...selectedReservation, statut: newStatut as any });
      }
      
      showNotification(`Statut mis à jour: ${getStatutTexte(newStatut)}`, "success");
      
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la mise à jour", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const reservationToDelete = reservations.find(r => r.id === id);
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la réservation #${id} ?`)) return;
    
    try {
      setReservations(prev => prev.filter(r => r.id !== id));
      if (selectedReservation && selectedReservation.id === id) {
        setShowModal(false);
        setSelectedReservation(null);
      }
      showNotification("Réservation supprimée avec succès", "success");
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "confirmee": return "#16a34a";
      case "terminee": return "#3b82f6";
      case "annulee": return "#ef4444";
      default: return "#d97706";
    }
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    try {
      const notification = document.createElement("div");
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        background: ${type === "success" ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #dc2626, #ef4444)"};
        animation: slideIn 0.3s ease;
        max-width: 400px;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        notification.style.transition = "all 0.3s ease";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    } catch (err) {
      console.error("Erreur de notification:", err);
    }
  };

  const stats = {
    total: reservations.length,
    en_attente: reservations.filter(r => r.statut === "en_attente").length,
    confirmees: reservations.filter(r => r.statut === "confirmee").length,
    terminees: reservations.filter(r => r.statut === "terminee").length,
    annulees: reservations.filter(r => r.statut === "annulee").length,
    total_prix: reservations.reduce((acc, r) => acc + (r.service?.prix || 0), 0),
  };

  if (error) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ padding: "24px" }}>
          <div style={{ 
            background: "#fee2e2", 
            color: "#dc2626", 
            padding: "16px 24px", 
            borderRadius: "12px",
            border: "1px solid #fecaca"
          }}>
            <h3 style={{ margin: "0 0 8px 0" }}>⚠️ Erreur</h3>
            <p style={{ margin: 0 }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "400px", 
          gap: "16px" 
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#4F46E5",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}></div>
          <p>Chargement des réservations...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* En-tête */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          marginBottom: "32px", 
          flexWrap: "wrap", 
          gap: "16px" 
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: "#1a202c", 
              margin: "0 0 4px 0", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px" 
            }}>
              <span style={{ fontSize: "32px" }}>📅</span>
              Gestion des Réservations
            </h1>
            <p style={{ color: "#718096", fontSize: "15px", margin: 0 }}>
              Gérez toutes les réservations de la plateforme KayJob
            </p>
          </div>
          <button 
            onClick={() => setShowStats(!showStats)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "white",
              color: "#4a5568",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            <span>📊</span>
            {showStats ? "Cacher" : "Voir"} les statistiques
          </button>
        </div>

        {/* Statistiques */}
        {showStats && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px"
            }}>
              {[
                { label: "Total", value: stats.total, icon: "📊", color: "#eff6ff", textColor: "#3b82f6" },
                { label: "En attente", value: stats.en_attente, icon: "⏳", color: "#fef3c7", textColor: "#d97706" },
                { label: "Confirmées", value: stats.confirmees, icon: "✅", color: "#dcfce7", textColor: "#16a34a" },
                { label: "Terminées", value: stats.terminees, icon: "🏁", color: "#e0f2fe", textColor: "#3b82f6" },
                { label: "Annulées", value: stats.annulees, icon: "❌", color: "#fee2e2", textColor: "#ef4444" }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  background: stat.color,
                  borderRadius: "12px"
                }}>
                  <div style={{
                    fontSize: "24px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    borderRadius: "10px"
                  }}>{stat.icon}</div>
                  <div>
                    <h3 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: stat.textColor }}>
                      {stat.value}
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f1f5f9",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center"
        }}>
          <div style={{
            flex: 1,
            minWidth: "200px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f8fafc",
            padding: "0 16px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Rechercher par service, demandeur ou prestataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                background: "none",
                outline: "none",
                fontSize: "14px"
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a0aec0",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { value: "tous", label: `Tous (${stats.total})` },
              { value: "en_attente", label: `⏳ En attente (${stats.en_attente})` },
              { value: "confirmee", label: `✅ Confirmées (${stats.confirmees})` },
              { value: "terminee", label: `🏁 Terminées (${stats.terminees})` },
              { value: "annulee", label: `❌ Annulées (${stats.annulees})` }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatut(filter.value)}
                style={{
                  padding: "8px 16px",
                  background: selectedStatut === filter.value ? "#4F46E5" : "#f8fafc",
                  color: selectedStatut === filter.value ? "white" : "#1e293b",
                  border: selectedStatut === filter.value ? "1px solid #4F46E5" : "1px solid #e2e8f0",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "8px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            <option value="date">📅 Trier par date</option>
            <option value="status">📊 Trier par statut</option>
            <option value="service">📌 Trier par service</option>
          </select>
        </div>

        {/* Résultats */}
        <div style={{ fontSize: "14px", color: "#718096", marginBottom: "16px" }}>
          <span>
            {filteredReservations.length} réservation{filteredReservations.length > 1 ? "s" : ""} trouvée{filteredReservations.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Tableau des réservations */}
        {filteredReservations.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "48px 20px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9"
          }}>
            <span style={{ fontSize: "48px", opacity: "0.5" }}>📭</span>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "8px 0 4px 0", color: "#475569" }}>
              Aucune réservation trouvée
            </p>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>
              {searchTerm ? "Essayez avec d'autres critères" : "Aucune réservation disponible"}
            </span>
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflowX: "auto",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "800px"
            }}>
              <thead>
                <tr style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0"
                }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>ID</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Service</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Demandeur</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Prestataire</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Montant</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Statut</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} style={{
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  >
                    <td style={{ padding: "16px 20px", fontWeight: "600", color: "#1a202c" }}>
                      #{reservation.id}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div>
                        <div style={{ fontWeight: "500", color: "#1a202c" }}>
                          {reservation.service?.nom || "-"}
                        </div>
                        {reservation.service?.categorie && (
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {reservation.service.categorie}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px" }}>{reservation.demandeur?.avatar || "👤"}</span>
                        <div>
                          <div style={{ fontWeight: "500", color: "#1a202c" }}>
                            {reservation.demandeur?.prenom} {reservation.demandeur?.nom}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {reservation.demandeur?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px" }}>{reservation.prestataire?.avatar || "👤"}</span>
                        <div>
                          <div style={{ fontWeight: "500", color: "#1a202c" }}>
                            {reservation.prestataire?.prenom} {reservation.prestataire?.nom}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {reservation.prestataire?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: "13px", color: "#475569" }}>
                      {formatDate(reservation.date_debut)}
                    </td>
                    <td style={{ padding: "16px 20px", fontWeight: "600", color: "#1a202c" }}>
                      {reservation.service?.prix?.toLocaleString()} FCFA
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: reservation.statut === "confirmee" ? "#dcfce7" :
                                  reservation.statut === "terminee" ? "#e0f2fe" :
                                  reservation.statut === "annulee" ? "#fee2e2" : "#fef3c7",
                        color: reservation.statut === "confirmee" ? "#16a34a" :
                               reservation.statut === "terminee" ? "#3b82f6" :
                               reservation.statut === "annulee" ? "#ef4444" : "#d97706"
                      }}>
                        <span>{getStatutIcon(reservation.statut)}</span>
                        {getStatutTexte(reservation.statut)}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button 
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowModal(true);
                          }}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#eef2ff",
                            color: "#4F46E5",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            transition: "all 0.3s ease"
                          }}
                          title="Voir détails"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleDelete(reservation.id)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#fee2e2",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            transition: "all 0.3s ease"
                          }}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Détails */}
        {showModal && selectedReservation && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }} onClick={() => setShowModal(false)}>
            <div style={{
              background: "white",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto"
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 32px",
                borderBottom: "1px solid #f1f5f9"
              }}>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1a202c",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "24px" }}>📋</span>
                  Réservation #{selectedReservation.id}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "none",
                    background: "#f1f5f9",
                    borderRadius: "50%",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b"
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: "32px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Service</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "500" }}>
                      {selectedReservation.service?.nom || "-"}
                    </p>
                    {selectedReservation.service?.categorie && (
                      <small style={{ color: "#94a3b8" }}>{selectedReservation.service.categorie}</small>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Prix</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "600" }}>
                      {selectedReservation.service?.prix?.toLocaleString()} FCFA
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Demandeur</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{selectedReservation.demandeur?.avatar || "👤"}</span>
                      <div>
                        <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "500" }}>
                          {selectedReservation.demandeur?.prenom} {selectedReservation.demandeur?.nom}
                        </p>
                        <small style={{ color: "#94a3b8", display: "block" }}>{selectedReservation.demandeur?.email}</small>
                        <small style={{ color: "#94a3b8" }}>{selectedReservation.demandeur?.telephone}</small>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Prestataire</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{selectedReservation.prestataire?.avatar || "👤"}</span>
                      <div>
                        <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "500" }}>
                          {selectedReservation.prestataire?.prenom} {selectedReservation.prestataire?.nom}
                        </p>
                        <small style={{ color: "#94a3b8", display: "block" }}>{selectedReservation.prestataire?.email}</small>
                        <small style={{ color: "#94a3b8" }}>{selectedReservation.prestataire?.telephone}</small>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date de début</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                      {formatDate(selectedReservation.date_debut)}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Statut</label>
                    <select 
                      value={selectedReservation.statut}
                      onChange={(e) => handleUpdateStatut(selectedReservation.id, e.target.value)}
                      disabled={updating}
                      style={{
                        padding: "8px 12px",
                        border: `2px solid ${getStatusColor(selectedReservation.statut)}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        background: "white",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="en_attente">⏳ En attente</option>
                      <option value="confirmee">✅ Confirmée</option>
                      <option value="terminee">🏁 Terminée</option>
                      <option value="annulee">❌ Annulée</option>
                    </select>
                  </div>

                  {selectedReservation.commentaire && (
                    <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Commentaire</label>
                      <div style={{
                        background: "#f8fafc",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontStyle: "italic",
                        color: "#475569"
                      }}>
                        {selectedReservation.commentaire}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date de création</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                      {new Date(selectedReservation.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                padding: "20px 32px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafbfc",
                borderRadius: "0 0 20px 20px"
              }}>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 24px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: "pointer"
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ReservationsAdmin;