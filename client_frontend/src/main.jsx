import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './index.css';        // ✅ Tailwind, DaisyUI, and custom CSS
import 'aos/dist/aos.css';  // ✅ AOS animation styles
import AOS from 'aos';

function Main() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      offset: 50,
    });
  }, []);

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Main />);
} catch (error) {
  console.error('🔥 React failed to render:', error);
}
