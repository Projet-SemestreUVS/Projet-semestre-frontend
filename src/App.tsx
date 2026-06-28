import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Services from "./pages/public/Services";
import ServiceDetail from "./pages/public/ServiceDetail";
import NotFound from "./pages/public/NotFound";

// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";

// ROUTES PROTÉGÉES
import AdminRoute from "./routes/AdminRoute";
import PrestataireRoute from "./routes/PrestataireRoute";
import DemandeurRoute from "./routes/DemandeurRoute";

// ADMIN
import Statistiques from "./pages/admin/Statistiques";
import Utilisateurs from "./pages/admin/Utilisateurs";
import Categories from "./pages/admin/Categories";
import ServicesAdmin from "./pages/admin/Services";
import CreateService from "./pages/admin/CreateService";
import ReservationsAdmin from "./pages/admin/ReservationsAdmin";
import { Avis } from "./pages/admin/Avis";

// PRESTATAIRE
import DashboardPrestataire from "./pages/prestataire/DashboardPrestataire";
import MesServices from "./pages/prestataire/MesServices";
import AjouterService from "./pages/prestataire/AjouterService";
import ModifierService from "./pages/prestataire/ModifierService";
import ReservationsRecues from "./pages/prestataire/ReservationsRecues";
import MessagesPrestataire from "./pages/prestataire/Messages";
import NotificationsPrestataire from "./pages/prestataire/Notifications";
import ProfilePrestataire from "./pages/prestataire/Profile";

// DEMANDEUR
import DashboardDemandeur from "./pages/demandeur/DashboardDemandeur";
import MesReservations from "./pages/demandeur/MesReservations";
import FaireReservation from "./pages/demandeur/FaireReservation";
import MesAvis from "./pages/demandeur/MesAvis";
import MessagesDemandeur from "./pages/demandeur/Messages";
import NotificationsDemandeur from "./pages/demandeur/Notifications";
import ProfileDemandeur from "./pages/demandeur/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ADMIN */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin/statistiques"
            element={<Statistiques />}
          />

          <Route
            path="/admin/users"
            element={<Utilisateurs />}
          />

          <Route
            path="/admin/categories"
            element={<Categories />}
          />

          <Route
            path="/admin/services"
            element={<ServicesAdmin />}
          />

          {/* AJOUT SERVICE */}
          <Route
            path="/admin/services/create"
            element={<CreateService />}
          />

          <Route
            path="/admin/reservations"
            element={<ReservationsAdmin />}
          />

          <Route
            path="/admin/reviews"
            element={<Avis />}
          />
        </Route>

        {/* PRESTATAIRE */}
        <Route element={<PrestataireRoute />}>
          <Route path="/prestataire/dashboard" element={<DashboardPrestataire />} />
          <Route path="/prestataire/services" element={<MesServices />} />
          <Route path="/prestataire/services/ajouter" element={<AjouterService />} />
          <Route path="/prestataire/services/modifier/:id" element={<ModifierService />} />
          <Route path="/prestataire/reservations" element={<ReservationsRecues />} />
          <Route path="/prestataire/messages" element={<MessagesPrestataire />} />
          <Route path="/prestataire/notifications" element={<NotificationsPrestataire />} />
          <Route path="/prestataire/profile" element={<ProfilePrestataire />} />
        </Route>

        {/* DEMANDEUR */}
        <Route element={<DemandeurRoute />}>
          <Route path="/demandeur/dashboard" element={<DashboardDemandeur />} />
          <Route path="/demandeur/reservations" element={<MesReservations />} />
          <Route path="/demandeur/reservation/nouvelle" element={<FaireReservation />} />
          <Route path="/demandeur/avis" element={<MesAvis />} />
          <Route path="/demandeur/messages" element={<MessagesDemandeur />} />
          <Route path="/demandeur/notifications" element={<NotificationsDemandeur />} />
          <Route path="/demandeur/profile" element={<ProfileDemandeur />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;