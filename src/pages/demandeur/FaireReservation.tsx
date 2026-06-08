// src/pages/demandeur/FaireReservation.tsx
import { Link } from "react-router-dom"; // Ajouter cette ligne si ce n'est pas déjà fait
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Service {
  id: number;
  nom: string;
  description: string;
  prix: number;
  duree: string;
  categorie_id: number;
  prestataire_id: number;
  prestataire_nom?: string;
  prestataire_prenom?: string;
}

interface ReservationData {
  service_id: number;
  demandeur_id: number;
  prestataire_id: number;
  date_debut: string;
  commentaire: string;
}

const FaireReservation = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [chargementService, setChargementService] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<ReservationData>({
    service_id: 0,
    demandeur_id: 0,
    prestataire_id: 0,
    date_debut: "",
    commentaire: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setChargementService(true);
        
        // Récupérer l'utilisateur connecté
        const userResponse = await api.get("/auth/profile");
        const currentUser = userResponse.data.user;
        setUser(currentUser);
        setForm(prev => ({ ...prev, demandeur_id: currentUser.id }));

        // Récupérer le service si un ID est passé
        if (serviceId) {
          const serviceResponse = await api.get(`/services/${serviceId}`);
          const serviceData = serviceResponse.data.data || serviceResponse.data;
          setService(serviceData);
          setForm(prev => ({
            ...prev,
            service_id: serviceData.id,
            prestataire_id: serviceData.prestataire_id
          }));
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setChargementService(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.service_id || form.service_id === 0) {
      newErrors.service_id = "Veuillez sélectionner un service";
    }
    if (!form.date_debut) {
      newErrors.date_debut = "Veuillez sélectionner une date";
    } else {
      const selectedDate = new Date(form.date_debut);
      const today = new Date();
      if (selectedDate < today) {
        newErrors.date_debut = "La date doit être dans le futur";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const reservationData = {
        service_id: form.service_id,
        demandeur_id: form.demandeur_id,
        prestataire_id: form.prestataire_id,
        date_debut: form.date_debut,
        commentaire: form.commentaire || null
      };
      
      const response = await api.post("/reservations", reservationData);
      
      if (response.data.success || response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/demandeur/reservations");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Erreur:", error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la réservation";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Si chargement
  if (chargementService) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="dashboard-demandeur">
        <div className="page-header">
          <h1>
            <i className="bi bi-calendar-plus"></i>
            Nouvelle réservation
          </h1>
          <p>Remplissez le formulaire ci-dessous pour effectuer une réservation</p>
        </div>

        {success ? (
          <div className="success-message">
            <i className="bi bi-check-circle-fill"></i>
            <h3>Réservation effectuée avec succès !</h3>
            <p>Redirection vers vos réservations...</p>
          </div>
        ) : (
          <div className="reservation-form-container">
            <form onSubmit={handleSubmit} className="reservation-form">
              {/* Sélection du service */}
              <div className="form-group">
                <label htmlFor="service_id">
                  <i className="bi bi-tools"></i>
                  Service <span className="required">*</span>
                </label>
                {service ? (
                  <div className="service-info-card">
                    <div className="service-info-header">
                      <i className="bi bi-tools"></i>
                      <span className="service-name">{service.nom}</span>
                    </div>
                    <div className="service-info-details">
                      <p><i className="bi bi-currency-dollar"></i> Prix: {service.prix?.toLocaleString()} FCFA</p>
                      <p><i className="bi bi-clock"></i> Durée: {service.duree}</p>
                      <p><i className="bi bi-person"></i> Description: {service.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="service-select-wrapper">
                    <select
                      name="service_id"
                      value={form.service_id || ""}
                      onChange={handleChange}
                      className={errors.service_id ? "error" : ""}
                    >
                      <option value="">Sélectionnez un service</option>
                      {/* Options à charger depuis l'API */}
                    </select>
                    <Link to="/services" className="browse-services-link">
                      <i className="bi bi-search"></i> Parcourir tous les services
                    </Link>
                  </div>
                )}
                {errors.service_id && <span className="error-message">{errors.service_id}</span>}
              </div>

              {/* Date de réservation */}
              <div className="form-group">
                <label htmlFor="date_debut">
                  <i className="bi bi-calendar"></i>
                  Date et heure <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date_debut"
                  value={form.date_debut}
                  onChange={handleChange}
                  className={errors.date_debut ? "error" : ""}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.date_debut && <span className="error-message">{errors.date_debut}</span>}
                <small className="form-hint">
                  <i className="bi bi-info-circle"></i>
                  Choisissez la date et l'heure souhaitées pour l'intervention
                </small>
              </div>

              {/* Commentaire */}
              <div className="form-group">
                <label htmlFor="commentaire">
                  <i className="bi bi-chat"></i>
                  Commentaire (optionnel)
                </label>
                <textarea
                  name="commentaire"
                  rows={4}
                  value={form.commentaire}
                  onChange={handleChange}
                  placeholder="Décrivez votre besoin, des informations complémentaires..."
                  className="commentaire-textarea"
                ></textarea>
                <small className="form-hint">
                  <i className="bi bi-info-circle"></i>
                  Précisez votre besoin pour aider le prestataire à mieux vous servir
                </small>
              </div>

              {/* Résumé de la réservation */}
              {service && (
                <div className="reservation-summary">
                  <h4>Résumé de la réservation</h4>
                  <div className="summary-details">
                    <div className="summary-item">
                      <span className="summary-label">Service :</span>
                      <span className="summary-value">{service.nom}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Prix :</span>
                      <span className="summary-value">{service.prix?.toLocaleString()} FCFA</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Date :</span>
                      <span className="summary-value">
                        {form.date_debut ? new Date(form.date_debut).toLocaleString('fr-FR') : "Non définie"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => navigate("/demandeur/dashboard")}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Réservation en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i>
                      Confirmer la réservation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .reservation-form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .reservation-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group label i {
          color: #354dd4;
        }

        .required {
          color: #ef4444;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #354dd4;
          box-shadow: 0 0 0 3px rgba(53, 77, 212, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #ef4444;
        }

        .error-message {
          font-size: 0.75rem;
          color: #ef4444;
        }

        .form-hint {
          font-size: 0.7rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .service-info-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
        }

        .service-info-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #354dd4;
          margin-bottom: 0.5rem;
        }

        .service-info-details p {
          font-size: 0.8rem;
          margin: 0.25rem 0;
          color: #64748b;
        }

        .reservation-summary {
          background: linear-gradient(135deg, rgba(53, 77, 212, 0.05), rgba(53, 77, 212, 0.02));
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(53, 77, 212, 0.1);
        }

        .reservation-summary h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1e293b;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .summary-label {
          color: #64748b;
        }

        .summary-value {
          font-weight: 600;
          color: #1e293b;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
        }

        .btn-submit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #354dd4;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background: #2a3fb0;
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .success-message {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 20px;
        }

        .success-message i {
          font-size: 3rem;
          color: #22c55e;
          margin-bottom: 1rem;
        }

        .success-message h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .browse-services-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          color: #354dd4;
          text-decoration: none;
          font-size: 0.875rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .reservation-form-container {
            padding: 1rem;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .btn-cancel,
          .btn-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default FaireReservation;