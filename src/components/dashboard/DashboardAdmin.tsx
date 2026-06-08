import { useEffect, useState } from "react";

import DashboardLayout from
"../../components/dashboard/DashboardLayout";

import AdminSidebar from
"../../components/dashboard/AdminSidebar";

import StatCard from
"../../components/admin/StatCard";

import { getStats }
from "../../services/adminService";

const DashboardAdmin = () => {

  const [stats,setStats] = useState({

    users:0,

    services:0,

    reservations:0,

    avis:0,
  });

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const data =
        await getStats();

      setStats(data);

    } catch(error) {

      console.log(error);

    }
  };

  return (

    <DashboardLayout
      sidebar={<AdminSidebar />}
    >

      <div className="mb-4">

        <h2>
          Tableau de bord
        </h2>

        <p className="text-muted">

          Bienvenue Administrateur

        </p>

      </div>

      <div className="row g-4">

        <div className="col-md-3">

          <StatCard
            title="Utilisateurs"
            value={stats.users}
            icon="👥"
          />

        </div>

        <div className="col-md-3">

          <StatCard
            title="Services"
            value={stats.services}
            icon="🛠️"
          />

        </div>

        <div className="col-md-3">

          <StatCard
            title="Réservations"
            value={stats.reservations}
            icon="📅"
          />

        </div>

        <div className="col-md-3">

          <StatCard
            title="Avis"
            value={stats.avis}
            icon="⭐"
          />

        </div>

      </div>

    </DashboardLayout>
  );
};

export default DashboardAdmin;