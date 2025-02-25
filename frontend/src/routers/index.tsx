
import AuthGuard from "@/hoc/auth-guard";
import UnauthGuard from "@/hoc/unauth-guard";
import { LoginPage, NotFound, Profile, RegisterPage, UserDashboard } from "@/pages";
import { Landing } from "@/pages/landing";

import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: "/login",
        element:  <UnauthGuard><LoginPage/></UnauthGuard>
        
    },
    {
        path: "/signup",
        element:  <UnauthGuard><RegisterPage/></UnauthGuard>
    },
    {
        path: "/dashboard",
        element: <AuthGuard><UserDashboard/></AuthGuard>  
    },
    {
        path: "/profile/:id",
        element:  <AuthGuard><Profile/></AuthGuard>  
    },
  
    {
        path: "*",
        element:  <NotFound/>
    }

];