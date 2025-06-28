import { MessageCircle } from "lucide-react";

export function SellerFinalCTA() {
  return (
    <section className="bg-green-600 py-12 px-4 md:px-12 text-white">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Still Have Questions?
        </h2>
        <p>
          Our support team is here to help you get started. Reach out anytime on WhatsApp.
        </p>
        <a
          href="https://wa.me/917887263984"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-6 py-3 rounded-full shadow hover:scale-105 transition"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
