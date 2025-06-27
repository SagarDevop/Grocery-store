import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How much does it cost to sell on GrocoMart?",
    answer: "It’s completely free to list your products. We charge a small service fee only when you make a sale.",
  },
  {
    question: "How will I receive payments?",
    answer: "Payments are made weekly directly to your bank account linked during registration.",
  },
  {
    question: "Who handles delivery?",
    answer: "You can either deliver yourself or opt for our delivery support if available in your area.",
  },
  {
    question: "Can I update my product prices later?",
    answer: "Yes, you can log in to your seller dashboard and change prices, stock, or items anytime.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b py-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800">{q}</h4>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>
      {open && <p className="text-sm text-gray-600 mt-2">{a}</p>}
    </div>
  );
}

export default function SellerFAQ() {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Seller FAQs
        </h2>
        <p className="text-gray-600 mb-8">
          Got questions? We’ve answered the most common ones below.
        </p>
        <div className="text-left bg-white rounded-xl shadow p-6 space-y-4">
          {faqs.map((item, idx) => (
            <FAQItem key={idx} q={item.question} a={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
