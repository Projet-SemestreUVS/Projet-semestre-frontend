// src/pages/admin/Avis.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import "../../styles/avis.css"; // Décommentez si vous avez le fichier CSS

interface Review {
  id: number;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    avatar?: string;
  };
  service: {
    id: number;
    nom: string;
    categorie?: string;
  };
  note: number;
  commentaire: string;
  createdAt: string;
  status: "approuve" | "en_attente" | "signale";
  reponse?: string;
  likes?: number;
  dislikes?: number;
}

const Avis = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "rating" | "popularity">("date");
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialisation des données
  useEffect(() => {
    try {
      const savedReviews = localStorage.getItem("reviews");
      if (savedReviews) {
        try {
          const parsedReviews = JSON.parse(savedReviews);
          if (Array.isArray(parsedReviews) && parsedReviews.length > 0) {
            setReviews(parsedReviews);
            setFilteredReviews(parsedReviews);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Erreur de parsing:", e);
        }
      }
      // Si pas de données ou données invalides, initialiser avec des données par défaut
      initializeDefaultReviews();
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      setError("Erreur lors du chargement des avis");
      setLoading(false);
    }
  }, []);

  const initializeDefaultReviews = () => {
    const defaultReviews: Review[] = [
      {
        id: 1,
        user: {
          id: 1,
          nom: "Diop",
          prenom: "Ahmadou",
          email: "ahmadou.diop@kayjob.com",
          avatar: "👨‍💼"
        },
        service: {
          id: 1,
          nom: "Cours de Mathématiques",
          categorie: "Éducation"
        },
        note: 5,
        commentaire: "Excellent professeur ! Très pédagogue et patient. Je recommande vivement ses services.",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: "approuve",
        likes: 12,
        dislikes: 1
      },
      {
        id: 2,
        user: {
          id: 2,
          nom: "Fall",
          prenom: "Fatou",
          email: "fatou.fall@kayjob.com",
          avatar: "👩‍💻"
        },
        service: {
          id: 2,
          nom: "Plomberie Générale",
          categorie: "Bricolage"
        },
        note: 4,
        commentaire: "Bon travail, mais un peu en retard. Le résultat final est satisfaisant.",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: "approuve",
        likes: 8,
        dislikes: 2
      },
      {
        id: 3,
        user: {
          id: 3,
          nom: "Ndiaye",
          prenom: "Moussa",
          email: "moussa.ndiaye@kayjob.com",
          avatar: "👨‍🔧"
        },
        service: {
          id: 3,
          nom: "Cours de Yoga",
          categorie: "Bien-être"
        },
        note: 5,
        commentaire: "Une expérience transformatrice ! Les séances sont relaxantes et revitalisantes.",
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        status: "approuve",
        likes: 25,
        dislikes: 0
      },
      {
        id: 4,
        user: {
          id: 4,
          nom: "Sow",
          prenom: "Aminata",
          email: "aminata.sow@kayjob.com",
          avatar: "👩‍🎨"
        },
        service: {
          id: 4,
          nom: "Couture sur Mesure",
          categorie: "Mode"
        },
        note: 3,
        commentaire: "Travail correct mais les délais ont été un peu longs.",
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        status: "en_attente",
        likes: 3,
        dislikes: 1
      },
      {
        id: 5,
        user: {
          id: 5,
          nom: "Ba",
          prenom: "Mamadou",
          email: "mamadou.ba@kayjob.com",
          avatar: "👨‍💻"
        },
        service: {
          id: 5,
          nom: "Réparation Informatique",
          categorie: "Technologie"
        },
        note: 2,
        commentaire: "Déçu du service. L'ordinateur a été réparé mais le problème est réapparu.",
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        status: "signale",
        likes: 1,
        dislikes: 8
      },
      {
        id: 6,
        user: {
          id: 6,
          nom: "Diallo",
          prenom: "Mariama",
          email: "mariama.diallo@kayjob.com",
          avatar: "👩‍💼"
        },
        service: {
          id: 6,
          nom: "Coaching Personnel",
          categorie: "Développement"
        },
        note: 5,
        commentaire: "Un coach exceptionnel ! Elle m'a aidé à atteindre mes objectifs professionnels.",
        createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
        status: "approuve",
        likes: 18,
        dislikes: 0
      }
    ];
    setReviews(defaultReviews);
    setFilteredReviews(defaultReviews);
    localStorage.setItem("reviews", JSON.stringify(defaultReviews));
    setLoading(false);
  };

  // Filtrage et tri
  useEffect(() => {
    try {
      let result = [...reviews];

      // Recherche
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(
          (r) =>
            r.user.nom.toLowerCase().includes(searchLower) ||
            r.user.prenom.toLowerCase().includes(searchLower) ||
            r.user.email.toLowerCase().includes(searchLower) ||
            r.service.nom.toLowerCase().includes(searchLower) ||
            r.commentaire.toLowerCase().includes(searchLower)
        );
      }

      // Filtre par note
      if (rating !== "all") {
        result = result.filter((r) => r.note === parseInt(rating));
      }

      // Filtre par statut
      if (statusFilter !== "all") {
        result = result.filter((r) => r.status === statusFilter);
      }

      // Tri
      if (sortBy === "date") {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === "rating") {
        result.sort((a, b) => b.note - a.note);
      } else if (sortBy === "popularity") {
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }

      setFilteredReviews(result);
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  }, [search, rating, statusFilter, sortBy, reviews]);

  // Sauvegarde automatique
  useEffect(() => {
    if (reviews.length > 0) {
      try {
        localStorage.setItem("reviews", JSON.stringify(reviews));
      } catch (err) {
        console.error("Erreur de sauvegarde:", err);
      }
    }
  }, [reviews]);

  const handleDelete = (id: number) => {
    try {
      const reviewToDelete = reviews.find((r) => r.id === id);
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'avis de ${reviewToDelete?.user.prenom} ${reviewToDelete?.user.nom} ?`)) {
        setReviews(reviews.filter((r) => r.id !== id));
        showNotification("Avis supprimé avec succès!", "success");
      }
    } catch (err) {
      console.error("Erreur de suppression:", err);
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const handleStatusChange = (id: number, newStatus: Review["status"]) => {
    try {
      setReviews(
        reviews.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );
      showNotification(`Statut mis à jour: ${getStatusLabel(newStatus)}`, "success");
    } catch (err) {
      console.error("Erreur de mise à jour du statut:", err);
      showNotification("Erreur lors de la mise à jour", "error");
    }
  };

  const handleReply = (id: number) => {
    try {
      if (!replyText.trim()) {
        showNotification("Veuillez saisir une réponse", "error");
        return;
      }
      setReviews(
        reviews.map((r) =>
          r.id === id ? { ...r, reponse: replyText.trim() } : r
        )
      );
      setReplyText("");
      setShowReplyModal(false);
      showNotification("Réponse ajoutée avec succès!", "success");
    } catch (err) {
      console.error("Erreur de réponse:", err);
      showNotification("Erreur lors de l'ajout de la réponse", "error");
    }
  };

  const handleLikeToggle = (id: number, type: "like" | "dislike") => {
    try {
      setReviews(
        reviews.map((r) => {
          if (r.id === id) {
            if (type === "like") {
              return { ...r, likes: (r.likes || 0) + 1 };
            } else {
              return { ...r, dislikes: (r.dislikes || 0) + 1 };
            }
          }
          return r;
        })
      );
    } catch (err) {
      console.error("Erreur de like:", err);
    }
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    try {
      const notification = document.createElement("div");
      notification.className = `notification notification-${type}`;
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

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "approuve":
        return "Approuvé";
      case "en_attente":
        return "En attente";
      case "signale":
        return "Signalé";
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "approuve":
        return "badge-status-approved";
      case "en_attente":
        return "badge-status-pending";
      case "signale":
        return "badge-status-reported";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "approuve":
        return "✅";
      case "en_attente":
        return "⏳";
      case "signale":
        return "⚠️";
      default:
        return "";
    }
  };

  const getStars = (note: number): string => {
    return "⭐".repeat(note) + "☆".repeat(5 - note);
  };

  // Statistiques
  const stats = {
    total: reviews.length,
    moyenne: reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.note, 0) / reviews.length : 0,
    distribution: [1, 2, 3, 4, 5].reduce((acc, n) => {
      acc[n] = reviews.filter((r) => r.note === n).length;
      return acc;
    }, {} as { [key: number]: number }),
    approuves: reviews.filter((r) => r.status === "approuve").length,
    enAttente: reviews.filter((r) => r.status === "en_attente").length,
    signales: reviews.filter((r) => r.status === "signale").length,
  };

  const openModal = (review: Review) => {
    try {
      setSelectedReview(review);
      setShowModal(true);
      document.body.style.overflow = "hidden";
    } catch (err) {
      console.error("Erreur d'ouverture du modal:", err);
    }
  };

  const closeModal = () => {
    try {
      setShowModal(false);
      setSelectedReview(null);
      document.body.style.overflow = "auto";
    } catch (err) {
      console.error("Erreur de fermeture du modal:", err);
    }
  };

  // Si erreur
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
          <p>Chargement des avis...</p>
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
              <span style={{ fontSize: "32px" }}>⭐</span>
              Gestion des Avis
            </h1>
            <p style={{ color: "#718096", fontSize: "15px", margin: 0 }}>
              Gérez tous les avis et commentaires de la plateforme KayJob
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
            marginBottom: "32px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px",
              marginBottom: "24px"
            }}>
              {[
                { label: "Total avis", value: stats.total, icon: "📝", color: "#eff6ff" },
                { label: "Note moyenne", value: stats.moyenne.toFixed(1), icon: "⭐", color: "#fef3c7" },
                { label: "Approuvés", value: stats.approuves, icon: "✅", color: "#dcfce7" },
                { label: "En attente", value: stats.enAttente, icon: "⏳", color: "#fefce8" },
                { label: "Signalés", value: stats.signales, icon: "⚠️", color: "#fee2e2" }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  background: "#f8fafc",
                  borderRadius: "12px"
                }}>
                  <div style={{
                    fontSize: "24px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: stat.color,
                    borderRadius: "10px"
                  }}>{stat.icon}</div>
                  <div>
                    <h3 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: "#1a202c" }}>{stat.value}</h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#718096" }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Distribution des notes */}
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#2d3748", margin: "0 0 16px 0" }}>
                Distribution des notes
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ minWidth: "60px", fontSize: "14px", fontWeight: "500", color: "#4a5568" }}>
                      {n} ⭐
                    </span>
                    <div style={{ flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #f59e0b, #f97316)",
                        borderRadius: "4px",
                        width: stats.total > 0 ? `${(stats.distribution[n] / stats.total) * 100}%` : "0%",
                        transition: "width 0.6s ease"
                      }}></div>
                    </div>
                    <span style={{ minWidth: "30px", fontSize: "14px", fontWeight: "600", color: "#4a5568", textAlign: "right" }}>
                      {stats.distribution[n]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px"
        }}>
          <div style={{
            flex: 1,
            minWidth: "250px",
            display: "flex",
            alignItems: "center",
            background: "white",
            border: "2px solid #e2e8f0",
            borderRadius: "12px",
            padding: "0 16px",
            transition: "all 0.3s ease"
          }}>
            <span style={{ fontSize: "18px", marginRight: "12px", opacity: "0.6" }}>🔍</span>
            <input
              type="text"
              style={{
                flex: 1,
                padding: "12px 0",
                border: "none",
                outline: "none",
                fontSize: "15px",
                background: "transparent"
              }}
              placeholder="Rechercher par nom, prénom, service ou commentaire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a0aec0",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px 8px"
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <select
              style={{
                padding: "12px 16px",
                background: "white",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#2d3748",
                cursor: "pointer",
                minWidth: "140px"
              }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="all">Toutes les notes</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>

            <select
              style={{
                padding: "12px 16px",
                background: "white",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#2d3748",
                cursor: "pointer",
                minWidth: "140px"
              }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="approuve">✅ Approuvés</option>
              <option value="en_attente">⏳ En attente</option>
              <option value="signale">⚠️ Signalés</option>
            </select>

            <select
              style={{
                padding: "12px 16px",
                background: "white",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#2d3748",
                cursor: "pointer",
                minWidth: "140px"
              }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "rating" | "popularity")}
            >
              <option value="date">📅 Plus récents</option>
              <option value="rating">⭐ Meilleures notes</option>
              <option value="popularity">🔥 Populaires</option>
            </select>
          </div>
        </div>

        {/* Résultats */}
        <div style={{ fontSize: "14px", color: "#718096", marginBottom: "16px" }}>
          <span>
            {filteredReviews.length} avis trouvé{filteredReviews.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Liste des avis */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
          {filteredReviews.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "white",
              borderRadius: "16px",
              border: "1px solid #f1f5f9"
            }}>
              <span style={{ fontSize: "48px", opacity: "0.5" }}>📭</span>
              <p style={{ fontSize: "16px", fontWeight: "500", margin: "8px 0 4px 0", color: "#475569" }}>
                Aucun avis trouvé
              </p>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                {search ? "Essayez avec d'autres critères" : "Aucun avis disponible pour le moment"}
              </span>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #f1f5f9",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                      color: "white",
                      borderRadius: "50%",
                      fontSize: "24px",
                      fontWeight: "600",
                      flexShrink: 0
                    }}>
                      {review.user.avatar || "👤"}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#1a202c", fontSize: "16px" }}>
                        {review.user.prenom} {review.user.nom}
                      </div>
                      <div style={{ fontSize: "13px", color: "#a0aec0" }}>{review.user.email}</div>
                    </div>
                  </div>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    background: review.status === "approuve" ? "#dcfce7" : review.status === "en_attente" ? "#fef3c7" : "#fee2e2",
                    color: review.status === "approuve" ? "#16a34a" : review.status === "en_attente" ? "#d97706" : "#dc2626"
                  }}>
                    <span>{getStatusIcon(review.status)}</span>
                    {getStatusLabel(review.status)}
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#4a5568", marginBottom: "8px" }}>
                    <span>📌</span> {review.service.nom}
                    {review.service.categorie && (
                      <span style={{ color: "#a0aec0", fontWeight: "400" }}> • {review.service.categorie}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "18px", letterSpacing: "2px" }}>
                      {getStars(review.note)}
                    </span>
                    <span style={{ fontWeight: "700", color: "#f59e0b", fontSize: "15px" }}>
                      {review.note}.0
                    </span>
                  </div>
                  <p style={{ color: "#2d3748", lineHeight: "1.6", margin: 0, fontSize: "15px" }}>
                    {review.commentaire}
                  </p>
                  {review.reponse && (
                    <div style={{
                      marginTop: "12px",
                      padding: "16px",
                      background: "#f7fafc",
                      borderRadius: "12px",
                      borderLeft: "4px solid #4F46E5"
                    }}>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#4F46E5", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>💬</span> Réponse de l'équipe
                      </div>
                      <p style={{ margin: 0, fontSize: "14px", color: "#2d3748" }}>{review.reponse}</p>
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  paddingTop: "16px",
                  borderTop: "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#a0aec0" }}>
                      🗓️ {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => handleLikeToggle(review.id, "like")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 12px",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          background: "#eff6ff",
                          color: "#3b82f6"
                        }}
                      >
                        👍 {review.likes || 0}
                      </button>
                      <button 
                        onClick={() => handleLikeToggle(review.id, "dislike")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 12px",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          background: "#fef2f2",
                          color: "#ef4444"
                        }}
                      >
                        👎 {review.dislikes || 0}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => openModal(review)}
                      style={{
                        width: "36px",
                        height: "36px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                        background: "#eff6ff",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title="Voir les détails"
                    >
                      👁️
                    </button>
                    {review.status === "en_attente" && (
                      <button
                        onClick={() => handleStatusChange(review.id, "approuve")}
                        style={{
                          width: "36px",
                          height: "36px",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "16px",
                          background: "#dcfce7",
                          color: "#16a34a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Approuver"
                      >
                        ✅
                      </button>
                    )}
                    {review.status === "signale" && (
                      <button
                        onClick={() => handleStatusChange(review.id, "approuve")}
                        style={{
                          width: "36px",
                          height: "36px",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "16px",
                          background: "#dcfce7",
                          color: "#16a34a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Approuver"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setShowReplyModal(true);
                      }}
                      style={{
                        width: "36px",
                        height: "36px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                        background: "#fef3c7",
                        color: "#d97706",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title="Répondre"
                    >
                      💬
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      style={{
                        width: "36px",
                        height: "36px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                        background: "#fef2f2",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Détails */}
        {showModal && selectedReview && (
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
          }} onClick={closeModal}>
            <div style={{
              background: "white",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "600px",
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
                  <span style={{ fontSize: "24px" }}>📝</span>
                  Détails de l'avis
                </h2>
                <button 
                  onClick={closeModal}
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
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "28px"
                  }}>
                    {selectedReview.user.avatar || "👤"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "18px", color: "#1a202c" }}>
                      {selectedReview.user.prenom} {selectedReview.user.nom}
                    </div>
                    <div style={{ fontSize: "14px", color: "#a0aec0" }}>{selectedReview.user.email}</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: "600", color: "#4a5568" }}>Service</span>
                  <span>{selectedReview.service.nom}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: "600", color: "#4a5568" }}>Note</span>
                  <span style={{ fontSize: "16px" }}>
                    {getStars(selectedReview.note)} ({selectedReview.note}.0)
                  </span>
                </div>

                <div style={{ padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: "600", color: "#4a5568" }}>Commentaire</span>
                  <p style={{ margin: "8px 0 0 0", color: "#2d3748", lineHeight: "1.6" }}>
                    {selectedReview.commentaire}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: "600", color: "#4a5568" }}>Statut</span>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    background: selectedReview.status === "approuve" ? "#dcfce7" : selectedReview.status === "en_attente" ? "#fef3c7" : "#fee2e2",
                    color: selectedReview.status === "approuve" ? "#16a34a" : selectedReview.status === "en_attente" ? "#d97706" : "#dc2626"
                  }}>
                    <span>{getStatusIcon(selectedReview.status)}</span>
                    {getStatusLabel(selectedReview.status)}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: "600", color: "#4a5568" }}>Date</span>
                  <span>
                    {new Date(selectedReview.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                {selectedReview.reponse && (
                  <div style={{ padding: "16px 0" }}>
                    <span style={{ fontWeight: "600", color: "#4a5568" }}>Réponse</span>
                    <div style={{
                      marginTop: "8px",
                      padding: "16px",
                      background: "#f7fafc",
                      borderRadius: "12px",
                      borderLeft: "4px solid #4F46E5"
                    }}>
                      <p style={{ margin: 0, color: "#2d3748" }}>{selectedReview.reponse}</p>
                    </div>
                  </div>
                )}
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
                  onClick={closeModal}
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
                <button 
                  onClick={() => {
                    closeModal();
                    setShowReplyModal(true);
                  }}
                  style={{
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  💬 Répondre
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Réponse */}
        {showReplyModal && selectedReview && (
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
          }} onClick={() => setShowReplyModal(false)}>
            <div style={{
              background: "white",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "600px",
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
                  <span style={{ fontSize: "24px" }}>💬</span>
                  Répondre à l'avis
                </h2>
                <button 
                  onClick={() => setShowReplyModal(false)}
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
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "24px" }}>{selectedReview.user.avatar || "👤"}</span>
                    <div>
                      <div style={{ fontWeight: "600", color: "#1a202c" }}>
                        {selectedReview.user.prenom} {selectedReview.user.nom}
                      </div>
                      <div style={{ fontSize: "13px", color: "#a0aec0" }}>{selectedReview.service.nom}</div>
                    </div>
                  </div>
                  <div style={{
                    padding: "12px",
                    background: "white",
                    borderRadius: "8px",
                    borderLeft: "3px solid #4F46E5"
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#4F46E5" }}>Commentaire :</span>
                    <p style={{ margin: "4px 0 0 0", color: "#2d3748", fontStyle: "italic" }}>
                      "{selectedReview.commentaire}"
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                    Votre réponse <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    style={{
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "vertical",
                      minHeight: "120px"
                    }}
                    placeholder="Rédigez votre réponse..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
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
                  onClick={() => setShowReplyModal(false)}
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
                  Annuler
                </button>
                <button 
                  onClick={() => handleReply(selectedReview.id)}
                  style={{
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  💬 Envoyer la réponse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Avis;