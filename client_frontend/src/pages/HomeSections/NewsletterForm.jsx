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
    <section
      className="bg-gray-100 py-10 text-center"
      data-aos="fade-up"
    >
      <h2 className="text-xl font-semibold mb-2">📬 Get Weekly Health Tips</h2>
      <p className="mb-4 text-sm">Delivered straight to your inbox by Dr Zepus.</p>
      <form onSubmit={handleSubmit} className="flex justify-center gap-2 max-w-md mx-auto">
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          required
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">Subscribe</button>
      </form>
    </section>
  );
}
