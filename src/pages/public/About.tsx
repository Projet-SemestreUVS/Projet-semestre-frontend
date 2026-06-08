import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "../../styles/about.css";

const About = () => {
  const values = [
    {
      title: "Fiabilité",
      text: "Nous vérifions chaque prestataire pour garantir une expérience sûre et sérieuse.",
      icon: "🔒",
      color: "#0D6EFD"
    },
    {
      title: "Rapidité",
      text: "Réservez en quelques minutes et obtenez une réponse rapide de professionnels qualifiés.",
      icon: "⚡",
      color: "#22C55E"
    },
    {
      title: "Transparence",
      text: "Prix, délais et prestations sont toujours clairement communiqués avant toute réservation.",
      icon: "🔍",
      color: "#F59E0B"
    },
    {
      title: "Innovation",
      text: "Nous innovons constamment pour vous offrir la meilleure expérience de mise en relation.",
      icon: "💡",
      color: "#8B5CF6"
    },
    {
      title: "Communauté",
      text: "Nous construisons une communauté solidaire où chacun peut contribuer et bénéficier.",
      icon: "👥",
      color: "#EC4899"
    },
    {
      title: "Qualité",
      text: "Nous garantissons des prestations de qualité avec des professionnels rigoureusement sélectionnés.",
      icon: "⭐",
      color: "#06B6D4"
    }
  ];

  const team = [
    {
      name: "Abdoulaye Gueye",
      role: "Fondateur & CEO",
      description: "Expert en technologies et entrepreneur passionné par l'innovation sociale.",
      avatar: "👨‍💼",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Ndeye Awa Mbodj",
      role: "Directrice des Opérations",
      description: "Spécialiste en gestion de projets et satisfaction client.",
      avatar: "👩‍💼",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Khady Pène",
      role: "Responsable Marketing",
      description: "Stratège marketing avec une passion pour la croissance des communautés.",
      avatar: "👩‍🎨",
      social: { linkedin: "#", twitter: "#" }
    }
  ];

  const stats = [
    { number: "10k+", label: "Prestataires actifs", icon: "👥" },
    { number: "50k+", label: "Clients satisfaits", icon: "😊" },
    { number: "98%", label: "Taux de satisfaction", icon: "📊" },
    { number: "24/7", label: "Support disponible", icon: "🕒" },
    { number: "500+", label: "Services proposés", icon: "🔧" },
    { number: "4.9/5", label: "Note moyenne", icon: "⭐" }
  ];

  const milestones = [
    { year: "2020", title: "Création de KAY JOB", description: "Lancement de la plateforme à Dakar" },
    { year: "2021", title: "500 prestataires", description: "Atteinte de 500 prestataires actifs" },
    { year: "2022", title: "Expansion nationale", description: "Extension à tout le Sénégal" },
    { year: "2023", title: "10k+ utilisateurs", description: "Communauté de plus de 10k utilisateurs" },
    { year: "2024", title: "Application mobile", description: "Lancement de l'application mobile" }
  ];

  const testimonials = [
    {
      name: "Ibrahima Ndiaye",
      role: "Prestataire Plomberie",
      text: "KAY JOB a transformé mon activité. Grâce à la plateforme, j'ai triplé mon chiffre d'affaires !",
      avatar: "👨‍🔧",
      rating: 5
    },
    {
      name: "Selbe Laye Nguenne",
      role: "Client Particulier",
      text: "Une plateforme fiable et facile à utiliser. J'ai trouvé des prestataires de qualité pour tous mes besoins.",
      avatar: "👩",
      rating: 5
    },
    {
      name: "Cheikou Sarr",
      role: "Développeur Web",
      text: "Je recommande vivement KAY JOB pour sa simplicité et son professionnalisme.",
      avatar: "👨‍💻",
      rating: 5
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-backdrop"></div>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="about-hero-content"
            >
              <span className="hero-badge">À propos de nous</span>
              <h1 className="hero-title">
                La plateforme qui révolutionne 
                <span className="gradient-text"> les services à domicile</span>
              </h1>
              <p className="hero-subtitle">
                KAY JOB relie les demandeurs et les prestataires de confiance pour rendre 
                chaque service simple, rapide et sécurisé au Sénégal et en Afrique.
              </p>
              <div className="hero-buttons">
                <Link to="/services" className="btn-primary-custom">
                  Découvrir les services
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/contact" className="btn-outline-custom">
                  Nous contacter
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container-custom">
            <div className="mission-grid">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mission-content"
              >
                <span className="section-badge">Notre mission</span>
                <h2 className="section-title-left">
                  Faciliter l'accès aux services de qualité pour tous
                </h2>
                <p className="mission-text">
                  Chez KAY JOB, nous croyons que chacun mérite d'accéder facilement à des services 
                  de qualité, où qu'il se trouve. Notre mission est de créer un écosystème digital 
                  qui connecte efficacement les prestataires qualifiés avec les demandeurs, 
                  tout en garantissant transparence, sécurité et satisfaction.
                </p>
                <div className="mission-stats">
                  {stats.slice(0, 3).map((stat, index) => (
                    <div key={index} className="stat-item">
                      <span className="stat-number">{stat.number}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mission-image"
              >
                <div className="image-card">
                  <div className="image-icon">⭐</div>
                  <h3>KAY JOB</h3>
                  <p>Votre partenaire de confiance</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="stats-grid"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="stat-card"
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <span className="section-badge">Nos valeurs</span>
              <h2 className="section-title">Ce qui nous guide au quotidien</h2>
              <p className="section-subtitle">
                Des principes fondamentaux qui façonnent notre culture et notre façon de travailler
              </p>
            </motion.div>

            <div className="values-grid">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="value-card"
                >
                  <div className="value-icon" style={{ background: `${value.color}15`, color: value.color }}>
                    {value.icon}
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-text">{value.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <span className="section-badge">Notre histoire</span>
              <h2 className="section-title">Un parcours d'innovation</h2>
              <p className="section-subtitle">
                Découvrez les étapes clés de notre développement
              </p>
            </motion.div>

            <div className="timeline">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
                >
                  <div className="timeline-dot">
                    <span>{milestone.year.slice(-2)}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-year">{milestone.year}</div>
                    <h3 className="timeline-title">{milestone.title}</h3>
                    <p className="timeline-description">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <span className="section-badge">Notre équipe</span>
              <h2 className="section-title">Des passionnés à votre service</h2>
              <p className="section-subtitle">
                Une équipe dédiée qui travaille chaque jour pour améliorer votre expérience
              </p>
            </motion.div>

            <div className="team-grid">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="team-card"
                >
                  <div className="team-avatar">{member.avatar}</div>
                  <h3 className="team-name">{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p className="team-description">{member.description}</p>
                  <div className="team-social">
                    <a href={member.social.linkedin} className="social-link">🔗</a>
                    <a href={member.social.twitter} className="social-link">🐦</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section-about">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <span className="section-badge">Témoignages</span>
              <h2 className="section-title">Ce qu'ils disent de nous</h2>
              <p className="section-subtitle">
                Des retours authentiques de notre communauté
              </p>
            </motion.div>

            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="testimonial-card-about"
                >
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-stars">
                    {"★".repeat(testimonial.rating)}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section-about">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="cta-content-about"
            >
              <h2>Prêt à rejoindre l'aventure ?</h2>
              <p>Que vous soyez prestataire ou demandeur, KAY JOB est là pour vous accompagner</p>
              <div className="cta-buttons">
                <Link to="/register?role=prestataire" className="cta-btn-primary">
                  Devenir prestataire
                </Link>
                <Link to="/register" className="cta-btn-secondary">
                  S'inscrire comme client
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;