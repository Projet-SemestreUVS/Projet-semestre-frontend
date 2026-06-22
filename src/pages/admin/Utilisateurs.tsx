import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import "../../styles/utilisateurs.css";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
}

const Utilisateurs = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "demandeur",
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );
  }, [users]);

  const openAddModal = () => {
    setEditingUser(null);

    setForm({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      role: "demandeur",
    });

    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);

    setForm({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
    });

    setShowModal(true);
  };

  const handleSave = () => {
    if (
      !form.nom ||
      !form.prenom ||
      !form.email
    ) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...form,
              }
            : u
        )
      );
    } else {
      const newUser: User = {
        id: Date.now(),
        ...form,
      };

      setUsers([...users, newUser]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Supprimer cet utilisateur ?"
      )
    ) {
      setUsers(
        users.filter(
          (user) => user.id !== id
        )
      );
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nom
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.prenom
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalUsers = users.length;

  const totalPrestataires =
    users.filter(
      (u) => u.role === "prestataire"
    ).length;

  const totalDemandeurs =
    users.filter(
      (u) => u.role === "demandeur"
    ).length;

  const totalAdmins =
    users.filter(
      (u) => u.role === "admin"
    ).length;

  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
    >
      <div className="users-page">

        <div className="page-header">
          <h2>
            Gestion des Utilisateurs
          </h2>

          <button
            className="btn-add"
            onClick={openAddModal}
          >
            + Ajouter
          </button>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <h3>{totalUsers}</h3>
            <p>Utilisateurs</p>
          </div>

          <div className="stat-card">
            <h3>{totalPrestataires}</h3>
            <p>Prestataires</p>
          </div>

          <div className="stat-card">
            <h3>{totalDemandeurs}</h3>
            <p>Demandeurs</p>
          </div>

          <div className="stat-card">
            <h3>{totalAdmins}</h3>
            <p>Admins</p>
          </div>

        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.telephone}
                    </td>

                    <td>
                      <span
                        className={`badge ${user.role}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-edit"
                        onClick={() =>
                          openEditModal(user)
                        }
                      >
                        Modifier
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleDelete(
                            user.id
                          )
                        }
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">

            <div className="modal-box">

              <h3>
                {editingUser
                  ? "Modifier"
                  : "Ajouter"}{" "}
                Utilisateur
              </h3>

              <input
                placeholder="Nom"
                value={form.nom}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nom:
                      e.target.value,
                  })
                }
              />

              <input
                placeholder="Prénom"
                value={form.prenom}
                onChange={(e) =>
                  setForm({
                    ...form,
                    prenom:
                      e.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
              />

              <input
                placeholder="Téléphone"
                value={form.telephone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    telephone:
                      e.target.value,
                  })
                }
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role:
                      e.target.value,
                  })
                }
              >
                <option value="admin">
                  Admin
                </option>

                <option value="prestataire">
                  Prestataire
                </option>

                <option value="demandeur">
                  Demandeur
                </option>
              </select>

              <div className="modal-actions">

                <button
                  className="btn-save"
                  onClick={handleSave}
                >
                  Enregistrer
                </button>

                <button
                  className="btn-cancel"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Annuler
                </button>

              </div>

            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Utilisateurs;