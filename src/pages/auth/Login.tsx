// src/pages/auth/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logos/kay-job.png";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && user) {
      console.log("Déjà connecté, redirection vers:", user.role);
      redirectBasedOnRole(user.role);
    }
  }, [user, authLoading]);

  const redirectBasedOnRole = (role: string) => {
    console.log("Redirection basée sur le rôle:", role);
    
    switch (role) {
      case "admin":
        navigate("/admin/statistiques", { replace: true });
        break;
      case "prestataire":
        navigate("/prestataire/dashboard", { replace: true });
        break;
      case "demandeur":
        navigate("/demandeur/dashboard", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email invalide";
    }
    
    if (!form.password) {
      newErrors.password = "Le mot de passe est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      console.log("Tentative de connexion:", form.email);
      
      const response = await api.post("/auth/login", form);
      console.log("Réponse API:", response.data);
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error("Token ou utilisateur manquant");
      }
      
      console.log("Connexion réussie - Rôle:", userData.role);
      
      login(token, userData);
      
      if (rememberMe) {
        localStorage.setItem("remember_email", form.email);
      } else {
        localStorage.removeItem("remember_email");
      }
      
      setTimeout(() => {
        redirectBasedOnRole(userData.role);
      }, 100);
      
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      const errorMessage = error.response?.data?.message || "Email ou mot de passe incorrect";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remember_email");
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-grid">
          {/* Left Side - Branding avec logo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="login-brand"
          >
            <div className="brand-content">
              <div className="brand-logo">
                <img src={logo} alt="KAY JOB" />
                <div className="brand-badge">
                  <i className="bi bi-star-fill"></i>
                </div>
              </div>
              <h1 className="brand-title">
                Bienvenue sur
                <span className="gradient-text"> KAY JOB</span>
              </h1>
              <p className="brand-description">
                Connectez-vous pour accéder à votre espace personnel et gérer vos services.
              </p>
              <div className="brand-features">
                <div className="feature-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Accès instantané aux services</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Gestion de vos réservations</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Messagerie intégrée</span>
                </div>
              </div>
              <div className="brand-stats">
                <div className="stat">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Utilisateurs</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
              {/* Lien retour à l'accueil */}
              <Link to="/" className="back-home-link">
                <i className="bi bi-arrow-left"></i>
                Retour à l'accueil
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="login-form-container"
          >
            <div className="form-wrapper">
              <div className="form-header">
                <h2>Connexion</h2>
                <p>Connectez-vous à votre compte</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="bi bi-envelope"></i> Email
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="bi bi-lock"></i> Mot de passe
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={errors.password ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <i className="bi bi-eye"></i>
                      ) : (
                        <i className="bi bi-eye-slash"></i>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>
                    Se souvenir de moi
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      Se connecter
                    </>
                  )}
                </button>

                <div className="register-link">
                  <span>Pas encore inscrit ?</span>
                  <Link to="/register">
                    Créer un compte <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;