interface Props {

  reservations:any[];

  onView:(reservation:any)=>void;

  onDelete:(id:number)=>void;

  onStatusChange:(
    id:number,
    status:string
  )=>void;
}

const ReservationsTable = ({
  reservations,
  onView,
  onDelete,
  onStatusChange,
}:Props) => {

  return (

    <div className="table-responsive">

      <table className="table table-hover">

        <thead>

          <tr>

            <th>ID</th>

            <th>Service</th>

            <th>Client</th>

            <th>Date</th>

            <th>Statut</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {reservations.map(
            (reservation:any)=>(
            <tr
              key={reservation.id}
            >

              <td>
                {reservation.id}
              </td>

              <td>
                {reservation.service?.titre}
              </td>

              <td>
                {reservation.demandeur?.nom}
              </td>

              <td>
                {reservation.date_reservation}
              </td>

              <td>

                <select
                  className="form-select"
                  value={
                    reservation.status
                  }
                  onChange={(e)=>
                    onStatusChange(
                      reservation.id,
                      e.target.value
                    )
                  }
                >

                  <option value="en_attente">
                    En attente
                  </option>

                  <option value="acceptee">
                    Acceptée
                  </option>

                  <option value="terminee">
                    Terminée
                  </option>

                  <option value="annulee">
                    Annulée
                  </option>

                </select>

              </td>

              <td>

                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() =>
                    onView(
                      reservation
                    )
                  }
                >
                  Voir
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    onDelete(
                      reservation.id
                    )
                  }
                >
                  Supprimer
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ReservationsTable;