import {
  Link
} from "react-router-dom";

interface Props {
  service:any;
}

const ServiceCard = ({
  service
}:Props) => {

  return (

    <div className="card h-100 shadow-sm border-0">

      <img
        src={service.image_url}
        className="card-img-top"
        alt={service.titre}
        style={{
          height:"220px",
          objectFit:"cover"
        }}
      />

      <div className="card-body">

        <h5>
          {service.titre}
        </h5>

        <p
          className="text-muted"
        >
          {
            service.categorie?.name
          }
        </p>

        <h6
          className="text-primary"
        >
          {service.prix} FCFA
        </h6>

        <Link
          to={`/services/${service.id}`}
          className="
          btn btn-primary w-100"
        >
          Voir détails
        </Link>

      </div>

    </div>
  );
};

export default ServiceCard;