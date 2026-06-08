import { Link } from "react-router-dom";

const PrestataireSidebar = () => {

  return (

    <div
      className="vh-100 text-white p-4"
      style={{
        background:"#0D6EFD"
      }}
    >

      <h4>KAY JOB</h4>

      <hr />

      <ul className="nav flex-column">

        <li className="mb-3">

          <Link
            to="/prestataire/dashboard"
            className="text-white"
          >
            Dashboard
          </Link>

        </li>

        <li className="mb-3">

          <Link
            to="/prestataire/services"
            className="text-white"
          >
            Mes Services
          </Link>

        </li>

        <li className="mb-3">

          <Link
            to="/prestataire/reservations"
            className="text-white"
          >
            Réservations
          </Link>

        </li>

         <li className="mb-3">
          <Link
            to="/prestataire/statistiques"
            className="text-white"
          >
            Statistiques
          </Link>
        </li>

        <li className="mb-3">
          <Link
            to="/prestataire/profile"
            className="text-white"
          >
            Mon Profil
          </Link>
        </li>

      </ul>

    </div>
  );
};

export default PrestataireSidebar;