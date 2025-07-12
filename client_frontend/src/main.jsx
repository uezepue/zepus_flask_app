import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// ✅ TailwindCSS + DaisyUI custom styles
import './index.css';

// ✅ AOS animation styles
import 'aos/dist/aos.css';
import AOS from 'aos';

function Main() {
  useEffect(() => {
    AOS.init({
      once: true,      // Only animate once
      duration: 800,   // Animation duration in ms
      offset: 50,      // Trigger point offset
    });
  }, []);

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

// ✅ Safe hydration entry point
try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Main />);
} catch (error) {
  console.error('🔥 React failed to render:', error);
}
