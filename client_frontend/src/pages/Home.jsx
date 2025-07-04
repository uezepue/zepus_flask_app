// Home.jsx
import React, { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const loadGeoDetection = async () => {
      try {
        const res = await fetch("https://ipapi.co/json");
        const data = await res.json();
        if (data.country_name !== "YourExpectedCountry") {
          alert("VPN or location spoofing detected. Services may be limited.");
        }
      } catch (err) {
        console.error("Geo detection failed", err);
      }
    };

    const loadGoogleTranslate = () => {
      const script = document.createElement('script');
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,fr,sw,ha,yo,ar,pt,es'
        }, 'google_translate_element');
      };
    };

    loadGeoDetection();
    loadGoogleTranslate();
  }, []);

  return (
    <div>
      <header>
        <div className="logo">ZEPUS Clinics</div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#consult">Consult a Doctor</a></li>
            <li><a href="#faqs">FAQs</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register" className="cta">Sign Up</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h1>Africa's Smartest AI Medical Assistant</h1>
        <p>Get triaged by AI, consult real doctors online or at nearby clinics in minutes.</p>
        <a href="/Patient_registration.html" className="btn-primary">Start Chat with Dr Zepus</a>
        <a href="/doctor/register" className="btn-secondary">Register as a Doctor</a>
      </section>

      <section id="services" className="features">
        <h2>Our Services</h2>
        <div className="cards">
          <div className="card">AI Symptom Checker</div>
          <div className="card">Online Doctor Consultations</div>
          <div className="card">Lab & Prescription Referrals</div>
          <div className="card">Government Hospital Integration</div>
          <div className="card">Affordable Local Pricing</div>
          <div className="card">Pan-African Coverage</div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>Tell Dr Zepus your symptoms</li>
          <li>Get triaged and referred</li>
          <li>Book a consultation (telemedicine or physical)</li>
          <li>Pay securely</li>
          <li>Follow up and recover</li>
        </ol>
      </section>

      <section className="trust">
        <h2>Trusted by Thousands</h2>
        <p>Serving patients across Africa. Verified doctors. Integrated with government clinics.</p>
        <div className="trust-stats">
          <div>500+ Verified Doctors</div>
          <div>50,000+ Patients Served</div>
          <div>30+ Countries Supported</div>
        </div>
      </section>

      <section id="blog" className="blog-preview">
        <h2>Health Articles</h2>
        <div className="adsense"></div>
        <div className="articles">
          <div className="article">10 Common Health Myths Busted</div>
          <div className="adsense"></div>
          <div className="article">AI in African Healthcare: Hope or Hype?</div>
          <div className="article">When to See a Doctor: Symptoms You Shouldn’t Ignore</div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Patients Say</h2>
        <blockquote>"Dr Zepus helped me get referred to the right clinic instantly. Fast and helpful!"</blockquote>
        <blockquote>"I consulted from home and got my meds in 30 minutes. Amazing service!"</blockquote>
      </section>

      <div className="floating-chat">
        <a href="/Patient_registration.html">💬 Chat with Dr Zepus</a>
      </div>

      <section className="newsletter">
        <h2>Get Weekly Health Tips</h2>
        <p>Delivered straight to your inbox by Dr Zepus.</p>
        <form action="/subscribe" method="post">
          <input type="email" name="email" placeholder="Your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <footer>
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="mailto:support@zepusclinics.com">Contact</a>
        </div>
        <div className="social-media">
          <a href="#">Facebook</a> | <a href="#">X</a> | <a href="#">Instagram</a>
        </div>
        <div className="adsense"></div>
        <div className="translate" id="google_translate_element"></div>
        <p>&copy; 2025 ZEPUS Clinics. All rights reserved.</p>
      </footer>
    </div>
  );
}
