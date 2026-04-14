import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children, requiredRole, redirectTo }) => {
  const { user } = useAuth();

  if (!user) {
    // User is not logged in, redirect to the login page
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // User does not have the required role, redirect to a forbidden page or home
    return <Navigate to={redirectTo || "/"} replace />;
  }

  // User is authenticated and has the required role
  return children;
};

export default ProtectedRoute;
