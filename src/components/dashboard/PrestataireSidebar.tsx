// src/components/dashboard/PrestataireSidebar.tsx
import { NavLink } from "react-router-dom";

const PrestataireSidebar = () => {
  const menuItems = [
    { path: "/prestataire/dashboard", icon: "bi-grid", label: "Tableau de bord" },
    { path: "/prestataire/services", icon: "bi-tools", label: "Mes services" },
    { path: "/prestataire/services/ajouter", icon: "bi-plus-circle", label: "Ajouter un service" },
    { path: "/prestataire/reservations", icon: "bi-calendar-check", label: "Réservations" },
    { path: "/prestataire/messages", icon: "bi-chat-dots", label: "Messages" },
    { path: "/prestataire/notifications", icon: "bi-bell", label: "Notifications" },
    { path: "/prestataire/profile", icon: "bi-person", label: "Mon profil" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🔧</div>
          <span className="logo-text">KAY JOB</span>
          <span className="logo-subtitle">Espace Prestataire</span>
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
            <span className="user-name">Prestataire</span>
            <span className="user-role">Professionnel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestataireSidebar;