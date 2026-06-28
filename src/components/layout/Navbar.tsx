import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logos/kay-job.png";
<NavLink to="/about">À propos</NavLink>
const Navbar = () => {

  const { user, logout } = useAuth();

  return (

    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">

      <div className="container navbar-shell">

        <Link className="navbar-brand modern-brand" to="/">
          <span className="brand-mark">
            <img src={logo} alt="KAY JOB" />
          </span>
          <span className="brand-copy">
            <strong>KAY JOB</strong>
            <small>Services rapides & fiables</small>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/">
                <i className="bi bi-house-door-fill nav-icon"></i>
                <span>Accueil</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/services">
                <i className="bi bi-grid-fill nav-icon"></i>
                <span>Services</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/about">
                <i className="bi bi-info-circle-fill nav-icon"></i>
                <span>À propos</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/contact">
                <i className="bi bi-envelope-fill nav-icon"></i>
                <span>Contact</span>
              </NavLink>
            </li>

            {!user ? (
              <>
                <li className="nav-item ms-lg-3">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary navbar-cta"
                  >
                    Connexion
                  </Link>
                </li>

                <li className="nav-item ms-lg-2">
                  <Link
                    to="/register"
                    className="btn btn-primary navbar-cta navbar-cta--primary"
                  >
                    Inscription
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  Bonjour {user.prenom} {user.nom}
                </li>

                <li className="nav-item">
                  <button
                    onClick={logout}
                    className="btn btn-danger"
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            )}

          </ul>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;