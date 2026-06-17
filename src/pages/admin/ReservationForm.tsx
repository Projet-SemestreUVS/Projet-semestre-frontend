// src/pages/admin/ReservationForm.tsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservation?: any;
  mode: 'create' | 'edit';
}

const ReservationForm = ({ isOpen, onClose, onSuccess, reservation, mode }: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    service_id: '',
    demandeur_id: '',
    prestataire_id: '',
    date_debut: '',
    statut: 'en_attente',
    commentaire: '',
  });
  const [services, setServices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (mode === 'edit' && reservation) {
        // Formater la date pour l'input datetime-local
        let dateDebut = '';
        if (reservation.date_debut) {
          try {
            const date = new Date(reservation.date_debut);
            dateDebut = date.toISOString().slice(0, 16);
          } catch (e) {
            dateDebut = '';
          }
        }

        setFormData({
          service_id: reservation.service_id?.toString() || '',
          demandeur_id: reservation.demandeur_id?.toString() || '',
          prestataire_id: reservation.prestataire_id?.toString() || '',
          date_debut: dateDebut,
          statut: reservation.statut || 'en_attente',
          commentaire: reservation.commentaire || '',
        });
      } else {
        // Réinitialiser le formulaire pour la création
        setFormData({
          service_id: '',
          demandeur_id: '',
          prestataire_id: '',
          date_debut: '',
          statut: 'en_attente',
          commentaire: '',
        });
      }
    }
  }, [isOpen, reservation, mode]);

  const fetchData = async () => {
    try {
      setError(null);
      const [servicesRes, usersRes] = await Promise.all([
        api.get('/services'),
        api.get('/auth/users')
      ]);
      
      setServices(servicesRes.data.data || servicesRes.data || []);
      setUsers(usersRes.data.data || usersRes.data || []);
    } catch (err: any) {
      console.error('Erreur chargement données:', err);
      setError('Erreur lors du chargement des données');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation des données
      if (!formData.service_id || !formData.demandeur_id || !formData.prestataire_id || !formData.date_debut) {
        setError('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }

      const data = {
        service_id: parseInt(formData.service_id),
        demandeur_id: parseInt(formData.demandeur_id),
        prestataire_id: parseInt(formData.prestataire_id),
        date_debut: formData.date_debut,
        statut: formData.statut,
        commentaire: formData.commentaire || null,
      };

      if (mode === 'create') {
        await api.post('/auth/reservations', data);
      } else {
        await api.put(`/auth/reservations/${reservation.id}`, data);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || err.response?.data?.errors || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="bi bi-calendar-plus"></i>
            {mode === 'create' ? 'Nouvelle réservation' : 'Modifier la réservation'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-body">
            {error && (
              <div className="form-error">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Service */}
              <div className="form-group">
                <label htmlFor="service_id">Service *</label>
                <select
                  id="service_id"
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un service</option>
                  {services.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.nom || service.titre || 'Service'} - {service.prix || 0} FCFA
                    </option>
                  ))}
                </select>
              </div>

              {/* Demandeur */}
              <div className="form-group">
                <label htmlFor="demandeur_id">Demandeur *</label>
                <select
                  id="demandeur_id"
                  value={formData.demandeur_id}
                  onChange={(e) => setFormData({ ...formData, demandeur_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un demandeur</option>
                  {users
                    .filter((u: any) => u.role === 'demandeur' || u.role === 'user')
                    .map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.prenom || ''} {user.nom || user.name || 'Utilisateur'} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              {/* Prestataire */}
              <div className="form-group">
                <label htmlFor="prestataire_id">Prestataire *</label>
                <select
                  id="prestataire_id"
                  value={formData.prestataire_id}
                  onChange={(e) => setFormData({ ...formData, prestataire_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un prestataire</option>
                  {users
                    .filter((u: any) => u.role === 'prestataire' || u.role === 'provider')
                    .map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.prenom || ''} {user.nom || user.name || 'Prestataire'} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              {/* Date de début */}
              <div className="form-group">
                <label htmlFor="date_debut">Date de début *</label>
                <input
                  type="datetime-local"
                  id="date_debut"
                  value={formData.date_debut}
                  onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                  required
                />
              </div>

              {/* Statut */}
              <div className="form-group">
                <label htmlFor="statut">Statut</label>
                <select
                  id="statut"
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                >
                  <option value="en_attente">📋 En attente</option>
                  <option value="confirmee">✅ Confirmée</option>
                  <option value="terminee">🏁 Terminée</option>
                  <option value="annulee">❌ Annulée</option>
                </select>
              </div>

              {/* Commentaire - Pleine largeur */}
              <div className="form-group full-width">
                <label htmlFor="commentaire">Commentaire</label>
                <textarea
                  id="commentaire"
                  rows={3}
                  value={formData.commentaire}
                  onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                  placeholder="Informations supplémentaires sur la réservation..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              <i className="bi bi-x-lg"></i> Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>
                  {mode === 'create' ? 'Créer la réservation' : 'Mettre à jour'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;