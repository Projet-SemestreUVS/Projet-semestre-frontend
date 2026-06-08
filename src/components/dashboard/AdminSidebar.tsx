// src/components/dashboard/AdminSidebar.tsx
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const menuItems = [
    { path: "/admin/statistiques", icon: "bi-graph-up", label: "Statistiques" },
    { path: "/admin/users", icon: "bi-people", label: "Utilisateurs" },
    { path: "/admin/categories", icon: "bi-tags", label: "Catégories" },
    { path: "/admin/services", icon: "bi-tools", label: "Services" },
    { path: "/admin/reviews", icon: "bi-star", label: "Avis" },
    { path: "/admin/reservations", icon: "bi-calendar-check", label: "Réservations" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">👑</div>
          <span className="logo-text">KAY JOB</span>
          <span className="logo-subtitle">Administration</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.path} className="nav-item">
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="user-info">
            <span className="user-name">Administrateur</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;