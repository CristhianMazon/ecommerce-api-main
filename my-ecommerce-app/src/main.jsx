// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Importa o CartProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* VERIFIQUE SE ESTÁ AQUI */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
