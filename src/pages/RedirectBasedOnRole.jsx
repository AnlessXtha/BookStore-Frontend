import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import HomePage from "./HomePage";

const RedirectBasedOnRole = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <HomePage />;
  }

  switch (currentUser?.roles[0]) {
    case "Admin":
      return <Navigate to="/admin" replace />;
    case "Staff":
      return <Navigate to="/staff" replace />;
    case "Member":
      return <Navigate to="/home" replace />;
    default:
      return <HomePage />;
  }
};

export default RedirectBasedOnRole;