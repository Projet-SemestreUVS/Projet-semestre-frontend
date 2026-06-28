// src/pages/demandeur/MesAvis.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import "../../styles/dashboard.css";
import DemandeurCard from "../../components/demandeur/DemandeurCard";
interface Avis {
  id: number;
  reservation_id: number;
  service_id: number;
  service_nom: string;
  prestataire_id: number;
  prestataire_nom: string;
  prestataire_prenom: string;
  note: number;
  commentaire: string;
  date: string;
  statut: "publie" | "modere" | "signale";
}

interface ReservationSansAvis {
  id: number;
  service_id: number;
  service_nom: string;
  prestataire_id: number;
  prestataire_nom: string;
  prestataire_prenom: string;
  date_debut: string;
  montant: number;
}

const MesAvis = () => {
  const [avisList, setAvisList] = useState<Avis[]>([]);
  const [reservationsSansAvis, setReservationsSansAvis] = useState<ReservationSansAvis[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showNewAvisModal, setShowNewAvisModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationSansAvis | null>(null);
  const [editAvis, setEditAvis] = useState<Avis | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formAvis, setFormAvis] = useState({
    note: 5,
    commentaire: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedNote, setSelectedNote] = useState(0);
  const [hoveredNote, setHoveredNote] = useState(0);
  const [filter, setFilter] = useState<"tous" | "publie" | "modere" | "signale">("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    moyenne: 0,
    publies: 0,
    signales: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    // Charger les avis depuis localStorage
    const storedAvis = localStorage.getItem("demandeur_avis");
    let avis: Avis[] = [];
    
    if (storedAvis) {
      avis = JSON.parse(storedAvis);
    } else {
      // Données mockées par défaut
      avis = [
        {
          id: 1,
          reservation_id: 1,
          service_id: 1,
          service_nom: "Plomberie Express",
          prestataire_id: 2,
          prestataire_nom: "Tech",
          prestataire_prenom: "Alpha",
          note: 5,
          commentaire: "Service excellent ! Le prestataire est arrivé à l'heure et a fait un travail impeccable.",
          date: "2024-06-15T10:30:00",
          statut: "publie"
        },
        {
          id: 2,
          reservation_id: 2,
          service_id: 2,
          service_nom: "Dépannage Électrique",
          prestataire_id: 2,
          prestataire_nom: "Tech",
          prestataire_prenom: "Alpha",
          note: 4,
          commentaire: "Très bon travail, juste un peu de retard mais compréhensible.",
          date: "2024-06-12T14:20:00",
          statut: "publie"
        },
        {
          id: 3,
          reservation_id: 3,
          service_id: 5,
          service_nom: "Coiffure à Domicile",
          prestataire_id: 5,
          prestataire_nom: "Beauty",
          prestataire_prenom: "Studio",
          note: 3,
          commentaire: "Correct, mais le résultat n'était pas exactement ce que j'attendais.",
          date: "2024-06-10T09:15:00",
          statut: "modere"
        }
      ];
      localStorage.setItem("demandeur_avis", JSON.stringify(avis));
    }
    setAvisList(avis);
    
    // Charger les réservations terminées sans avis
    const storedReservations = localStorage.getItem("reservations");
    let reservations: any[] = [];
    
    if (storedReservations) {
      reservations = JSON.parse(storedReservations);
    } else {
      reservations = [
        { id: 1, service_id: 1, service_nom: "Plomberie Express", prestataire_id: 2, prestataire_nom: "Tech", prestataire_prenom: "Alpha", date_debut: "2024-06-20T10:00:00", statut: "terminee", montant: 25000 },
        { id: 2, service_id: 2, service_nom: "Dépannage Électrique", prestataire_id: 2, prestataire_nom: "Tech", prestataire_prenom: "Alpha", date_debut: "2024-06-18T14:00:00", statut: "terminee", montant: 30000 },
        { id: 3, service_id: 4, service_nom: "Transport Aéroport", prestataire_id: 4, prestataire_nom: "Mobility", prestataire_prenom: "Service", date_debut: "2024-06-22T05:00:00", statut: "terminee", montant: 15000 },
        { id: 4, service_id: 6, service_nom: "Ménage Complet", prestataire_id: 6, prestataire_nom: "Clean", prestataire_prenom: "Service", date_debut: "2024-06-25T08:00:00", statut: "terminee", montant: 25000 }
      ];
      localStorage.setItem("reservations", JSON.stringify(reservations));
    }
    
    // Filtrer les réservations terminées sans avis
    const avisReservationIds = avis.map(a => a.reservation_id);
    const sansAvis = reservations
      .filter((r: any) => r.statut === "terminee" && !avisReservationIds.includes(r.id))
      .map((r: any) => ({
        id: r.id,
        service_id: r.service_id,
        service_nom: r.service_nom || "Service",
        prestataire_id: r.prestataire_id,
        prestataire_nom: r.prestataire_nom || "Prestataire",
        prestataire_prenom: r.prestataire_prenom || "",
        date_debut: r.date_debut,
        montant: r.montant || 0
      }));
    
    setReservationsSansAvis(sansAvis);
    
    // Calculer les statistiques
    const total = avis.length;
    const moyenne = total > 0 ? avis.reduce((acc, a) => acc + a.note, 0) / total : 0;
    const publies = avis.filter(a => a.statut === "publie").length;
    const signales = avis.filter(a => a.statut === "signale").length;
    
    setStats({ total, moyenne, publies, signales });
    setLoading(false);
  };

  const renderStars = (note: number, interactive = false, onClick?: (n: number) => void) => {
    const stars = [];
    const currentNote = interactive ? (hoveredNote || selectedNote) : note;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= currentNote ? "-fill" : ""}`}
          style={{
            color: i <= currentNote ? "#fbbf24" : "#cbd5e1",
            fontSize: interactive ? "2rem" : "1rem",
            cursor: interactive ? "pointer" : "default",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={() => interactive && setHoveredNote(i)}
          onMouseLeave={() => interactive && setHoveredNote(selectedNote)}
          onClick={() => {
            if (interactive && onClick) {
              setSelectedNote(i);
              onClick(i);
            }
          }}
        />
      );
    }
    return stars;
  };

  // OUVERTURE DU MODAL POUR NOUVEL AVIS
  const handleOpenNewAvisModal = () => {
    setShowNewAvisModal(true);
    setFormAvis({ note: 5, commentaire: "" });
    setSelectedNote(5);
    setSelectedServiceId(null);
  };

  const handleOpenModal = (reservation: ReservationSansAvis) => {
    setSelectedReservation(reservation);
    setFormAvis({ note: 5, commentaire: "" });
    setSelectedNote(5);
    setShowModal(true);
    setShowNewAvisModal(false);
  };

  const handleEditAvis = (avis: Avis) => {
    setEditAvis(avis);
    setFormAvis({ note: avis.note, commentaire: avis.commentaire });
    setSelectedNote(avis.note);
    setShowEditModal(true);
  };

  const handleSubmitAvis = () => {
    if (!selectedReservation) return;
    
    setSubmitting(true);
    
    const newAvis: Avis = {
      id: Date.now(),
      reservation_id: selectedReservation.id,
      service_id: selectedReservation.service_id,
      service_nom: selectedReservation.service_nom,
      prestataire_id: selectedReservation.prestataire_id,
      prestataire_nom: selectedReservation.prestataire_nom,
      prestataire_prenom: selectedReservation.prestataire_prenom,
      note: formAvis.note,
      commentaire: formAvis.commentaire,
      date: new Date().toISOString(),
      statut: "publie"
    };
    
    const updatedAvis = [newAvis, ...avisList];
    setAvisList(updatedAvis);
    localStorage.setItem("demandeur_avis", JSON.stringify(updatedAvis));
    
    // Mettre à jour les réservations sans avis
    setReservationsSansAvis(prev => prev.filter(r => r.id !== selectedReservation.id));
    
    // Mettre à jour les statistiques
    updateStats(updatedAvis);
    
    setShowModal(false);
    setSelectedReservation(null);
    setSubmitting(false);
  };

  // SOUMETTRE UN AVIS DEPUIS LE MODAL NOUVEL AVIS
  const handleSubmitNewAvis = () => {
    if (!formAvis.commentaire.trim()) {
      alert("Veuillez saisir un commentaire");
      return;
    }
    
    setSubmitting(true);
    
    // Créer un avis générique avec un service fictif
    const newAvis: Avis = {
      id: Date.now(),
      reservation_id: Date.now(),
      service_id: selectedServiceId || 1,
      service_nom: "Service personnalisé",
      prestataire_id: 2,
      prestataire_nom: "Prestataire",
      prestataire_prenom: "Alpha",
      note: formAvis.note,
      commentaire: formAvis.commentaire,
      date: new Date().toISOString(),
      statut: "publie"
    };
    
    const updatedAvis = [newAvis, ...avisList];
    setAvisList(updatedAvis);
    localStorage.setItem("demandeur_avis", JSON.stringify(updatedAvis));
    
    // Mettre à jour les statistiques
    updateStats(updatedAvis);
    
    setShowNewAvisModal(false);
    setSubmitting(false);
    setFormAvis({ note: 5, commentaire: "" });
  };

  const handleEditSubmit = () => {
    if (!editAvis) return;
    
    setSubmitting(true);
    
    const updatedAvis = avisList.map(a =>
      a.id === editAvis.id

        ? { ...a, note: formAvis.note, commentaire: formAvis.commentaire }
        : a
    );
    
    setAvisList(updatedAvis);
    localStorage.setItem("demandeur_avis", JSON.stringify(updatedAvis));
    
    // Mettre à jour les statistiques
    updateStats(updatedAvis);
    
    setShowEditModal(false);
    setEditAvis(null);
    setSubmitting(false);
  };

  const updateStats = (avis: Avis[]) => {
    const total = avis.length;
    const moyenne = total > 0 ? avis.reduce((acc, a) => acc + a.note, 0) / total : 0;
    const publies = avis.filter(a => a.statut === "publie").length;
    const signales = avis.filter(a => a.statut === "signale").length;
    setStats({ total, moyenne, publies, signales });
  };

  const handleDeleteAvis = (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    
    const updatedAvis = avisList.filter(a => a.id !== id);
    setAvisList(updatedAvis);
    localStorage.setItem("demandeur_avis", JSON.stringify(updatedAvis));
    
    // Mettre à jour les statistiques
    updateStats(updatedAvis);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "publie": return { label: "Publié", class: "status-published", icon: "bi-check-circle-fill" };
      case "modere": return { label: "En modération", class: "status-moderated", icon: "bi-clock-fill" };
      case "signale": return { label: "Signalé", class: "status-reported", icon: "bi-flag-fill" };
      default: return { label: "Publié", class: "status-published", icon: "bi-check-circle-fill" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredAvis = avisList.filter(a => {
    const matchesFilter = filter === "tous" || a.statut === filter;
    const matchesSearch = a.service_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.prestataire_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.prestataire_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.commentaire.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de vos avis...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="mes-avis">
        <div className="page-header">
          <h1>
            <i className="bi bi-star"></i>
            Mes avis
          </h1>
          <p>Gérez vos avis sur les services reçus</p>
        </div>
</div>

{/* CARTE DEMANDEUR AJOUTÉE ICI */}
<DemandeurCard titre="Demandeuteur" valeur={stats.total} />

{/* Statistiques */}
<div className="stats-container">
        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon purple"><i className="bi bi-chat-dots"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Avis donnés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon gold"><i className="bi bi-star-fill"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.moyenne.toFixed(1)}/5</span>
              <span className="stat-label">Note moyenne</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><i className="bi bi-check-circle"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.publies}</span>
              <span className="stat-label">Publiés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red"><i className="bi bi-flag"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.signales}</span>
              <span className="stat-label">Signalés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><i className="bi bi-pencil-square"></i></div>
            <div className="stat-info">
              <span className="stat-value">{reservationsSansAvis.length}</span>
              <span className="stat-label">À évaluer</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-container">
          <button 
            className="btn-new-avis"
            onClick={handleOpenNewAvisModal}
          >
            <i className="bi bi-plus-circle"></i>
            Nouvel avis
          </button>
        </div>

        {/* Section des réservations à évaluer */}
        {reservationsSansAvis.length > 0 && (
          <div className="to-review-section">
            <h3>
              <i className="bi bi-pencil-square"></i>
              Services à évaluer ({reservationsSansAvis.length})
            </h3>
            <div className="to-review-grid">
              {reservationsSansAvis.map((reservation) => (
                <div key={reservation.id} className="to-review-card">
                  <div className="review-service-info">
                    <div className="service-icon">
                      <i className="bi bi-tools"></i>
                    </div>
                    <div className="service-details">
                      <h4>{reservation.service_nom}</h4>
                      <p>{reservation.prestataire_prenom} {reservation.prestataire_nom}</p>
                      <span className="review-date">
                        <i className="bi bi-calendar"></i> {formatDate(reservation.date_debut)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="btn-review-now"
                    onClick={() => handleOpenModal(reservation)}
                  >
                    <i className="bi bi-star"></i>
                    Donner mon avis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="filters-container">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Rechercher un avis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button className={`filter-btn ${filter === "tous" ? "active" : ""}`} onClick={() => setFilter("tous")}>
              Tous ({avisList.length})
            </button>
            <button className={`filter-btn ${filter === "publie" ? "active" : ""}`} onClick={() => setFilter("publie")}>
              Publiés ({stats.publies})
            </button>
            <button className={`filter-btn ${filter === "modere" ? "active" : ""}`} onClick={() => setFilter("modere")}>
              En modération
            </button>
            <button className={`filter-btn ${filter === "signale" ? "active" : ""}`} onClick={() => setFilter("signale")}>
              Signalés ({stats.signales})
            </button>
          </div>
        </div>

        {/* Liste des avis */}
        {filteredAvis.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-chat-square-text"></i>
            <h3>Aucun avis</h3>
            <p>Vous n'avez pas encore donné d'avis</p>
            <Link to="/services" className="btn-explore">
              <i className="bi bi-search"></i> Explorer les services
            </Link>
          </div>
        ) : (
          <div className="avis-grid">
            {filteredAvis.map((avis) => {
              const status = getStatutBadge(avis.statut);
              return (
                <div key={avis.id} className="avis-card">
                  <div className="avis-header">
                    <div className="avis-service">
                      <i className="bi bi-tools"></i>
                      <span>{avis.service_nom}</span>
                    </div>
                    <div className={`status-badge ${status.class}`}>
                      <i className={`bi ${status.icon}`}></i>
                      {status.label}
                    </div>
                  </div>

                  <div className="avis-body">
                    <div className="avis-prestataire">
                      <i className="bi bi-person-circle"></i>
                      <span>{avis.prestataire_prenom} {avis.prestataire_nom}</span>
                    </div>
                    <div className="avis-note">
                      {renderStars(avis.note)}
                      <span className="note-value">{avis.note}/5</span>
                    </div>
                    <div className="avis-commentaire">
                      <i className="bi bi-chat-quote"></i>
                      <p>"{avis.commentaire}"</p>
                    </div>
                    <div className="avis-date">
                      <i className="bi bi-calendar"></i>
                      {formatDate(avis.date)}
                    </div>
                  </div>

                  <div className="avis-footer">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditAvis(avis)}
                    >
                      <i className="bi bi-pencil"></i>
                      Modifier
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteAvis(avis.id)}
                    >
                      <i className="bi bi-trash"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Nouvel Avis Générique */}
        {showNewAvisModal && (
          <div className="modal-overlay" onClick={() => setShowNewAvisModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="bi bi-plus-circle"></i>
                  Nouvel avis
                </h3>
                <button className="close-btn" onClick={() => setShowNewAvisModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="info-message">
                  <i className="bi bi-info-circle"></i>
                  <p>Donnez votre avis sur un service que vous avez utilisé.</p>
                </div>

                <div className="note-section">
                  <label>Votre note :</label>
                  <div className="stars-interactive">
                    {renderStars(formAvis.note, true, (note) => {
                      setFormAvis({ ...formAvis, note });
                    })}
                    <span className="note-preview">{formAvis.note}/5</span>
                  </div>
                </div>

                <div className="commentaire-section">
                  <label htmlFor="new-commentaire">Votre commentaire :</label>
                  <textarea
                    id="new-commentaire"
                    rows={4}
                    value={formAvis.commentaire}
                    onChange={(e) => setFormAvis({ ...formAvis, commentaire: e.target.value })}
                    placeholder="Partagez votre expérience avec ce prestataire..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowNewAvisModal(false)}>
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleSubmitNewAvis}
                  disabled={submitting}
                >
                  {submitting ? "Envoi..." : "Publier mon avis"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Avis sur réservation spécifique */}
        {showModal && selectedReservation && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="bi bi-star"></i>
                  Donner mon avis
                </h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="reservation-info-modal">
                  <div className="service-info">
                    <i className="bi bi-tools"></i>
                    <span>{selectedReservation.service_nom}</span>
                  </div>
                  <div className="prestataire-info">
                    <i className="bi bi-person"></i>
                    <span>{selectedReservation.prestataire_prenom} {selectedReservation.prestataire_nom}</span>
                  </div>
                  <div className="date-info">
                    <i className="bi bi-calendar"></i>
                    <span>{formatDate(selectedReservation.date_debut)}</span>
                  </div>
                </div>

                <div className="note-section">
                  <label>Votre note :</label>
                  <div className="stars-interactive">
                    {renderStars(formAvis.note, true, (note) => {
                      setFormAvis({ ...formAvis, note });
                    })}
                    <span className="note-preview">{formAvis.note}/5</span>
                  </div>
                </div>

                <div className="commentaire-section">
                  <label htmlFor="commentaire">Votre commentaire :</label>
                  <textarea
                    id="commentaire"
                    rows={4}
                    value={formAvis.commentaire}
                    onChange={(e) => setFormAvis({ ...formAvis, commentaire: e.target.value })}
                    placeholder="Partagez votre expérience avec ce prestataire..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleSubmitAvis}
                  disabled={submitting}
                >
                  {submitting ? "Envoi..." : "Publier mon avis"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Modifier Avis */}
        {showEditModal && editAvis && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="bi bi-pencil"></i>
                  Modifier mon avis
                </h3>
                <button className="close-btn" onClick={() => setShowEditModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="reservation-info-modal">
                  <div className="service-info">
                    <i className="bi bi-tools"></i>
                    <span>{editAvis.service_nom}</span>
                  </div>
                  <div className="prestataire-info">
                    <i className="bi bi-person"></i>
                    <span>{editAvis.prestataire_prenom} {editAvis.prestataire_nom}</span>
                  </div>
                </div>

                <div className="note-section">
                  <label>Votre note :</label>
                  <div className="stars-interactive">
                    {renderStars(formAvis.note, true, (note) => {
                      setFormAvis({ ...formAvis, note });
                    })}
                    <span className="note-preview">{formAvis.note}/5</span>
                  </div>
                </div>

                <div className="commentaire-section">
                  <label htmlFor="edit-commentaire">Votre commentaire :</label>
                  <textarea
                    id="edit-commentaire"
                    rows={4}
                    value={formAvis.commentaire}
                    onChange={(e) => setFormAvis({ ...formAvis, commentaire: e.target.value })}
                    placeholder="Modifiez votre commentaire..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleEditSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .mes-avis {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon i { font-size: 1.5rem; }
        .stat-icon.purple { background: #f3e8ff; color: #a855f7; }
        .stat-icon.gold { background: #fef3c7; color: #f59e0b; }
        .stat-icon.green { background: #dcfce7; color: #22c55e; }
        .stat-icon.red { background: #fee2e2; color: #ef4444; }
        .stat-icon.blue { background: #eef2ff; color: #354dd4; }

        .stat-info .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }
        .stat-info .stat-label {
          font-size: 0.7rem;
          color: #64748b;
        }

        .actions-container {
          margin-bottom: 1.5rem;
        }

        .btn-new-avis {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: #354dd4;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-new-avis:hover {
          background: #2a3fb0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(53, 77, 212, 0.3);
        }

        .info-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #eef2ff;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        .info-message i { color: #354dd4; font-size: 1.25rem; }
        .info-message p { margin: 0; font-size: 0.85rem; color: #475569; }

        .to-review-section {
          margin-bottom: 2rem;
        }
        .to-review-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .to-review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1rem;
        }

        .to-review-card {
          background: white;
          border-radius: 16px;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .review-service-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .service-icon {
          width: 45px;
          height: 45px;
          background: #eef2ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .service-icon i { font-size: 1.25rem; color: #354dd4; }

        .service-details h4 { font-size: 1rem; margin-bottom: 0.25rem; }
        .service-details p { font-size: 0.8rem; color: #64748b; margin: 0; }
        .review-date { font-size: 0.7rem; color: #94a3b8; }

        .btn-review-now {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #354dd4;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .btn-review-now:hover { background: #2a3fb0; transform: scale(1.02); }

        .filters-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.6rem 1rem;
        }
        .search-box i { color: #94a3b8; margin-right: 0.5rem; }
        .search-box input { flex: 1; border: none; outline: none; }

        .filter-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .filter-btn:hover { border-color: #354dd4; color: #354dd4; }
        .filter-btn.active { background: #354dd4; color: white; border-color: #354dd4; }

        .avis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.5rem;
        }

        .avis-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .avis-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15); }

        .avis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .avis-service { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
        .avis-service i { color: #354dd4; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }
        .status-published { background: #dcfce7; color: #22c55e; }
        .status-moderated { background: #fef3c7; color: #d97706; }
        .status-reported { background: #fee2e2; color: #dc2626; }

        .avis-body { padding: 1.5rem; }
        .avis-prestataire { display: flex; align-items: center; gap: 0.5rem; color: #354dd4; font-weight: 500; margin-bottom: 0.5rem; }
        .avis-note { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
        .avis-note i { font-size: 1rem; }
        .note-value { font-weight: 600; color: #1e293b; }
        .avis-commentaire { display: flex; gap: 0.5rem; background: #f8fafc; padding: 1rem; border-radius: 12px; margin-top: 0.5rem; }
        .avis-commentaire i { color: #94a3b8; }
        .avis-commentaire p { flex: 1; font-size: 0.85rem; font-style: italic; margin: 0; color: #475569; }
        .avis-date { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.75rem; font-size: 0.7rem; color: #94a3b8; }

        .avis-footer {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .btn-edit, .btn-delete {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .btn-edit { background: #eef2ff; color: #354dd4; }
        .btn-edit:hover { background: #354dd4; color: white; }
        .btn-delete { background: #fee2e2; color: #ef4444; }
        .btn-delete:hover { background: #ef4444; color: white; }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-container {
          background: white;
          border-radius: 24px;
          max-width: 550px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .modal-header h3 { display: flex; align-items: center; gap: 0.5rem; }
        .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; }

        .modal-body { padding: 1.5rem; }

        .reservation-info-modal {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        .reservation-info-modal div { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
        .reservation-info-modal div:last-child { margin-bottom: 0; }
        .reservation-info-modal i { color: #354dd4; }

        .note-section { margin-bottom: 1.5rem; }
        .note-section label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
        .stars-interactive { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .note-preview { font-size: 0.8rem; color: #64748b; margin-left: 0.5rem; }

        .commentaire-section { margin-bottom: 1.5rem; }
        .commentaire-section label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
        .commentaire-section textarea { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 12px; resize: vertical; font-family: inherit; }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        .btn-secondary { padding: 0.5rem 1rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; }
        .btn-primary { padding: 0.5rem 1rem; background: #354dd4; color: white; border: none; border-radius: 8px; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .empty-state {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 20px;
        }
        .empty-state i { font-size: 4rem; color: #cbd5e1; margin-bottom: 1rem; }
        .btn-explore {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #354dd4;
          color: white;
          border-radius: 10px;
          text-decoration: none;
        }

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
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .to-review-grid { grid-template-columns: 1fr; }
          .avis-grid { grid-template-columns: 1fr; }
          .stats-container { grid-template-columns: repeat(2, 1fr); }
          .filters-container { flex-direction: column; }
          .filter-buttons { justify-content: center; }
          .to-review-card { flex-direction: column; text-align: center; }
          .review-service-info { flex-direction: column; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MesAvis;