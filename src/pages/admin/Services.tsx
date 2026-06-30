// src/pages/admin/Services.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";

interface Service {
  id: number;
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  prestataire_id: number;
  statut: "actif" | "inactif" | "en_attente";
  created_at: string;
  updated_at?: string;
  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
  images?: string[];
  note_moyenne?: number;
  nombre_avis?: number;
}

interface ServiceStats {
  total: number;
  actifs: number;
  inactifs: number;
  en_attente: number;
  prix_moyen: number;
  categorie_populaire: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [filterCategorie, setFilterCategorie] = useState("toutes");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [sortBy, setSortBy] = useState<"date" | "prix" | "nom">("date");
  const [categories, setCategories] = useState<string[]>([]);

  // Initialisation des données
  useEffect(() => {
    try {
      const savedServices = localStorage.getItem("services");
      if (savedServices) {
        try {
          const parsed = JSON.parse(savedServices);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setServices(parsed);
            setFilteredServices(parsed);
            extractCategories(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Erreur de parsing:", e);
        }
      }
      initializeDefaultServices();
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      setError("Erreur lors du chargement des services");
      setLoading(false);
    }
  }, []);

  const extractCategories = (servicesList: Service[]) => {
    const cats = [...new Set(servicesList.map(s => s.categorie).filter(Boolean))];
    setCategories(cats);
  };

  const initializeDefaultServices = () => {
    const defaultServices: Service[] = [
      {
        id: 1,
        titre: "Cours de Mathématiques - Niveau Lycée",
        description: "Cours particuliers de mathématiques pour lycéens. Préparation aux examens et aide aux devoirs. Méthode pédagogique adaptée à chaque élève.",
        prix: 15000,
        categorie: "Éducation",
        prestataire_id: 2,
        statut: "actif",
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        prestataire: {
          id: 2,
          nom: "Fall",
          prenom: "Fatou",
          email: "fatou.fall@kayjob.com",
          telephone: "+221 78 987 65 43",
          avatar: "👩‍🏫"
        },
        note_moyenne: 4.8,
        nombre_avis: 24
      },
      {
        id: 2,
        titre: "Plomberie Générale - Dépannage Urgent",
        description: "Intervention rapide pour tous vos problèmes de plomberie. Fuites, canalisations bouchées, installation de sanitaires. Devis gratuit.",
        prix: 25000,
        categorie: "Bricolage",
        prestataire_id: 4,
        statut: "actif",
        created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        prestataire: {
          id: 4,
          nom: "Sow",
          prenom: "Aminata",
          email: "aminata.sow@kayjob.com",
          telephone: "+221 77 789 01 23",
          avatar: "👩‍🔧"
        },
        note_moyenne: 4.5,
        nombre_avis: 18
      },
      {
        id: 3,
        titre: "Cours de Yoga et Méditation",
        description: "Séances de yoga et méditation pour tous niveaux. Amélioration de la flexibilité, réduction du stress et bien-être général.",
        prix: 12000,
        categorie: "Bien-être",
        prestataire_id: 6,
        statut: "actif",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        prestataire: {
          id: 6,
          nom: "Diallo",
          prenom: "Mariama",
          email: "mariama.diallo@kayjob.com",
          telephone: "+221 78 345 67 89",
          avatar: "🧘‍♀️"
        },
        note_moyenne: 4.9,
        nombre_avis: 32
      },
      {
        id: 4,
        titre: "Couture sur Mesure - Création Unique",
        description: "Création de vêtements sur mesure. Robes, costumes, tenues traditionnelles. Conseils personnalisés et retouches incluses.",
        prix: 18000,
        categorie: "Mode",
        prestataire_id: 5,
        statut: "en_attente",
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        prestataire: {
          id: 5,
          nom: "Ba",
          prenom: "Mamadou",
          email: "mamadou.ba@kayjob.com",
          telephone: "+221 70 234 56 78",
          avatar: "👨‍🎨"
        },
        note_moyenne: 4.2,
        nombre_avis: 10
      },
      {
        id: 5,
        titre: "Réparation Informatique - PC & Mac",
        description: "Diagnostic et réparation d'ordinateurs. Problèmes matériels et logiciels. Récupération de données et optimisation système.",
        prix: 20000,
        categorie: "Technologie",
        prestataire_id: 3,
        statut: "inactif",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        prestataire: {
          id: 3,
          nom: "Ndiaye",
          prenom: "Moussa",
          email: "moussa.ndiaye@kayjob.com",
          telephone: "+221 76 456 78 90",
          avatar: "👨‍💻"
        },
        note_moyenne: 3.8,
        nombre_avis: 7
      },
      {
        id: 6,
        titre: "Coaching Personnel et Développement",
        description: "Accompagnement personnalisé pour atteindre vos objectifs professionnels et personnels. Techniques de communication et gestion du stress.",
        prix: 22000,
        categorie: "Développement",
        prestataire_id: 6,
        statut: "actif",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        prestataire: {
          id: 6,
          nom: "Diallo",
          prenom: "Mariama",
          email: "mariama.diallo@kayjob.com",
          telephone: "+221 78 345 67 89",
          avatar: "🧘‍♀️"
        },
        note_moyenne: 4.7,
        nombre_avis: 15
      },
      {
        id: 7,
        titre: "Photographie Professionnelle",
        description: "Séances photo professionnelles. Mariages, événements, portraits, produits. Matériel haut de gamme et retouches incluses.",
        prix: 35000,
        categorie: "Art",
        prestataire_id: 2,
        statut: "actif",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        prestataire: {
          id: 2,
          nom: "Fall",
          prenom: "Fatou",
          email: "fatou.fall@kayjob.com",
          telephone: "+221 78 987 65 43",
          avatar: "👩‍🏫"
        },
        note_moyenne: 4.6,
        nombre_avis: 20
      }
    ];
    setServices(defaultServices);
    setFilteredServices(defaultServices);
    extractCategories(defaultServices);
    localStorage.setItem("services", JSON.stringify(defaultServices));
    setLoading(false);
  };

  // Filtrage et tri
  useEffect(() => {
    try {
      let result = [...services];

      // Recherche
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(
          (s) =>
            s.titre.toLowerCase().includes(searchLower) ||
            s.description.toLowerCase().includes(searchLower) ||
            s.categorie.toLowerCase().includes(searchLower) ||
            s.prestataire?.prenom?.toLowerCase().includes(searchLower) ||
            s.prestataire?.nom?.toLowerCase().includes(searchLower)
        );
      }

      // Filtre par catégorie
      if (filterCategorie !== "toutes") {
        result = result.filter((s) => s.categorie === filterCategorie);
      }

      // Filtre par statut
      if (filterStatut !== "tous") {
        result = result.filter((s) => s.statut === filterStatut);
      }

      // Tri
      if (sortBy === "date") {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (sortBy === "prix") {
        result.sort((a, b) => a.prix - b.prix);
      } else if (sortBy === "nom") {
        result.sort((a, b) => a.titre.localeCompare(b.titre));
      }

      setFilteredServices(result);
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  }, [search, filterCategorie, filterStatut, sortBy, services]);

  // Sauvegarde automatique
  useEffect(() => {
    if (services.length > 0) {
      try {
        localStorage.setItem("services", JSON.stringify(services));
      } catch (err) {
        console.error("Erreur de sauvegarde:", err);
      }
    }
  }, [services]);

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case "actif": return "statut-actif";
      case "inactif": return "statut-inactif";
      default: return "statut-attente";
    }
  };

  const getStatutTexte = (statut: string) => {
    switch (statut) {
      case "actif": return "Actif";
      case "inactif": return "Inactif";
      default: return "En attente";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "actif": return "🟢";
      case "inactif": return "🔴";
      default: return "🟡";
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "actif": return "#16a34a";
      case "inactif": return "#ef4444";
      default: return "#d97706";
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setServices(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, statut: s.statut === "actif" ? "inactif" : "actif" as any }
            : s
        )
      );
      showNotification("Statut du service mis à jour", "success");
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la mise à jour", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const serviceToDelete = services.find(s => s.id === id);
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le service "${serviceToDelete?.titre}" ?`)) return;
    
    try {
      setServices(prev => prev.filter(s => s.id !== id));
      if (selectedService && selectedService.id === id) {
        setShowModal(false);
        setSelectedService(null);
      }
      showNotification("Service supprimé avec succès", "success");
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrix = (prix: number) => {
    return prix.toLocaleString() + ' FCFA';
  };

  const getStars = (note: number) => {
    const fullStars = Math.floor(note);
    const halfStar = note % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return '⭐'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
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

  // Statistiques
  const stats: ServiceStats = {
    total: services.length,
    actifs: services.filter(s => s.statut === "actif").length,
    inactifs: services.filter(s => s.statut === "inactif").length,
    en_attente: services.filter(s => s.statut === "en_attente").length,
    prix_moyen: services.length > 0 ? services.reduce((acc, s) => acc + s.prix, 0) / services.length : 0,
    categorie_populaire: services.length > 0 
      ? Object.entries(services.reduce((acc, s) => {
          acc[s.categorie] = (acc[s.categorie] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0] || "Aucune"
      : "Aucune"
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
          <p>Chargement des services...</p>
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
              <span style={{ fontSize: "32px" }}>🛠️</span>
              Gestion des Services
            </h1>
            <p style={{ color: "#718096", fontSize: "15px", margin: 0 }}>
              Gérez tous les services proposés sur la plateforme KayJob
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
              gap: "16px",
              marginBottom: "16px"
            }}>
              {[
                { label: "Total", value: stats.total, icon: "📦", color: "#eff6ff", textColor: "#3b82f6" },
                { label: "Actifs", value: stats.actifs, icon: "🟢", color: "#dcfce7", textColor: "#16a34a" },
                { label: "Inactifs", value: stats.inactifs, icon: "🔴", color: "#fee2e2", textColor: "#ef4444" },
                { label: "En attente", value: stats.en_attente, icon: "🟡", color: "#fef3c7", textColor: "#d97706" },
                { label: "Prix moyen", value: formatPrix(stats.prix_moyen), icon: "💰", color: "#e0f2fe", textColor: "#3b82f6" }
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
                    <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: stat.textColor }}>
                      {stat.value}
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "12px"
            }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                📊 Catégorie la plus populaire : <strong>{stats.categorie_populaire}</strong>
              </span>
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
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                background: "none",
                outline: "none",
                fontSize: "14px"
              }}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
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

          <select
            value={filterCategorie}
            onChange={(e) => setFilterCategorie(e.target.value)}
            style={{
              padding: "10px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <option value="toutes">📂 Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            style={{
              padding: "10px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <option value="tous">📊 Tous statuts</option>
            <option value="actif">🟢 Actifs</option>
            <option value="inactif">🔴 Inactifs</option>
            <option value="en_attente">🟡 En attente</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "10px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <option value="date">📅 Plus récents</option>
            <option value="prix">💰 Moins chers</option>
            <option value="nom">🔤 Par nom</option>
          </select>
        </div>

        {/* Résultats */}
        <div style={{ fontSize: "14px", color: "#718096", marginBottom: "16px" }}>
          <span>
            {filteredServices.length} service{filteredServices.length > 1 ? "s" : ""} trouvé{filteredServices.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Liste des services */}
        {filteredServices.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "48px 20px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9"
          }}>
            <span style={{ fontSize: "48px", opacity: "0.5" }}>📭</span>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "8px 0 4px 0", color: "#475569" }}>
              Aucun service trouvé
            </p>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>
              {search ? "Essayez avec d'autres critères" : "Aucun service disponible"}
            </span>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px"
          }}>
            {filteredServices.map((service) => (
              <div key={service.id} style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #f1f5f9",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
              }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#1a202c" }}>
                        {service.titre}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{
                        padding: "2px 10px",
                        background: "#eff6ff",
                        color: "#3b82f6",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600"
                      }}>
                        📂 {service.categorie}
                      </span>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "2px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: service.statut === "actif" ? "#dcfce7" :
                                  service.statut === "inactif" ? "#fee2e2" : "#fef3c7",
                        color: service.statut === "actif" ? "#16a34a" :
                               service.statut === "inactif" ? "#ef4444" : "#d97706"
                      }}>
                        <span>{getStatutIcon(service.statut)}</span>
                        {getStatutTexte(service.statut)}
                      </span>
                    </div>
                  </div>
                  <span style={{ 
                    fontWeight: "700", 
                    color: "#4F46E5",
                    fontSize: "18px"
                  }}>
                    {formatPrix(service.prix)}
                  </span>
                </div>

                <p style={{
                  color: "#475569",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  flex: 1
                }}>
                  {service.description.length > 120 
                    ? service.description.substring(0, 120) + "..." 
                    : service.description}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid #f1f5f9",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>{service.prestataire?.avatar || "👤"}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "500", color: "#1a202c" }}>
                        {service.prestataire?.prenom} {service.prestataire?.nom}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {formatDate(service.created_at)}
                      </div>
                    </div>
                  </div>
                  {service.note_moyenne && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "14px" }}>
                        {getStars(service.note_moyenne)}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a202c" }}>
                        {service.note_moyenne.toFixed(1)}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        ({service.nombre_avis || 0})
                      </span>
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f1f5f9",
                  justifyContent: "flex-end"
                }}>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowModal(true);
                    }}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#eef2ff",
                      color: "#4F46E5",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    👁️ Détails
                  </button>
                  <button
                    onClick={() => handleToggleStatus(service.id)}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: service.statut === "actif" ? "#fef3c7" : "#dcfce7",
                      color: service.statut === "actif" ? "#d97706" : "#16a34a",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {service.statut === "actif" ? "⏸️ Désactiver" : "▶️ Activer"}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#fee2e2",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Détails */}
        {showModal && selectedService && (
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
                  Détails du service
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
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#1a202c", margin: "0 0 8px 0" }}>
                    {selectedService.titre}
                  </h3>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      padding: "4px 12px",
                      background: "#eff6ff",
                      color: "#3b82f6",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      📂 {selectedService.categorie}
                    </span>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: selectedService.statut === "actif" ? "#dcfce7" :
                                selectedService.statut === "inactif" ? "#fee2e2" : "#fef3c7",
                      color: selectedService.statut === "actif" ? "#16a34a" :
                             selectedService.statut === "inactif" ? "#ef4444" : "#d97706"
                    }}>
                      <span>{getStatutIcon(selectedService.statut)}</span>
                      {getStatutTexte(selectedService.statut)}
                    </span>
                    <span style={{
                      padding: "4px 12px",
                      background: "#fef3c7",
                      color: "#d97706",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      💰 {formatPrix(selectedService.prix)}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                      Prestataire
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "24px" }}>{selectedService.prestataire?.avatar || "👤"}</span>
                      <div>
                        <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "500" }}>
                          {selectedService.prestataire?.prenom} {selectedService.prestataire?.nom}
                        </p>
                        <small style={{ color: "#94a3b8", display: "block" }}>
                          {selectedService.prestataire?.email}
                        </small>
                        <small style={{ color: "#94a3b8" }}>
                          {selectedService.prestataire?.telephone}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                      Note moyenne
                    </label>
                    <div>
                      <div style={{ fontSize: "20px" }}>
                        {getStars(selectedService.note_moyenne || 0)}
                      </div>
                      <p style={{ fontSize: "14px", color: "#1e293b", margin: "4px 0 0 0" }}>
                        {selectedService.note_moyenne?.toFixed(1) || "N/A"} 
                        <span style={{ fontSize: "13px", color: "#94a3b8", marginLeft: "4px" }}>
                          ({selectedService.nombre_avis || 0} avis)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                    Description
                  </label>
                  <p style={{
                    fontSize: "14px",
                    color: "#475569",
                    lineHeight: "1.8",
                    margin: 0,
                    background: "#f8fafc",
                    padding: "16px",
                    borderRadius: "12px"
                  }}>
                    {selectedService.description}
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                      Date de création
                    </label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                      {formatDate(selectedService.created_at)}
                    </p>
                  </div>
                  {selectedService.updated_at && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                        Dernière mise à jour
                      </label>
                      <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                        {formatDate(selectedService.updated_at)}
                      </p>
                    </div>
                  )}
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
                <button
                  onClick={() => handleToggleStatus(selectedService.id)}
                  style={{
                    padding: "10px 24px",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    background: selectedService.statut === "actif" ? "#fef3c7" : "#dcfce7",
                    color: selectedService.statut === "actif" ? "#d97706" : "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {selectedService.statut === "actif" ? "⏸️ Désactiver" : "▶️ Activer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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

export default Services;