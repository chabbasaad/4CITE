import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
// import { Role } from "@/common/types";
import { useAuthStore } from "@/store/auth-store";



const AuthGuard: React.FC<{ children: React.ReactElement; }> = ({
  children,

}) => {
  const { logout,isAuthenticated } = useAuthStore();



  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);



  if (!isAuthenticated) {
    return <Navigate to={("/login")} />;
  }

  return children;
};

export default AuthGuard;