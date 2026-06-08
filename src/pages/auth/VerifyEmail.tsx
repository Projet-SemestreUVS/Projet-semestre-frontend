import logo from "../../assets/logos/kay-job.png";

import { Link } from "react-router-dom";

const VerifyEmail = () => {

  return (

    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background:
          "linear-gradient(135deg,#0D6EFD,#4DA3FF)"
      }}
    >

      <div
        className="card shadow-lg border-0 p-5 text-center"
        style={{
          maxWidth: "500px"
        }}
      >

        <img
          src={logo}
          alt="logo"
          width="130"
          className="mx-auto mb-4"
        />

        <h2 className="fw-bold">

          Vérifiez votre email

        </h2>

        <p className="text-muted mt-3">

          Un email de confirmation
          vous a été envoyé.

        </p>

        <p>

          Cliquez sur le lien reçu
          pour activer votre compte.

        </p>

        <Link
          to="/login"
          className="btn btn-primary mt-3"
        >

          Retour à la connexion

        </Link>

      </div>

    </div>
  );
};

export default VerifyEmail;