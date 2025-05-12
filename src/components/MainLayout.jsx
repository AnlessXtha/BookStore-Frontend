import { useContext } from "react";
import Navbar from "./Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => (
  <>
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  </>
);

const RequireAuth = ({ allowedRoles }) => {
  const { currentUser } = useContext(AuthContext);
  const userRoles = currentUser?.roles || [];

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    if (userRoles.includes("Admin")) return <Navigate to="/admin" replace />;
    if (userRoles.includes("Staff"))
      return <Navigate to="/staff/dashboard" replace />;
    if (userRoles.includes("Member")) return <Navigate to="/home" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export { MainLayout, RequireAuth };
