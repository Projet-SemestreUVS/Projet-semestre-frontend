import { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import logo from "../../assets/logos/prestataire.png";
import awa from "../../assets/logos/awa.png";
import laye from "../../assets/logos/laye.png";
import pene from "../../assets/logos/pene.png";
import "../../styles/global.css";
import "../../styles/home.css";

// Composant pour l'animation au scroll
const ScrollAnimation = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.div>
  );
};

// Composant de catégorie
const CategoryCard = ({ icon, title, count, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    className="col-lg-4 col-md-6 mb-4"
  >
    <div className="category-card">
      <div className="category-icon"><i className={`bi ${icon}`} aria-hidden="true" /></div>
      <h3 className="category-title">{title}</h3>
      <p className="category-count">{count}+ prestataires</p>
    </div>
  </motion.div>
);

// Composant étape
const StepCard = ({ number, icon, title, description, index }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    className="col-md-4 mb-4"
  >
    <div className="step-card">
      <div className="step-number">{number}</div>
      <div className="step-icon"><i className={`bi ${icon}`} aria-hidden="true" /></div>
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  </motion.div>
);

// Composant témoignage - CORRIGÉ
const TestimonialCard = ({ avatar, text, name, role, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="col-md-6 col-lg-4 mb-4"
  >
    <div className="testimonial-card">
      {avatar ? (
        <img 
          src={avatar} 
          alt={name} 
          className="testimonial-avatar" 
          onError={(e) => {
            // Gestion d'erreur si l'image ne charge pas
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = 'testimonial-avatar-fallback';
              fallback.textContent = name.charAt(0);
              parent.appendChild(fallback);
            }
          }}
        />
      ) : (
        <div className="testimonial-avatar-fallback">{name.charAt(0)}</div>
      )}
      <p className="testimonial-text">"{text}"</p>
      <h4 className="testimonial-name">{name}</h4>
      <p className="testimonial-role">{role}</p>
      <div className="text-warning mt-2">
        {"★".repeat(5)}
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchSuggestions = ["Plomberie", "Développement", "Électricité", "Ménage"];

  // Données des catégories
  const categories = [
    { icon: "bi-tools", title: "Plomberie", count: 245 },
    { icon: "bi-lightning-charge-fill", title: "Électricité", count: 189 },
    { icon: "bi-code-slash", title: "Développement", count: 567 },
    { icon: "bi-truck", title: "Transport", count: 432 },
    { icon: "bi-scissors", title: "Coiffure", count: 321 },
    { icon: "bi-house-door", title: "Ménage", count: 298 },
    { icon: "bi-mortarboard-fill", title: "Cours particuliers", count: 456 },
    { icon: "bi-palette-fill", title: "Design graphique", count: 234 },
  ];

  // Données des étapes
  const steps = [
    {
      number: "01",
      icon: "bi-person-plus-fill",
      title: "Créez votre compte",
      description: "Inscrivez-vous gratuitement en quelques minutes et accédez à tous les services.",
    },
    {
      number: "02",
      icon: "bi-search-heart",
      title: "Trouvez un prestataire",
      description: "Parcourez les profils, comparez les prix et lisez les avis clients.",
    },
    {
      number: "03",
      icon: "bi-calendar2-check-fill",
      title: "Réservez et payez",
      description: "Choisissez la date, effectuez le paiement sécurisé et recevez une confirmation.",
    },
  ];

  // Données des fonctionnalités
  const features = [
    {
      icon: "bi-shield-lock-fill",
      title: "Paiement sécurisé",
      description: "Transactions 100% sécurisées avec garantie satisfait ou remboursé.",
    },
    {
      icon: "bi-star-fill",
      title: "Avis vérifiés",
      description: "Tous les avis sont authentifiés pour vous garantir une qualité de service.",
    },
    {
      icon: "bi-rocket-takeoff-fill",
      title: "Support 24/7",
      description: "Une équipe dédiée disponible 7j/7 pour vous accompagner.",
    },
    {
      icon: "bi-phone-fill",
      title: "Application mobile",
      description: "Accédez à tous les services depuis votre smartphone.",
    },
  ];

  // Données des témoignages - CORRIGÉ avec les imports d'images corrects
  const testimonials = [
    {
      avatar: laye,  // Utilisation directe de l'import
      text: "Service exceptionnel ! J'ai trouvé un développeur en moins de 24h. Le travail est de grande qualité.",
      name: "Abdoulaye Gueye",
      role: "Client satisfait",
    },
    {
      avatar: awa,   // Utilisation directe de l'import
      text: "Plateforme très intuitive et fiable. Les prestataires sont professionnels et réactifs.",
      name: "Ndeye Awa Mbodj",
      role: "Utilisatrice régulière",
    },
    {
      avatar: pene,  // Utilisation directe de l'import
      text: "Meilleure plateforme pour trouver des services de qualité. Je recommande vivement !",
      name: "Khady Pène",
      role: "Client professionnel",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation de recherche
    setTimeout(() => {
      console.log("Recherche:", searchQuery);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />

      {/* SECTION HERO */}
      <section className="hero-section">
        <div className="hero-backdrop" />
        <div className="container-custom hero-shell">
          <div className="row align-items-center min-vh-75 gy-5">
            <div className="col-lg-7 mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="hero-copy"
              >
                <span className="hero-badge">Votre marketplace de confiance</span>
                <h1 className="hero-title">Trouvez le meilleur prestataire près de chez vous.</h1>
                <p className="hero-subtitle">Plomberie, développement, électricité, transport, coiffure et bien plus encore. Des professionnels vérifiés, des prix clairs et des réservations rapides.</p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                onSubmit={handleSearch}
                className="search-bar"
              >
                <input
                  type="text"
                  className="search-input"
                  placeholder="Recherchez un service, une catégorie ou un prestataire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn" disabled={isLoading}>
                  {isLoading ? "Recherche..." : <><i className="bi bi-search me-2" />Rechercher</>}
                </button>
              </motion.form>

              <motion.div className="search-tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.5 }}>
                {searchSuggestions.map((item) => (
                  <button key={item} type="button" className="search-chip" onClick={() => setSearchQuery(item)}>{item}</button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="hero-stats"
              >
                <div className="stat-item"><span className="stat-number">10k+</span><span className="stat-label">Prestataires</span></div>
                <div className="stat-item"><span className="stat-number">5k+</span><span className="stat-label">Services</span></div>
                <div className="stat-item"><span className="stat-number">98%</span><span className="stat-label">Clients satisfaits</span></div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="col-lg-5 text-center"
            >
              <div className="prestataire-spotlight-card">
                <div className="prestataire-badge">Prestataire du moment</div>
                <div className="prestataire-image-wrap">
                  <img 
                    src={logo} 
                    alt="Prestataire KAYJOB" 
                    className="prestataire-image"
                    onError={(e) => {
                      console.error("Erreur de chargement de l'image:", logo);
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=KAYJOB";
                    }}
                  />
                </div>
                <h3 className="prestataire-title">Profils vérifiés & rapides</h3>
                <p className="prestataire-text">Choisissez un expert selon vos besoins, votre budget et votre disponibilité en quelques clics.</p>
                <div className="prestataire-mini-grid">
                  <span><i className="bi bi-star-fill me-1" /> 4.9/5</span>
                  <span><i className="bi bi-clock-history me-1" /> Réponse &lt; 30 min</span>
                  <span><i className="bi bi-shield-lock-fill me-1" /> Paiement sécurisé</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION CATÉGORIES */}
      <section className="categories-section section-padding soft-surface">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Catégories populaires</h2>
            <p className="text-center text-muted mb-5">
              Découvrez nos catégories les plus recherchées par nos utilisateurs
            </p>
          </motion.div>

          <div className="row">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} index={index} />
            ))}
          </div>

          <div className="text-center mt-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary-custom btn-custom"
              onClick={() => console.log("Voir toutes les catégories")}
            >
              Voir toutes les catégories →
            </motion.button>
          </div>
        </div>
      </section>

      {/* SECTION COMMENT ÇA MARCHE */}
      <section className="how-it-works-section section-padding soft-surface">
        <div className="container-custom">
          <ScrollAnimation>
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="text-center text-muted mb-5">
              Trois étapes simples pour trouver le prestataire idéal
            </p>
          </ScrollAnimation>

          <div className="row">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FONCTIONNALITÉS */}
      <section className="features-section section-padding soft-surface">
        <div className="container-custom">
          <ScrollAnimation>
            <h2 className="section-title">Pourquoi nous choisir ?</h2>
            <p className="text-center text-muted mb-5">
              Une plateforme fiable et sécurisée pour tous vos besoins
            </p>
          </ScrollAnimation>

          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="feature-card"
                >
                  <div className="feature-icon"><i className={`bi ${feature.icon}`} aria-hidden="true" /></div>
                  <h3 className="h5 mb-3">{feature.title}</h3>
                  <p className="text-muted small">{feature.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION TÉMOIGNAGES */}
      <section className="testimonials-section section-padding">
        <div className="container-custom">
          <ScrollAnimation>
            <h2 className="section-title">Ce que nos clients disent</h2>
            <p className="text-center text-muted mb-5">
              Des milliers de clients satisfaits nous font confiance
            </p>
          </ScrollAnimation>

          <div className="row">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CTA */}
      <section className="cta-section section-padding">
        <div className="container-custom">
          <div className="cta-content text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="cta-title"
            >
              Prêt à trouver votre prestataire ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="cta-text"
            >
              Rejoignez notre communauté et bénéficiez des meilleurs services
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-light btn-custom"
                style={{
                  background: "white",
                  color: "var(--primary)",
                  padding: "1rem 2rem",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                }}
                onClick={() => console.log("S'inscrire")}
              >
                <i className="bi bi-arrow-right-circle me-2" /> Commencer maintenant
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;