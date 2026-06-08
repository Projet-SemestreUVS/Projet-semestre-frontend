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
      
      // Appeler la fonction login du contexte
      login(token, userData);
      
      // Sauvegarder l'email
      if (rememberMe) {
        localStorage.setItem("remember_email", form.email);
      } else {
        localStorage.removeItem("remember_email");
      }
      
      // Rediriger
      redirectBasedOnRole(userData.role);
      
    } catch (error: any) {
      console.error("Erreur:", error);
      const errorMessage = error.response?.data?.message || "Email ou mot de passe incorrect";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Charger l'email mémorisé
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
          <div className="loading-spinner">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-grid">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="login-brand"
          >
            <div className="brand-content">
              <div className="brand-logo">
                <img src={logo} alt="KAY JOB" />
              </div>
              <h1 className="brand-title">
                Bienvenue sur
                <span className="gradient-text"> KAY JOB</span>
              </h1>
              <p className="brand-description">
                Connectez-vous pour accéder à votre espace personnel.
              </p>
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
                  <label htmlFor="email">Email</label>
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

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
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
                      {showPassword ? "👁️" : "👁️‍🗨️"}
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
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </button>

                <div className="register-link">
                  <span>Pas encore inscrit ?</span>
                  <Link to="/register">Créer un compte →</Link>
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