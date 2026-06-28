import "./About.css";
const About = () => {
  return (
    <div className="about-page">

     <section className="about-hero">
  <div className="hero-backdrop"></div>

  <div className="about-hero-content">
    <span className="hero-badge">KayJob Platform</span>

    <h1 className="hero-title">
      À propos de <span className="gradient-text">KayJob</span>
    </h1>

    <p className="hero-subtitle">
      Une plateforme qui connecte prestataires et demandeurs de services.
    </p>
  </div>
</section>

      {/* DESCRIPTION */}
      <section className="about-description">
        <h2>Qui sommes-nous ?</h2>
        <p>
          KayJob est une solution digitale permettant de trouver rapidement
          des services fiables près de chez vous.
        </p>
      </section>

     {/* FEATURES */}
<section className="about-features">
  <div className="feature-card">Rapidité</div>
  <div className="feature-card">Sécurité</div>
  <div className="feature-card">Facilité</div>
</section>

     <section className="mission-section">
  <div className="mission-grid">

    <div>
      <h3 className="section-title-left">Mission</h3>
      <p className="mission-text">
        Faciliter la mise en relation entre utilisateurs.
      </p>
    </div>

    <div>
      <h3 className="section-title-left">Vision</h3>
      <p className="mission-text">
        Devenir la plateforme n°1 de services au Sénégal.
      </p>
    </div>

  </div>
</section>
    </div>
  );
};

export default About;