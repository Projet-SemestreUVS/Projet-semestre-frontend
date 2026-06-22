// src/pages/prestataire/MesServices.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import "../../styles/dashboard.css";

interface Service {
  id: number;
  nom: string;
  description: string;
  prix: number;
  duree: string;
  categorie_id: number;
  categorie?: {
    id: number;
    nom: string;
    icone: string;
  };
  image: string | null;
  statut: "actif" | "inactif";
  reservations_count: number;
  reservations_en_attente: number;
  created_at: string;
}

// Catégories mockées
const categories = [
  { id: 1, nom: "Plomberie", icone: "bi-tools" },
  { id: 2, nom: "Électricité", icone: "bi-lightning" },
  { id: 3, nom: "Développement Web", icone: "bi-code-slash" },
  { id: 4, nom: "Transport", icone: "bi-truck" },
  { id: 5, nom: "Coiffure", icone: "bi-scissors" },
  { id: 6, nom: "Ménage", icone: "bi-house-door" },
  { id: 7, nom: "Cours particuliers", icone: "bi-book" },
  { id: 8, nom: "Design graphique", icone: "bi-palette" },
  { id: 9, nom: "Jardinage", icone: "bi-flower1" },
  { id: 10, nom: "Photographie", icone: "bi-camera" },
];

// Services mockés par défaut
const defaultServices: Service[] = [
  {
    id: 1,
    nom: "Plomberie Express",
    description: "Service de plomberie rapide pour fuites, débouchage et installation sanitaire. Intervention dans l'heure.",
    prix: 25000,
    duree: "1h",
    categorie_id: 1,
    categorie: categories[0],
    image: null,
    statut: "actif",
    reservations_count: 12,
    reservations_en_attente: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    nom: "Dépannage Électrique",
    description: "Dépannage électrique 24/7 pour votre domicile ou bureau. Installation et maintenance.",
    prix: 30000,
    duree: "2h",
    categorie_id: 2,
    categorie: categories[1],
    image: null,
    statut: "actif",
    reservations_count: 8,
    reservations_en_attente: 1,
    created_at: new Date().toISOString(),
  },
];

const MesServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setLoading(true);
    // Récupérer les services du localStorage
    const storedServices = localStorage.getItem("prestataire_services");
    
    if (storedServices) {
      const parsedServices = JSON.parse(storedServices);
      // Ajouter les informations de catégorie
      const servicesWithCategory = parsedServices.map((service: Service) => ({
        ...service,
        categorie: categories.find(c => c.id === service.categorie_id)
      }));
      setServices(servicesWithCategory);
    } else {
      // Initialiser avec les services par défaut
      localStorage.setItem("prestataire_services", JSON.stringify(defaultServices));
      setServices(defaultServices);
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    const updatedServices = services.filter(s => s.id !== id);
    setServices(updatedServices);
    localStorage.setItem("prestataire_services", JSON.stringify(updatedServices));
    setDeleteConfirm(null);
  };

  const handleToggleStatut = (id: number) => {
    const updatedServices = services.map(service =>
      service.id === id 
        ? { ...service, statut: service.statut === "actif" ? "inactif" : "actif" as "actif" | "inactif" }
        : service
    );
    setServices(updatedServices);
    localStorage.setItem("prestataire_services", JSON.stringify(updatedServices));
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<PrestataireSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de vos services...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div className="dashboard-prestataire">
        <div className="page-header">
          <h1>
            <i className="bi bi-tools"></i>
            Mes services
          </h1>
          <p>Gérez vos services proposés aux clients ({services.length} service(s))</p>
        </div>

        <div className="services-actions">
          <Link to="/prestataire/services/ajouter" className="btn-add">
            <i className="bi bi-plus-circle"></i>
            Ajouter un service
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-box"></i>
            <h3>Aucun service</h3>
            <p>Vous n'avez pas encore ajouté de service</p>
            <Link to="/prestataire/services/ajouter" className="btn-add-service">
              Ajouter mon premier service
            </Link>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                {service.image && (
                  <div className="service-image">
                    <img src={service.image} alt={service.nom} />
                  </div>
                )}
                <div className="service-card-header">
                  <div className="service-category">
                    <i className={`bi ${service.categorie?.icone || 'bi-tag'}`}></i>
                    {service.categorie?.nom || "Non catégorisé"}
                  </div>
                  <div className={`service-statut ${service.statut === "actif" ? "actif" : "inactif"}`}>
                    {service.statut === "actif" ? "Actif" : "Inactif"}
                  </div>
                </div>
                <div className="service-card-body">
                  <h3>{service.nom}</h3>
                  <p>{service.description.substring(0, 100)}...</p>
                  <div className="service-details">
                    <span><i className="bi bi-currency-dollar"></i> {service.prix.toLocaleString()} FCFA</span>
                    <span><i className="bi bi-clock"></i> {service.duree}</span>
                    <span><i className="bi bi-calendar"></i> {service.reservations_count || 0} réservations</span>
                  </div>
                  {service.reservations_en_attente > 0 && (
                    <div className="service-alert">
                      <i className="bi bi-bell"></i>
                      {service.reservations_en_attente} réservation(s) en attente
                    </div>
                  )}
                </div>
                <div className="service-card-footer">
                  <button 
                    className={`btn-toggle ${service.statut === "actif" ? "btn-desactiver" : "btn-activer"}`}
                    onClick={() => handleToggleStatut(service.id)}
                  >
                    {service.statut === "actif" ? "Désactiver" : "Activer"}
                  </button>
                  <Link to={`/prestataire/services/modifier/${service.id}`} className="btn-edit">
                    <i className="bi bi-pencil"></i>
                    Modifier
                  </Link>
                  {deleteConfirm === service.id ? (
                    <div className="delete-confirm">
                      <span>Confirmer ?</span>
                      <button onClick={() => handleDelete(service.id)} className="btn-confirm">
                        Oui
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} className="btn-cancel-confirm">
                        Non
                      </button>
                    </div>
                  ) : (
                    <button className="btn-delete" onClick={() => setDeleteConfirm(service.id)}>
                      <i className="bi bi-trash"></i>
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .services-actions {
          margin-bottom: 1.5rem;
        }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: #354dd4;
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-add:hover {
          background: #2a3fb0;
          transform: translateY(-2px);
          color: white;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .service-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }

        .service-image {
          height: 180px;
          overflow: hidden;
        }

        .service-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .service-category {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: #354dd4;
          background: #eef2ff;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .service-statut {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .service-statut.actif {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .service-statut.inactif {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .service-card-body {
          padding: 1.5rem;
        }

        .service-card-body h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .service-card-body p {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .service-details {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.75rem;
          color: #1e293b;
        }

        .service-details i {
          margin-right: 0.25rem;
          color: #354dd4;
        }

        .service-alert {
          margin-top: 0.75rem;
          padding: 0.5rem;
          background: #fef3c7;
          color: #d97706;
          border-radius: 8px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .service-card-footer {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .btn-toggle, .btn-edit, .btn-delete {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-toggle.btn-desactiver {
          background: #fee2e2;
          color: #ef4444;
        }

        .btn-toggle.btn-activer {
          background: #dcfce7;
          color: #22c55e;
        }

        .btn-edit {
          background: #eef2ff;
          color: #354dd4;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .btn-delete {
          background: #fee2e2;
          color: #ef4444;
        }

        .delete-confirm {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
        }

        .btn-confirm, .btn-cancel-confirm {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .btn-confirm {
          background: #ef4444;
          color: white;
        }

        .btn-cancel-confirm {
          background: #e2e8f0;
          color: #64748b;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 20px;
        }

        .empty-state i {
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .loading-container {
          text-align: center;
          padding: 3rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #354dd4;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MesServices;