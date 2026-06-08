import { useEffect, useState } from "react";

import DashboardLayout from
"../../components/dashboard/DashboardLayout";

import AdminSidebar from
"../../components/dashboard/AdminSidebar";

import { getUsers }
from "../../services/adminService";

const Utilisateurs = () => {

  const [users,setUsers] =
    useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    const data =
      await getUsers();

    setUsers(data);

  };

  return (

    <DashboardLayout
      sidebar={<AdminSidebar />}
    >

      <h2>
        Gestion des Utilisateurs
      </h2>

      <div className="table-responsive mt-4">

        <table className="table table-striped">

          <thead>

            <tr>

              <th>ID</th>

              <th>Nom</th>

              <th>Email</th>

              <th>Rôle</th>

            </tr>

          </thead>

          <tbody>

            {users.map(
              (user:any) => (

              <tr key={user.id}>

                <td>
                  {user.id}
                </td>

                <td>
                  {user.nom}
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  {user.role}
                </td>

                <td>

                  <button className="btn btn-danger btn-sm">
                    Supprimer
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
};

export default Utilisateurs;