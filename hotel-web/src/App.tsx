import React from 'react';
import './App.css'
import AppRoutes from "./routes/routes.tsx";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/header/header.tsx";
import { ToastContainer } from 'react-toastify';

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
