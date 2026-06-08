import {
  useEffect,
  useState
} from "react";

import DashboardLayout from
"../../components/dashboard/DashboardLayout";

import PrestataireSidebar from
"../../components/dashboard/PrestataireSidebar";

import {
  getDashboardStats
}
from "../../services/prestataireService";

const DashboardPrestataire = () => {

  const [stats,
    setStats] =
    useState<any>(null);

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats =
  async () => {

    const data =
      await getDashboardStats();

    setStats(data);
  };

  if(!stats)
    return <p>Chargement...</p>;

  return (

    <DashboardLayout
      sidebar={
        <PrestataireSidebar />
      }
    >

      <h2>
        Tableau de bord
      </h2>

      <div className="row g-4 mt-3">

        <div className="col-md-3">

          <div className="card shadow-sm">

            <div className="card-body">

              <h3>
                {stats.services}
              </h3>

              <p>
                Services
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card shadow-sm">

            <div className="card-body">

              <h3>
                {stats.reservations}
              </h3>

              <p>
                Réservations
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card shadow-sm">

            <div className="card-body">

              <h3>
                {stats.terminees}
              </h3>

              <p>
                Terminées
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card shadow-sm">

            <div className="card-body">

              <h3>
                {stats.revenus}
              </h3>

              <p>
                Revenus FCFA
              </p>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default DashboardPrestataire;