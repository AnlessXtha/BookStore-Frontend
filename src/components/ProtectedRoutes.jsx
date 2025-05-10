import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({
    isAllowed,
    redirectPath = "/login",
    children,
    errorMessage,
}) => {
    const location = useLocation();

    useEffect(() => {
        if (!isAllowed && errorMessage) {
            toast.error(errorMessage);
        }
    }, [isAllowed, errorMessage]);

    if (!isAllowed) {
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;