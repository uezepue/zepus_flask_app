import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import 'aos/dist/aos.css';
import AOS from 'aos';

function Main() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
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
