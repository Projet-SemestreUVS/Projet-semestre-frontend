// src/pages/demandeur/FaireReservation.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/dashboard.css";

interface Service {
  id: number;
  nom: string;
  description: string;
  prix: number;
  duree: string;
  categorie_id: number;
  categorie_nom: string;
  prestataire_id: number;
  prestataire_nom: string;
  prestataire_prenom: string;
  image: string | null;
  note: number;
}

interface ReservationData {
  id: number;
  service_id: number;
  service_nom: string;
  demandeur_id: number;
  demandeur_nom: string;
  demandeur_prenom: string;
  demandeur_email: string;
  demandeur_telephone: string;
  prestataire_id: number;
  prestataire_nom: string;
  prestataire_prenom: string;
  date_debut: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  montant: number;
  created_at: string;
}

// Services mockés avec catégories et prestataires
const servicesData: Service[] = [
  { 
    id: 1, 
    nom: "Plomberie Express", 
    description: "Intervention rapide pour fuites, débouchage et installation sanitaire", 
    prix: 25000, 
    duree: "1h", 
    categorie_id: 1, 
    categorie_nom: "Plomberie", 
    prestataire_id: 2, 
    prestataire_nom: "Tech", 
    prestataire_prenom: "Alpha", 
    image: null, 
    note: 4.8 
  },
  { 
    id: 2, 
    nom: "Dépannage Électrique", 
    description: "Dépannage électrique 24/7, installation et maintenance", 
    prix: 30000, 
    duree: "2h", 
    categorie_id: 2, 
    categorie_nom: "Électricité", 
    prestataire_id: 2, 
    prestataire_nom: "Tech", 
    prestataire_prenom: "Alpha", 
    image: null, 
    note: 4.9 
  },
  { 
    id: 3, 
    nom: "Création Site Web", 
    description: "Site vitrine, e-commerce ou application sur mesure", 
    prix: 150000, 
    duree: "5 jours", 
    categorie_id: 3, 
    categorie_nom: "Développement", 
    prestataire_id: 3, 
    prestataire_nom: "Dev", 
    prestataire_prenom: "Solution", 
    image: null, 
    note: 4.7 
  },
  { 
    id: 4, 
    nom: "Transport Aéroport", 
    description: "Transport vers/aéroport, véhicule climatisé", 
    prix: 15000, 
    duree: "30min", 
    categorie_id: 4, 
    categorie_nom: "Transport", 
    prestataire_id: 4, 
    prestataire_nom: "Mobility", 
    prestataire_prenom: "Service", 
    image: null, 
    note: 4.6 
  },
  { 
    id: 5, 
    nom: "Coiffure à Domicile", 
    description: "Coupe, brushing, coloration à domicile", 
    prix: 20000, 
    duree: "1h30", 
    categorie_id: 5, 
    categorie_nom: "Beauté", 
    prestataire_id: 5, 
    prestataire_nom: "Beauty", 
    prestataire_prenom: "Studio", 
    image: null, 
    note: 4.9 
  },
  { 
    id: 6, 
    nom: "Ménage Complet", 
    description: "Nettoyage complet de votre domicile ou bureau", 
    prix: 25000, 
    duree: "3h", 
    categorie_id: 6, 
    categorie_nom: "Entretien", 
    prestataire_id: 6, 
    prestataire_nom: "Clean", 
    prestataire_prenom: "Service", 
    image: null, 
    note: 4.8 
  },
];

const FaireReservation = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceSelector, setShowServiceSelector] = useState(!serviceId);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [form, setForm] = useState({
    service_id: 0,
    demandeur_id: 0,
    prestataire_id: 0,
    date_debut: "",
    commentaire: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Catégories uniques
  const categories = ["all", ...new Set(servicesData.map(s => s.categorie_nom))];

  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté
    if (user) {
      setUserInfo(user);
      setForm(prev => ({
        ...prev,
        demandeur_id: user.id
      }));
    } else {
      // Fallback: récupérer depuis localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserInfo(userData);
          setForm(prev => ({
            ...prev,
            demandeur_id: userData.id
          }));
        } catch (e) {
          // Utiliser des valeurs par défaut
          setUserInfo({ id: 1, nom: "Dupont", prenom: "Jean", email: "jean.dupont@email.com", telephone: "771234567" });
        }
      } else {
        // Utilisateur par défaut pour le développement
        setUserInfo({ id: 1, nom: "Dupont", prenom: "Jean", email: "jean.dupont@email.com", telephone: "771234567" });
      }
    }
  }, [user]);

  useEffect(() => {
    if (serviceId) {
      const service = servicesData.find(s => s.id === parseInt(serviceId));
      if (service) {
        setSelectedService(service);
        setForm({
          service_id: service.id,
          demandeur_id: userInfo?.id || 1,
          prestataire_id: service.prestataire_id,
          date_debut: "",
          commentaire: ""
        });
        setShowServiceSelector(false);
      }
    }
  }, [serviceId, userInfo]);

  // Filtrer les services
  const filteredServices = servicesData.filter(service => {
    const matchesSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.categorie_nom === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setForm({
      service_id: service.id,
      demandeur_id: userInfo?.id || 1,
      prestataire_id: service.prestataire_id,
      date_debut: "",
      commentaire: ""
    });
    setShowServiceSelector(false);
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!selectedService) return;
    if (!userInfo) return;
    
    setLoading(true);
    
    // Créer la nouvelle réservation avec toutes les informations nécessaires
    const newReservation: ReservationData = {
      id: Date.now(),
      service_id: selectedService.id,
      service_nom: selectedService.nom,
      demandeur_id: userInfo.id,
      demandeur_nom: userInfo.nom || "Dupont",
      demandeur_prenom: userInfo.prenom || "Jean",
      demandeur_email: userInfo.email || "client@email.com",
      demandeur_telephone: userInfo.telephone || "771234567",
      prestataire_id: selectedService.prestataire_id,
      prestataire_nom: selectedService.prestataire_nom,
      prestataire_prenom: selectedService.prestataire_prenom,
      date_debut: form.date_debut,
      statut: "en_attente",
      commentaire: form.commentaire || null,
      montant: selectedService.prix,
      created_at: new Date().toISOString()
    };
    
    console.log("📝 Nouvelle réservation créée:", newReservation);
    
    // Sauvegarder dans localStorage
    const existingReservations = localStorage.getItem("reservations");
    let reservations = existingReservations ? JSON.parse(existingReservations) : [];
    reservations.unshift(newReservation);
    localStorage.setItem("reservations", JSON.stringify(reservations));
    
    console.log("💾 Réservations sauvegardées:", reservations);
    
    // Créer une notification pour le prestataire
    const prestataireNotifications = localStorage.getItem("prestataire_notifications");
    let notifications = prestataireNotifications ? JSON.parse(prestataireNotifications) : [];
    const newNotification = {
      id: Date.now(),
      type: "reservation",
      titre: "Nouvelle réservation",
      contenu: `${userInfo.prenom} ${userInfo.nom} a réservé votre service '${selectedService.nom}'`,
      lu: false,
      date: new Date().toISOString(),
      service_id: selectedService.id,
      service_nom: selectedService.nom,
      client_nom: `${userInfo.prenom} ${userInfo.nom}`
    };
    notifications.unshift(newNotification);
    localStorage.setItem("prestataire_notifications", JSON.stringify(notifications));
    
    console.log("🔔 Notification prestataire créée:", newNotification);
    console.log("✅ Réservation terminée, redirection...");
    
    setSuccess(true);
    setTimeout(() => {
      navigate("/demandeur/reservations");
    }, 2000);
    
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (success) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Réservation confirmée !</h2>
            <p>Votre réservation a été envoyée au prestataire.</p>
            <p className="success-detail">Vous recevrez une confirmation sous 24h.</p>
            <button onClick={() => navigate("/demandeur/reservations")} className="btn-view-reservations">
              Voir mes réservations
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="reservation-page">
        <div className="page-header">
          <h1><i className="bi bi-calendar-plus"></i> Nouvelle réservation</h1>
          <p>Sélectionnez un service et planifiez votre intervention</p>
        </div>

        {showServiceSelector ? (
          <div className="service-selector">
            <div className="selector-header">
              <h2>Choisissez un service</h2>
              <div className="filters">
                <div className="search-box">
                  <i className="bi bi-search"></i>
                  <input type="text" placeholder="Rechercher un service..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="category-filters">
                  {categories.map(cat => (
                    <button key={cat} className={`category-chip ${selectedCategory === cat ? "active" : ""}`} onClick={() => setSelectedCategory(cat)}>
                      {cat === "all" ? "Tous" : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="services-grid-selector">
              {filteredServices.map(service => (
                <div key={service.id} className="service-card-selector" onClick={() => handleSelectService(service)}>
                  <div className="service-icon"><i className="bi bi-tools"></i></div>
                  <div className="service-info">
                    <h3>{service.nom}</h3>
                    <p>{service.description.substring(0, 60)}...</p>
                    <div className="service-meta">
                      <span className="category">{service.categorie_nom}</span>
                      <span className="price">{service.prix.toLocaleString()} FCFA</span>
                      <span className="duration"><i className="bi bi-clock"></i> {service.duree}</span>
                    </div>
                    <div className="prestataire-info">
                      <i className="bi bi-person"></i> {service.prestataire_prenom} {service.prestataire_nom}
                      <span className="rating"><i className="bi bi-star-fill"></i> {service.note}</span>
                    </div>
                  </div>
                  <button className="select-btn">Sélectionner</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="booking-form-container">
            <div className="selected-service-card">
              <button className="back-btn" onClick={() => setShowServiceSelector(true)}>
                <i className="bi bi-arrow-left"></i> Changer de service
              </button>
              <div className="service-summary">
                <div className="service-icon-large"><i className="bi bi-tools"></i></div>
                <div className="service-details">
                  <h3>{selectedService?.nom}</h3>
                  <p>{selectedService?.description}</p>
                  <div className="details-grid">
                    <div className="detail"><i className="bi bi-tag"></i> {selectedService?.categorie_nom}</div>
                    <div className="detail"><i className="bi bi-currency-dollar"></i> {selectedService?.prix.toLocaleString()} FCFA</div>
                    <div className="detail"><i className="bi bi-clock"></i> {selectedService?.duree}</div>
                    <div className="detail"><i className="bi bi-person"></i> {selectedService?.prestataire_prenom} {selectedService?.prestataire_nom}</div>
                    <div className="detail"><i className="bi bi-star-fill"></i> {selectedService?.note}/5</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label><i className="bi bi-calendar"></i> Date et heure *</label>
                <input type="datetime-local" name="date_debut" value={form.date_debut} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} />
                {errors.date_debut && <span className="error-message">{errors.date_debut}</span>}
              </div>

              <div className="form-group">
                <label><i className="bi bi-chat"></i> Message (optionnel)</label>
                <textarea name="commentaire" rows={3} value={form.commentaire} onChange={handleChange} placeholder="Décrivez votre besoin, des informations complémentaires..." />
              </div>

              <div className="resume-section">
                <h4>Résumé de la réservation</h4>
                <div className="resume-details">
                  <div className="resume-item">
                    <span>Service :</span>
                    <strong>{selectedService?.nom}</strong>
                  </div>
                  <div className="resume-item">
                    <span>Prestataire :</span>
                    <strong>{selectedService?.prestataire_prenom} {selectedService?.prestataire_nom}</strong>
                  </div>
                  <div className="resume-item">
                    <span>Montant :</span>
                    <strong>{selectedService?.prix.toLocaleString()} FCFA</strong>
                  </div>
                  <div className="resume-item">
                    <span>Date :</span>
                    <strong>{form.date_debut ? new Date(form.date_debut).toLocaleString('fr-FR') : "Non définie"}</strong>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate("/demandeur/dashboard")}>Annuler</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <><span className="spinner-small"></span> Réservation...</> : "Confirmer la réservation"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .reservation-page { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .service-selector { max-width: 1000px; margin: 0 auto; }
        .selector-header { margin-bottom: 2rem; }
        .selector-header h2 { font-size: 1.25rem; margin-bottom: 1rem; }
        .filters { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .search-box { flex: 1; display: flex; align-items: center; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.5rem 1rem; }
        .search-box i { color: #94a3b8; margin-right: 0.5rem; }
        .search-box input { flex: 1; border: none; outline: none; }
        .category-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .category-chip { padding: 0.5rem 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 20px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; }
        .category-chip:hover { border-color: #354dd4; color: #354dd4; }
        .category-chip.active { background: #354dd4; color: white; border-color: #354dd4; }

        .services-grid-selector { display: flex; flex-direction: column; gap: 1rem; }
        .service-card-selector { display: flex; align-items: center; gap: 1rem; background: white; border-radius: 16px; padding: 1rem; cursor: pointer; transition: all 0.2s; border: 1px solid #e2e8f0; }
        .service-card-selector:hover { transform: translateX(5px); border-color: #354dd4; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .service-icon { width: 60px; height: 60px; background: #eef2ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .service-icon i { font-size: 1.5rem; color: #354dd4; }
        .service-info { flex: 1; }
        .service-info h3 { font-size: 1rem; margin-bottom: 0.25rem; }
        .service-info p { font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem; }
        .service-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem; }
        .service-meta span { font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 12px; }
        .category { background: #eef2ff; color: #354dd4; }
        .price { background: #dcfce7; color: #22c55e; }
        .duration { background: #fef3c7; color: #d97706; }
        .prestataire-info { font-size: 0.7rem; color: #64748b; display: flex; align-items: center; gap: 0.5rem; }
        .rating { color: #f59e0b; }
        .select-btn { padding: 0.5rem 1rem; background: #354dd4; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.8rem; }

        .booking-form-container { max-width: 700px; margin: 0 auto; }
        .selected-service-card { background: white; border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .back-btn { background: none; border: none; color: #354dd4; cursor: pointer; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.25rem; }
        .service-summary { display: flex; gap: 1.5rem; }
        .service-icon-large { width: 80px; height: 80px; background: #eef2ff; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .service-icon-large i { font-size: 2rem; color: #354dd4; }
        .service-details { flex: 1; }
        .service-details h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
        .service-details p { font-size: 0.8rem; color: #64748b; margin-bottom: 1rem; }
        .details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .detail { font-size: 0.75rem; display: flex; align-items: center; gap: 0.25rem; color: #64748b; }

        .booking-form { background: white; border-radius: 20px; padding: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; display: flex; align-items: center; gap: 0.25rem; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 12px; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #354dd4; }
        .error-message { color: #ef4444; font-size: 0.7rem; margin-top: 0.25rem; display: block; }

        .resume-section { background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
        .resume-section h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
        .resume-details { display: flex; flex-direction: column; gap: 0.5rem; }
        .resume-item { display: flex; justify-content: space-between; font-size: 0.85rem; }
        .resume-item strong { color: #354dd4; }

        .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
        .btn-cancel { padding: 0.75rem 1.5rem; background: #f1f5f9; border: none; border-radius: 10px; cursor: pointer; }
        .btn-submit { padding: 0.75rem 1.5rem; background: #354dd4; color: white; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner-small { width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .success-container { display: flex; justify-content: center; align-items: center; min-height: 60vh; }
        .success-card { text-align: center; background: white; border-radius: 20px; padding: 3rem; max-width: 400px; }
        .success-icon { width: 70px; height: 70px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem; }
        .btn-view-reservations { margin-top: 1rem; padding: 0.75rem 1.5rem; background: #354dd4; color: white; border: none; border-radius: 10px; cursor: pointer; }

        @media (max-width: 768px) { 
          .service-summary { flex-direction: column; align-items: center; text-align: center; } 
          .details-grid { grid-template-columns: 1fr; } 
          .service-card-selector { flex-direction: column; text-align: center; } 
          .service-meta { justify-content: center; }
          .prestataire-info { justify-content: center; }
          .form-actions { flex-direction: column; }
          .btn-cancel, .btn-submit { width: 100%; justify-content: center; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default FaireReservation;