import { Navigate } from "react-router-dom";
import { JSX } from "react";

const isAuthenticatedAdmin = () => {
    const userData = localStorage.getItem("user_data");

    if (!userData) {
        return false;
    }

    try {
        const user = JSON.parse(userData);
        return user?.role === "admin";
    } catch (error) {
        console.error("Erreur de parsing des données utilisateur :", error);
        return false;
    }
};

const AuthGuardAdmin = ({ children }: { children: JSX.Element }) => {
    return isAuthenticatedAdmin() ? children : <Navigate to="/" />;
};

export default AuthGuardAdmin;
