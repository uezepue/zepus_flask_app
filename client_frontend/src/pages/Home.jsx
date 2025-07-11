import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Header from './HomeSections/Header';
import Hero from './HomeSections/Hero';
import Services from './HomeSections/Services';
import HowItWorks from './HomeSections/HowItWorks';
import Stats from './HomeSections/Stats';
import NewsletterForm from './HomeSections/NewsletterForm';
import Footer from './HomeSections/Footer';

// Lazy loaded components
const Blog = lazy(() => import('./HomeSections/Blog'));
const Testimonials = lazy(() => import('./HomeSections/Testimonials'));

export default function Home() {
  const [geoWarning, setGeoWarning] = useState(false);

  useEffect(() => {
    // Geo detection
    const loadGeoDetection = async () => {
      try {
        const res = await fetch('https://ipapi.co/json');
        const data = await res.json();
        const allowedCountries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt'];
        if (!allowedCountries.includes(data?.country_name)) {
          setGeoWarning(true);
        }
      } catch (err) {
        console.warn('🌍 Geo detection failed:', err);
      }
    };

    // Google Translate
    const loadGoogleTranslate = () => {
      if (typeof window === 'undefined') return;

      try {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = function () {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,fr,sw,ha,yo,ar,pt,es',
            },
            'google_translate_element'
          );
        };
      } catch (e) {
        console.error('Translate widget failed to load', e);
      }
    };

    loadGeoDetection();
    loadGoogleTranslate();
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 dark:bg-gray-900 transition-colors">
      {geoWarning && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-2 px-4 text-sm">
          ⚠️ Your location appears outside our supported regions. Some features may be restricted.
        </div>
      )}

      {/* Translate + Dark Mode Toggle */}
      <div className="flex justify-end items-center gap-4 px-6 py-2 text-sm">
        <div id="google_translate_element" />
        <button onClick={toggleDarkMode} className="btn btn-xs btn-outline">
          🌓 Toggle Theme
        </button>
      </div>

      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <Stats />

      <Suspense fallback={<div className="text-center py-6">Loading blog section...</div>}>
        <Blog />
      </Suspense>

      <Suspense fallback={<div className="text-center py-6">Loading testimonials...</div>}>
        <Testimonials />
      </Suspense>

      <NewsletterForm />
      <Footer />

      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-50 bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-800 animate-pulse text-sm md:text-base">
        <Link to="/triage-bot">💬 Chat with Dr Zepus</Link>
      </div>
    </div>
  );
}
