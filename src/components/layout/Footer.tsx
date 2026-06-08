import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import logo from "../../assets/logos/kay-job.png";
import "../../styles/footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  // Navigation links
  const quickLinks = [
    { name: "Accueil", path: "/", icon: "bi bi-house-door-fill" },
    { name: "Services", path: "/services", icon: "bi bi-tools" },
    { name: "Comment ça marche", path: "/how-it-works", icon: "bi bi-journal-text" },
    { name: "Témoignages", path: "/testimonials", icon: "bi bi-star-fill" },
    { name: "À propos", path: "/about", icon: "bi bi-book-half" },
    { name: "Contact", path: "/contact", icon: "bi bi-telephone-fill" },
    { name: "Blog", path: "/blog", icon: "bi bi-pencil-square" },
    { name: "FAQ", path: "/faq", icon: "bi bi-question-circle-fill" },
  ];

  const legalLinks = [
    { name: "Conditions générales", path: "/terms" },
    { name: "Politique de confidentialité", path: "/privacy" },
    { name: "Mentions légales", path: "/legal" },
    { name: "Cookies", path: "/cookies" },
  ];

  const categories = [
    { name: "Plomberie", count: 245 },
    { name: "Électricité", count: 189 },
    { name: "Développement", count: 567 },
    { name: "Transport", count: 432 },
    { name: "Coiffure", count: 321 },
    { name: "Ménage", count: 298 },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "bi bi-facebook", url: "https://facebook.com", color: "#1877f2" },
    { name: "Twitter", icon: "bi bi-twitter-x", url: "https://twitter.com", color: "#1da1f2" },
    { name: "Instagram", icon: "bi bi-instagram", url: "https://instagram.com", color: "#e4405f" },
    { name: "LinkedIn", icon: "bi bi-linkedin", url: "https://linkedin.com", color: "#0077b5" },
    { name: "YouTube", icon: "bi bi-youtube", url: "https://youtube.com", color: "#ff0000" },
    { name: "TikTok", icon: "bi bi-tiktok", url: "https://tiktok.com", color: "#000000" },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulation d'inscription à la newsletter
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-modern">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="newsletter-wrapper"
          >
            <div className="newsletter-content">
              <div className="newsletter-icon"><i className="bi bi-envelope-paper-fill"></i></div>
              <h3 className="newsletter-title">
                Inscrivez-vous à notre newsletter
              </h3>
              <p className="newsletter-text">
                Recevez nos offres exclusives et les dernières actualités
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn">
                  {isSubscribed ? "✓ Inscrit !" : "S'abonner"}
                </button>
              </div>
              <p className="newsletter-note">
                ✨ Pas de spam, seulement des offres intéressantes
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container-custom">
          <div className="footer-grid">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <div className="footer-logo">
                <img src={logo} alt="KAY JOB" className="footer-brand-logo" />
                <span className="logo-text">KAY<span className="logo-highlight">JOB</span></span>
              </div>
              <p className="footer-description">
                Plateforme de mise en relation entre prestataires et demandeurs.
                Trouvez le meilleur service près de chez vous en quelques clics.
              </p>
              <div className="footer-stats">
                <div className="stat">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Prestataires</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5k+</span>
                  <span className="stat-label">Services</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <h4 className="footer-title">
                <span className="title-icon"><i className="bi bi-link-45deg"></i></span>
                Liens rapides
              </h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={link.path} className="footer-link">
                      <span className="link-icon"><i className={link.icon}></i></span>
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Popular Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <h4 className="footer-title">
                <span className="title-icon"><i className="bi bi-collection-fill"></i></span>
                Catégories populaires
              </h4>
              <ul className="footer-categories">
                {categories.map((category, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/services?category=${category.name}`} className="category-link">
                      <span>{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <h4 className="footer-title">
                <span className="title-icon"><i className="bi bi-geo-alt-fill"></i></span>
                Contact
              </h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon"><i className="bi bi-geo-alt-fill"></i></span>
                  <div>
                    <strong>Adresse</strong>
                    <p>Dakar, Sénégal</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><i className="bi bi-envelope-fill"></i></span>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:contact@kayjob.sn">contact@kayjob.sn</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><i className="bi bi-telephone-fill"></i></span>
                  <div>
                    <strong>Téléphone</strong>
                    <a href="tel:+221781234567">+221 78 123 45 67</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><i className="bi bi-clock-fill"></i></span>
                  <div>
                    <strong>Horaires</strong>
                    <p>Lun - Ven: 8h - 20h</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h5 className="social-title">Suivez-nous</h5>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ background: social.color }}
                      aria-label={social.name}
                    >
                      <i className={social.icon}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container-custom">
          <div className="bottom-content">
            <div className="copyright">
              <p>
                © {currentYear} KAY JOB. Tous droits réservés.
              </p>
            </div>
            <div className="legal-links">
              {legalLinks.map((link, index) => (
                <Link key={index} to={link.path} className="legal-link">
                  {link.name}
                </Link>
              ))}
            </div>
            <button onClick={scrollToTop} className="back-to-top">
              <span><i className="bi bi-arrow-up-circle-fill"></i></span>
              Haut de page
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;