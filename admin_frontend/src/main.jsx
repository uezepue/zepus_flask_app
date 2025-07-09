// admin_frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <BrowserRouter basename="/admin">
      <App />
    </BrowserRouter>
  );
} catch (error) {
  console.error('🔥 Admin React failed to render:', error);
}
