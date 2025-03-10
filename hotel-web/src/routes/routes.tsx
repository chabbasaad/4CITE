import { Routes, Route } from "react-router-dom";
import AuthGuard from "./auth-guard";
import Home from "../page/public/home/home";
import Profile from "../page/user/profile/profile";
import HotelOverview from "../page/public/hotel/hotel-overview";
import About from "../page/public/about/about";
import AuthGuardAdmin from "./auth-guard-admin";
import HotelsList from "../page/admin/hotel/hotels-list";
import UsersList from "../page/admin/users/users-list";
import BookingList from "../page/admin/booking/booking-list";
import HotelListFilter from "../page/public/hotel/hotel-list-filter";

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
