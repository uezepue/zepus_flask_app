import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [geoWarning, setGeoWarning] = useState(false);

  useEffect(() => {
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

  return (
    <div className="font-sans text-gray-800">
      {geoWarning && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-2 px-4 text-sm">
          ⚠️ Your location appears outside our supported regions. Some features may be restricted.
        </div>
      )}

      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-xl font-bold text-blue-700">ZEPUS Clinics</div>
          <nav>
            <ul className="flex flex-wrap gap-4 text-sm text-gray-700">
              <li><Link to="/">Home</Link></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#consult">Consult</a></li>
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register/patient" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Sign Up</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="text-center py-16 bg-blue-50">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Africa's Smartest AI Medical Assistant</h1>
        <p className="text-lg mb-6">Get triaged by AI, consult real doctors online or at nearby clinics in minutes.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/patient/triage" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">Start Chat with Dr Zepus</Link>
          <Link to="/register/doctor" className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800">Register as a Doctor</Link>
        </div>
      </section>

      <section id="services" className="py-12 bg-white text-center">
        <h2 className="text-2xl font-semibold mb-6">Our Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm">
          <div className="p-4 bg-gray-100 rounded shadow">AI Symptom Checker</div>
          <div className="p-4 bg-gray-100 rounded shadow">Online Doctor Consultations</div>
          <div className="p-4 bg-gray-100 rounded shadow">Lab & Prescription Referrals</div>
          <div className="p-4 bg-gray-100 rounded shadow">Government Hospital Integration</div>
          <div className="p-4 bg-gray-100 rounded shadow">Affordable Local Pricing</div>
          <div className="p-4 bg-gray-100 rounded shadow">Pan-African Coverage</div>
        </div>
      </section>

      <section className="py-12 bg-blue-50 text-center">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 max-w-lg mx-auto">
          <li>Tell Dr Zepus your symptoms</li>
          <li>Get triaged and referred</li>
          <li>Book a consultation (telemedicine or physical)</li>
          <li>Pay securely</li>
          <li>Follow up and recover</li>
        </ol>
      </section>

      <section className="py-12 bg-white text-center">
        <h2 className="text-2xl font-semibold mb-4">Trusted by Thousands</h2>
        <p className="mb-6 text-gray-600">Serving patients across Africa. Verified doctors. Integrated with government clinics.</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="p-4 bg-green-100 rounded shadow">500+ Verified Doctors</div>
          <div className="p-4 bg-green-100 rounded shadow">50,000+ Patients Served</div>
          <div className="p-4 bg-green-100 rounded shadow">30+ Countries Supported</div>
        </div>
      </section>

      <section id="blog" className="py-12 bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold mb-4">Health Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-sm">
          <div className="p-4 bg-white border rounded shadow">10 Common Health Myths Busted</div>
          <div className="p-4 bg-white border rounded shadow">AI in African Healthcare: Hope or Hype?</div>
          <div className="p-4 bg-white border rounded shadow">When to See a Doctor: Symptoms You Shouldn’t Ignore</div>
        </div>
      </section>

      <section className="py-12 text-center bg-white">
        <h2 className="text-2xl font-semibold mb-4">What Our Patients Say</h2>
        <blockquote className="italic text-gray-700 max-w-xl mx-auto mb-4">
          "Dr Zepus helped me get referred to the right clinic instantly. Fast and helpful!"
        </blockquote>
        <blockquote className="italic text-gray-700 max-w-xl mx-auto">
          "I consulted from home and got my meds in 30 minutes. Amazing service!"
        </blockquote>
      </section>

      <div className="fixed bottom-4 right-4 bg-blue-700 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-800">
        <Link to="/patient/triage">💬 Chat with Dr Zepus</Link>
      </div>

      <section className="bg-gray-100 py-10 text-center">
        <h2 className="text-xl font-semibold mb-2">📬 Get Weekly Health Tips</h2>
        <p className="mb-4 text-sm">Delivered straight to your inbox by Dr Zepus.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            fetch("/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            })
              .then((res) => res.json())
              .then((data) => alert(data.message || "Subscribed successfully"))
              .catch(() => alert("Failed to subscribe"));
          }}
          className="flex justify-center gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            required
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Subscribe</button>
        </form>
      </section>

      <footer className="bg-blue-800 text-white text-sm py-6 text-center">
        <div className="mb-3">
          <Link to="/about" className="mx-2 hover:underline">About Us</Link>
          <Link to="/privacy" className="mx-2 hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="mx-2 hover:underline">Terms of Service</Link>
          <a href="mailto:support@zepusclinics.com" className="mx-2 hover:underline">Contact</a>
        </div>
        <div className="mb-3">Follow us: Facebook | X | Instagram</div>
        <div id="google_translate_element" className="mb-2" />
        <p>&copy; 2025 ZEPUS Clinics. All rights reserved.</p>
      </footer>
    </div>
  );
}
