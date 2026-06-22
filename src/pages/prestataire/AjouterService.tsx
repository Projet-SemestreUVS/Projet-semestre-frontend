// src/pages/prestataire/AjouterService.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import "../../styles/dashboard.css";

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
  { id: 11, nom: "Climatisation", icone: "bi-snow" },
  { id: 12, nom: "Garde d'enfants", icone: "bi-people" },
];

const AjouterService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    duree: "",
    categorie_id: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "L'image ne doit pas dépasser 2 Mo" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Veuillez sélectionner une image" });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom du service est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (formData.description.length < 20) newErrors.description = "La description doit contenir au moins 20 caractères";
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
    
    setLoading(true);
    
    // Simuler un délai d'ajout
    setTimeout(() => {
      // Récupérer les services existants dans localStorage
      const existingServices = localStorage.getItem("prestataire_services");
      let services = existingServices ? JSON.parse(existingServices) : [];
      
      // Créer le nouveau service
      const newService = {
        id: Date.now(),
        nom: formData.nom,
        description: formData.description,
        prix: parseInt(formData.prix),
        duree: formData.duree,
        categorie_id: parseInt(formData.categorie_id),
        categorie: categories.find(c => c.id === parseInt(formData.categorie_id)),
        image: imagePreview || null,
        statut: "actif",
        reservations_count: 0,
        reservations_en_attente: 0,
        created_at: new Date().toISOString(),
      };
      
      // Ajouter le nouveau service
      services.unshift(newService);
      localStorage.setItem("prestataire_services", JSON.stringify(services));
      
      setSuccessMessage("Service ajouté avec succès !");
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate("/prestataire/services");
      }, 2000);
      
      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div className="dashboard-prestataire">
        <div className="page-header">
          <h1>
            <i className="bi bi-plus-circle"></i>
            Ajouter un service
          </h1>
          <p>Créez un nouveau service pour vos clients</p>
        </div>

        {successMessage && (
          <div className="alert-success">
            <i className="bi bi-check-circle-fill"></i>
            {successMessage}
          </div>
        )}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="service-form">
            {/* Image */}
            <div className="form-group">
              <label>Image du service (optionnel)</label>
              <div className="image-upload-area">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Aperçu" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder" onClick={() => document.getElementById("image-input")?.click()}>
                    <i className="bi bi-cloud-upload"></i>
                    <p>Cliquez pour uploader une image</p>
                    <small>PNG, JPG, JPEG (max 2Mo)</small>
                  </div>
                )}
                <input
                  type="file"
                  id="image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
              {errors.image && <span className="error-message">{errors.image}</span>}
            </div>

            {/* Nom du service */}
            <div className="form-group">
              <label htmlFor="nom">Nom du service *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Ex: Plomberie Express"
                className={errors.nom ? "error" : ""}
              />
              {errors.nom && <span className="error-message">{errors.nom}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre service en détail..."
                className={errors.description ? "error" : ""}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
              <small className="form-hint">Minimum 20 caractères</small>
            </div>

            {/* Catégorie */}
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
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
              {errors.categorie_id && <span className="error-message">{errors.categorie_id}</span>}
            </div>

            {/* Prix et Durée */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prix">Prix (FCFA) *</label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  placeholder="25000"
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
                  placeholder="1h30, 2 jours..."
                  className={errors.duree ? "error" : ""}
                />
                {errors.duree && <span className="error-message">{errors.duree}</span>}
              </div>
            </div>

            {/* Boutons */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate("/prestataire/services")}>
                Annuler
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Ajout en cours..." : "Ajouter le service"}
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
          grid-template-columns: 1fr 1fr;
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

        .form-hint {
          font-size: 0.7rem;
          color: #64748b;
        }

        .image-upload-area {
          width: 100%;
        }

        .upload-placeholder {
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-placeholder:hover {
          border-color: #354dd4;
          background: #f8fafc;
        }

        .upload-placeholder i {
          font-size: 2rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .image-preview {
          position: relative;
          width: 100%;
          max-width: 200px;
          margin: 0 auto;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }

        .remove-image {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          cursor: pointer;
        }

        .alert-success {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border-radius: 12px;
          margin-bottom: 1rem;
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

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AjouterService;