// src/pages/admin/Utilisateurs.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import api from "../../services/api";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: string;
  localisation?: string;
  created_at?: string;
}

const Utilisateurs = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    localisation: "",
    role: "demandeur",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter(
      (u) =>
        u.nom?.toLowerCase().includes(search.toLowerCase()) ||
        u.prenom?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      console.log("Réponse API:", res.data);
      
      let usersData = [];
      if (res.data && res.data.data) {
        usersData = res.data.data;
      } else if (Array.isArray(res.data)) {
        usersData = res.data;
      } else if (res.data.users) {
        usersData = res.data.users;
      }
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      alert("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({
      ...form,
      password,
      password_confirmation: password,
    });
  };

  const handleSubmit = async () => {
    if (!form.nom.trim()) {
      alert("Le nom est requis");
      return;
    }
    if (!form.prenom.trim()) {
      alert("Le prénom est requis");
      return;
    }
    if (!form.email.trim()) {
      alert("L'email est requis");
      return;
    }
    if (!form.email.includes("@")) {
      alert("Email invalide");
      return;
    }
    if (!editingUser && !form.password) {
      alert("Le mot de passe est requis");
      return;
    }
    if (!editingUser && form.password !== form.password_confirmation) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingUser) {
        const updateData = {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          localisation: form.localisation,
          role: form.role,
        };
        await api.put(`/users/${editingUser.id}`, updateData);
        alert("Utilisateur modifié avec succès");
      } else {
        const createData = {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          localisation: form.localisation,
          role: form.role,
          password: form.password,
          password_confirmation: form.password_confirmation,
        };
        await api.post("/users", createData);
        alert("Utilisateur créé avec succès");
      }
      
      fetchUsers();
      closeModal();
    } catch (error: any) {
      console.error("Erreur:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.errors || "Erreur lors de l'opération";
      if (typeof errorMsg === "object") {
        alert(JSON.stringify(errorMsg));
      } else {
        alert(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (id: number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.");
    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);
      alert("Utilisateur supprimé avec succès");
      fetchUsers();
    } catch (error: any) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone || "",
      localisation: user.localisation || "",
      role: user.role,
      password: "",
      password_confirmation: "",
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      localisation: "",
      role: "demandeur",
      password: "",
      password_confirmation: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-danger";
      case "prestataire":
        return "bg-success";
      default:
        return "bg-primary";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "prestataire":
        return "Prestataire";
      default:
        return "Demandeur";
    }
  };

  const totalUsers = users.length;
  const totalPrestataires = users.filter((u) => u.role === "prestataire").length;
  const totalDemandeurs = users.filter((u) => u.role === "demandeur").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container-fluid py-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold text-primary mb-1">
              <i className="bi bi-people-fill me-2"></i>
              Gestion des Utilisateurs
            </h2>
            <p className="text-muted mb-0">
              Administration complète des comptes de la plateforme KayJob
            </p>
          </div>
          <button className="btn btn-primary rounded-pill px-4" onClick={openCreate}>
            <i className="bi bi-plus-lg me-2"></i>
            Nouvel utilisateur
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="display-6 text-primary mb-2 fw-bold">{totalUsers}</div>
                <span className="text-muted">Total Utilisateurs</span>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="display-6 text-danger mb-2 fw-bold">{totalAdmins}</div>
                <span className="text-muted">Administrateurs</span>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="display-6 text-success mb-2 fw-bold">{totalPrestataires}</div>
                <span className="text-muted">Prestataires</span>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="display-6 text-info mb-2 fw-bold">{totalDemandeurs}</div>
                <span className="text-muted">Demandeurs</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Rechercher par nom, prénom ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TABLEAU DES UTILISATEURS */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">ID</th>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <i className="bi bi-inbox fs-1 text-muted"></i>
                        <p className="text-muted mt-2">Aucun utilisateur trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4">{user.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle me-3">
                              {user.prenom?.[0]}{user.nom?.[0]}
                            </div>
                            <div>
                              <div className="fw-semibold">{user.prenom} {user.nom}</div>
                              <small className="text-muted">{user.localisation || "Localisation non définie"}</small>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.telephone || "-"}</td>
                        <td>
                          <span className={`badge ${getRoleBadgeClass(user.role)} px-3 py-2 rounded-pill`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-outline-warning me-2 rounded-circle" onClick={() => openEdit(user)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => deleteUser(user.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL AJOUT/MODIFICATION */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header bg-light rounded-top-4">
                  <h5 className="modal-title fw-bold">
                    <i className={`bi ${editingUser ? "bi-pencil-square" : "bi-person-plus"} me-2 text-primary`}></i>
                    {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Nom *</label>
                      <input
                        className="form-control"
                        placeholder="Nom"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Prénom *</label>
                      <input
                        className="form-control"
                        placeholder="Prénom"
                        value={form.prenom}
                        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Email *</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Téléphone</label>
                      <input
                        className="form-control"
                        placeholder="Téléphone"
                        value={form.telephone}
                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Localisation</label>
                      <input
                        className="form-control"
                        placeholder="Dakar, Sénégal"
                        value={form.localisation}
                        onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Rôle *</label>
                      <select
                        className="form-select"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                      >
                        <option value="demandeur">👤 Demandeur</option>
                        <option value="prestataire">🔧 Prestataire</option>
                        <option value="admin">👑 Administrateur</option>
                      </select>
                    </div>
                    {!editingUser && (
                      <>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Mot de passe *</label>
                          <div className="input-group">
                            <input
                              className="form-control"
                              type="text"
                              value={form.password}
                              readOnly
                              placeholder="Mot de passe généré"
                            />
                            <button className="btn btn-outline-primary" type="button" onClick={generatePassword}>
                              <i className="bi bi-shuffle"></i> Générer
                            </button>
                          </div>
                          <small className="text-muted">Cliquez sur générer pour créer un mot de passe sécurisé</small>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Confirmer le mot de passe *</label>
                          <input
                            className="form-control"
                            type="password"
                            placeholder="Confirmation"
                            value={form.password_confirmation}
                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="modal-footer bg-light rounded-bottom-4">
                  <button className="btn btn-secondary px-4" onClick={closeModal}>
                    Annuler
                  </button>
                  <button className="btn btn-primary px-4" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .avatar-circle {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0D6EFD, #4DA3FF);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
          text-transform: uppercase;
        }
        .display-6 {
          font-size: 2rem;
          font-weight: 600;
        }
        .modal.show {
          display: block;
        }
        .rounded-4 {
          border-radius: 1rem;
        }
        .rounded-top-4 {
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .rounded-bottom-4 {
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Utilisateurs;