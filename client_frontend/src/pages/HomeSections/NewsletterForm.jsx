import React from 'react';

export default function NewsletterForm() {
  const handleSubmit = (e) => {
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
  };

  return (
    <section className="py-16 bg-gray-100" id="newsletter">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            📬 Get Weekly Health Tips
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Delivered straight to your inbox by Dr Zepus.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
