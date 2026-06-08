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
    >

      <div className="modal-dialog modal-lg">

        <div className="modal-content">

          <div className="modal-header">

            <h5>
              Détails du service
            </h5>

            <button
              className="btn-close"
              data-bs-dismiss="modal"
            />

          </div>

          <div className="modal-body">

            <h4>
              {service.titre}
            </h4>

            <hr />

            <p>
              <strong>
                Catégorie :
              </strong>
              {" "}
              {service.categorie?.name}
            </p>

            <p>
              <strong>
                Prestataire :
              </strong>
              {" "}
              {service.user?.nom}
            </p>

            <p>
              <strong>
                Prix :
              </strong>
              {" "}
              {service.prix}
              {" FCFA"}
            </p>

            <p>
              <strong>
                Description :
              </strong>
            </p>

            <p>
              {service.description}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ServiceDetailsModal;