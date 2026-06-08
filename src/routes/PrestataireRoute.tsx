import { Navigate, Outlet } from "react-router-dom";

const PrestataireRoute = () => {

  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "prestataire") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrestataireRoute;