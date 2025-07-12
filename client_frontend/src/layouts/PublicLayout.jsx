import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/TopNav'; // Adjust path if your folder differs

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      {/* ✅ Navigation bar */}
      <TopNav />

      {/* ✅ Main content container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* ✅ Footer */}
      <footer className="bg-blue-900 text-white text-sm py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <div>
            <a href="/about" className="mx-2 hover:underline">About Us</a>
            <a href="/privacy" className="mx-2 hover:underline">Privacy Policy</a>
            <a href="/terms" className="mx-2 hover:underline">Terms</a>
            <a href="mailto:support@zepusclinics.com" className="mx-2 hover:underline">Contact</a>
          </div>
          <div>Follow us: Facebook | X | Instagram</div>
          <div>&copy; {new Date().getFullYear()} ZEPUS Clinics. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
