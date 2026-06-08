import DashboardLayout from
"../../components/dashboard/DashboardLayout";

import PrestataireSidebar from
"../../components/dashboard/PrestataireSidebar";

const DashboardPrestataire = () => {

  return (

    <DashboardLayout
      sidebar={<PrestataireSidebar />}
    >

      <h2>
        Tableau de bord Prestataire
      </h2>

      <div className="card p-4 mt-3">

        Gérez vos services ici

      </div>

    </DashboardLayout>
  );
};

export default DashboardPrestataire;