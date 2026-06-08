import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "../../styles/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construction du mailto avec les données du formulaire
    const subject = encodeURIComponent(`[KAY JOB] ${formData.subject} - De: ${formData.name}`);
    const body = encodeURIComponent(
      `Bonjour,\n\n` +
      `Je vous contacte via le formulaire de contact KAY JOB.\n\n` +
      `--- INFORMATIONS DE CONTACT ---\n` +
      `Nom: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Téléphone: ${formData.phone || "Non renseigné"}\n\n` +
      `--- MESSAGE ---\n` +
      `${formData.message}\n\n` +
      `---\n` +
      `Envoyé depuis le formulaire de contact KAY JOB\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `Merci de me contacter dans les plus brefs délais.\n\n` +
      `Cordialement,\n${formData.name}`
    );
    
    // Création du lien mailto
    const mailtoLink = `mailto:abdoulayegueye005@gmail.com?subject=${subject}&body=${body}`;
    
    // Tentative d'ouverture du client mail
    try {
      window.location.href = mailtoLink;
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact methods
  const contactMethods = [
    {
      icon: "📍",
      title: "Adresse",
      details: ["Dakar, Sénégal", "Plateforme 100% en ligne"],
      action: null
    },
    {
      icon: "📞",
      title: "Téléphone",
      details: ["+221 76 31 62 164", "Disponible 24h/24"],
      action: "tel:+221763162164"
    },
    {
      icon: "✉️",
      title: "Email",
      details: ["abdoulayegueye005@gmail.com", "Réponse sous 24h"],
      action: "mailto:abdoulayegueye005@gmail.com"
    },
    {
      icon: "🕒",
      title: "Horaires",
      details: ["Lun - Ven: 8h00 - 18h00", "Sam: 9h00 - 13h00", "Dim: Fermé"],
      action: null
    }
  ];

  const faqs = [
    {
      question: "Comment réserver un service ?",
      answer: "Il vous suffit de parcourir les services, choisir celui qui vous intéresse, et cliquer sur 'Réserver'. Vous serez guidé tout au long du processus."
    },
    {
      question: "Comment devenir prestataire ?",
      answer: "Créez un compte en sélectionnant 'Prestataire', remplissez votre profil, et soumettez vos documents pour validation. Notre équipe vous contactera sous 48h."
    },
    {
      question: "Les paiements sont-ils sécurisés ?",
      answer: "Oui, tous les paiements sont sécurisés. Vous pouvez payer en espèces au prestataire, par virement bancaire ou par mobile money."
    },
    {
      question: "Que faire en cas de litige ?",
      answer: "Notre service client est à votre disposition pour résoudre tout problème. Contactez-nous par email ou téléphone, nous traitons chaque réclamation individuellement."
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-backdrop"></div>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="contact-hero-content"
            >
              <span className="hero-badge">Contactez-nous</span>
              <h1 className="hero-title">
                Nous sommes à votre <span className="gradient-text">écoute</span>
              </h1>
              <p className="hero-subtitle">
                Une question, un projet, une suggestion ? Notre équipe est là pour vous accompagner. 
                N'hésitez pas à nous contacter, nous vous répondrons dans les meilleurs délais.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="contact-methods">
          <div className="container-custom">
            <div className="methods-grid">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="method-card"
                >
                  <div className="method-icon">{method.icon}</div>
                  <h3 className="method-title">{method.title}</h3>
                  {method.details.map((detail, idx) => (
                    <p key={idx} className="method-detail">{detail}</p>
                  ))}
                  {method.action && (
                    <a href={method.action} className="method-action">
                      {method.title === "Téléphone" ? "Appeler maintenant" : "Envoyer un email"}
                      <span className="action-arrow">→</span>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="contact-form-section">
          <div className="container-custom">
            <div className="contact-grid">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="form-container"
              >
                <div className="form-header">
                  <span className="form-badge">Formulaire de contact</span>
                  <h2 className="form-title">Envoyez-nous un message</h2>
                  <p className="form-subtitle">
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        Nom complet <span className="required">*</span>
                      </label>
                      <div className="input-icon">
                        <span className="icon">👤</span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Jean Dupont"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        Email <span className="required">*</span>
                      </label>
                      <div className="input-icon">
                        <span className="icon">✉️</span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="jean@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Téléphone</label>
                      <div className="input-icon">
                        <span className="icon">📞</span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+221 76 316 21 64"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">
                        Sujet <span className="required">*</span>
                      </label>
                      <div className="input-icon">
                        <span className="icon">📝</span>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Objet de votre message"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      Message <span className="required">*</span>
                    </label>
                    <div className="input-icon textarea-icon">
                      <span className="icon">💬</span>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Décrivez votre besoin, question ou suggestion..."
                      />
                    </div>
                  </div>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="success-message"
                    >
                      ✓ Message envoyé avec succès ! Notre équipe vous répondra sous 24h.
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="error-message"
                    >
                      ⚠️ Une erreur s'est produite. Veuillez réessayer ou nous contacter directement par téléphone.
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-small"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <span className="btn-icon">✈️</span>
                      </>
                    )}
                  </button>

                  <p className="form-note">
                    * En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter.
                    Vos informations ne seront jamais partagées avec des tiers.
                  </p>
                </form>
              </motion.div>

              {/* Map & Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="info-container"
              >
                <div className="map-card">
                  <h3>📍 Notre emplacement</h3>
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123666.25034925215!2d-17.46633955!3d14.69277745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec1726a6a0d8e3b%3A0x5f9b8a3a8c5b3b1!2sDakar%2C%20Senegal!5e0!3m2!1sfr!2ssn!4v1700000000000!5m2!1sfr!2ssn"
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="KAY JOB Location"
                    ></iframe>
                  </div>
                </div>

                <div className="social-card">
                  <h3>📱 Suivez-nous</h3>
                  <div className="social-grid">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-item facebook">
                      <span>📘</span>
                      <div>
                        <strong>Facebook</strong>
                        <p>/kayjob.sn</p>
                      </div>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-item twitter">
                      <span>🐦</span>
                      <div>
                        <strong>Twitter</strong>
                        <p>@kayjob</p>
                      </div>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-item instagram">
                      <span>📸</span>
                      <div>
                        <strong>Instagram</strong>
                        <p>@kayjob.sn</p>
                      </div>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-item linkedin">
                      <span>🔗</span>
                      <div>
                        <strong>LinkedIn</strong>
                        <p>KAY JOB</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="response-card">
                  <div className="response-icon">⚡</div>
                  <h4>Réponse garantie sous 24h</h4>
                  <p>Notre équipe s'engage à vous répondre dans les 24 heures ouvrées suivant votre demande.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section-contact">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <span className="section-badge">FAQ</span>
              <h2 className="section-title">Questions fréquentes</h2>
              <p className="section-subtitle">
                Retrouvez les réponses aux questions les plus courantes
              </p>
            </motion.div>

            <div className="faq-grid-contact">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="faq-item-contact"
                >
                  <div className="faq-question">
                    <span className="faq-icon">❓</span>
                    <h3>{faq.question}</h3>
                  </div>
                  <p className="faq-answer">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section-contact">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="cta-content-contact"
            >
              <h2>Vous êtes prestataire ?</h2>
              <p>Rejoignez notre plateforme et développez votre activité avec KAY JOB</p>
              <div className="cta-buttons-contact">
                <a href="mailto:abdoulayegueye005@gmail.com?subject=Devenir prestataire KAY JOB&body=Bonjour,%0D%0A%0D%0AJe souhaite devenir prestataire sur KAY JOB.%0D%0A%0D%0AVoici mes informations:%0D%0A- Nom complet: %0D%0A- Métier: %0D%0A- Téléphone: %0D%0A%0D%0ACordialement" className="cta-primary">
                  Devenir prestataire
                </a>
                <a href="tel:+221763162164" className="cta-secondary">
                  Appel direct
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Contact;