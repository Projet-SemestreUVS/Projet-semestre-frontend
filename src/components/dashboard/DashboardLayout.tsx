// src/components/dashboard/DashboardLayout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/dashboard.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {sidebar}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
            <h1>Tableau de bord</h1>
          </div>
          <div className="header-right">
            <div className="user-info-header">
              <span className="user-name-header">
                {user?.prenom} {user?.nom}
              </span>
              <span className="user-role-header">{user?.role === "demandeur" ? "Demandeur" : user?.role}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <i className="bi bi-box-arrow-right"></i>
              <span>Déconnexion</span>
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;