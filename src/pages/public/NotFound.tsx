import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />

      <section className="py-5 text-center bg-white">
        <div className="container py-5">
          <h1 className="display-1 fw-bold text-primary">404</h1>
          <h2 className="mb-3">Page introuvable</h2>
          <p className="text-secondary mb-4">La page que vous cherchez n’existe pas ou a été déplacée.</p>
          <Link to="/" className="btn btn-primary-custom">Retour à l’accueil</Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default NotFound;
