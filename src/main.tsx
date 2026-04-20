import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { overrideNativeModals } from './utils/modal-override.ts';

// Configura o sistema para desativar e sobrescrever nativos
overrideNativeModals();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
