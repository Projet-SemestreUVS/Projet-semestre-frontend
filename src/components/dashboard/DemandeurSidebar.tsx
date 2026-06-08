// src/components/dashboard/DemandeurSidebar.tsx
import { NavLink } from "react-router-dom";

const DemandeurSidebar = () => {
  const menuItems = [
    { path: "/demandeur/dashboard", icon: "bi-grid", label: "Tableau de bord" },
    { path: "/demandeur/reservations", icon: "bi-calendar-check", label: "Mes réservations" },
    { path: "/demandeur/reservation/nouvelle", icon: "bi-search", label: "FaireReservation" },
    { path: "/demandeur/avis", icon: "bi-star", label: "Mes avis" },
    { path: "/demandeur/messages", icon: "bi-chat-dots", label: "Messages" },
    { path: "/demandeur/notifications", icon: "bi-bell", label: "Notifications" },
    { path: "/demandeur/profile", icon: "bi-person", label: "Mon profil" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">👤</div>
          <span className="logo-text">KAY JOB</span>
          <span className="logo-subtitle">Espace Demandeur</span>
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
            <span className="user-name">Demandeur</span>
            <span className="user-role">Client</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandeurSidebar;