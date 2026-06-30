// // src/pages/admin/ReservationsAdmin.tsx
// import { useState, useEffect } from "react";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import AdminSidebar from "../../components/dashboard/AdminSidebar";
// import ReservationForm from "./ReservationForm";
// import api from "../../services/api";

// interface Reservation {
//   id: number;
//   service_id: number;
//   demandeur_id: number;
//   prestataire_id: number;
//   date_debut: string;
//   date_fin?: string;
//   statut: "en_attente" | "confirmee" | "terminee" | "annulee";
//   commentaire: string | null;
//   message?: string | null;
//   prix_total?: number;
//   created_at: string;
//   updated_at?: string;
//   service?: {
//     id: number;
//     nom: string;
//     titre?: string;
//     prix: number;
//     description?: string;
//     image?: string;
//   };
//   demandeur?: {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//     telephone: string;
//     avatar?: string;
//   };
//   prestataire?: {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//     telephone: string;
//     avatar?: string;
//   };
// }

// const ReservationsAdmin = () => {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedStatut, setSelectedStatut] = useState<string>("tous");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
//   const [updating, setUpdating] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
//   const [showForm, setShowForm] = useState(false);
//   const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
//   const [editingReservation, setEditingReservation] = useState<any>(null);

//   useEffect(() => {
//     fetchReservations();
//   }, []);

//   const fetchReservations = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await api.get("/auth/reservations");
//       console.log("Réservations reçues:", response.data);
      
//       let reservationsData = [];
//       if (response.data?.data) {
//         reservationsData = response.data.data;
//       } else if (Array.isArray(response.data)) {
//         reservationsData = response.data;
//       } else if (response.data?.reservations) {
//         reservationsData = response.data.reservations;
//       } else {
//         reservationsData = [];
//       }
      
//       setReservations(reservationsData);
//     } catch (err: any) {
//       console.error("Erreur détaillée:", err);
      
//       // ✅ CORRECTION : Vérifier si c'est vraiment une erreur 403
//       // Si c'est une autre erreur, afficher un message plus générique
//       if (err.response?.status === 403) {
//         // Au lieu d'erreur, on affiche un message informatif
//         // Mais on ne bloque pas l'affichage
//         setError("Vous n'avez pas les droits admin. Affichage en lecture seule.");
//         // On essaie quand même d'afficher les données si disponibles
//         if (err.response?.data?.data) {
//           setReservations(err.response.data.data);
//         }
//       } else if (err.response?.status === 401) {
//         setError("Session expirée. Veuillez vous reconnecter.");
//         setTimeout(() => {
//           window.location.href = '/login';
//         }, 2000);
//       } else {
//         // ✅ CORRECTION : Message d'erreur plus précis
//         setError(err.response?.data?.message || "Erreur lors du chargement des réservations");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = () => {
//     setFormMode('create');
//     setEditingReservation(null);
//     setShowForm(true);
//   };

//   const handleEdit = (reservation: any) => {
//     setFormMode('edit');
//     setEditingReservation(reservation);
//     setShowForm(true);
//   };

//   const handleFormSuccess = () => {
//     fetchReservations();
//     showNotification(
//       formMode === 'create' ? 'Réservation créée avec succès' : 'Réservation mise à jour avec succès',
//       'success'
//     );
//   };

//   const getStatutClass = (statut: string) => {
//     switch (statut) {
//       case "confirmee": return "statut-confirmee";
//       case "terminee": return "statut-terminee";
//       case "annulee": return "statut-annulee";
//       default: return "statut-attente";
//     }
//   };

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case "confirmee": return "bi-check-circle-fill";
//       case "terminee": return "bi-check2-circle";
//       case "annulee": return "bi-x-circle-fill";
//       default: return "bi-clock-fill";
//     }
//   };

//   const getStatutTexte = (statut: string) => {
//     switch (statut) {
//       case "confirmee": return "Confirmée";
//       case "terminee": return "Terminée";
//       case "annulee": return "Annulée";
//       default: return "En attente";
//     }
//   };

//   const handleUpdateStatut = async (id: number, newStatut: string) => {
//     try {
//       setUpdating(true);
//       await api.put(`/auth/reservations/${id}`, { statut: newStatut });
      
//       setReservations(prev =>
//         prev.map(r =>
//           r.id === id ? { ...r, statut: newStatut as Reservation["statut"] } : r
//         )
//       );
      
//       if (selectedReservation && selectedReservation.id === id) {
//         setSelectedReservation({ ...selectedReservation, statut: newStatut as Reservation["statut"] });
//       }
      
//       showNotification("Statut mis à jour avec succès", "success");
//     } catch (err: any) {
//       console.error("Erreur mise à jour:", err);
//       showNotification(err.response?.data?.message || "Erreur lors de la mise à jour", "error");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.")) return;
    
//     try {
//       await api.delete(`/auth/reservations/${id}`);
//       setReservations(prev => prev.filter(r => r.id !== id));
//       if (selectedReservation && selectedReservation.id === id) {
//         setShowModal(false);
//         setSelectedReservation(null);
//       }
//       showNotification("Réservation supprimée avec succès", "success");
//     } catch (err: any) {
//       console.error("Erreur suppression:", err);
//       showNotification(err.response?.data?.message || "Erreur lors de la suppression", "error");
//     }
//   };

//   const showNotification = (message: string, type: "success" | "error") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "Date non définie";
//     return new Date(dateString).toLocaleString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0
//     }).format(price);
//   };

//   const filteredReservations = reservations.filter(res => {
//     const matchesStatut = selectedStatut === "tous" || res.statut === selectedStatut;
//     const searchLower = searchTerm.toLowerCase();
//     const matchesSearch = 
//       (res.service?.nom || res.service?.titre || "")?.toLowerCase().includes(searchLower) ||
//       `${res.demandeur?.prenom || ""} ${res.demandeur?.nom || ""}`.toLowerCase().includes(searchLower) ||
//       `${res.prestataire?.prenom || ""} ${res.prestataire?.nom || ""}`.toLowerCase().includes(searchLower) ||
//       res.id.toString().includes(searchLower);
//     return matchesStatut && matchesSearch;
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

//   const stats = {
//     total: reservations.length,
//     en_attente: reservations.filter(r => r.statut === "en_attente").length,
//     confirmees: reservations.filter(r => r.statut === "confirmee").length,
//     terminees: reservations.filter(r => r.statut === "terminee").length,
//     annulees: reservations.filter(r => r.statut === "annulee").length,
//     revenus_total: reservations.reduce((sum, r) => {
//       if (r.statut === "confirmee" || r.statut === "terminee") {
//         return sum + (r.service?.prix || r.prix_total || 0);
//       }
//       return sum;
//     }, 0)
//   };

//   if (loading) {
//     return (
//       <DashboardLayout sidebar={<AdminSidebar />}>
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Chargement des réservations...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // ✅ CORRECTION : Même en cas d'erreur, on affiche la page avec un message
//   // mais on ne bloque pas l'affichage complet
//   return (
//     <DashboardLayout sidebar={<AdminSidebar />}>
//       <div className="reservations-manager">
//         {notification && (
//           <div className={`notification notification-${notification.type}`}>
//             <i className={`bi bi-${notification.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}`}></i>
//             <span>{notification.message}</span>
//           </div>
//         )}

//         {/* ✅ CORRECTION : Afficher l'erreur mais pas bloquer */}
//         {error && (
//           <div className="error-banner">
//             <i className="bi bi-info-circle"></i>
//             <span>{error}</span>
//           </div>
//         )}

//         <div className="page-header">
//           <div className="header-left">
//             <h1>
//               <i className="bi bi-calendar-check"></i>
//               Gestion des réservations
//             </h1>
//             <p>Consultez et gérez toutes les réservations de la plateforme</p>
//           </div>
//           <button className="btn-primary btn-create" onClick={handleCreate}>
//             <i className="bi bi-plus-lg"></i>
//             Nouvelle réservation
//           </button>
//         </div>

//         {/* Statistiques */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon"><i className="bi bi-calendar-week"></i></div>
//             <div className="stat-info">
//               <h3>{stats.total}</h3>
//               <p>Total réservations</p>
//             </div>
//           </div>
//           <div className="stat-card stat-warning">
//             <div className="stat-icon"><i className="bi bi-clock-history"></i></div>
//             <div className="stat-info">
//               <h3>{stats.en_attente}</h3>
//               <p>En attente</p>
//             </div>
//           </div>
//           <div className="stat-card stat-success">
//             <div className="stat-icon"><i className="bi bi-check-circle"></i></div>
//             <div className="stat-info">
//               <h3>{stats.confirmees}</h3>
//               <p>Confirmées</p>
//             </div>
//           </div>
//           <div className="stat-card stat-info">
//             <div className="stat-icon"><i className="bi bi-check2-circle"></i></div>
//             <div className="stat-info">
//               <h3>{stats.terminees}</h3>
//               <p>Terminées</p>
//             </div>
//           </div>
//           <div className="stat-card stat-danger">
//             <div className="stat-icon"><i className="bi bi-x-circle"></i></div>
//             <div className="stat-info">
//               <h3>{stats.annulees}</h3>
//               <p>Annulées</p>
//             </div>
//           </div>
//           <div className="stat-card stat-primary">
//             <div className="stat-icon"><i className="bi bi-currency-franc"></i></div>
//             <div className="stat-info">
//               <h3>{formatPrice(stats.revenus_total)}</h3>
//               <p>Revenus totaux</p>
//             </div>
//           </div>
//         </div>

//         {/* Filtres */}
//         <div className="filters-bar">
//           <div className="search-wrapper">
//             <i className="bi bi-search"></i>
//             <input
//               type="text"
//               placeholder="Rechercher par ID, service, demandeur ou prestataire..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button className="clear-search" onClick={() => setSearchTerm("")}>
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             )}
//           </div>
//           <div className="status-filters">
//             {["tous", "en_attente", "confirmee", "terminee", "annulee"].map(status => (
//               <button
//                 key={status}
//                 className={`status-filter-btn ${selectedStatut === status ? "active" : ""}`}
//                 onClick={() => setSelectedStatut(status)}
//               >
//                 {status === "tous" ? "Tous" : getStatutTexte(status)}
//                 <span className="count">
//                   {status === "tous" ? stats.total : stats[status as keyof typeof stats]}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tableau */}
//         {filteredReservations.length === 0 ? (
//           <div className="empty-state">
//             <i className="bi bi-calendar-x"></i>
//             <h3>Aucune réservation trouvée</h3>
//             <p>Aucune réservation ne correspond à vos critères</p>
//             {(searchTerm || selectedStatut !== "tous") && (
//               <button 
//                 className="reset-filters-btn"
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedStatut("tous");
//                 }}
//               >
//                 <i className="bi bi-arrow-counterclockwise"></i>
//                 Réinitialiser les filtres
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="table-wrapper">
//               <table className="reservations-table">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Service</th>
//                     <th>Demandeur</th>
//                     <th>Prestataire</th>
//                     <th>Date</th>
//                     <th>Montant</th>
//                     <th>Statut</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.map((reservation) => (
//                     <tr key={reservation.id}>
//                       <td className="reservation-id">#{reservation.id}</td>
//                       <td>
//                         <div className="service-info">
//                           {reservation.service?.image && (
//                             <img src={reservation.service.image} alt="" className="service-thumb" />
//                           )}
//                           <span>{reservation.service?.nom || "-"}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="user-info">
//                           {reservation.demandeur?.avatar && (
//                             <img src={reservation.demandeur.avatar} alt="" className="user-avatar" />
//                           )}
//                           <div>
//                             <div className="user-name">
//                               {reservation.demandeur?.prenom} {reservation.demandeur?.nom}
//                             </div>
//                             <div className="user-contact">{reservation.demandeur?.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="user-info">
//                           {reservation.prestataire?.avatar && (
//                             <img src={reservation.prestataire.avatar} alt="" className="user-avatar" />
//                           )}
//                           <div>
//                             <div className="user-name">
//                               {reservation.prestataire?.prenom} {reservation.prestataire?.nom}
//                             </div>
//                             <div className="user-contact">{reservation.prestataire?.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{formatDate(reservation.date_debut)}</td>
//                       <td className="price">{formatPrice(reservation.service?.prix || 0)}</td>
//                       <td>
//                         <span className={`status-badge ${getStatutClass(reservation.statut)}`}>
//                           <i className={getStatutIcon(reservation.statut)}></i>
//                           {getStatutTexte(reservation.statut)}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <button
//                             className="action-btn view-btn"
//                             onClick={() => {
//                               setSelectedReservation(reservation);
//                               setShowModal(true);
//                             }}
//                             title="Voir détails"
//                           >
//                             <i className="bi bi-eye"></i>
//                           </button>
//                           <button
//                             className="action-btn edit-btn"
//                             onClick={() => handleEdit(reservation)}
//                             title="Modifier"
//                           >
//                             <i className="bi bi-pencil"></i>
//                           </button>
//                           <button
//                             className="action-btn delete-btn"
//                             onClick={() => handleDelete(reservation.id)}
//                             title="Supprimer"
//                           >
//                             <i className="bi bi-trash"></i>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {totalPages > 1 && (
//               <div className="pagination">
//                 <button 
//                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
//                   disabled={currentPage === 1}
//                   className="pagination-btn"
//                 >
//                   <i className="bi bi-chevron-left"></i>
//                 </button>
//                 <div className="pagination-pages">
//                   {[...Array(Math.min(5, totalPages))].map((_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`pagination-page ${currentPage === pageNum ? "active" : ""}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button 
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
//                   disabled={currentPage === totalPages}
//                   className="pagination-btn"
//                 >
//                   <i className="bi bi-chevron-right"></i>
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         <ReservationForm
//           isOpen={showForm}
//           onClose={() => setShowForm(false)}
//           onSuccess={handleFormSuccess}
//           reservation={editingReservation}
//           mode={formMode}
//         />

//         {showModal && selectedReservation && (
//           <div className="modal-overlay" onClick={() => setShowModal(false)}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-header">
//                 <h3>
//                   <i className="bi bi-calendar-check"></i>
//                   Détails de la réservation #{selectedReservation.id}
//                 </h3>
//                 <button className="modal-close" onClick={() => setShowModal(false)}>
//                   <i className="bi bi-x-lg"></i>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <div className="details-grid">
//                   <div className="detail-group">
//                     <label><i className="bi bi-briefcase"></i> Service</label>
//                     <p className="detail-value">{selectedReservation.service?.nom || "-"}</p>
//                   </div>
//                   <div className="detail-group">
//                     <label><i className="bi bi-currency-franc"></i> Prix</label>
//                     <p className="detail-value price">{formatPrice(selectedReservation.service?.prix || 0)}</p>
//                   </div>
//                   <div className="detail-group">
//                     <label><i className="bi bi-person"></i> Demandeur</label>
//                     <div className="detail-person">
//                       <div className="person-name">
//                         {selectedReservation.demandeur?.prenom} {selectedReservation.demandeur?.nom}
//                       </div>
//                       <div className="person-contact">
//                         <i className="bi bi-envelope"></i> {selectedReservation.demandeur?.email}
//                       </div>
//                       <div className="person-contact">
//                         <i className="bi bi-telephone"></i> {selectedReservation.demandeur?.telephone || "Non renseigné"}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="detail-group">
//                     <label><i className="bi bi-person-badge"></i> Prestataire</label>
//                     <div className="detail-person">
//                       <div className="person-name">
//                         {selectedReservation.prestataire?.prenom} {selectedReservation.prestataire?.nom}
//                       </div>
//                       <div className="person-contact">
//                         <i className="bi bi-envelope"></i> {selectedReservation.prestataire?.email}
//                       </div>
//                       <div className="person-contact">
//                         <i className="bi bi-telephone"></i> {selectedReservation.prestataire?.telephone || "Non renseigné"}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="detail-group">
//                     <label><i className="bi bi-calendar-event"></i> Date de début</label>
//                     <p className="detail-value">{formatDate(selectedReservation.date_debut)}</p>
//                   </div>
//                   {selectedReservation.date_fin && (
//                     <div className="detail-group">
//                       <label><i className="bi bi-calendar-event"></i> Date de fin</label>
//                       <p className="detail-value">{formatDate(selectedReservation.date_fin)}</p>
//                     </div>
//                   )}
//                   <div className="detail-group">
//                     <label><i className="bi bi-tag"></i> Statut actuel</label>
//                     <select 
//                       value={selectedReservation.statut}
//                       onChange={(e) => handleUpdateStatut(selectedReservation.id, e.target.value)}
//                       disabled={updating}
//                       className="status-select"
//                     >
//                       <option value="en_attente">📋 En attente</option>
//                       <option value="confirmee">✅ Confirmée</option>
//                       <option value="terminee">🏁 Terminée</option>
//                       <option value="annulee">❌ Annulée</option>
//                     </select>
//                     {updating && <span className="updating-spinner"><i className="bi bi-arrow-repeat spin"></i> Mise à jour...</span>}
//                   </div>
//                   {(selectedReservation.commentaire || selectedReservation.message) && (
//                     <div className="detail-group full-width">
//                       <label><i className="bi bi-chat"></i> Commentaire</label>
//                       <div className="commentaire-text">
//                         <i className="bi bi-quote"></i>
//                         {selectedReservation.commentaire || selectedReservation.message}
//                       </div>
//                     </div>
//                   )}
//                   <div className="detail-group">
//                     <label><i className="bi bi-clock"></i> Date de création</label>
//                     <p className="detail-value">{new Date(selectedReservation.created_at).toLocaleString('fr-FR')}</p>
//                   </div>
//                   {selectedReservation.updated_at && (
//                     <div className="detail-group">
//                       <label><i className="bi bi-pencil"></i> Dernière modification</label>
//                       <p className="detail-value">{new Date(selectedReservation.updated_at).toLocaleString('fr-FR')}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn-secondary" onClick={() => setShowModal(false)}>
//                   <i className="bi bi-x-lg"></i> Fermer
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .reservations-manager {
//           padding: 2rem;
//           background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//           min-height: 100vh;
//           position: relative;
//         }

//         .error-banner {
//           background: #fef3c7;
//           border-left: 4px solid #d97706;
//           padding: 1rem 1.5rem;
//           border-radius: 12px;
//           margin-bottom: 1.5rem;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           color: #92400e;
//         }

//         .error-banner i {
//           font-size: 1.25rem;
//           color: #d97706;
//         }

//         .notification {
//           position: fixed;
//           top: 20px;
//           right: 20px;
//           padding: 1rem 1.5rem;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           z-index: 10000;
//           animation: slideIn 0.3s ease;
//           box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
//           font-weight: 500;
//         }

//         .notification-success {
//           background: linear-gradient(135deg, #10b981, #059669);
//           color: white;
//         }

//         .notification-error {
//           background: linear-gradient(135deg, #ef4444, #dc2626);
//           color: white;
//         }

//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         .loading-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 400px;
//         }

//         .spinner {
//           width: 50px;
//           height: 50px;
//           border: 3px solid #e2e8f0;
//           border-top-color: #354dd4;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .spinner-small {
//           display: inline-block;
//           width: 16px;
//           height: 16px;
//           border: 2px solid #fff;
//           border-top-color: transparent;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//           margin-right: 8px;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .page-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 2rem;
//         }

//         .header-left h1 {
//           font-size: 1.875rem;
//           font-weight: 700;
//           color: #1e293b;
//           margin-bottom: 0.5rem;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .header-left p {
//           color: #64748b;
//         }

//         .btn-create {
//           padding: 0.75rem 1.5rem;
//           background: #354dd4;
//           color: white;
//           border: none;
//           border-radius: 10px;
//           font-weight: 500;
//           cursor: pointer;
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           transition: all 0.2s;
//         }

//         .btn-create:hover {
//           background: #1e40af;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(53, 77, 212, 0.3);
//         }

//         .stats-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 1rem;
//           margin-bottom: 2rem;
//         }

//         .stat-card {
//           background: white;
//           border-radius: 16px;
//           padding: 1.5rem;
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//           transition: transform 0.2s, box-shadow 0.2s;
//         }

//         .stat-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         }

//         .stat-icon {
//           width: 52px;
//           height: 52px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.5rem;
//         }

//         .stat-card:not(.stat-warning):not(.stat-success):not(.stat-info):not(.stat-danger):not(.stat-primary) .stat-icon {
//           background: #eef2ff;
//           color: #354dd4;
//         }

//         .stat-warning .stat-icon {
//           background: #fef3c7;
//           color: #d97706;
//         }

//         .stat-success .stat-icon {
//           background: #dcfce7;
//           color: #10b981;
//         }

//         .stat-info .stat-icon {
//           background: #dbeafe;
//           color: #3b82f6;
//         }

//         .stat-danger .stat-icon {
//           background: #fee2e2;
//           color: #ef4444;
//         }

//         .stat-primary .stat-icon {
//           background: linear-gradient(135deg, #354dd4, #1e40af);
//           color: white;
//         }

//         .stat-info h3 {
//           font-size: 1.5rem;
//           font-weight: 700;
//           margin: 0;
//           color: #1e293b;
//         }

//         .stat-info p {
//           margin: 0;
//           color: #64748b;
//           font-size: 0.875rem;
//         }

//         .filters-bar {
//           background: white;
//           border-radius: 16px;
//           padding: 1rem;
//           margin-bottom: 1.5rem;
//           display: flex;
//           gap: 1rem;
//           flex-wrap: wrap;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//         }

//         .search-wrapper {
//           flex: 1;
//           position: relative;
//         }

//         .search-wrapper i {
//           position: absolute;
//           left: 1rem;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #94a3b8;
//         }

//         .search-wrapper input {
//           width: 100%;
//           padding: 0.75rem 2.5rem 0.75rem 2.5rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 12px;
//           font-size: 0.875rem;
//           transition: all 0.2s;
//         }

//         .search-wrapper input:focus {
//           outline: none;
//           border-color: #354dd4;
//           box-shadow: 0 0 0 3px rgba(53, 77, 212, 0.1);
//         }

//         .clear-search {
//           position: absolute;
//           right: 0.75rem;
//           top: 50%;
//           transform: translateY(-50%);
//           background: none;
//           border: none;
//           color: #94a3b8;
//           cursor: pointer;
//           padding: 0.25rem;
//         }

//         .status-filters {
//           display: flex;
//           gap: 0.5rem;
//           flex-wrap: wrap;
//         }

//         .status-filter-btn {
//           padding: 0.5rem 1rem;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           border-radius: 10px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           font-size: 0.875rem;
//           transition: all 0.2s;
//         }

//         .status-filter-btn:hover {
//           border-color: #354dd4;
//           color: #354dd4;
//         }

//         .status-filter-btn.active {
//           background: #354dd4;
//           color: white;
//           border-color: #354dd4;
//         }

//         .status-filter-btn .count {
//           background: rgba(0,0,0,0.1);
//           padding: 0.125rem 0.5rem;
//           border-radius: 20px;
//           font-size: 0.7rem;
//           font-weight: 600;
//         }

//         .status-filter-btn.active .count {
//           background: rgba(255,255,255,0.2);
//         }

//         .table-wrapper {
//           background: white;
//           border-radius: 16px;
//           overflow-x: auto;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//         }

//         .reservations-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .reservations-table th,
//         .reservations-table td {
//           padding: 1rem;
//           text-align: left;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .reservations-table th {
//           background: #f8fafc;
//           font-weight: 600;
//           color: #475569;
//           font-size: 0.875rem;
//         }

//         .reservations-table tbody tr:hover {
//           background: #f8fafc;
//         }

//         .reservation-id {
//           font-weight: 600;
//           color: #354dd4;
//         }

//         .service-info {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .service-thumb {
//           width: 32px;
//           height: 32px;
//           border-radius: 8px;
//           object-fit: cover;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .user-avatar {
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           object-fit: cover;
//         }

//         .user-name {
//           font-weight: 500;
//           color: #1e293b;
//         }

//         .user-contact {
//           font-size: 0.7rem;
//           color: #94a3b8;
//         }

//         .price {
//           font-weight: 600;
//           color: #10b981;
//         }

//         .status-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.35rem 0.85rem;
//           border-radius: 20px;
//           font-size: 0.75rem;
//           font-weight: 600;
//         }

//         .statut-confirmee {
//           background: #dcfce7;
//           color: #166534;
//         }

//         .statut-terminee {
//           background: #dbeafe;
//           color: #1e40af;
//         }

//         .statut-annulee {
//           background: #fee2e2;
//           color: #991b1b;
//         }

//         .statut-attente {
//           background: #fef3c7;
//           color: #92400e;
//         }

//         .action-buttons {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .action-btn {
//           width: 34px;
//           height: 34px;
//           border-radius: 10px;
//           border: none;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s;
//         }

//         .view-btn {
//           background: #eef2ff;
//           color: #354dd4;
//         }

//         .view-btn:hover {
//           background: #354dd4;
//           color: white;
//           transform: scale(1.05);
//         }

//         .edit-btn {
//           background: #dbeafe;
//           color: #3b82f6;
//         }

//         .edit-btn:hover {
//           background: #3b82f6;
//           color: white;
//           transform: scale(1.05);
//         }

//         .delete-btn {
//           background: #fee2e2;
//           color: #ef4444;
//         }

//         .delete-btn:hover {
//           background: #ef4444;
//           color: white;
//           transform: scale(1.05);
//         }

//         .empty-state {
//           text-align: center;
//           padding: 4rem;
//           background: white;
//           border-radius: 16px;
//         }

//         .empty-state i {
//           font-size: 4rem;
//           color: #cbd5e1;
//           margin-bottom: 1rem;
//         }

//         .empty-state h3 {
//           margin-bottom: 0.5rem;
//           color: #1e293b;
//         }

//         .empty-state p {
//           color: #64748b;
//         }

//         .reset-filters-btn {
//           margin-top: 1.5rem;
//           padding: 0.5rem 1rem;
//           background: #f1f5f9;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .pagination {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 0.5rem;
//           margin-top: 1.5rem;
//         }

//         .pagination-btn {
//           padding: 0.5rem 1rem;
//           border: 1px solid #e2e8f0;
//           background: white;
//           border-radius: 10px;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .pagination-btn:hover:not(:disabled) {
//           background: #354dd4;
//           color: white;
//           border-color: #354dd4;
//         }

//         .pagination-btn:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .pagination-pages {
//           display: flex;
//           gap: 0.25rem;
//         }

//         .pagination-page {
//           width: 36px;
//           height: 36px;
//           border: 1px solid #e2e8f0;
//           background: white;
//           border-radius: 10px;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .pagination-page:hover {
//           border-color: #354dd4;
//           color: #354dd4;
//         }

//         .pagination-page.active {
//           background: #354dd4;
//           color: white;
//           border-color: #354dd4;
//         }

//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0,0,0,0.5);
//           backdrop-filter: blur(4px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           animation: fadeIn 0.2s ease;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         .modal-content {
//           background: white;
//           border-radius: 24px;
//           width: 90%;
//           max-width: 800px;
//           max-height: 85vh;
//           overflow-y: auto;
//           animation: slideUp 0.3s ease;
//         }

//         .form-modal {
//           max-width: 700px;
//         }

//         @keyframes slideUp {
//           from {
//             transform: translateY(30px);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 1.5rem;
//           border-bottom: 1px solid #e2e8f0;
//           position: sticky;
//           top: 0;
//           background: white;
//           z-index: 1;
//         }

//         .modal-header h3 {
//           margin: 0;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           color: #1e293b;
//         }

//         .modal-close {
//           background: none;
//           border: none;
//           font-size: 1.25rem;
//           cursor: pointer;
//           color: #94a3b8;
//           transition: color 0.2s;
//         }

//         .modal-close:hover {
//           color: #ef4444;
//         }

//         .modal-body {
//           padding: 1.5rem;
//         }

//         .modal-footer {
//           padding: 1rem 1.5rem;
//           border-top: 1px solid #e2e8f0;
//           display: flex;
//           justify-content: flex-end;
//           gap: 0.75rem;
//         }

//         .reservation-form {
//           display: flex;
//           flex-direction: column;
//         }

//         .form-body {
//           padding: 1.5rem;
//         }

//         .form-error {
//           background: #fee2e2;
//           color: #991b1b;
//           padding: 0.75rem 1rem;
//           border-radius: 10px;
//           margin-bottom: 1.5rem;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .form-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 1.25rem;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         .form-group.full-width {
//           grid-column: span 2;
//         }

//         .form-group label {
//           font-size: 0.875rem;
//           font-weight: 500;
//           color: #1e293b;
//         }

//         .form-group select,
//         .form-group input,
//         .form-group textarea {
//           padding: 0.75rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 0.875rem;
//           transition: all 0.2s;
//           font-family: inherit;
//         }

//         .form-group select:focus,
//         .form-group input:focus,
//         .form-group textarea:focus {
//           outline: none;
//           border-color: #354dd4;
//           box-shadow: 0 0 0 3px rgba(53, 77, 212, 0.1);
//         }

//         .form-group textarea {
//           resize: vertical;
//           min-height: 80px;
//         }

//         .details-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 1.5rem;
//         }

//         .detail-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         .detail-group.full-width {
//           grid-column: span 2;
//         }

//         .detail-group label {
//           font-size: 0.7rem;
//           font-weight: 600;
//           color: #64748b;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .detail-value {
//           font-size: 0.95rem;
//           color: #1e293b;
//           margin: 0;
//         }

//         .detail-value.price {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #10b981;
//         }

//         .detail-person {
//           background: #f8fafc;
//           padding: 0.75rem;
//           border-radius: 12px;
//         }

//         .person-name {
//           font-weight: 600;
//           color: #1e293b;
//           margin-bottom: 0.25rem;
//         }

//         .person-contact {
//           font-size: 0.75rem;
//           color: #64748b;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           margin-top: 0.25rem;
//         }

//         .status-select {
//           padding: 0.6rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 0.875rem;
//           background: white;
//           cursor: pointer;
//         }

//         .status-select:focus {
//           outline: none;
//           border-color: #354dd4;
//         }

//         .updating-spinner {
//           font-size: 0.7rem;
//           color: #354dd4;
//           margin-top: 0.25rem;
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//         }

//         .spin {
//           animation: spin 1s linear infinite;
//         }

//         .commentaire-text {
//           background: #f8fafc;
//           padding: 1rem;
//           border-radius: 12px;
//           font-style: italic;
//           color: #475569;
//           display: flex;
//           gap: 0.5rem;
//         }

//         .commentaire-text i {
//           color: #94a3b8;
//         }

//         .btn-secondary {
//           padding: 0.6rem 1.5rem;
//           background: #f1f5f9;
//           border: none;
//           border-radius: 10px;
//           cursor: pointer;
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           transition: all 0.2s;
//         }

//         .btn-secondary:hover {
//           background: #e2e8f0;
//         }

//         .btn-primary {
//           padding: 0.6rem 1.5rem;
//           background: #354dd4;
//           color: white;
//           border: none;
//           border-radius: 10px;
//           cursor: pointer;
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           transition: all 0.2s;
//         }

//         .btn-primary:hover:not(:disabled) {
//           background: #1e40af;
//         }

//         .btn-primary:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         @media (max-width: 768px) {
//           .reservations-manager {
//             padding: 1rem;
//           }

//           .page-header {
//             flex-direction: column;
//             gap: 1rem;
//           }

//           .stats-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }

//           .filters-bar {
//             flex-direction: column;
//           }

//           .status-filters {
//             justify-content: center;
//           }

//           .details-grid {
//             grid-template-columns: 1fr;
//           }

//           .form-grid {
//             grid-template-columns: 1fr;
//           }

//           .form-group.full-width {
//             grid-column: span 1;
//           }

//           .detail-group.full-width {
//             grid-column: span 1;
//           }

//           .modal-content {
//             width: 95%;
//             max-height: 90vh;
//           }

//           .reservations-table th,
//           .reservations-table td {
//             padding: 0.75rem;
//             font-size: 0.8rem;
//           }

//           .action-buttons {
//             flex-direction: column;
//           }
//         }
//       `}</style>
//     </DashboardLayout>
//   );
// };

// export default ReservationsAdmin;


// src/pages/admin/ReservationsAdmin.tsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";

interface Reservation {
  id: number;
  service_id: number;
  demandeur_id: number;
  prestataire_id: number;
  date_debut: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  created_at: string;
  service?: {
    id: number;
    nom: string;
    prix: number;
    categorie?: string;
  };
  demandeur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
}

const ReservationsAdmin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatut, setSelectedStatut] = useState<string>("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "status" | "service">("date");
  const [showStats, setShowStats] = useState(true);

  // Initialisation des données
  useEffect(() => {
    try {
      const savedReservations = localStorage.getItem("reservations");
      if (savedReservations) {
        try {
          const parsed = JSON.parse(savedReservations);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReservations(parsed);
            setFilteredReservations(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Erreur de parsing:", e);
        }
      }
      initializeDefaultReservations();
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      setError("Erreur lors du chargement des réservations");
      setLoading(false);
    }
  }, []);

  const initializeDefaultReservations = () => {
    const defaultReservations: Reservation[] = [
      {
        id: 1,
        service_id: 1,
        demandeur_id: 1,
        prestataire_id: 2,
        date_debut: new Date(Date.now() + 86400000 * 2).toISOString(),
        statut: "confirmee",
        commentaire: "Première séance prévue à 14h",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        service: {
          id: 1,
          nom: "Cours de Mathématiques",
          prix: 15000,
          categorie: "Éducation"
        },
        demandeur: {
          id: 1,
          nom: "Diop",
          prenom: "Ahmadou",
          email: "ahmadou.diop@kayjob.com",
          telephone: "+221 77 123 45 67",
          avatar: "👨‍💼"
        },
        prestataire: {
          id: 2,
          nom: "Fall",
          prenom: "Fatou",
          email: "fatou.fall@kayjob.com",
          telephone: "+221 78 987 65 43",
          avatar: "👩‍🏫"
        }
      },
      {
        id: 2,
        service_id: 2,
        demandeur_id: 3,
        prestataire_id: 4,
        date_debut: new Date(Date.now() + 86400000 * 5).toISOString(),
        statut: "en_attente",
        commentaire: "Besoin d'une intervention urgente",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        service: {
          id: 2,
          nom: "Plomberie Générale",
          prix: 25000,
          categorie: "Bricolage"
        },
        demandeur: {
          id: 3,
          nom: "Ndiaye",
          prenom: "Moussa",
          email: "moussa.ndiaye@kayjob.com",
          telephone: "+221 76 456 78 90",
          avatar: "👨‍🔧"
        },
        prestataire: {
          id: 4,
          nom: "Sow",
          prenom: "Aminata",
          email: "aminata.sow@kayjob.com",
          telephone: "+221 77 789 01 23",
          avatar: "👩‍🔧"
        }
      },
      {
        id: 3,
        service_id: 3,
        demandeur_id: 5,
        prestataire_id: 6,
        date_debut: new Date(Date.now() - 86400000 * 1).toISOString(),
        statut: "terminee",
        commentaire: "Très satisfait du service",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        service: {
          id: 3,
          nom: "Cours de Yoga",
          prix: 12000,
          categorie: "Bien-être"
        },
        demandeur: {
          id: 5,
          nom: "Ba",
          prenom: "Mamadou",
          email: "mamadou.ba@kayjob.com",
          telephone: "+221 70 234 56 78",
          avatar: "👨‍💻"
        },
        prestataire: {
          id: 6,
          nom: "Diallo",
          prenom: "Mariama",
          email: "mariama.diallo@kayjob.com",
          telephone: "+221 78 345 67 89",
          avatar: "🧘‍♀️"
        }
      },
      {
        id: 4,
        service_id: 4,
        demandeur_id: 1,
        prestataire_id: 5,
        date_debut: new Date(Date.now() + 86400000 * 8).toISOString(),
        statut: "en_attente",
        commentaire: "À confirmer avant le 15",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        service: {
          id: 4,
          nom: "Couture sur Mesure",
          prix: 18000,
          categorie: "Mode"
        },
        demandeur: {
          id: 1,
          nom: "Diop",
          prenom: "Ahmadou",
          email: "ahmadou.diop@kayjob.com",
          telephone: "+221 77 123 45 67",
          avatar: "👨‍💼"
        },
        prestataire: {
          id: 5,
          nom: "Ba",
          prenom: "Mamadou",
          email: "mamadou.ba@kayjob.com",
          telephone: "+221 70 234 56 78",
          avatar: "👨‍🎨"
        }
      },
      {
        id: 5,
        service_id: 5,
        demandeur_id: 2,
        prestataire_id: 3,
        date_debut: new Date(Date.now() - 86400000 * 15).toISOString(),
        statut: "annulee",
        commentaire: "Annulé par le demandeur",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        service: {
          id: 5,
          nom: "Réparation Informatique",
          prix: 20000,
          categorie: "Technologie"
        },
        demandeur: {
          id: 2,
          nom: "Fall",
          prenom: "Fatou",
          email: "fatou.fall@kayjob.com",
          telephone: "+221 78 987 65 43",
          avatar: "👩‍💻"
        },
        prestataire: {
          id: 3,
          nom: "Ndiaye",
          prenom: "Moussa",
          email: "moussa.ndiaye@kayjob.com",
          telephone: "+221 76 456 78 90",
          avatar: "👨‍💻"
        }
      }
    ];
    setReservations(defaultReservations);
    setFilteredReservations(defaultReservations);
    localStorage.setItem("reservations", JSON.stringify(defaultReservations));
    setLoading(false);
  };

  // Filtrage et tri
  useEffect(() => {
    try {
      let result = [...reservations];

      // Recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(
          (r) =>
            r.service?.nom?.toLowerCase().includes(searchLower) ||
            r.demandeur?.prenom?.toLowerCase().includes(searchLower) ||
            r.demandeur?.nom?.toLowerCase().includes(searchLower) ||
            r.prestataire?.prenom?.toLowerCase().includes(searchLower) ||
            r.prestataire?.nom?.toLowerCase().includes(searchLower) ||
            r.service?.categorie?.toLowerCase().includes(searchLower)
        );
      }

      // Filtre par statut
      if (selectedStatut !== "tous") {
        result = result.filter((r) => r.statut === selectedStatut);
      }

      // Tri
      if (sortBy === "date") {
        result.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
      } else if (sortBy === "status") {
        const statusOrder = { en_attente: 0, confirmee: 1, terminee: 2, annulee: 3 };
        result.sort((a, b) => statusOrder[a.statut] - statusOrder[b.statut]);
      } else if (sortBy === "service") {
        result.sort((a, b) => (a.service?.nom || "").localeCompare(b.service?.nom || ""));
      }

      setFilteredReservations(result);
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  }, [searchTerm, selectedStatut, sortBy, reservations]);

  // Sauvegarde automatique
  useEffect(() => {
    if (reservations.length > 0) {
      try {
        localStorage.setItem("reservations", JSON.stringify(reservations));
      } catch (err) {
        console.error("Erreur de sauvegarde:", err);
      }
    }
  }, [reservations]);

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case "confirmee": return "statut-confirmee";
      case "terminee": return "statut-terminee";
      case "annulee": return "statut-annulee";
      default: return "statut-attente";
    }
  };

  const getStatutTexte = (statut: string) => {
    switch (statut) {
      case "confirmee": return "Confirmée";
      case "terminee": return "Terminée";
      case "annulee": return "Annulée";
      default: return "En attente";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "confirmee": return "✅";
      case "terminee": return "🏁";
      case "annulee": return "❌";
      default: return "⏳";
    }
  };

  const handleUpdateStatut = async (id: number, newStatut: string) => {
    try {
      setUpdating(true);
      
      setReservations(prev =>
        prev.map(r =>
          r.id === id ? { ...r, statut: newStatut as any } : r
        )
      );
      
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation({ ...selectedReservation, statut: newStatut as any });
      }
      
      showNotification(`Statut mis à jour: ${getStatutTexte(newStatut)}`, "success");
      
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la mise à jour", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const reservationToDelete = reservations.find(r => r.id === id);
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la réservation #${id} ?`)) return;
    
    try {
      setReservations(prev => prev.filter(r => r.id !== id));
      if (selectedReservation && selectedReservation.id === id) {
        setShowModal(false);
        setSelectedReservation(null);
      }
      showNotification("Réservation supprimée avec succès", "success");
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "confirmee": return "#16a34a";
      case "terminee": return "#3b82f6";
      case "annulee": return "#ef4444";
      default: return "#d97706";
    }
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    try {
      const notification = document.createElement("div");
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        background: ${type === "success" ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #dc2626, #ef4444)"};
        animation: slideIn 0.3s ease;
        max-width: 400px;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        notification.style.transition = "all 0.3s ease";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    } catch (err) {
      console.error("Erreur de notification:", err);
    }
  };

  const stats = {
    total: reservations.length,
    en_attente: reservations.filter(r => r.statut === "en_attente").length,
    confirmees: reservations.filter(r => r.statut === "confirmee").length,
    terminees: reservations.filter(r => r.statut === "terminee").length,
    annulees: reservations.filter(r => r.statut === "annulee").length,
    total_prix: reservations.reduce((acc, r) => acc + (r.service?.prix || 0), 0),
  };

  if (error) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ padding: "24px" }}>
          <div style={{ 
            background: "#fee2e2", 
            color: "#dc2626", 
            padding: "16px 24px", 
            borderRadius: "12px",
            border: "1px solid #fecaca"
          }}>
            <h3 style={{ margin: "0 0 8px 0" }}>⚠️ Erreur</h3>
            <p style={{ margin: 0 }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "400px", 
          gap: "16px" 
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#4F46E5",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}></div>
          <p>Chargement des réservations...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* En-tête */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          marginBottom: "32px", 
          flexWrap: "wrap", 
          gap: "16px" 
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: "#1a202c", 
              margin: "0 0 4px 0", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px" 
            }}>
              <span style={{ fontSize: "32px" }}>📅</span>
              Gestion des Réservations
            </h1>
            <p style={{ color: "#718096", fontSize: "15px", margin: 0 }}>
              Gérez toutes les réservations de la plateforme KayJob
            </p>
          </div>
          <button 
            onClick={() => setShowStats(!showStats)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "white",
              color: "#4a5568",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            <span>📊</span>
            {showStats ? "Cacher" : "Voir"} les statistiques
          </button>
        </div>

        {/* Statistiques */}
        {showStats && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px"
            }}>
              {[
                { label: "Total", value: stats.total, icon: "📊", color: "#eff6ff", textColor: "#3b82f6" },
                { label: "En attente", value: stats.en_attente, icon: "⏳", color: "#fef3c7", textColor: "#d97706" },
                { label: "Confirmées", value: stats.confirmees, icon: "✅", color: "#dcfce7", textColor: "#16a34a" },
                { label: "Terminées", value: stats.terminees, icon: "🏁", color: "#e0f2fe", textColor: "#3b82f6" },
                { label: "Annulées", value: stats.annulees, icon: "❌", color: "#fee2e2", textColor: "#ef4444" }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  background: stat.color,
                  borderRadius: "12px"
                }}>
                  <div style={{
                    fontSize: "24px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    borderRadius: "10px"
                  }}>{stat.icon}</div>
                  <div>
                    <h3 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: stat.textColor }}>
                      {stat.value}
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f1f5f9",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center"
        }}>
          <div style={{
            flex: 1,
            minWidth: "200px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f8fafc",
            padding: "0 16px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Rechercher par service, demandeur ou prestataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                background: "none",
                outline: "none",
                fontSize: "14px"
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a0aec0",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { value: "tous", label: `Tous (${stats.total})` },
              { value: "en_attente", label: `⏳ En attente (${stats.en_attente})` },
              { value: "confirmee", label: `✅ Confirmées (${stats.confirmees})` },
              { value: "terminee", label: `🏁 Terminées (${stats.terminees})` },
              { value: "annulee", label: `❌ Annulées (${stats.annulees})` }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatut(filter.value)}
                style={{
                  padding: "8px 16px",
                  background: selectedStatut === filter.value ? "#4F46E5" : "#f8fafc",
                  color: selectedStatut === filter.value ? "white" : "#1e293b",
                  border: selectedStatut === filter.value ? "1px solid #4F46E5" : "1px solid #e2e8f0",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "8px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            <option value="date">📅 Trier par date</option>
            <option value="status">📊 Trier par statut</option>
            <option value="service">📌 Trier par service</option>
          </select>
        </div>

        {/* Résultats */}
        <div style={{ fontSize: "14px", color: "#718096", marginBottom: "16px" }}>
          <span>
            {filteredReservations.length} réservation{filteredReservations.length > 1 ? "s" : ""} trouvée{filteredReservations.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Tableau des réservations */}
        {filteredReservations.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "48px 20px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9"
          }}>
            <span style={{ fontSize: "48px", opacity: "0.5" }}>📭</span>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "8px 0 4px 0", color: "#475569" }}>
              Aucune réservation trouvée
            </p>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>
              {searchTerm ? "Essayez avec d'autres critères" : "Aucune réservation disponible"}
            </span>
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflowX: "auto",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "800px"
            }}>
              <thead>
                <tr style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0"
                }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>ID</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Service</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Demandeur</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Prestataire</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Montant</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Statut</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} style={{
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  >
                    <td style={{ padding: "16px 20px", fontWeight: "600", color: "#1a202c" }}>
                      #{reservation.id}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div>
                        <div style={{ fontWeight: "500", color: "#1a202c" }}>
                          {reservation.service?.nom || "-"}
                        </div>
                        {reservation.service?.categorie && (
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {reservation.service.categorie}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px" }}>{reservation.demandeur?.avatar || "👤"}</span>
                        <div>
                          <div style={{ fontWeight: "500", color: "#1a202c" }}>
                            {reservation.demandeur?.prenom} {reservation.demandeur?.nom}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {reservation.demandeur?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px" }}>{reservation.prestataire?.avatar || "👤"}</span>
                        <div>
                          <div style={{ fontWeight: "500", color: "#1a202c" }}>
                            {reservation.prestataire?.prenom} {reservation.prestataire?.nom}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {reservation.prestataire?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: "13px", color: "#475569" }}>
                      {formatDate(reservation.date_debut)}
                    </td>
                    <td style={{ padding: "16px 20px", fontWeight: "600", color: "#1a202c" }}>
                      {reservation.service?.prix?.toLocaleString()} FCFA
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: reservation.statut === "confirmee" ? "#dcfce7" :
                                  reservation.statut === "terminee" ? "#e0f2fe" :
                                  reservation.statut === "annulee" ? "#fee2e2" : "#fef3c7",
                        color: reservation.statut === "confirmee" ? "#16a34a" :
                               reservation.statut === "terminee" ? "#3b82f6" :
                               reservation.statut === "annulee" ? "#ef4444" : "#d97706"
                      }}>
                        <span>{getStatutIcon(reservation.statut)}</span>
                        {getStatutTexte(reservation.statut)}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button 
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowModal(true);
                          }}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#eef2ff",
                            color: "#4F46E5",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            transition: "all 0.3s ease"
                          }}
                          title="Voir détails"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleDelete(reservation.id)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#fee2e2",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            transition: "all 0.3s ease"
                          }}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Détails */}
        {showModal && selectedReservation && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }} onClick={() => setShowModal(false)}>
            <div style={{
              background: "white",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto"
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 32px",
                borderBottom: "1px solid #f1f5f9"
              }}>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1a202c",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "24px" }}>📋</span>
                  Réservation #{selectedReservation.id}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "none",
                    background: "#f1f5f9",
                    borderRadius: "50%",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b"
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: "32px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Service</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "500" }}>
                      {selectedReservation.service?.nom || "-"}
                    </p>
                    {selectedReservation.service?.categorie && (
                      <small style={{ color: "#94a3b8" }}>{selectedReservation.service.categorie}</small>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Prix</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "600" }}>
                      {selectedReservation.service?.prix?.toLocaleString()} FCFA
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Demandeur</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{selectedReservation.demandeur?.avatar || "👤"}</span>
                      <div>
                        <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "500" }}>
                          {selectedReservation.demandeur?.prenom} {selectedReservation.demandeur?.nom}
                        </p>
                        <small style={{ color: "#94a3b8", display: "block" }}>{selectedReservation.demandeur?.email}</small>
                        <small style={{ color: "#94a3b8" }}>{selectedReservation.demandeur?.telephone}</small>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Prestataire</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{selectedReservation.prestataire?.avatar || "👤"}</span>
                      <div>
                        <p style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "500" }}>
                          {selectedReservation.prestataire?.prenom} {selectedReservation.prestataire?.nom}
                        </p>
                        <small style={{ color: "#94a3b8", display: "block" }}>{selectedReservation.prestataire?.email}</small>
                        <small style={{ color: "#94a3b8" }}>{selectedReservation.prestataire?.telephone}</small>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date de début</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                      {formatDate(selectedReservation.date_debut)}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Statut</label>
                    <select 
                      value={selectedReservation.statut}
                      onChange={(e) => handleUpdateStatut(selectedReservation.id, e.target.value)}
                      disabled={updating}
                      style={{
                        padding: "8px 12px",
                        border: `2px solid ${getStatusColor(selectedReservation.statut)}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        background: "white",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="en_attente">⏳ En attente</option>
                      <option value="confirmee">✅ Confirmée</option>
                      <option value="terminee">🏁 Terminée</option>
                      <option value="annulee">❌ Annulée</option>
                    </select>
                  </div>

                  {selectedReservation.commentaire && (
                    <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Commentaire</label>
                      <div style={{
                        background: "#f8fafc",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontStyle: "italic",
                        color: "#475569"
                      }}>
                        {selectedReservation.commentaire}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date de création</label>
                    <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                      {new Date(selectedReservation.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                padding: "20px 32px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafbfc",
                borderRadius: "0 0 20px 20px"
              }}>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 24px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: "pointer"
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ReservationsAdmin;
