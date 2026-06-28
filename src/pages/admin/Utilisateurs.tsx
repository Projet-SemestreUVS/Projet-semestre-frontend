// src/pages/admin/Utilisateurs.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  localisation: string;
  role: "admin" | "prestataire" | "demandeur";
  status: "actif" | "inactif" | "suspendu";
  created_at: string;
  last_login?: string;
  avatar?: string;
  bio?: string;
}

interface UserStats {
  total: number;
  admins: number;
  prestataires: number;
  demandeurs: number;
  actifs: number;
  inactifs: number;
  suspendus: number;
  nouveaux: number;
}

const Utilisateurs = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [filterRole, setFilterRole] = useState("tous");
  const [filterStatus, setFilterStatus] = useState("tous");
  const [sortBy, setSortBy] = useState<"date" | "name" | "role">("date");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    localisation: "",
    role: "demandeur" as "admin" | "prestataire" | "demandeur",
    status: "actif" as "actif" | "inactif" | "suspendu",
    bio: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialisation des données
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        try {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
            setFilteredUsers(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Erreur de parsing:", e);
        }
      }
      initializeDefaultUsers();
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      setLoading(false);
    }
  }, []);

  const initializeDefaultUsers = () => {
    const defaultUsers: User[] = [
      {
        id: 1,
        nom: "Diop",
        prenom: "Ahmadou",
        email: "ahmadou.diop@kayjob.com",
        telephone: "+221 77 123 45 67",
        localisation: "Dakar, Sénégal",
        role: "admin",
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        last_login: new Date(Date.now() - 3600000).toISOString(),
        avatar: "👨‍💼",
        bio: "Administrateur principal de la plateforme KayJob"
      },
      {
        id: 2,
        nom: "Fall",
        prenom: "Fatou",
        email: "fatou.fall@kayjob.com",
        telephone: "+221 78 987 65 43",
        localisation: "Thiès, Sénégal",
        role: "prestataire",
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
        last_login: new Date(Date.now() - 7200000).toISOString(),
        avatar: "👩‍🏫",
        bio: "Professeur de mathématiques expérimentée"
      },
      {
        id: 3,
        nom: "Ndiaye",
        prenom: "Moussa",
        email: "moussa.ndiaye@kayjob.com",
        telephone: "+221 76 456 78 90",
        localisation: "Saint-Louis, Sénégal",
        role: "demandeur",
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        last_login: new Date(Date.now() - 86400000).toISOString(),
        avatar: "👨‍💻",
        bio: "Demandeur de services divers"
      },
      {
        id: 4,
        nom: "Sow",
        prenom: "Aminata",
        email: "aminata.sow@kayjob.com",
        telephone: "+221 77 789 01 23",
        localisation: "Dakar, Sénégal",
        role: "prestataire",
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
        last_login: new Date(Date.now() - 86400000 * 2).toISOString(),
        avatar: "👩‍🔧",
        bio: "Plombière professionnelle"
      },
      {
        id: 5,
        nom: "Ba",
        prenom: "Mamadou",
        email: "mamadou.ba@kayjob.com",
        telephone: "+221 70 234 56 78",
        localisation: "Touba, Sénégal",
        role: "demandeur",
        status: "inactif",
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        last_login: new Date(Date.now() - 86400000 * 10).toISOString(),
        avatar: "👨‍🎨",
        bio: "À la recherche de services artistiques"
      },
      {
        id: 6,
        nom: "Diallo",
        prenom: "Mariama",
        email: "mariama.diallo@kayjob.com",
        telephone: "+221 78 345 67 89",
        localisation: "Dakar, Sénégal",
        role: "admin",
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
        last_login: new Date(Date.now() - 3600000).toISOString(),
        avatar: "👩‍💼",
        bio: "Administratrice et coach professionnelle"
      }
    ];
    setUsers(defaultUsers);
    setFilteredUsers(defaultUsers);
    localStorage.setItem("users", JSON.stringify(defaultUsers));
    setLoading(false);
  };

  // Filtrage et tri
  useEffect(() => {
    try {
      let result = [...users];

      // Recherche
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(
          (u) =>
            u.nom.toLowerCase().includes(searchLower) ||
            u.prenom.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower) ||
            u.localisation.toLowerCase().includes(searchLower) ||
            u.bio?.toLowerCase().includes(searchLower)
        );
      }

      // Filtre par rôle
      if (filterRole !== "tous") {
        result = result.filter((u) => u.role === filterRole);
      }

      // Filtre par statut
      if (filterStatus !== "tous") {
        result = result.filter((u) => u.status === filterStatus);
      }

      // Tri
      if (sortBy === "date") {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (sortBy === "name") {
        result.sort((a, b) => `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`));
      } else if (sortBy === "role") {
        const roleOrder = { admin: 0, prestataire: 1, demandeur: 2 };
        result.sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
      }

      setFilteredUsers(result);
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  }, [search, filterRole, filterStatus, sortBy, users]);

  // Sauvegarde automatique
  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem("users", JSON.stringify(users));
      } catch (err) {
        console.error("Erreur de sauvegarde:", err);
      }
    }
  }, [users]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!form.nom.trim()) errors.nom = "Le nom est requis";
    else if (form.nom.length < 2) errors.nom = "Le nom doit contenir au moins 2 caractères";
    
    if (!form.prenom.trim()) errors.prenom = "Le prénom est requis";
    else if (form.prenom.length < 2) errors.prenom = "Le prénom doit contenir au moins 2 caractères";
    
    if (!form.email.trim()) errors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Email invalide";
    }
    
    if (form.telephone && !/^[\d\s\+\(\)\-]{8,}$/.test(form.telephone)) {
      errors.telephone = "Numéro de téléphone invalide";
    }

    // Vérifier si l'email existe déjà
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === form.email.toLowerCase() && 
      u.id !== editingUser?.id
    );
    if (emailExists) {
      errors.email = "Cet email est déjà utilisé";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const now = new Date().toISOString();
    
    if (editingUser) {
      // Modification
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id
            ? {
                ...u,
                nom: form.nom.trim(),
                prenom: form.prenom.trim(),
                email: form.email.trim(),
                telephone: form.telephone.trim(),
                localisation: form.localisation.trim(),
                role: form.role,
                status: form.status,
                bio: form.bio.trim(),
              }
            : u
        )
      );
      showNotification("Utilisateur modifié avec succès !", "success");
    } else {
      // Création
      const newUser: User = {
        id: Date.now(),
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim(),
        localisation: form.localisation.trim(),
        role: form.role,
        status: form.status,
        created_at: now,
        last_login: now,
        avatar: getAvatar(form.prenom, form.nom),
        bio: form.bio.trim() || undefined,
      };
      setUsers(prev => [newUser, ...prev]);
      showNotification("Utilisateur créé avec succès !", "success");
    }

    closeModal();
  };

  const getAvatar = (prenom: string, nom: string): string => {
    const avatars = ["👨‍💼", "👩‍💼", "👨‍💻", "👩‍💻", "👨‍🔧", "👩‍🔧", "👨‍🎨", "👩‍🎨", "🧑‍💼", "🧑‍💻", "🧑‍🔧", "🧑‍🎨"];
    const index = (prenom.length + nom.length) % avatars.length;
    return avatars[index];
  };

  const handleDelete = (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${userToDelete.prenom} ${userToDelete.nom} ?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setSelectedUsers(prev => prev.filter(uid => uid !== id));
      showNotification("Utilisateur supprimé avec succès !", "success");
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    
    if (window.confirm(`Supprimer ${selectedUsers.length} utilisateur(s) sélectionné(s) ?`)) {
      setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      setShowBulkActions(false);
      showNotification(`${selectedUsers.length} utilisateur(s) supprimé(s) !`, "success");
    }
  };

  const handleBulkStatusUpdate = (status: "actif" | "inactif" | "suspendu") => {
    if (selectedUsers.length === 0) return;
    
    setUsers(prev =>
      prev.map(u =>
        selectedUsers.includes(u.id) ? { ...u, status } : u
      )
    );
    setSelectedUsers([]);
    setShowBulkActions(false);
    showNotification(`Statut mis à jour pour ${selectedUsers.length} utilisateur(s) !`, "success");
  };

  const handleToggleSelect = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setForm({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone || "",
        localisation: user.localisation || "",
        role: user.role,
        status: user.status,
        bio: user.bio || "",
      });
    } else {
      setEditingUser(null);
      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        localisation: "",
        role: "demandeur",
        status: "actif",
        bio: "",
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormErrors({});
  };

  const getRoleBadgeClass = (role: string): string => {
    switch (role) {
      case "admin": return "role-admin";
      case "prestataire": return "role-prestataire";
      default: return "role-demandeur";
    }
  };

  const getRoleIcon = (role: string): string => {
    switch (role) {
      case "admin": return "👑";
      case "prestataire": return "🔧";
      default: return "👤";
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "actif": return "status-actif";
      case "inactif": return "status-inactif";
      default: return "status-suspendu";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "actif": return "🟢";
      case "inactif": return "🔴";
      default: return "🟡";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = now.getTime() - past.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return formatDate(dateString);
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
  const stats: UserStats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    prestataires: users.filter(u => u.role === "prestataire").length,
    demandeurs: users.filter(u => u.role === "demandeur").length,
    actifs: users.filter(u => u.status === "actif").length,
    inactifs: users.filter(u => u.status === "inactif").length,
    suspendus: users.filter(u => u.status === "suspendu").length,
    nouveaux: users.filter(u => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(u.created_at) > weekAgo;
    }).length,
  };

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
          <p>Chargement des utilisateurs...</p>
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
              <span style={{ fontSize: "32px" }}>👥</span>
              Gestion des Utilisateurs
            </h1>
            <p style={{ color: "#718096", fontSize: "15px", margin: 0 }}>
              Gérez tous les utilisateurs de la plateforme KayJob
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
              {showStats ? "Cacher" : "Voir"} les stats
            </button>
            <button 
              onClick={() => openModal()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)"
              }}
            >
              <span>➕</span>
              Nouvel utilisateur
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {showStats && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px"
          }}>
            {[
              { label: "Total", value: stats.total, icon: "👥", color: "#eff6ff", textColor: "#3b82f6" },
              { label: "Administrateurs", value: stats.admins, icon: "👑", color: "#fef2f2", textColor: "#dc2626" },
              { label: "Prestataires", value: stats.prestataires, icon: "🔧", color: "#dcfce7", textColor: "#16a34a" },
              { label: "Demandeurs", value: stats.demandeurs, icon: "👤", color: "#fef3c7", textColor: "#d97706" },
              { label: "Actifs", value: stats.actifs, icon: "🟢", color: "#dcfce7", textColor: "#16a34a" },
              { label: "Nouveaux (7j)", value: stats.nouveaux, icon: "🆕", color: "#e0f2fe", textColor: "#3b82f6" }
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
        )}

        {/* Filtres et recherche */}
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
              placeholder="Rechercher par nom, email, localisation..."
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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
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
            <option value="tous">👥 Tous rôles</option>
            <option value="admin">👑 Administrateurs</option>
            <option value="prestataire">🔧 Prestataires</option>
            <option value="demandeur">👤 Demandeurs</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <option value="suspendu">🟡 Suspendus</option>
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
            <option value="name">🔤 Par nom</option>
            <option value="role">👥 Par rôle</option>
          </select>
        </div>

        {/* Actions en masse */}
        {selectedUsers.length > 0 && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "16px",
            border: "2px solid #4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <span style={{ fontWeight: "600", color: "#1a202c" }}>
              {selectedUsers.length} utilisateur(s) sélectionné(s)
            </span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleBulkStatusUpdate("actif")}
                style={{
                  padding: "6px 14px",
                  background: "#dcfce7",
                  color: "#16a34a",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
              >
                🟢 Activer
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("inactif")}
                style={{
                  padding: "6px 14px",
                  background: "#fee2e2",
                  color: "#ef4444",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
              >
                🔴 Désactiver
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("suspendu")}
                style={{
                  padding: "6px 14px",
                  background: "#fef3c7",
                  color: "#d97706",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
              >
                🟡 Suspendre
              </button>
              <button
                onClick={handleBulkDelete}
                style={{
                  padding: "6px 14px",
                  background: "#fee2e2",
                  color: "#ef4444",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
              >
                🗑️ Supprimer
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                style={{
                  padding: "6px 14px",
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
              >
                ✕ Annuler
              </button>
            </div>
          </div>
        )}

        {/* Résultats */}
        <div style={{ fontSize: "14px", color: "#718096", marginBottom: "16px" }}>
          <span>
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} trouvé{filteredUsers.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Tableau des utilisateurs */}
        {filteredUsers.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "48px 20px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9"
          }}>
            <span style={{ fontSize: "48px", opacity: "0.5" }}>📭</span>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "8px 0 4px 0", color: "#475569" }}>
              Aucun utilisateur trouvé
            </p>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>
              {search ? "Essayez avec d'autres critères" : "Ajoutez votre premier utilisateur"}
            </span>
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9",
            overflowX: "auto"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px"
            }}>
              <thead>
                <tr style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0"
                }}>
                  <th style={{ padding: "12px 16px", width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleToggleSelectAll}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        accentColor: "#4F46E5"
                      }}
                    />
                  </th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Utilisateur</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Email</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Localisation</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Rôle</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Statut</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.2s ease",
                    background: selectedUsers.includes(user.id) ? "#eef2ff" : "white"
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedUsers.includes(user.id)) {
                      e.currentTarget.style.background = "#f8fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedUsers.includes(user.id)) {
                      e.currentTarget.style.background = "white";
                    }
                  }}
                  >
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleToggleSelect(user.id)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          accentColor: "#4F46E5"
                        }}
                      />
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "44px",
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                          color: "white",
                          borderRadius: "12px",
                          fontSize: "22px",
                          fontWeight: "600",
                          flexShrink: 0
                        }}>
                          {user.avatar || "👤"}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", color: "#1a202c" }}>
                            {user.prenom} {user.nom}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            📱 {user.telephone || "Non renseigné"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                            🕐 {formatTimeAgo(user.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontSize: "14px", color: "#1a202c" }}>
                        {user.email}
                      </div>
                      {user.bio && (
                        <div style={{ fontSize: "12px", color: "#94a3b8", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user.bio}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#475569" }}>
                        <span>📍</span> {user.localisation || "Non définie"}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: user.role === "admin" ? "#fef2f2" :
                                  user.role === "prestataire" ? "#dcfce7" : "#fef3c7",
                        color: user.role === "admin" ? "#dc2626" :
                               user.role === "prestataire" ? "#16a34a" : "#d97706"
                      }}>
                        <span>{getRoleIcon(user.role)}</span>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: user.status === "actif" ? "#dcfce7" :
                                  user.status === "inactif" ? "#fee2e2" : "#fef3c7",
                        color: user.status === "actif" ? "#16a34a" :
                               user.status === "inactif" ? "#ef4444" : "#d97706"
                      }}>
                        <span>{getStatusIcon(user.status)}</span>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        <button
                          onClick={() => openModal(user)}
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
                            fontSize: "14px",
                            transition: "all 0.3s ease"
                          }}
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                            fontSize: "14px",
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

        {/* Modal Ajout/Modification */}
        {showModal && (
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
              maxWidth: "580px",
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
                  <span style={{ fontSize: "24px" }}>
                    {editingUser ? "✏️" : "➕"}
                  </span>
                  {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
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
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                        Nom <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        placeholder="Nom"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: `2px solid ${formErrors.nom ? "#ef4444" : "#e2e8f0"}`,
                          borderRadius: "10px",
                          fontSize: "14px",
                          transition: "all 0.3s ease",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                        onBlur={(e) => e.target.style.borderColor = formErrors.nom ? "#ef4444" : "#e2e8f0"}
                      />
                      {formErrors.nom && <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>{formErrors.nom}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                        Prénom <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.prenom}
                        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                        placeholder="Prénom"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: `2px solid ${formErrors.prenom ? "#ef4444" : "#e2e8f0"}`,
                          borderRadius: "10px",
                          fontSize: "14px",
                          transition: "all 0.3s ease",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                        onBlur={(e) => e.target.style.borderColor = formErrors.prenom ? "#ef4444" : "#e2e8f0"}
                      />
                      {formErrors.prenom && <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>{formErrors.prenom}</span>}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                      Email <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="exemple@email.com"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `2px solid ${formErrors.email ? "#ef4444" : "#e2e8f0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                      onBlur={(e) => e.target.style.borderColor = formErrors.email ? "#ef4444" : "#e2e8f0"}
                    />
                    {formErrors.email && <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>{formErrors.email}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      placeholder="+221 77 123 45 67"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `2px solid ${formErrors.telephone ? "#ef4444" : "#e2e8f0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                      onBlur={(e) => e.target.style.borderColor = formErrors.telephone ? "#ef4444" : "#e2e8f0"}
                    />
                    {formErrors.telephone && <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>{formErrors.telephone}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={form.localisation}
                      onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                      placeholder="Dakar, Sénégal"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                      Bio
                    </label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Brève description..."
                      rows={2}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        resize: "vertical",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                        Rôle <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "10px",
                          fontSize: "14px",
                          background: "white",
                          cursor: "pointer",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                      >
                        <option value="demandeur">👤 Demandeur</option>
                        <option value="prestataire">🔧 Prestataire</option>
                        <option value="admin">👑 Administrateur</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                        Statut <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "10px",
                          fontSize: "14px",
                          background: "white",
                          cursor: "pointer",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                      >
                        <option value="actif">🟢 Actif</option>
                        <option value="inactif">🔴 Inactif</option>
                        <option value="suspendu">🟡 Suspendu</option>
                      </select>
                    </div>
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
                  onClick={closeModal}
                  style={{
                    padding: "10px 24px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  style={{
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span>💾</span>
                  {editingUser ? "Mettre à jour" : "Enregistrer"}
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

export default Utilisateurs;