interface Props {
  reservation:any;
}

const ReservationDetailsModal = ({
  reservation
}:Props) => {

  if(!reservation) return null;

  return (

    <div
      className="modal fade"
      id="reservationDetailsModal"
      tabIndex={-1}
    >

      <div className="modal-dialog modal-lg">

        <div className="modal-content">

          <div className="modal-header">

            <h5>
              Détails Réservation
            </h5>

            <button
              className="btn-close"
              data-bs-dismiss="modal"
            />

          </div>

          <div className="modal-body">

            <p>
              <strong>
                Service :
              </strong>
              {" "}
              {reservation.service?.titre}
            </p>

            <p>
              <strong>
                Demandeur :
              </strong>
              {" "}
              {reservation.demandeur?.nom}
            </p>

            <p>
              <strong>
                Prestataire :
              </strong>
              {" "}
              {reservation.prestataire?.nom}
            </p>

            <p>
              <strong>
                Date :
              </strong>
              {" "}
              {reservation.date_reservation}
            </p>

            <p>
              <strong>
                Montant :
              </strong>
              {" "}
              {reservation.montant}
              FCFA
            </p>

            <p>
              <strong>
                Statut :
              </strong>
              {" "}
              {reservation.status}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ReservationDetailsModal;