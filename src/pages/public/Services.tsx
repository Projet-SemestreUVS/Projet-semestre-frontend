import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "../../styles/services.css";

// Types
interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  priceUnit: string;
  description: string;
  longDescription?: string;
  icon: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  features: string[];
  images: string[];
  provider: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Données enrichies des services
  const services: Service[] = [
    {
      id: 1,
      name: "Plomberie Express",
      category: "Plomberie",
      price: 25000,
      priceUnit: "FCFA",
      description: "Intervention rapide pour fuites, débouchage et installation sanitaire.",
      longDescription: "Service de plomberie d'urgence disponible 24h/24 et 7j/7. Intervenez qualifiés avec matériel professionnel.",
      icon: "🔧",
      rating: 4.8,
      reviews: 234,
      deliveryTime: "30 min",
      features: ["Déplacement gratuit", "Devis sans engagement", "Garantie 3 mois"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Alpha Tech Services",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 2,
      name: "Électricité Sûre",
      category: "Électricité",
      price: 30000,
      priceUnit: "FCFA",
      description: "Maintenance, branchement et dépannage pour votre domicile ou bureau.",
      longDescription: "Installations électriques complètes, mise aux normes, dépannage d'urgence.",
      icon: "⚡",
      rating: 4.9,
      reviews: 189,
      deliveryTime: "45 min",
      features: ["Certifié NFC", "Matériel aux normes", "Garantie 1 an"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Electro Plus",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 3,
      name: "Développement Web Pro",
      category: "Digital",
      price: 60000,
      priceUnit: "FCFA",
      description: "Sites vitrine, landing pages et solutions métier sur mesure.",
      longDescription: "Création de sites web modernes, responsive et optimisés SEO.",
      icon: "💻",
      rating: 4.7,
      reviews: 567,
      deliveryTime: "5 jours",
      features: ["Design responsive", "SEO optimisé", "Formation incluse"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Dev Solutions",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 4,
      name: "Transport Urbain Express",
      category: "Transport",
      price: 15000,
      priceUnit: "FCFA",
      description: "Livraison, déménagement et déplacement rapide selon vos besoins.",
      longDescription: "Service de transport fiable avec suivi GPS en temps réel.",
      icon: "🚚",
      rating: 4.6,
      reviews: 432,
      deliveryTime: "20 min",
      features: ["Suivi GPS", "Assurance incluse", "Chauffeur professionnel"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Mobility Sénégal",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 5,
      name: "Coiffure Premium",
      category: "Beauté",
      price: 20000,
      priceUnit: "FCFA",
      description: "Coupe, brushing et soins de beauté réalisés par des professionnels.",
      longDescription: "Salon de coiffure haut de gamme, produits naturels et service personnalisé.",
      icon: "✂️",
      rating: 4.9,
      reviews: 321,
      deliveryTime: "1 heure",
      features: ["Produits bio", "Service à domicile", "1er RDV offert"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Beauty Studio",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 6,
      name: "Ménage Pro",
      category: "Entretien",
      price: 18000,
      priceUnit: "FCFA",
      description: "Nettoyage complet et entretien régulier de votre espace.",
      longDescription: "Service de nettoyage professionnel pour bureaux et domiciles.",
      icon: "🧹",
      rating: 4.8,
      reviews: 298,
      deliveryTime: "2 heures",
      features: ["Matériel fourni", "Assurance incluse", "Éco-produits"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Clean Service",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 7,
      name: "Jardinage & Paysagisme",
      category: "Jardinage",
      price: 35000,
      priceUnit: "FCFA",
      description: "Entretien de jardin, tonte, taille et aménagement paysager.",
      longDescription: "Services complets d'entretien et création d'espaces verts.",
      icon: "🌿",
      rating: 4.7,
      reviews: 156,
      deliveryTime: "1 jour",
      features: ["Matériel pro", "Conseils personnalisés", "Forfait mensuel"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Green Garden",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 8,
      name: "Photographie Pro",
      category: "Photographie",
      price: 45000,
      priceUnit: "FCFA",
      description: "Séances photo professionnelles, événements et portraits.",
      longDescription: "Photographe expérimenté pour tous vos événements spéciaux.",
      icon: "📷",
      rating: 4.9,
      reviews: 203,
      deliveryTime: "3 jours",
      features: ["Photos retouchées", "Album numérique", "Droit d'auteur inclus"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Art Photo Studio",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 9,
      name: "Cours Particuliers",
      category: "Éducation",
      price: 15000,
      priceUnit: "FCFA/heure",
      description: "Soutien scolaire et cours particuliers toutes matières.",
      longDescription: "Professeurs qualifiés pour un accompagnement personnalisé.",
      icon: "📚",
      rating: 4.8,
      reviews: 456,
      deliveryTime: "24h",
      features: ["1er cours offert", "Profils vérifiés", "Suivi pédagogique"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Educ Plus",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 10,
      name: "Design Graphique",
      category: "Digital",
      price: 50000,
      priceUnit: "FCFA",
      description: "Logo, charte graphique et supports de communication.",
      longDescription: "Designer créatif pour votre identité visuelle.",
      icon: "🎨",
      rating: 4.9,
      reviews: 234,
      deliveryTime: "3 jours",
      features: ["3 concepts", "Sources incluses", "Modifications illimitées"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Creative Design",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 11,
      name: "Climatisation",
      category: "Électricité",
      price: 40000,
      priceUnit: "FCFA",
      description: "Installation et entretien de climatiseurs.",
      longDescription: "Service rapide et professionnel pour clim réversible.",
      icon: "❄️",
      rating: 4.7,
      reviews: 167,
      deliveryTime: "1 heure",
      features: ["Diagnostic gratuit", "Garantie 6 mois", "Produits certifiés"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Clim Services",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    },
    {
      id: 12,
      name: "Garde d'enfants",
      category: "Services",
      price: 10000,
      priceUnit: "FCFA/heure",
      description: "Baby-sitting et garde d'enfants à domicile.",
      longDescription: "Gardes expérimentées et formées aux premiers secours.",
      icon: "👶",
      rating: 4.9,
      reviews: 389,
      deliveryTime: "30 min",
      features: ["Formation secourisme", "Activités ludiques", "Extrascolaire"],
      images: ["/api/placeholder/400/300"],
      provider: {
        name: "Kids Care",
        avatar: "/api/placeholder/60/60",
        verified: true
      }
    }
  ];

  // Catégories uniques
  const categories = [
    "all",
    ...Array.from(new Set(services.map(s => s.category)))
  ];

  // Filtrage des services
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = service.price >= priceRange.min && service.price <= priceRange.max;
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Tri des services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "popular") return b.rating - a.rating;
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Simulation de chargement
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, [selectedCategory, searchTerm, sortBy, priceRange]);

  const handlePriceChange = (type: string, value: number) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Composant de carte service
  const ServiceCard = ({ service, index }: { service: Service; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className={`service-card ${viewMode === "list" ? "service-card-list" : ""}`}
    >
      <div className="service-card-inner">
        <div className="service-card-header">
          <div className="service-icon">{service.icon}</div>
          <div className="service-category-badge">{service.category}</div>
        </div>
        
        <div className="service-card-body">
          <h3 className="service-title">{service.name}</h3>
          
          <div className="service-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(service.rating) ? "star filled" : "star"}>
                  ★
                </span>
              ))}
            </div>
            <span className="rating-value">{service.rating}</span>
            <span className="reviews-count">({service.reviews} avis)</span>
          </div>
          
          <p className="service-description">{service.description}</p>
          
          <div className="service-features">
            {service.features.map((feature, i) => (
              <span key={i} className="feature-tag">
                ✓ {feature}
              </span>
            ))}
          </div>
          
          <div className="service-footer">
            <div className="service-price">
              <span className="price-amount">{service.price.toLocaleString()}</span>
              <span className="price-unit">{service.priceUnit}</span>
            </div>
            
            <div className="service-delivery">
              <span>⏱️ {service.deliveryTime}</span>
            </div>
            
            <Link to={`/services/${service.id}`} className="btn-view-details">
              Voir détails
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Navbar />
      
      <div className="services-page">
        {/* Hero Section */}
        <section className="services-hero">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="services-hero-content"
            >
              <h1 className="services-hero-title">
                Nos <span className="gradient-text">Services</span>
              </h1>
              <p className="services-hero-subtitle">
                Découvrez notre large gamme de services professionnels, 
                sélectionnés pour leur qualité et leur fiabilité
              </p>
              <div className="services-stats">
                <div className="stat">
                  <span className="stat-number">{services.length}+</span>
                  <span className="stat-label">Services</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50k+</span>
                  <span className="stat-label">Clients satisfaits</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="container-custom">
            <div className="filters-wrapper">
              {/* Search Bar */}
              <div className="search-wrapper">
                <i className="search-icon">🔍</i>
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Category Filters */}
              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-filter ${selectedCategory === category ? "active" : ""}`}
                  >
                    {category === "all" ? "Tous" : category}
                    {category !== "all" && (
                      <span className="category-count">
                        {services.filter(s => s.category === category).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort and View Options */}
              <div className="sort-options">
                <div className="sort-select">
                  <label>Trier par :</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="popular">Les plus populaires</option>
                    <option value="rating">Mieux notés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>

                <div className="view-toggle">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  >
                    ▦
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-section">
          <div className="container-custom">
            <div className="services-header">
              <h2 className="section-title">
                {selectedCategory === "all" ? "Tous nos services" : `Services - ${selectedCategory}`}
              </h2>
              <p className="services-count">
                {sortedServices.length} service{sortedServices.length > 1 ? "s" : ""} trouvé{sortedServices.length > 1 ? "s" : ""}
              </p>
            </div>

            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Chargement des services...</p>
              </div>
            ) : (
              <AnimatePresence>
                {sortedServices.length > 0 ? (
                  <div className={`services-grid ${viewMode === "list" ? "list-view" : ""}`}>
                    {sortedServices.map((service, index) => (
                      <ServiceCard key={service.id} service={service} index={index} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="no-results"
                  >
                    <div className="no-results-icon">🔍</div>
                    <h3>Aucun service trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                    <button onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setPriceRange({ min: 0, max: 200000 });
                    }} className="reset-filters-btn">
                      Réinitialiser les filtres
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta">
          <div className="container-custom">
            <div className="cta-content">
              <h2>Vous êtes prestataire de services ?</h2>
              <p>Rejoignez notre plateforme et développez votre activité</p>
              <Link to="/register?role=prestataire" className="cta-button">
                Devenir prestataire
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Services;