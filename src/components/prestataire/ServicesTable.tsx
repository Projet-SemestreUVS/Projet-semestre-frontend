interface Props {

  services:any[];

  onEdit:(service:any)=>void;

  onDelete:(id:number)=>void;

  onToggle:(id:number)=>void;
}

const ServicesTable = ({
  services,
  onEdit,
  onDelete,
  onToggle
}:Props) => {

  return (

    <div className="table-responsive">

      <table className="table">

        <thead>

          <tr>

            <th>Image</th>

            <th>Titre</th>

            <th>Prix</th>

            <th>Statut</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {services.map(
            (service:any)=>(
            <tr key={service.id}>

              <td>

                <img
                  src={service.image_url}
                  alt=""
                  width="60"
                />

              </td>

              <td>
                {service.titre}
              </td>

              <td>
                {service.prix} FCFA
              </td>

              <td>

                <span
                  className={
                    service.actif
                    ? "badge bg-success"
                    : "badge bg-danger"
                  }
                >

                  {
                    service.actif
                    ? "Actif"
                    : "Inactif"
                  }

                </span>

              </td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    onEdit(service)
                  }
                >
                  Modifier
                </button>

                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() =>
                    onToggle(service.id)
                  }
                >
                  Statut
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    onDelete(service.id)
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

export default ServicesTable;