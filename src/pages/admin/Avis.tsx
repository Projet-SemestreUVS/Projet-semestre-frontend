import { useState, useEffect } from 'react';
import '../../styles/avis.css';

interface User {
  id: number;
  prenom?: string;
  nom?: string;
}

interface Service {
  id: number;
  nom: string;
}

interface Reservation {
  id: number;
  service: Service;
}

interface Avis {
  id: number;
  note: number;
  commentaire: string;
  demandeur: User;
  prestataire: User;
  reservation: Reservation;
  created_at: string;
}

export default function GestionAvis() {
  const [avisList, setAvisList] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');

  useEffect(() => {
    fetch('http://localhost:8000/api/auth/avis', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur chargement avis');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setAvisList(data.data);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cet avis ?')) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/auth/avis/${id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setAvisList((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      alert('Erreur suppression');
    }
  };

  const filteredAvis = avisList.filter((item) => {
    const nomAuteur =
      `${item.demandeur?.prenom ?? ''} ${item.demandeur?.nom ?? ''}`.trim();

    const matchesSearch = nomAuteur
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRating =
      selectedRating === 'all' ||
      item.note === Number(selectedRating);

    return matchesSearch && matchesRating;
  });

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">Erreur : {error}</div>;
  }

  const moyenne =
    avisList.length > 0
      ? (
          avisList.reduce((sum, avis) => sum + avis.note, 0) /
          avisList.length
        ).toFixed(1)
      : '0';

  return (
    <div className="services-page">
      <div className="page-header">
        <h1>Gestion des Avis</h1>
        <h2 style={{ color: "red" }}>TEST ADAMA</h2>
        <p>Consultez, gérez et contrôlez les avis</p>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <h3>{avisList.length}</h3>
          <p>Avis donnés</p>
        </div>

        <div className="stat-box">
          <h3>{moyenne}</h3>
          <p>Note moyenne</p>
        </div>

        <div className="stat-box">
          <h3>{avisList.length}</h3>
          <p>Avis publiés</p>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un auteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="all">Toutes les notes</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>
      </div>

     <div className="table-responsive">
  <table className="table table-striped align-middle">
    <thead className="table-dark">
      <tr>
        <th>Service</th>
        <th>Note</th>
        <th>Commentaire</th>
        <th>Date</th>
        <th>Statut</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredAvis.length > 0 ? (
        filteredAvis.map((item) => (
          <tr key={item.id}>
            <td>
              {item.reservation?.service?.nom || "N/A"}
            </td>

            <td>
              <span className="badge bg-warning text-dark">
                ⭐ {item.note}/5
              </span>
            </td>

            <td>{item.commentaire}</td>

            <td>
              {new Date(item.created_at).toLocaleDateString()}
            </td>

            <td>
              <span className="badge bg-success">
                Publié
              </span>
            </td>

            <td>
              <button className="btn btn-info btn-sm me-2">
                Modifier
              </button>

              <button className="btn btn-warning btn-sm me-2">
                Signaler
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(item.id)}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className="text-center">
            Aucun avis trouvé
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>
);
}