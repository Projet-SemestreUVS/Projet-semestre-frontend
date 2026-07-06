// src/pages/auth/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logos/kay-job.png";
import "../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    password_confirmation: "",
    role: "demandeur",
    localisation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
    
    if (!form.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email invalide";
    }
    if (!form.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    }
    if (!form.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (form.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Les mots de passe ne correspondent pas";
    }
    if (!acceptTerms) {
      newErrors.terms = "Vous devez accepter les conditions d'utilisation";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      console.log("Envoi du formulaire:", form);
      
      const response = await api.post("/auth/register", form);
      console.log("Réponse:", response.data);
      
      if (response.data.token) {
        login(response.data.token, response.data.user);
      }
      
      navigate("/verify-email");
    } catch (error: any) {
      console.error("Erreur:", error);
      const errorMessage = error.response?.data?.message || "Une erreur est survenue";
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: "bi-check-circle-fill", text: "Accès à tous les services" },
    { icon: "bi-check-circle-fill", text: "Support client 24/7" },
    { icon: "bi-check-circle-fill", text: "Paiement sécurisé" },
    { icon: "bi-check-circle-fill", text: "Avis vérifiés" },
  ];

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-grid">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="register-brand"
          >
            <div className="brand-content">
              <div className="brand-logo">
                <img src={logo} alt="KAY JOB" />
                <div className="brand-badge">
                  <i className="bi bi-star-fill"></i>
                </div>
              </div>
              <h1 className="brand-title">
                Créez votre compte
                <span className="gradient-text"> KAY JOB</span>
              </h1>
              <p className="brand-description">
                Rejoignez la plus grande plateforme de mise en relation au Sénégal.
              </p>
              
              <div className="brand-features">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="feature-item"
                  >
                    <i className={`bi ${benefit.icon}`}></i>
                    <span>{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="brand-stats">
                <div className="stat">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Utilisateurs</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Services</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfaction</span>
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
            className="register-form-container"
          >
            <div className="form-wrapper">
              <div className="form-header">
                <h2>Inscription</h2>
                <p>Créez votre compte en quelques secondes</p>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">
                      <i className="bi bi-person"></i> Nom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className={errors.nom ? "error" : ""}
                    />
                    {errors.nom && <span className="error-message">{errors.nom}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="prenom">
                      <i className="bi bi-person"></i> Prénom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={form.prenom}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      className={errors.prenom ? "error" : ""}
                    />
                    {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <i className="bi bi-envelope"></i> Email <span className="required">*</span>
                  </label>
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
                  <label htmlFor="telephone">
                    <i className="bi bi-telephone"></i> Téléphone <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="+221 76 316 21 64"
                    className={errors.telephone ? "error" : ""}
                  />
                  {errors.telephone && <span className="error-message">{errors.telephone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="localisation">
                    <i className="bi bi-geo-alt"></i> Localisation
                  </label>
                  <input
                    type="text"
                    id="localisation"
                    name="localisation"
                    value={form.localisation}
                    onChange={handleChange}
                    placeholder="Dakar, Sénégal"
                  />
                </div>

                {/* ROLE SELECTION */}
                <div className="form-group">
                  <label htmlFor="role">
                    <i className="bi bi-person-badge"></i> Je suis <span className="required">*</span>
                  </label>
                  <div className="role-selector">
                    <label className={`role-option ${form.role === "demandeur" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="role"
                        value="demandeur"
                        checked={form.role === "demandeur"}
                        onChange={handleChange}
                      />
                      <div className="role-icon">
                        <i className="bi bi-search"></i>
                      </div>
                      <div className="role-info">
                        <strong>Demandeur</strong>
                        <small>Je cherche un service</small>
                      </div>
                    </label>
                    
                    <label className={`role-option ${form.role === "prestataire" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="role"
                        value="prestataire"
                        checked={form.role === "prestataire"}
                        onChange={handleChange}
                      />
                      <div className="role-icon">
                        <i className="bi bi-tools"></i>
                      </div>
                      <div className="role-info">
                        <strong>Prestataire</strong>
                        <small>Je propose mes services</small>
                      </div>
                    </label>

                    <label className={`role-option ${form.role === "admin" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={form.role === "admin"}
                        onChange={handleChange}
                      />
                      <div className="role-icon">
                        <i className="bi bi-shield"></i>
                      </div>
                      <div className="role-info">
                        <strong>Administrateur</strong>
                        <small>Gérer la plateforme</small>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">
                      <i className="bi bi-lock"></i> Mot de passe <span className="required">*</span>
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

                  <div className="form-group">
                    <label htmlFor="password_confirmation">
                      <i className="bi bi-lock"></i> Confirmation <span className="required">*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="password_confirmation"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={errors.password_confirmation ? "error" : ""}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <i className="bi bi-eye"></i>
                        ) : (
                          <i className="bi bi-eye-slash"></i>
                        )}
                      </button>
                    </div>
                    {errors.password_confirmation && <span className="error-message">{errors.password_confirmation}</span>}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="terms-group">
                  <label className="terms-checkbox">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <span className="terms-custom"></span>
                    <span className="terms-text">
                      J'accepte les{" "}
                      <Link to="/terms">Conditions d'utilisation</Link> et la{" "}
                      <Link to="/privacy">Politique de confidentialité</Link>
                      <span className="required">*</span>
                    </span>
                  </label>
                  {errors.terms && <span className="error-message">{errors.terms}</span>}
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus"></i>
                      Créer mon compte
                    </>
                  )}
                </button>

                <div className="login-link">
                  Déjà un compte ?{" "}
                  <Link to="/login">
                    Connectez-vous <i className="bi bi-arrow-right"></i>
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

export default Register;