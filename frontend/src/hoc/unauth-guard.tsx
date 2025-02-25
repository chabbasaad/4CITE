import { useAuthStore } from "@/store/auth-store";
import React from "react";
import { Navigate } from "react-router-dom";



const UnauthGuard: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();
  

  if (isAuthenticated) {
    return <Navigate to={("/dashboard")} />;
  }
  

  return children;
};

export default UnauthGuard;