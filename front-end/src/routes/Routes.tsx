import { Routes, Route } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import Home from "../page/home/Home.tsx";
import Profile from "../page/profile/profile.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route
                path="/profile"
                element={
                    <AuthGuard>
                        <Profile />
                    </AuthGuard>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
