
interface Props {
  services: any[];
  onEdit: (service: any) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onView: (service: any) => void;
}

const ServicesTable = ({
  services,
  onEdit,
  onDelete,
  onToggle,
  onView,
}: Props) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Tarif</th>
            <th>Disponibilité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {services.length > 0 ? (
            services.map((service: any) => (
              <tr key={service.id}>
                <td>
                  <img
  src={
    service.photos_url?.[0] ||
    "https://via.placeholder.com/60"
  }
  alt={service.titre}
  width="60"
  height="60"
  style={{
    objectFit: "cover",
    borderRadius: "8px",
  }}
/>
                </td>

                <td>{service.titre}</td>

                <td>
                  {service.categorie?.nom ||
                    service.categorie?.name ||
                    "-"}
                </td>

                <td>{service.tarif} FCFA</td>

                <td>
                  {service.disponibilite ? (
                    <span className="badge bg-success">
                      Disponible
                    </span>
                  ) : (
                    <span className="badge bg-secondary">
                      Indisponible
                    </span>
                  )}
                </td>

                <td>
                  {service.statut === "active" ? (
                    <span className="badge bg-success">
                      Actif
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      Inactif
                    </span>
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => onView(service)}
                  >
                    Voir
                  </button>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => onEdit(service)}
                  >
                    Modifier
                  </button>

                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => onDelete(service.id)}
                  >
                    Supprimer
                  </button>

                  <button
                    className={`btn btn-sm ${
                      service.statut === "active"
                        ? "btn-secondary"
                        : "btn-success"
                    }`}
                    onClick={() => onToggle(service.id)}
                  >
                    {service.statut === "active"
                      ? "Désactiver"
                      : "Activer"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                Aucun service trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;