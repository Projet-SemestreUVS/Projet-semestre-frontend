// src/pages/admin/Statistiques.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";

interface StatData {
  users: {
    total: number;
    admins: number;
    prestataires: number;
    demandeurs: number;
    actifs: number;
    inactifs: number;
    suspendus: number;
    nouveaux: number;
  };
  services: {
    total: number;
    actifs: number;
    inactifs: number;
    en_attente: number;
    categories: { nom: string; count: number; icon?: string; color?: string }[];
    prix_moyen: number;
    prix_min: number;
    prix_max: number;
  };
  categories: {
    total: number;
    actives: number;
    inactives: number;
    total_services: number;
    moyenne_services: number;
    plus_populaire: { nom: string; count: number; icon?: string; color?: string } | null;
    moins_populaire: { nom: string; count: number; icon?: string; color?: string } | null;
    repartition: { nom: string; count: number; icon?: string; color?: string }[];
  };
  reservations: {
    total: number;
    en_attente: number;
    confirmees: number;
    terminees: number;
    annulees: number;
    par_mois: { mois: string; total: number }[];
    par_statut: { statut: string; count: number }[];
    par_categorie: { categorie: string; count: number }[];
  };
  avis: {
    total: number;
    moyenne: number;
    distribution: { note: number; count: number }[];
    approuves: number;
    en_attente: number;
    signales: number;
    par_mois: { mois: string; total: number }[];
    par_categorie: { categorie: string; note: number; count: number }[];
  };
  revenus: {
    total: number;
    par_mois: { mois: string; total: number }[];
    par_service: { service: string; total: number }[];
    par_categorie: { categorie: string; total: number }[];
  };
  performances: {
    taux_engagement: number;
    taux_conversion: number;
    satisfaction: number;
    croissance: number;
  };
}

const Statistiques = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"7j" | "30j" | "90j" | "365j">("30j");
  const [activeTab, setActiveTab] = useState<"global" | "users" | "services" | "categories" | "reservations" | "avis">("global");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 300);
    loadStats();
  }, [selectedPeriod]);

  const loadStats = () => {
    try {
      // Récupération des données depuis localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const services = JSON.parse(localStorage.getItem("services") || "[]");
      const categories = JSON.parse(localStorage.getItem("categories") || "[]");
      const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
      const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");

      // Calcul des statistiques utilisateurs
      const userStats = {
        total: users.length,
        admins: users.filter((u: any) => u.role === "admin").length,
        prestataires: users.filter((u: any) => u.role === "prestataire").length,
        demandeurs: users.filter((u: any) => u.role === "demandeur").length,
        actifs: users.filter((u: any) => u.status === "actif").length,
        inactifs: users.filter((u: any) => u.status === "inactif").length,
        suspendus: users.filter((u: any) => u.status === "suspendu").length,
        nouveaux: users.filter((u: any) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(u.created_at) > weekAgo;
        }).length,
      };

      // Calcul des statistiques services
      const serviceStats = {
        total: services.length,
        actifs: services.filter((s: any) => s.statut === "actif").length,
        inactifs: services.filter((s: any) => s.statut === "inactif").length,
        en_attente: services.filter((s: any) => s.statut === "en_attente").length,
        categories: categories.map((c: any) => ({
          nom: c.name,
          count: services.filter((s: any) => s.categorie === c.name).length,
          icon: c.icon || "📂",
          color: c.color || "#4F46E5"
        })).filter((c: any) => c.count > 0),
        prix_moyen: services.length > 0 ? services.reduce((acc: number, s: any) => acc + s.prix, 0) / services.length : 0,
        prix_min: services.length > 0 ? Math.min(...services.map((s: any) => s.prix)) : 0,
        prix_max: services.length > 0 ? Math.max(...services.map((s: any) => s.prix)) : 0,
      };

      // Calcul des statistiques catégories
      const totalServices = services.length;
      const categoryStats = {
        total: categories.length,
        actives: categories.filter((c: any) => c.status === "actif").length,
        inactives: categories.filter((c: any) => c.status === "inactif").length,
        total_services: totalServices,
        moyenne_services: categories.length > 0 ? totalServices / categories.length : 0,
        plus_populaire: null as { nom: string; count: number; icon?: string; color?: string } | null,
        moins_populaire: null as { nom: string; count: number; icon?: string; color?: string } | null,
        repartition: categories.map((c: any) => ({
          nom: c.name,
          count: services.filter((s: any) => s.categorie === c.name).length,
          icon: c.icon || "📂",
          color: c.color || "#4F46E5"
        })).sort((a: any, b: any) => b.count - a.count),
      };

      // Déterminer la catégorie la plus et moins populaire
      if (categoryStats.repartition.length > 0) {
        categoryStats.plus_populaire = categoryStats.repartition[0];
        categoryStats.moins_populaire = categoryStats.repartition[categoryStats.repartition.length - 1];
      }

      // Calcul des statistiques réservations
      const reservationStats = {
        total: reservations.length,
        en_attente: reservations.filter((r: any) => r.statut === "en_attente").length,
        confirmees: reservations.filter((r: any) => r.statut === "confirmee").length,
        terminees: reservations.filter((r: any) => r.statut === "terminee").length,
        annulees: reservations.filter((r: any) => r.statut === "annulee").length,
        par_mois: getMonthlyData(reservations, "date_debut"),
        par_statut: [
          { statut: "En attente", count: reservations.filter((r: any) => r.statut === "en_attente").length },
          { statut: "Confirmées", count: reservations.filter((r: any) => r.statut === "confirmee").length },
          { statut: "Terminées", count: reservations.filter((r: any) => r.statut === "terminee").length },
          { statut: "Annulées", count: reservations.filter((r: any) => r.statut === "annulee").length },
        ].filter(s => s.count > 0),
        par_categorie: categories.map((c: any) => ({
          categorie: c.name,
          count: reservations.filter((r: any) => r.service?.categorie === c.name).length
        })).filter((c: any) => c.count > 0).sort((a: any, b: any) => b.count - a.count),
      };

      // Calcul des statistiques avis
      const avisStats = {
        total: reviews.length,
        moyenne: reviews.length > 0 ? reviews.reduce((acc: number, r: any) => acc + r.note, 0) / reviews.length : 0,
        distribution: [1, 2, 3, 4, 5].map(n => ({
          note: n,
          count: reviews.filter((r: any) => r.note === n).length
        })).filter(d => d.count > 0),
        approuves: reviews.filter((r: any) => r.status === "approuve").length,
        en_attente: reviews.filter((r: any) => r.status === "en_attente").length,
        signales: reviews.filter((r: any) => r.status === "signale").length,
        par_mois: getMonthlyData(reviews, "createdAt"),
        par_categorie: categories.map((c: any) => {
          const catReviews = reviews.filter((r: any) => r.service?.categorie === c.name);
          return {
            categorie: c.name,
            note: catReviews.length > 0 ? catReviews.reduce((acc: number, r: any) => acc + r.note, 0) / catReviews.length : 0,
            count: catReviews.length
          };
        }).filter((c: any) => c.count > 0).sort((a: any, b: any) => b.note - a.note),
      };

      // Calcul des revenus
      const revenusTotal = reservations.reduce((acc: number, r: any) => {
        if (r.statut === "terminee" || r.statut === "confirmee") {
          return acc + (r.service?.prix || 0);
        }
        return acc;
      }, 0);

      const revenusStats = {
        total: revenusTotal,
        par_mois: getMonthlyRevenue(reservations),
        par_service: getServiceRevenue(reservations),
        par_categorie: categories.map((c: any) => ({
          categorie: c.name,
          total: reservations
            .filter((r: any) => r.service?.categorie === c.name && (r.statut === "terminee" || r.statut === "confirmee"))
            .reduce((acc: number, r: any) => acc + (r.service?.prix || 0), 0)
        })).filter((c: any) => c.total > 0).sort((a: any, b: any) => b.total - a.total),
      };

      // Performances
      const performances = {
        taux_engagement: userStats.total > 0 ? (reservations.length / userStats.total) * 100 : 0,
        taux_conversion: services.length > 0 ? (reservations.filter((r: any) => r.statut === "terminee").length / services.length) * 100 : 0,
        satisfaction: avisStats.moyenne,
        croissance: userStats.nouveaux,
      };

      setStats({
        users: userStats,
        services: serviceStats,
        categories: categoryStats,
        reservations: reservationStats,
        avis: avisStats,
        revenus: revenusStats,
        performances: performances,
      });

      setError(null);
    } catch (err) {
      console.error("Erreur de chargement des stats:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyData = (items: any[], dateField: string) => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const monthCounts = new Array(12).fill(0);
    
    items.forEach((item: any) => {
      const date = new Date(item[dateField]);
      if (!isNaN(date.getTime())) {
        monthCounts[date.getMonth()]++;
      }
    });

    return months.map((mois, index) => ({
      mois,
      total: monthCounts[index]
    }));
  };

  const getMonthlyRevenue = (reservations: any[]) => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const monthRevenue = new Array(12).fill(0);
    
    reservations.forEach((r: any) => {
      const date = new Date(r.date_debut);
      if (!isNaN(date.getTime()) && (r.statut === "terminee" || r.statut === "confirmee")) {
        monthRevenue[date.getMonth()] += r.service?.prix || 0;
      }
    });

    return months.map((mois, index) => ({
      mois,
      total: monthRevenue[index]
    }));
  };

  const getServiceRevenue = (reservations: any[]) => {
    const serviceMap = new Map();
    
    reservations.forEach((r: any) => {
      if (r.statut === "terminee" || r.statut === "confirmee") {
        const nom = r.service?.nom || "Service inconnu";
        serviceMap.set(nom, (serviceMap.get(nom) || 0) + (r.service?.prix || 0));
      }
    });

    return Array.from(serviceMap.entries())
      .map(([service, total]) => ({ service, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  const formatCurrency = (num: number) => {
    return num.toLocaleString('fr-FR') + ' FCFA';
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "400px", 
          gap: "16px" 
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#4F46E5",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}></div>
          <p style={{ color: "#64748b", fontWeight: "500" }}>Analyse des données en cours...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !stats) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
          gap: "16px"
        }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: "#fee2e2", 
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px"
          }}>
            ⚠️
          </div>
          <h3 style={{ color: "#1a202c", margin: 0 }}>Erreur de chargement</h3>
          <p style={{ color: "#64748b", margin: 0 }}>{error || "Impossible de charger les données"}</p>
          <button 
            onClick={loadStats}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            🔄 Réessayer
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* En-tête */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          marginBottom: "32px", 
          flexWrap: "wrap", 
          gap: "16px" 
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: "#1a202c", 
              margin: "0 0 4px 0", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px" 
            }}>
              <span style={{ fontSize: "32px" }}>📊</span>
              Tableau de bord
            </h1>
            <p style={{ color: "#718096", fontSize: "15px", margin: 0 }}>
              Vue d'ensemble des performances de la plateforme KayJob
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["7j", "30j", "90j", "365j"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                style={{
                  padding: "8px 16px",
                  background: selectedPeriod === period ? "#4F46E5" : "#f1f5f9",
                  color: selectedPeriod === period ? "white" : "#475569",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {period === "7j" ? "7 jours" : period === "30j" ? "30 jours" : period === "90j" ? "90 jours" : "1 an"}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs Principaux */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {[
            { label: "Utilisateurs", value: stats.users.total, icon: "👥", color: "#3b82f6", bg: "#eff6ff" },
            { label: "Services", value: stats.services.total, icon: "🛠️", color: "#16a34a", bg: "#dcfce7" },
            { label: "Catégories", value: stats.categories.total, icon: "📁", color: "#8b5cf6", bg: "#f3e8ff" },
            { label: "Réservations", value: stats.reservations.total, icon: "📅", color: "#d97706", bg: "#fef3c7" },
            { label: "Avis", value: stats.avis.total, icon: "⭐", color: "#ec4899", bg: "#fce7f3" },
            { label: "Revenus", value: formatCurrency(stats.revenus.total), icon: "💰", color: "#22c55e", bg: "#dcfce7" },
          ].map((kpi, index) => (
            <div key={index} style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9",
              transition: "all 0.3s ease",
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${index * 0.1}s`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{kpi.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: "#1a202c", marginTop: "4px" }}>
                    {kpi.value}
                  </div>
                </div>
                <div style={{
                  width: "44px",
                  height: "44px",
                  background: kpi.bg,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px"
                }}>
                  {kpi.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Onglets de navigation */}
        <div style={{
          display: "flex",
          gap: "4px",
          background: "#f1f5f9",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "24px",
          overflowX: "auto"
        }}>
          {[
            { id: "global", label: "🌍 Global" },
            { id: "users", label: "👥 Utilisateurs" },
            { id: "services", label: "🛠️ Services" },
            { id: "categories", label: "📁 Catégories" },
            { id: "reservations", label: "📅 Réservations" },
            { id: "avis", label: "⭐ Avis" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "10px 20px",
                background: activeTab === tab.id ? "white" : "transparent",
                color: activeTab === tab.id ? "#1a202c" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: activeTab === tab.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === "global" && (
          <>
            {/* Performances */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px"
            }}>
              {[
                { label: "Taux d'engagement", value: stats.performances.taux_engagement.toFixed(1) + "%", icon: "🎯", desc: "Utilisateurs actifs" },
                { label: "Taux de conversion", value: stats.performances.taux_conversion.toFixed(1) + "%", icon: "📈", desc: "Services réservés" },
                { label: "Satisfaction", value: stats.performances.satisfaction.toFixed(1) + " ⭐", icon: "😊", desc: "Note moyenne" },
                { label: "Croissance", value: "+" + stats.performances.croissance, icon: "🚀", desc: "Nouveaux utilisateurs" },
              ].map((perf, index) => (
                <div key={index} style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #f1f5f9",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{perf.icon}</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: "#1a202c" }}>
                    {perf.value}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a202c" }}>{perf.label}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>{perf.desc}</div>
                </div>
              ))}
            </div>

            {/* Graphiques Global */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "24px"
            }}>
              <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #f1f5f9"
              }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                  📊 Réservations par mois
                </h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px" }}>
                  {stats.reservations.par_mois.map((item, index) => {
                    const max = Math.max(...stats.reservations.par_mois.map(d => d.total), 1);
                    const height = (item.total / max) * 180;
                    return (
                      <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: "100%",
                          height: `${Math.max(height, 4)}px`,
                          background: "linear-gradient(180deg, #4F46E5, #7C3AED)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.6s ease",
                          minHeight: height > 0 ? "4px" : "0"
                        }}></div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>{item.mois}</div>
                        <div style={{ fontSize: "9px", fontWeight: "600", color: "#4F46E5" }}>{item.total}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #f1f5f9"
              }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                  💰 Revenus par mois
                </h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px" }}>
                  {stats.revenus.par_mois.map((item, index) => {
                    const max = Math.max(...stats.revenus.par_mois.map(d => d.total), 1);
                    const height = (item.total / max) * 180;
                    return (
                      <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: "100%",
                          height: `${Math.max(height, 4)}px`,
                          background: "linear-gradient(180deg, #22c55e, #16a34a)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.6s ease",
                          minHeight: height > 0 ? "4px" : "0"
                        }}></div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>{item.mois}</div>
                        <div style={{ fontSize: "9px", fontWeight: "600", color: "#16a34a" }}>
                          {item.total > 0 ? (item.total / 1000).toFixed(1) + "k" : "0"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Catégories */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                🏆 Top 5 catégories les plus populaires
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {stats.categories.repartition.slice(0, 5).map((cat, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9"
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: cat.color || "#4F46E5",
                      borderRadius: "10px",
                      fontSize: "20px"
                    }}>
                      {cat.icon || "📂"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a202c" }}>{cat.nom}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{cat.count} services</div>
                    </div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#4F46E5"
                    }}>
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Onglet Utilisateurs */}
        {activeTab === "users" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                👥 Répartition des utilisateurs
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Administrateurs", value: stats.users.admins, color: "#dc2626" },
                  { label: "Prestataires", value: stats.users.prestataires, color: "#16a34a" },
                  { label: "Demandeurs", value: stats.users.demandeurs, color: "#3b82f6" },
                ].map((item, index) => {
                  const percentage = stats.users.total > 0 ? (item.value / stats.users.total) * 100 : 0;
                  return (
                    <div key={index}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "#475569" }}>{item.label}</span>
                        <span style={{ fontWeight: "600", color: "#1a202c" }}>
                          {item.value} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginTop: "4px"
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: "4px",
                          transition: "width 1s ease",
                          width: animate ? `${percentage}%` : "0%"
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                📊 Statut des utilisateurs
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Actifs", value: stats.users.actifs, color: "#22c55e" },
                  { label: "Inactifs", value: stats.users.inactifs, color: "#ef4444" },
                  { label: "Suspendus", value: stats.users.suspendus, color: "#f59e0b" },
                ].map((item, index) => {
                  const percentage = stats.users.total > 0 ? (item.value / stats.users.total) * 100 : 0;
                  return (
                    <div key={index}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "#475569" }}>{item.label}</span>
                        <span style={{ fontWeight: "600", color: "#1a202c" }}>
                          {item.value} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginTop: "4px"
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: "4px",
                          transition: "width 1s ease",
                          width: animate ? `${percentage}%` : "0%"
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Services */}
        {activeTab === "services" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                📊 Répartition des services
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Actifs", value: stats.services.actifs, color: "#22c55e" },
                  { label: "En attente", value: stats.services.en_attente, color: "#f59e0b" },
                  { label: "Inactifs", value: stats.services.inactifs, color: "#ef4444" },
                ].map((item, index) => {
                  const percentage = stats.services.total > 0 ? (item.value / stats.services.total) * 100 : 0;
                  return (
                    <div key={index}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "#475569" }}>{item.label}</span>
                        <span style={{ fontWeight: "600", color: "#1a202c" }}>
                          {item.value} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginTop: "4px"
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: "4px",
                          transition: "width 1s ease",
                          width: animate ? `${percentage}%` : "0%"
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                💰 Informations prix
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Prix moyen</span>
                  <span style={{ fontWeight: "600", color: "#1a202c" }}>
                    {formatCurrency(stats.services.prix_moyen)}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Prix minimum</span>
                  <span style={{ fontWeight: "600", color: "#16a34a" }}>
                    {formatCurrency(stats.services.prix_min)}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Prix maximum</span>
                  <span style={{ fontWeight: "600", color: "#ef4444" }}>
                    {formatCurrency(stats.services.prix_max)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Catégories */}
        {activeTab === "categories" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                📊 Statistiques générales
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Total catégories</span>
                  <span style={{ fontWeight: "700", color: "#1a202c", fontSize: "18px" }}>
                    {stats.categories.total}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Catégories actives</span>
                  <span style={{ fontWeight: "600", color: "#16a34a" }}>
                    {stats.categories.actives} ({stats.categories.total > 0 ? ((stats.categories.actives / stats.categories.total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Catégories inactives</span>
                  <span style={{ fontWeight: "600", color: "#ef4444" }}>
                    {stats.categories.inactives} ({stats.categories.total > 0 ? ((stats.categories.inactives / stats.categories.total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Services par catégorie (moyenne)</span>
                  <span style={{ fontWeight: "600", color: "#d97706" }}>
                    {stats.categories.moyenne_services.toFixed(1)}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <span style={{ color: "#475569" }}>Total services</span>
                  <span style={{ fontWeight: "700", color: "#1a202c", fontSize: "18px" }}>
                    {stats.categories.total_services}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                🏆 Catégories populaires
              </h3>
              {stats.categories.plus_populaire && (
                <div style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  borderRadius: "12px",
                  marginBottom: "12px",
                  border: "1px solid #f59e0b"
                }}>
                  <div style={{ fontSize: "12px", color: "#92400e", fontWeight: "600" }}>⭐ PLUS POPULAIRE</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: stats.categories.plus_populaire.color || "#4F46E5",
                      borderRadius: "10px",
                      fontSize: "20px"
                    }}>
                      {stats.categories.plus_populaire.icon || "📂"}
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#78350f" }}>
                        {stats.categories.plus_populaire.nom}
                      </div>
                      <div style={{ fontSize: "13px", color: "#92400e" }}>
                        {stats.categories.plus_populaire.count} services
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {stats.categories.moins_populaire && (
                <div style={{
                  padding: "16px",
                  background: "#f1f5f9",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0"
                }}>
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>📉 MOINS POPULAIRE</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: stats.categories.moins_populaire.color || "#94a3b8",
                      borderRadius: "10px",
                      fontSize: "20px"
                    }}>
                      {stats.categories.moins_populaire.icon || "📂"}
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#475569" }}>
                        {stats.categories.moins_populaire.nom}
                      </div>
                      <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                        {stats.categories.moins_populaire.count} services
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Répartition des catégories */}
            <div style={{
              gridColumn: "span 2",
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                📊 Répartition des services par catégorie
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {stats.categories.repartition.map((cat, index) => {
                  const percentage = stats.categories.total_services > 0 ? (cat.count / stats.categories.total_services) * 100 : 0;
                  return (
                    <div key={index}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "18px" }}>{cat.icon || "📂"}</span>
                          <span style={{ color: "#475569" }}>{cat.nom}</span>
                        </div>
                        <span style={{ fontWeight: "600", color: "#1a202c" }}>
                          {cat.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginTop: "4px"
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: cat.color || "#4F46E5",
                          borderRadius: "4px",
                          transition: "width 1s ease",
                          width: animate ? `${percentage}%` : "0%"
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Réservations */}
        {activeTab === "reservations" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                📊 Statut des réservations
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {stats.reservations.par_statut.map((item, index) => {
                  const percentage = stats.reservations.total > 0 ? (item.count / stats.reservations.total) * 100 : 0;
                  const colors: { [key: string]: string } = {
                    "En attente": "#f59e0b",
                    "Confirmées": "#3b82f6",
                    "Terminées": "#22c55e",
                    "Annulées": "#ef4444"
                  };
                  return (
                    <div key={index}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "#475569" }}>{item.statut}</span>
                        <span style={{ fontWeight: "600", color: "#1a202c" }}>
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginTop: "4px"
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: colors[item.statut] || "#8b5cf6",
                          borderRadius: "4px",
                          transition: "width 1s ease",
                          width: animate ? `${percentage}%` : "0%"
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                📊 Réservations par catégorie
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {stats.reservations.par_categorie.length > 0 ? (
                  stats.reservations.par_categorie.slice(0, 5).map((item, index) => {
                    const percentage = stats.reservations.total > 0 ? (item.count / stats.reservations.total) * 100 : 0;
                    return (
                      <div key={index}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                          <span style={{ color: "#475569" }}>{item.categorie}</span>
                          <span style={{ fontWeight: "600", color: "#1a202c" }}>
                            {item.count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div style={{
                          width: "100%",
                          height: "8px",
                          background: "#f1f5f9",
                          borderRadius: "4px",
                          overflow: "hidden",
                          marginTop: "4px"
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e"][index % 5],
                            borderRadius: "4px",
                            transition: "width 1s ease",
                            width: animate ? `${percentage}%` : "0%"
                          }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                    Aucune réservation par catégorie
                  </div>
                )}
              </div>
            </div>

            {/* Revenus par catégorie */}
            <div style={{
              gridColumn: "span 2",
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                💰 Revenus par catégorie
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {stats.revenus.par_categorie.length > 0 ? (
                  stats.revenus.par_categorie.map((item, index) => (
                    <div key={index} style={{
                      padding: "16px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px solid #f1f5f9",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>{item.categorie}</div>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#1a202c", marginTop: "4px" }}>
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                    Aucune donnée de revenu par catégorie
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Avis */}
        {activeTab === "avis" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                ⭐ Distribution des notes
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {stats.avis.distribution.length > 0 ? (
                  stats.avis.distribution
                    .sort((a, b) => b.note - a.note)
                    .map((item) => {
                      const percentage = stats.avis.total > 0 ? (item.count / stats.avis.total) * 100 : 0;
                      return (
                        <div key={item.note}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                            <span style={{ color: "#475569" }}>
                              {item.note} ⭐
                            </span>
                            <span style={{ fontWeight: "600", color: "#1a202c" }}>
                              {item.count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div style={{
                            width: "100%",
                            height: "8px",
                            background: "#f1f5f9",
                            borderRadius: "4px",
                            overflow: "hidden",
                            marginTop: "4px"
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: "100%",
                              background: item.note >= 4 ? "#22c55e" : item.note >= 3 ? "#f59e0b" : "#ef4444",
                              borderRadius: "4px",
                              transition: "width 1s ease",
                              width: animate ? `${percentage}%` : "0%"
                            }}></div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                    Aucun avis disponible
                  </div>
                )}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f1f5f9"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>
                📊 Avis par catégorie
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {stats.avis.par_categorie.length > 0 ? (
                  stats.avis.par_categorie.slice(0, 5).map((item, index) => {
                    const stars = "⭐".repeat(Math.round(item.note)) + "☆".repeat(5 - Math.round(item.note));
                    return (
                      <div key={index} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 12px",
                        background: "#f8fafc",
                        borderRadius: "8px"
                      }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a202c" }}>
                            {item.categorie}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {item.count} avis
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "14px" }}>{stars}</div>
                          <div style={{ fontSize: "12px", fontWeight: "600", color: "#d97706" }}>
                            {item.note.toFixed(1)} / 5
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                    Aucun avis par catégorie
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Statistiques;