// نقطة دخول React — main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// تنسيقات Tailwind + Glassmorphism
import './styles/glassmorphism.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
