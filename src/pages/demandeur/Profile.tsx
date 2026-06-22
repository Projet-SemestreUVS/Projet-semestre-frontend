// src/pages/demandeur/Profile.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/dashboard.css";

interface UserProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  localisation: string;
  photo: string | null;
  role: string;
  email_verified_at: string | null;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    localisation: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Récupérer depuis localStorage
      const storedUser = localStorage.getItem("user");
      let userData = null;
      
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (e) {
          console.error("Erreur parsing user:", e);
        }
      }
      
      if (userData) {
        setProfile(userData);
        setFormData({
          nom: userData.nom || "",
          prenom: userData.prenom || "",
          email: userData.email || "",
          telephone: userData.telephone || "",
          localisation: userData.localisation || "",
        });
      } else if (user) {
        // Utiliser l'utilisateur du contexte
        setProfile(user);
        setFormData({
          nom: user.nom || "",
          prenom: user.prenom || "",
          email: user.email || "",
          telephone: user.telephone || "",
          localisation: user.localisation || "",
        });
      } else {
        // Données mockées par défaut
        const mockProfile: UserProfile = {
          id: 1,
          nom: "Dupont",
          prenom: "Jean",
          email: "jean.dupont@email.com",
          telephone: "+221 77 123 45 67",
          localisation: "Dakar, Sénégal",
          photo: null,
          role: "demandeur",
          email_verified_at: new Date().toISOString(),
          created_at: "2024-01-15T00:00:00"
        };
        setProfile(mockProfile);
        setFormData({
          nom: mockProfile.nom,
          prenom: mockProfile.prenom,
          email: mockProfile.email,
          telephone: mockProfile.telephone,
          localisation: mockProfile.localisation,
        });
      }
    } catch (err: any) {
      console.error("Erreur:", err);
      setMessage({ type: "error", text: "Erreur lors du chargement du profil" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "L'image ne doit pas dépasser 2 Mo" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Veuillez sélectionner une image" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    
    try {
      setSaving(true);
      
      // Simuler l'upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setProfile(prev => prev ? { ...prev, photo: photoUrl } : null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setMessage({ type: "success", text: "Photo de profil mise à jour" });
        setTimeout(() => setMessage(null), 3000);
        
        // Mettre à jour le localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.photo = photoUrl;
          localStorage.setItem("user", JSON.stringify(userData));
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Erreur lors de l'upload" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Simuler la mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => prev ? { ...prev, ...formData } : null);
      setMessage({ type: "success", text: "Profil mis à jour avec succès" });
      
      // Mettre à jour le localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = { ...userData, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Mettre à jour le contexte Auth si disponible
        if (login) {
          const token = localStorage.getItem("token");
          if (token) {
            login(token, updatedUser);
          }
        }
      }
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Erreur lors de la mise à jour" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setMessage({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas" });
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères" });
      return;
    }
    
    try {
      setChangingPassword(true);
      
      // Simuler le changement de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: "success", text: "Mot de passe modifié avec succès" });
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setShowPasswordForm(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Erreur lors du changement de mot de passe" });
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="profile-page">
        <div className="page-header">
          <h1>
            <i className="bi bi-person-circle"></i>
            Mon profil
          </h1>
          <p>Gérez vos informations personnelles</p>
        </div>

        {message && (
          <div className={`alert-message ${message.type}`}>
            <i className={`bi ${message.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
            {message.text}
          </div>
        )}

        <div className="profile-container">
          {/* Photo Section */}
          <div className="profile-photo-section">
            <div className="profile-photo">
              {previewUrl ? (
                <img src={previewUrl} alt="Aperçu" />
              ) : profile?.photo ? (
                <img src={profile.photo} alt={`${profile.prenom} ${profile.nom}`} />
              ) : (
                <div className="photo-placeholder">
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
            </div>
            <div className="photo-actions">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: "none" }}
              />
              <button className="btn-upload" onClick={() => fileInputRef.current?.click()}>
                <i className="bi bi-camera"></i>
                Changer la photo
              </button>
              {selectedFile && (
                <button className="btn-save-photo" onClick={handleUploadPhoto} disabled={saving}>
                  <i className="bi bi-save"></i>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              )}
            </div>
            <div className="photo-info">
              <p>Format accepté: JPG, PNG, GIF</p>
              <p>Taille max: 2 Mo</p>
            </div>
          </div>

          {/* Informations du compte */}
          <div className="profile-info-section">
            <div className="info-card">
              <h3>
                <i className="bi bi-info-circle"></i>
                Informations personnelles
              </h3>
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Adresse email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+221 76 316 21 64"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="localisation">Localisation</label>
                  <input
                    type="text"
                    id="localisation"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleChange}
                    placeholder="Dakar, Sénégal"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={saving}>
                    <i className="bi bi-save"></i>
                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            </div>

            {/* Sécurité */}
            <div className="info-card">
              <h3>
                <i className="bi bi-shield-lock"></i>
                Sécurité
              </h3>
              
              {!showPasswordForm ? (
                <button className="btn-change-password" onClick={() => setShowPasswordForm(true)}>
                  <i className="bi bi-key"></i>
                  Changer mon mot de passe
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <label htmlFor="current_password">Mot de passe actuel</label>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new_password">Nouveau mot de passe</label>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new_password_confirmation">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      id="new_password_confirmation"
                      name="new_password_confirmation"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowPasswordForm(false)}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-save" disabled={changingPassword}>
                      <i className="bi bi-key"></i>
                      {changingPassword ? "Modification..." : "Modifier le mot de passe"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Statistiques du compte */}
            <div className="info-card">
              <h3>
                <i className="bi bi-graph-up"></i>
                Statistiques du compte
              </h3>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Membre depuis :</span>
                  <span className="stat-value">
                    {profile?.created_at ? formatDate(profile.created_at) : "-"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Email vérifié :</span>
                  <span className={`stat-value ${profile?.email_verified_at ? "verified" : "not-verified"}`}>
                    {profile?.email_verified_at ? (
                      <>
                        <i className="bi bi-check-circle-fill"></i> Oui
                      </>
                    ) : (
                      <>
                        <i className="bi bi-x-circle-fill"></i> Non
                      </>
                    )}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Rôle :</span>
                  <span className="stat-value role-badge">
                    {profile?.role === "demandeur" ? "Demandeur" : 
                     profile?.role === "prestataire" ? "Prestataire" : 
                     "Administrateur"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">ID utilisateur :</span>
                  <span className="stat-value">#{profile?.id}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="info-card">
              <h3>
                <i className="bi bi-arrow-right-circle"></i>
                Actions
              </h3>
              <div className="actions-list">
                <button className="action-btn" onClick={() => navigate("/demandeur/reservations")}>
                  <i className="bi bi-calendar-check"></i>
                  Voir mes réservations
                </button>
                <button className="action-btn" onClick={() => navigate("/demandeur/avis")}>
                  <i className="bi bi-star"></i>
                  Voir mes avis
                </button>
                <button className="action-btn" onClick={() => navigate("/demandeur/messages")}>
                  <i className="bi bi-chat-dots"></i>
                  Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .alert-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          animation: slideDown 0.3s ease;
        }

        .alert-message.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .alert-message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
        }

        /* Photo Section */
        .profile-photo-section {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          height: fit-content;
        }

        .profile-photo {
          width: 200px;
          height: 200px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #eef2ff;
        }

        .profile-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #354dd4, #4da3ff);
        }

        .photo-placeholder i {
          font-size: 5rem;
          color: white;
        }

        .photo-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn-upload,
        .btn-save-photo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-upload {
          background: #f1f5f9;
          color: #1e293b;
        }

        .btn-upload:hover {
          background: #e2e8f0;
        }

        .btn-save-photo {
          background: #354dd4;
          color: white;
        }

        .btn-save-photo:hover:not(:disabled) {
          background: #2a3fb0;
        }

        .btn-save-photo:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .photo-info {
          margin-top: 0.5rem;
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .photo-info p {
          margin: 0.1rem 0;
        }

        /* Info Section */
        .profile-info-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .info-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #1e293b;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .profile-form,
        .password-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          font-weight: 500;
          color: #1e293b;
        }

        .form-group input {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #354dd4;
          box-shadow: 0 0 0 3px rgba(53, 77, 212, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .btn-save,
        .btn-cancel,
        .btn-change-password {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-save {
          background: #354dd4;
          color: white;
        }

        .btn-save:hover:not(:disabled) {
          background: #2a3fb0;
          transform: translateY(-2px);
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #64748b;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
        }

        .btn-change-password {
          background: #f1f5f9;
          color: #354dd4;
          width: 100%;
          justify-content: center;
        }

        .btn-change-password:hover {
          background: #e2e8f0;
        }

        /* Stats List */
        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-value.verified {
          color: #22c55e;
        }

        .stat-value.not-verified {
          color: #ef4444;
        }

        .role-badge {
          background: #eef2ff;
          color: #354dd4;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        /* Actions List */
        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          color: #1e293b;
        }

        .action-btn:hover {
          background: #eef2ff;
          border-color: #354dd4;
          transform: translateX(5px);
        }

        .action-btn i {
          color: #354dd4;
          font-size: 1.1rem;
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top-color: #354dd4;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .profile-container {
            grid-template-columns: 1fr;
          }
          
          .profile-photo-section {
            max-width: 350px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .btn-save,
          .btn-cancel {
            width: 100%;
            justify-content: center;
          }
          
          .profile-photo {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Profile;