import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mount the app into the <div id="root"> inside index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
