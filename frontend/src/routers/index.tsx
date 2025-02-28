import AuthGuard from "@/hoc/auth-guard";
import UnauthGuard from "@/hoc/unauth-guard";
import { RouteObject } from "react-router-dom";
import {Profile} from "@/pages/profile/profile.tsx";
import {Home} from "@/pages/home/home.tsx";
import {RegisterPage} from "@/pages/auth/register-page.tsx";
import {LoginPage} from "@/pages/auth/login-page.tsx";
import {NotFound} from "@/pages/errors/not-found.tsx";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
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
        path: "/profile/:id",
        element:  <AuthGuard><Profile/></AuthGuard>
    },

    {
        path: "*",
        element:  <NotFound/>
    }

];