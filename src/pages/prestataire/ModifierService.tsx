// src/pages/prestataire/ModifierService.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Categorie {
  id: number;
  nom: string;
}

interface Service {
  id: number;
  nom: string;
  description: string;
  prix: number;
  duree: string;
  categorie_id: number;
  statut: string;
}

const ModifierService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    duree: "",
    categorie_id: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [serviceRes, categoriesRes] = await Promise.all([
        api.get(`/services/${id}`),
        api.get("/categories")
      ]);
      
      const service = serviceRes.data.data || serviceRes.data;
      setFormData({
        nom: service.nom || "",
        description: service.description || "",
        prix: service.prix?.toString() || "",
        duree: service.duree || "",
        categorie_id: service.categorie_id?.toString() || "",
      });
      
      let categoriesData = [];
      if (categoriesRes.data.data) {
        categoriesData = categoriesRes.data.data;
      } else if (Array.isArray(categoriesRes.data)) {
        categoriesData = categoriesRes.data;
      }
      setCategories(categoriesData);
      
    } catch (error) {
      console.error("Erreur:", error);
      navigate("/prestataire/services");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom du service est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.prix) newErrors.prix = "Le prix est requis";
    if (Number(formData.prix) <= 0) newErrors.prix = "Le prix doit être supérieur à 0";
    if (!formData.duree) newErrors.duree = "La durée est requise";
    if (!formData.categorie_id) newErrors.categorie_id = "La catégorie est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const data = {
        ...formData,
        prix: Number(formData.prix),
      };
      await api.put(`/services/${id}`, data);
      navigate("/prestataire/services");
    } catch (err: any) {
      console.error("Erreur:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || "Erreur lors de la modification");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <DashboardLayout sidebar={<PrestataireSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement du service...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div className="dashboard-prestataire">
        <div className="page-header">
          <h1>
            <i className="bi bi-pencil-square"></i>
            Modifier le service
          </h1>
          <p>Modifiez les informations de votre service</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="service-form">
            <div className="form-group">
              <label htmlFor="nom">Nom du service *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={errors.nom ? "error" : ""}
              />
              {errors.nom && <span className="error-message">{errors.nom}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "error" : ""}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categorie_id">Catégorie *</label>
                <select
                  id="categorie_id"
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleChange}
                  className={errors.categorie_id ? "error" : ""}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
                {errors.categorie_id && <span className="error-message">{errors.categorie_id}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="prix">Prix (FCFA) *</label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  className={errors.prix ? "error" : ""}
                />
                {errors.prix && <span className="error-message">{errors.prix}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="duree">Durée *</label>
                <input
                  type="text"
                  id="duree"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                  className={errors.duree ? "error" : ""}
                />
                {errors.duree && <span className="error-message">{errors.duree}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate("/prestataire/services")}>
                Annuler
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .service-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
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
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #354dd4;
          box-shadow: 0 0 0 3px rgba(53, 77, 212, 0.1);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #ef4444;
        }

        .error-message {
          font-size: 0.7rem;
          color: #ef4444;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .btn-cancel, .btn-submit {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #64748b;
        }

        .btn-submit {
          background: #354dd4;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background: #2a3fb0;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .btn-cancel, .btn-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ModifierService;