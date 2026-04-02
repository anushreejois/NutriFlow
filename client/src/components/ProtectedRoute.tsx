import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

// define the props interface explicitly
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userInfo = localStorage.getItem("userInfo");

  if (!userInfo) {
    // If not logged in, force redirect to Login
    return <Navigate to="/login" replace />;
  }

  // Render the child component (Dashboard)
  return <>{children}</>;
};

export default ProtectedRoute;