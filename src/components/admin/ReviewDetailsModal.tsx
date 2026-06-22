interface Avis {
  id: number;
  user: { name: string; email: string };
  service: { titre: string };
  note: number;
  commentaire: string;
  created_at: string;
}

interface ReviewDetailsModalProps {
  review: Avis;
  onClose: () => void; // <- il manquait ça
}

const ReviewDetailsModal = ({ review, onClose }: ReviewDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Détails de l'avis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        
        <div className="space-y-3">
          <p><strong>Client :</strong> {review.user.name}</p>
          <p><strong>Email :</strong> {review.user.email}</p>
          <p><strong>Service :</strong> {review.service.titre}</p>
          <p><strong>Note :</strong> {review.note}/5 ⭐</p>
          <p><strong>Commentaire :</strong> {review.commentaire}</p>
          <p><strong>Date :</strong> {new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ReviewDetailsModal;