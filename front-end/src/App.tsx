import React from 'react';
import './App.css'
import AppRoutes from "./routes/Routes.tsx";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/header/Header.tsx";

function App() {

  return (
    <>
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
