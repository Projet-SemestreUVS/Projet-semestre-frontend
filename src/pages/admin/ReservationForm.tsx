import { useState, useEffect } from "react";
import api from "../../services/api";

interface User {
  id: number;
  nom: string;
  prenom: string;
  role?: string;
}

interface Service {
  id: number;
  nom: string;
}

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservation: any | null;
  mode: "create" | "edit";
}

const ReservationForm = ({ isOpen, onClose, onSuccess, reservation, mode }: ReservationFormProps) => {
  const [demandeurId, setDemandeurId] = useState("");
  const [prestataireId, setPrestataireId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [commentaire, setCommentaire] = useState("");
  
  const [demandeurs, setDemandeurs] = useState<User[]>([]);
  const [prestataires, setPrestataires] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Charger les listes de sélection (Clients, Prestataires, Services)
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [usersRes, servicesRes] = await Promise.all([
            api.get("/auth/users"),
            api.get("/auth/services")
          ]);
          
          const allUsers: User[] = usersRes.data?.data || usersRes.data || [];
          const allServices: Service[] = servicesRes.data?.data || servicesRes.data || [];
          
          setServices(allServices);
          // Filtrer selon vos rôles si définis, sinon affiche tout le monde
          setDemandeurs(allUsers.filter(u => u.role === "demandeur" || !u.role));
          setPrestataires(allUsers.filter(u => u.role === "prestataire" || !u.role));
        } catch (err) {
          console.error("Erreur de pré-chargement des listes", err);
        }
      };
      
      fetchData();
    }
  }, [isOpen]);

  // Remplir si on est en mode édition
  useEffect(() => {
    if (mode === "edit" && reservation) {
      setDemandeurId(reservation.demandeur_id?.toString() || "");
      setPrestataireId(reservation.prestataire_id?.toString() || "");
      setServiceId(reservation.service_id?.toString() || "");
      // Convertir la date pour l'input datetime-local (YYYY-MM-DDTHH:mm)
      if (reservation.date_debut) {
        const date = new Date(reservation.date_debut);
        const formattedDate = date.toISOString().slice(0, 16);
        setDateDebut(formattedDate);
      }
      setCommentaire(reservation.commentaire || "");
    } else {
      setDemandeurId("");
      setPrestataireId("");
      setServiceId("");
      setDateDebut("");
      setCommentaire("");
    }
  }, [mode, reservation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandeurId || !prestataireId || !serviceId || !dateDebut) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload = {
      demandeur_id: parseInt(demandeurId),
      prestataire_id: parseInt(prestataireId),
      service_id: parseInt(serviceId),
      date_debut: dateDebut,
      commentaire: commentaire,
      statut: mode === "create" ? "en_attente" : reservation.statut
    };

    try {
      setSubmitting(true);
      if (mode === "create") {
        await api.post("/auth/reservations", payload);
      } else {
        await api.put(`/auth/reservations/${reservation.id}`, payload);
      }
      onSuccess(); // Actualise la table principale
      onClose();   // Ferme la modale
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header de la Modale */}
        <div className="bg-[#1e2530] text-white px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {mode === "create" ? "Créer une réservation" : "Modifier la réservation"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-xl focus:outline-none">
            &times;
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Sélection Client */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client (Demandeur) <span className="text-red-500">*</span></label>
            <select
              value={demandeurId}
              onChange={(e) => setDemandeurId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            >
              <option value="">-- Choisir un client --</option>
              {demandeurs.map(d => (
                <option key={d.id} value={d.id}>{d.prenom} {d.nom}</option>
              ))}
            </select>
          </div>

          {/* Sélection Prestataire */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prestataire <span className="text-red-500">*</span></label>
            <select
              value={prestataireId}
              onChange={(e) => setPrestataireId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            >
              <option value="">-- Choisir un prestataire --</option>
              {prestataires.map(p => (
                <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
              ))}
            </select>
          </div>

          {/* Sélection Service */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service <span className="text-red-500">*</span></label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            >
              <option value="">-- Choisir un service --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
          </div>

          {/* Sélection Date et Heure */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Heure de début <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-gray-700"
            />
          </div>

          {/* Commentaire optionnel */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Commentaire / Instructions</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={3}
              placeholder="Ajouter des notes à propos de la réservation..."
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end items-center gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#1c84ff] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded transition shadow-sm disabled:opacity-50"
            >
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReservationForm;