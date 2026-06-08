import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "../../styles/serviceDetail.css";

// Types
interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  priceUnit: string;
  duration: string;
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
    phone: string;
    email: string;
    since: string;
    completedJobs: number;
  };
  relatedServices?: number[];
}

// Configuration des images par catégorie
const categoryImages = {
  Plomberie: {
    main: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop"
    ]
  },
  Électricité: {
    main: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop"
    ]
  },
  Digital: {
    main: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop"
    ]
  },
  Transport: {
    main: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop"
    ]
  },
  Beauté: {
    main: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop"
    ]
  },
  Entretien: {
    main: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop"
    ]
  },
  Jardinage: {
    main: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop"
    ]
  },
  Photographie: {
    main: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop"
    ]
  },
  Éducation: {
    main: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop"
    ]
  },
  Services: {
    main: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop"
    ]
  }
};

// Avatars des prestataires par catégorie
const providerAvatars = {
  Plomberie: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  Électricité: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop",
  Digital: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop",
  Transport: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
  Beauté: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
  Entretien: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  Jardinage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop",
  Photographie: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop",
  Éducation: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
  Services: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
};

// Données complètes des services avec images API
const servicesData: Service[] = [
  {
    id: 1,
    name: "Plomberie Express",
    category: "Plomberie",
    price: 25000,
    priceUnit: "FCFA",
    duration: "1h à 2h",
    description: "Service rapide pour fuites, débouchage, changement de robinet et petites réparations sanitaires.",
    longDescription: "Notre service de plomberie express intervient rapidement pour résoudre tous vos problèmes de plomberie. Avec une équipe de techniciens certifiés et expérimentés, nous garantissons un travail de qualité dans les meilleurs délais. Que ce soit pour une urgence (fuite, canalisation bouchée) ou pour des travaux programmés (installation sanitaire, remplacement de chauffe-eau), nous sommes à votre disposition.",
    icon: "🔧",
    rating: 4.8,
    reviews: 234,
    deliveryTime: "30 min",
    features: [
      "Intervention express sous 30 minutes",
      "Technicien certifié et expérimenté",
      "Pièces de rechange disponibles",
      "Garantie 3 mois sur les réparations",
      "Devis gratuit et sans engagement",
      "Matériel professionnel"
    ],
    images: categoryImages.Plomberie.gallery,
    provider: {
      name: "Ibrahima Ndiaye Tech Services",
      avatar: providerAvatars.Plomberie,
      verified: true,
      phone: "+221 78 123 45 67",
      email: "contact@alphatech.sn",
      since: "2020",
      completedJobs: 1234
    },
    relatedServices: [2, 4]
  },
  {
    id: 2,
    name: "Électricité Sûre",
    category: "Électricité",
    price: 30000,
    priceUnit: "FCFA",
    duration: "1h à 3h",
    description: "Installation, maintenance et dépannage électrique pour maisons et bureaux.",
    longDescription: "Service électrique professionnel pour tous vos besoins. Nos électriciens qualifiés interviennent pour l'installation, la maintenance et le dépannage de vos installations électriques. Nous respectons les normes de sécurité les plus strictes et utilisons du matériel certifié.",
    icon: "⚡",
    rating: 4.9,
    reviews: 189,
    deliveryTime: "45 min",
    features: [
      "Diagnostic gratuit et détaillé",
      "Installation aux normes NFC",
      "Certificat de conformité",
      "Garantie 1 an sur les travaux",
      "Intervention urgente 24/7",
      "Matériel certifié"
    ],
    images: categoryImages.Électricité.gallery,
    provider: {
      name: "Abdoulaye Gueye Électro",
      avatar: providerAvatars.Électricité,
      verified: true,
      phone: "+221 78 234 56 78",
      email: "contact@electroplus.sn",
      since: "2019",
      completedJobs: 892
    },
    relatedServices: [1, 11]
  },
  {
    id: 3,
    name: "Développement Web Pro",
    category: "Digital",
    price: 60000,
    priceUnit: "FCFA",
    duration: "2j à 5j",
    description: "Création de sites modernes, rapides et optimisés pour les conversions.",
    longDescription: "Nous créons des sites web professionnels, modernes et parfaitement adaptés à votre activité. Notre équipe de développeurs expérimentés utilise les dernières technologies pour vous offrir un site rapide, sécurisé et optimisé pour le référencement.",
    icon: "💻",
    rating: 4.7,
    reviews: 567,
    deliveryTime: "5 jours",
    features: [
      "Design responsive et moderne",
      "Optimisation SEO complète",
      "Formation à l'utilisation",
      "Hébergement inclus (1 an)",
      "Maintenance mensuelle offerte",
      "Support technique 7j/7"
    ],
    images: categoryImages.Digital.gallery,
    provider: {
      name: "Cheikhou Sarr Solutions",
      avatar: providerAvatars.Digital,
      verified: true,
      phone: "+221 78 345 67 89",
      email: "contact@devsolutions.sn",
      since: "2018",
      completedJobs: 2056
    },
    relatedServices: [10]
  },
  {
    id: 4,
    name: "Transport Urbain Express",
    category: "Transport",
    price: 15000,
    priceUnit: "FCFA",
    duration: "30 min à 1h",
    description: "Livraison, déménagement et déplacement rapide selon vos besoins.",
    longDescription: "Service de transport fiable et rapide pour tous vos déplacements. Nous proposons des solutions adaptées à vos besoins : livraison de colis, transport de personnes, déménagement, etc. Nos chauffeurs sont professionnels et nos véhicules sont assurés.",
    icon: "🚚",
    rating: 4.6,
    reviews: 432,
    deliveryTime: "20 min",
    features: [
      "Suivi GPS en temps réel",
      "Assurance tous risques incluse",
      "Chauffeur professionnel",
      "Tarifs transparents",
      "Disponible 24h/24",
      "Véhicules climatisés"
    ],
    images: categoryImages.Transport.gallery,
    provider: {
      name: " Ndeye Awa Mbodj Mobility Sénégal",
      avatar: providerAvatars.Transport,
      verified: true,
      phone: "+221 78 456 78 90",
      email: "contact@mobility.sn",
      since: "2021",
      completedJobs: 3456
    },
    relatedServices: []
  },
  {
    id: 5,
    name: "Coiffure Premium",
    category: "Beauté",
    price: 20000,
    priceUnit: "FCFA",
    duration: "1h à 2h",
    description: "Coupe, brushing et soins de beauté réalisés par des professionnels.",
    longDescription: "Salon de coiffure haut de gamme offrant des prestations de qualité. Nos coiffeurs expérimentés vous conseillent et réalisent la coiffure qui vous correspond. Nous utilisons des produits naturels et respectueux de vos cheveux.",
    icon: "✂️",
    rating: 4.9,
    reviews: 321,
    deliveryTime: "1 heure",
    features: [
      "Produits bio et naturels",
      "Service à domicile disponible",
      "Premier rendez-vous offert",
      "Conseils personnalisés",
      "Soins capillaires inclus",
      "Ambiance relaxante"
    ],
    images: categoryImages.Beauté.gallery,
    provider: {
      name: "Selbe Guenn Beauty Studio",
      avatar: providerAvatars.Beauté,
      verified: true,
      phone: "+221 78 567 89 01",
      email: "contact@beautystudio.sn",
      since: "2020",
      completedJobs: 678
    },
    relatedServices: []
  },
  {
    id: 6,
    name: "Ménage Pro",
    category: "Entretien",
    price: 18000,
    priceUnit: "FCFA",
    duration: "2h à 4h",
    description: "Nettoyage complet et entretien régulier de votre espace.",
    longDescription: "Service de nettoyage professionnel pour vos locaux. Nous utilisons des produits écologiques et des équipements modernes pour un résultat impeccable. Que ce soit pour un nettoyage ponctuel ou régulier, nous nous adaptons à vos besoins.",
    icon: "🧹",
    rating: 4.8,
    reviews: 298,
    deliveryTime: "2 heures",
    features: [
      "Matériel professionnel fourni",
      "Assurance incluse",
      "Produits écologiques",
      "Intervenants formés",
      "Devis gratuit",
      "Forfaits personnalisés"
    ],
    images: categoryImages.Entretien.gallery,
    provider: {
      name: "Adama Thioune Clean Service",
      avatar: providerAvatars.Entretien,
      verified: true,
      phone: "+221 78 678 90 12",
      email: "contact@cleanservice.sn",
      since: "2019",
      completedJobs: 1456
    },
    relatedServices: []
  },
  {
    id: 7,
    name: "Jardinage & Paysagisme",
    category: "Jardinage",
    price: 35000,
    priceUnit: "FCFA",
    duration: "1j à 2j",
    description: "Entretien de jardin, tonte, taille et aménagement paysager.",
    longDescription: "Service complet d'entretien et d'aménagement de jardins. Nos jardiniers professionnels prennent soin de votre espace vert toute l'année. De la simple tonte à la création d'un jardin paysager, nous réalisons tous vos projets.",
    icon: "🌿",
    rating: 4.7,
    reviews: 156,
    deliveryTime: "1 jour",
    features: [
      "Matériel professionnel",
      "Conseils d'entretien personnalisés",
      "Forfait mensuel disponible",
      "Déplacement gratuit",
      "Traitement bio possible",
      "Garantie satisfaction"
    ],
    images: categoryImages.Jardinage.gallery,
    provider: {
      name: "Papa Mandoubé Green Garden",
      avatar: providerAvatars.Jardinage,
      verified: true,
      phone: "+221 78 789 01 23",
      email: "contact@greengarden.sn",
      since: "2021",
      completedJobs: 523
    },
    relatedServices: []
  },
  {
    id: 8,
    name: "Photographie Pro",
    category: "Photographie",
    price: 45000,
    priceUnit: "FCFA",
    duration: "2h à 4h",
    description: "Séances photo professionnelles, événements et portraits.",
    longDescription: "Photographe professionnel pour tous vos événements. Nous capturons vos moments précieux avec créativité et professionnalisme. Mariages, anniversaires, portraits professionnels, notre équipe s'adapte à vos besoins.",
    icon: "📷",
    rating: 4.9,
    reviews: 203,
    deliveryTime: "3 jours",
    features: [
      "Photos retouchées HD",
      "Album numérique offert",
      "Droit d'auteur inclus",
      "Déplacement gratuit",
      "Matériel professionnel",
      "Satisfaction garantie"
    ],
    images: categoryImages.Photographie.gallery,
    provider: {
      name: "Khady Pene Art Photo Studio",
      avatar: providerAvatars.Photographie,
      verified: true,
      phone: "+221 78 890 12 34",
      email: "contact@artphoto.sn",
      since: "2018",
      completedJobs: 2345
    },
    relatedServices: []
  },
  {
    id: 9,
    name: "Cours Particuliers",
    category: "Éducation",
    price: 15000,
    priceUnit: "FCFA/heure",
    duration: "1h à 2h",
    description: "Soutien scolaire et cours particuliers toutes matières.",
    longDescription: "Professeur particulier pour un accompagnement personnalisé. Nous proposons des cours dans toutes les matières pour tous les niveaux. Nos professeurs sont qualifiés et expérimentés.",
    icon: "📚",
    rating: 4.8,
    reviews: 456,
    deliveryTime: "24h",
    features: [
      "Premier cours offert",
      "Profils vérifiés et certifiés",
      "Suivi pédagogique régulier",
      "Cours à domicile ou en ligne",
      "Horaires flexibles",
      "Tarifs dégressifs"
    ],
    images: categoryImages.Éducation.gallery,
    provider: {
      name: " Adama Fall Educ Plus",
      avatar: providerAvatars.Éducation,
      verified: true,
      phone: "+221 78 901 23 45",
      email: "contact@educplus.sn",
      since: "2020",
      completedJobs: 3456
    },
    relatedServices: []
  },
  {
    id: 10,
    name: "Design Graphique",
    category: "Digital",
    price: 50000,
    priceUnit: "FCFA",
    duration: "2j à 3j",
    description: "Logo, charte graphique et supports de communication.",
    longDescription: "Designer créatif pour votre identité visuelle. Nous créons des designs uniques qui reflètent votre marque et attirent vos clients. Logos, chartes graphiques, supports de communication, nous réalisons tous vos projets créatifs.",
    icon: "🎨",
    rating: 4.9,
    reviews: 234,
    deliveryTime: "3 jours",
    features: [
      "3 concepts de logo proposés",
      "Sources haute définition incluses",
      "Modifications illimitées",
      "Charte graphique complète",
      "Visuels sur mesure",
      "Droits d'utilisation inclus"
    ],
    images: categoryImages.Digital.gallery,
    provider: {
      name: "Aminata Creative Design",
      avatar: providerAvatars.Digital,
      verified: true,
      phone: "+221 78 012 34 56",
      email: "contact@creativedesign.sn",
      since: "2019",
      completedJobs: 1789
    },
    relatedServices: [3]
  },
  {
    id: 11,
    name: "Climatisation",
    category: "Électricité",
    price: 40000,
    priceUnit: "FCFA",
    duration: "2h à 3h",
    description: "Installation et entretien de climatiseurs.",
    longDescription: "Service rapide et professionnel pour l'installation et l'entretien de vos climatiseurs. Nous intervenons pour l'installation, la maintenance et le dépannage de tous types de climatiseurs.",
    icon: "❄️",
    rating: 4.7,
    reviews: 167,
    deliveryTime: "1 heure",
    features: [
      "Diagnostic gratuit",
      "Garantie 6 mois",
      "Produits certifiés",
      "Installation rapide",
      "Maintenance préventive",
      "Service d'urgence"
    ],
    images: categoryImages.Électricité.gallery,
    provider: {
      name: "Abibou Diop Clim Services",
      avatar: providerAvatars.Électricité,
      verified: true,
      phone: "+221 78 123 45 67",
      email: "contact@climservices.sn",
      since: "2021",
      completedJobs: 890
    },
    relatedServices: [2]
  },
  {
    id: 12,
    name: "Garde d'enfants",
    category: "Services",
    price: 10000,
    priceUnit: "FCFA/heure",
    duration: "Selon besoin",
    description: "Baby-sitting et garde d'enfants à domicile.",
    longDescription: "Service de garde d'enfants professionnel et sécurisé. Nos baby-sitters sont expérimentées, formées aux premiers secours et vérifiées. Nous assurons la sécurité et le bien-être de vos enfants.",
    icon: "👶",
    rating: 4.9,
    reviews: 389,
    deliveryTime: "30 min",
    features: [
      "Formation premiers secours",
      "Activités ludiques",
      "Aide aux devoirs incluse",
      "Extrascolaire possible",
      "Horaires flexibles",
      "Suivi parental"
    ],
    images: categoryImages.Services.gallery,
    provider: {
      name: "Saliou Diatta Kids Care",
      avatar: providerAvatars.Services,
      verified: true,
      phone: "+221 78 234 56 78",
      email: "contact@kidscare.sn",
      since: "2020",
      completedJobs: 2345
    },
    relatedServices: []
  }
];

// Composant d'évaluation par étoiles
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : ""}`}>
          ★
        </span>
      ))}
      <span className="rating-value">{rating}</span>
    </div>
  );
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Récupération du service
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const foundService = servicesData.find((item) => item.id === Number(id));
      setService(foundService || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

  // Récupération des services similaires
  const getRelatedServices = () => {
    if (!service) return [];
    return servicesData.filter(s => 
      service.relatedServices?.includes(s.id) || 
      (s.category === service.category && s.id !== service.id)
    ).slice(0, 3);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    // Simulation d'envoi de réservation
    setTimeout(() => {
      setIsBooking(false);
      setShowBookingForm(false);
      alert("✅ Demande de réservation envoyée ! Un prestataire vous contactera sous 24h.");
    }, 1500);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="service-detail-loading">
          <div className="spinner"></div>
          <p>Chargement du service...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="service-not-found">
          <div className="not-found-icon">🔍</div>
          <h2>Service introuvable</h2>
          <p>Le service que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/services" className="btn-primary-custom">
            Retour aux services
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const relatedServices = getRelatedServices();

  return (
    <>
      <Navbar />
      
      <div className="service-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb-section">
          <div className="container-custom">
            <div className="breadcrumb-nav">
              <Link to="/">Accueil</Link>
              <span className="separator">›</span>
              <Link to="/services">Services</Link>
              <span className="separator">›</span>
              <span className="current">{service.name}</span>
            </div>
          </div>
        </div>

        {/* Service Header */}
        <section className="service-header">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="service-header-content"
            >
              <div className="service-category-badge">
                <span className="service-icon">{service.icon}</span>
                {service.category}
              </div>
              <h1 className="service-title">{service.name}</h1>
              <div className="service-meta">
                <StarRating rating={service.rating} />
                <span className="reviews-count">({service.reviews} avis clients)</span>
                <span className="delivery-time">⏱️ Intervention sous {service.deliveryTime}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="service-main">
          <div className="container-custom">
            <div className="service-grid">
              {/* Left Column - Images & Details */}
              <div className="service-gallery">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="main-image"
                >
                  <img 
                    src={categoryImages[service.category as keyof typeof categoryImages]?.main || categoryImages.Services.main} 
                    alt={service.name}
                  />
                </motion.div>
                <div className="thumbnails">
                  {service.images.map((img, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={img} alt={`${service.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="service-description-full"
                >
                  <h3>À propos de ce service</h3>
                  <p>{service.longDescription || service.description}</p>
                  
                  <h3>Ce que vous obtenez</h3>
                  <ul className="features-list">
                    {service.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="check-icon">✓</span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Right Column - Booking Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="booking-card"
              >
                <div className="price-section">
                  <div className="price">
                    <span className="price-amount">{service.price.toLocaleString()}</span>
                    <span className="price-unit">{service.priceUnit}</span>
                  </div>
                  <div className="duration">
                    <span>⏱️ Durée : {service.duration}</span>
                  </div>
                </div>

                <div className="info-item">
                  <strong>✅ Disponibilité</strong>
                  <p>Disponible aujourd'hui</p>
                </div>

                <div className="info-item">
                  <strong>📍 Lieu d'intervention</strong>
                  <p>Dakar et sa banlieue</p>
                </div>

                <button 
                  className="btn-book-now"
                  onClick={() => setShowBookingForm(!showBookingForm)}
                >
                  {showBookingForm ? "Annuler" : "Réserver maintenant"}
                </button>

                {showBookingForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="booking-form"
                    onSubmit={handleBooking}
                  >
                    <div className="form-group">
                      <label>Date souhaitée *</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label>Heure souhaitée *</label>
                      <input
                        type="time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Message (optionnel)</label>
                      <textarea
                        rows={3}
                        placeholder="Précisez votre besoin..."
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn-confirm-booking" disabled={isBooking}>
                      {isBooking ? "Envoi en cours..." : "Confirmer la réservation"}
                    </button>
                    <p className="booking-note">
                      * Un prestataire vous contactera sous 24h pour confirmer votre réservation
                    </p>
                  </motion.form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Provider Section */}
        <section className="provider-section">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="provider-card"
            >
              <div className="provider-header">
                <img src={service.provider.avatar} alt={service.provider.name} className="provider-avatar" />
                <div className="provider-info">
                  <h3>{service.provider.name}</h3>
                  <div className="provider-badges">
                    {service.provider.verified && (
                      <span className="badge-verified">✓ Vérifié</span>
                    )}
                    <span className="badge-experience">📅 Depuis {service.provider.since}</span>
                    <span className="badge-jobs">🏆 {service.provider.completedJobs}+ missions</span>
                  </div>
                </div>
              </div>
              <div className="provider-contact">
                <a href={`tel:${service.provider.phone}`} className="contact-phone">
                  📞 {service.provider.phone}
                </a>
                <a href={`mailto:${service.provider.email}`} className="contact-email">
                  ✉️ {service.provider.email}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="related-services">
            <div className="container-custom">
              <h2 className="section-title">Services similaires</h2>
              <div className="related-services-grid">
                {relatedServices.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="related-service-card"
                    onClick={() => navigate(`/services/${related.id}`)}
                  >
                    <div className="related-icon">{related.icon}</div>
                    <h3>{related.name}</h3>
                    <p>{related.description.substring(0, 60)}...</p>
                    <div className="related-price">
                      {related.price.toLocaleString()} {related.priceUnit}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container-custom">
            <h2 className="section-title">Questions fréquentes</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>Comment réserver ce service ?</h4>
                <p>Cliquez sur "Réserver maintenant" sur cette page, remplissez le formulaire avec vos informations, et un prestataire vous contactera sous 24h pour confirmer.</p>
              </div>
              <div className="faq-item">
                <h4>Comment se passe le paiement ?</h4>
                <p>Le paiement se fait directement au prestataire après validation du service. Vous pouvez payer en espèces, par virement ou par mobile money.</p>
              </div>
              <div className="faq-item">
                <h4>Puis-je annuler ma réservation ?</h4>
                <p>Oui, l'annulation est gratuite jusqu'à 2h avant le rendez-vous. Au-delà, des frais peuvent s'appliquer.</p>
              </div>
              <div className="faq-item">
                <h4>Que faire en cas de problème ?</h4>
                <p>Notre service client est disponible 24/7 au +221 78 123 45 67 ou par email à support@kayjob.sn</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ServiceDetail;