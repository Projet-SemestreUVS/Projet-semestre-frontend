interface Props {
  service: any;
}

const ServiceDetailsModal = ({
  service,
}: Props) => {
  if (!service) return null;

  return (
    <div
      className="modal fade"
      id="serviceDetailsModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              Détails du service
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body">

            {/* Image */}

            {service.photos_url &&
              service.photos_url.length > 0 && (
                <img
                  src={service.photos_url[0]}
                  alt={service.titre}
                  className="img-fluid rounded mb-3"
                />
              )}

            <h3 className="mb-3">
              {service.titre}
            </h3>

            <hr />

            <p>
              <strong>Catégorie :</strong>{" "}
              {service.categorie?.nom ||
                service.categorie?.name ||
                "Non définie"}
            </p>

            <p>
              <strong>Prestataire :</strong>{" "}
              {service.prestataire?.nom ||
                "Non renseigné"}
            </p>

            <p>
              <strong>Tarif :</strong>{" "}
              {service.tarif} FCFA
            </p>

            <p>
              <strong>Disponibilité :</strong>{" "}
              {service.disponibilite
                ? "Disponible"
                : "Indisponible"}
            </p>

            <p>
              <strong>Statut :</strong>{" "}
              {service.statut}
            </p>

            <hr />

            <h5>Description</h5>

            <p>
              {service.description}
            </p>

          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Fermer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;