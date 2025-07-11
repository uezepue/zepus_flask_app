import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <h1 className="text-6xl font-bold text-blue-800 mb-4">404</h1>
      <p className="text-gray-700 text-lg mb-6">Oops! Page not found.</p>
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Homepage
      </Link>
    </div>
  );
}
