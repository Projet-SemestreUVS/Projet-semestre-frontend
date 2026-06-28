interface Service {
  id: number;
  categorie_id?: number;
  titre: string;
  description?: string;
  photos_url?: string[];
  tarif: string | number;
  disponibilite?: boolean;
  statut: string;
}

interface Props {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const ServicesTable = ({
  services,
  onEdit,
  onDelete,
  onToggle,
}: Props) => {
  console.log("ServicesTable chargé", services);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Titre</th>
            <th>Tarif</th>
            <th>Disponibilité</th>
            <th>Statut</th>
            <th style={{ width: "250px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {services.length > 0 ? (
            services.map((service) => {
              const firstPhoto =
                service.photos_url &&
                service.photos_url.length > 0
                  ? service.photos_url[0]
                  : null;

              return (
                <tr key={service.id}>
                  <td>
                    {firstPhoto ? (
                      <img
                        src={firstPhoto}
                        alt={service.titre}
                        width="70"
                        height="70"
                        className="border rounded"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span className="text-muted">
                        Aucune image
                      </span>
                    )}
                  </td>

                  <td>
                    <strong>{service.titre}</strong>
                  </td>

                  <td>{service.tarif} FCFA</td>

                  <td>
                    <span
                      className={
                        service.disponibilite
                          ? "badge bg-info"
                          : "badge bg-secondary"
                      }
                    >
                      {service.disponibilite
                        ? "Disponible"
                        : "Indisponible"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        service.statut === "active"
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }
                    >
                      {service.statut === "active"
                        ? "Actif"
                        : "Inactif"}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        console.log(
                          "Bouton Modifier cliqué",
                          service
                        );

                        onEdit(service);
                      }}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Modifier
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => {
                        console.log(
                          "Bouton Statut cliqué",
                          service.id
                        );

                        onToggle(service.id);
                      }}
                    >
                      <i className="bi bi-arrow-repeat me-1"></i>
                      Statut
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        console.log(
                          "Bouton Supprimer cliqué",
                          service.id
                        );

                        onDelete(service.id);
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-4"
              >
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