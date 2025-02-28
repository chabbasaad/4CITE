import { Navigate } from "react-router-dom";
import {JSX} from "react";

const isAuthenticated = () => {
    return localStorage.getItem("user") !== null;
};

const AuthGuard = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default AuthGuard;
