// NotFound.jsx
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">Sorry, the page you're looking for does not exist.</p>
    </div>
  );
}
