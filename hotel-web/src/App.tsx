import React from 'react';
import './App.css'
import AppRoutes from "./routes/routes.tsx";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/header/header.tsx";
import { ToastContainer } from 'react-toastify';

const getUserRole = () => {
    const userData = localStorage.getItem("user_data");

    if (!userData) return null;

    try {
        const user = JSON.parse(userData);
        return user?.role;
    } catch (error) {
        console.error("Erreur de parsing des données utilisateur :", error);
        return null;
    }
};

function App() {

  return (
    <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"

        />
      <React.StrictMode>
        <BrowserRouter>
          <Header />
          <AppRoutes />
        </BrowserRouter>
      </React.StrictMode>
    </>
  )
}

export default App
