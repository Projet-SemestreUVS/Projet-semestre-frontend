import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./styles/global.css";
import "./styles/navbar.css";
import { ToastContainer } from "react-toastify";


import "react-toastify/dist/ReactToastify.css";
// import './index.css';

import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      
       <ToastContainer
    position="top-right"
    autoClose={3000}
  />
    </AuthProvider>
  </React.StrictMode>
);

