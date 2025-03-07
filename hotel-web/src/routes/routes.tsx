import { Routes, Route } from "react-router-dom";
import AuthGuard from "./auth-guard.tsx";
import Home from "../page/public/home/home.tsx";
import Profile from "../page/user/profile/profile.tsx";
import HotelOverview from "../page/user/hotel/hotel-overview.tsx";
import About from "../page/public/nous/about.tsx";
import AuthGuardAdmin from "./auth-guard-admin.tsx";
import HotelsList from "../page/admin/hotel/hotels-list.tsx";
import UsersList from "../page/admin/users/users-list.tsx";
import BookingList from "../page/admin/booking/booking-list.tsx";
import HotelListFilter from "../page/user/hotel/hotel-list-filter.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nous" element={<About />} />
            <Route path="/hotel" element={<HotelListFilter />} />
            <Route path="/hotel/:id" element={<HotelOverview />} />
            <Route
                path="/profile"
                element={
                    <AuthGuard>
                        <Profile />
                    </AuthGuard>
                }
            />

            <Route
                path="/admin/gestion-hotel"
                element={
                    <AuthGuardAdmin>
                        <HotelsList />
                    </AuthGuardAdmin>
                }
            />
            <Route
                path="/admin/gestion-users"
                element={
                    <AuthGuardAdmin>
                        <UsersList />
                    </AuthGuardAdmin>
                }
            />
            <Route
                path="/admin/gestion-booking"
                element={
                    <AuthGuardAdmin>
                        <BookingList />
                    </AuthGuardAdmin>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
