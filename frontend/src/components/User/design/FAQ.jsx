import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the 3D jersey customization work?",
      answer:
        "Our 3D customization tool allows you to design jerseys in real-time. Simply select your sport, choose colors, add text, logos, and see your design come to life instantly in 3D. You can rotate and view your jersey from all angles before placing your order.",
    },
    {
      question: "What sports do you support for custom jerseys?",
      answer:
        "We currently support Cricket, Football, Basketball, Rugby, Volleyball, and Hockey. Each sport has specific jersey templates and sizing options tailored to the sport's requirements.",
    },
    {
      question: "What is the minimum order quantity?",
      answer:
        "We accept orders starting from just 1 jersey! Whether you need a single custom jersey or bulk orders for entire teams, we've got you covered.",
    },
    {
      question: "How long does it take to produce and deliver jerseys?",
      answer:
        "Standard production time is 7-10 business days after design approval. Delivery time depends on your location: 2-3 days for local delivery, 5-7 days for international shipping.",
    },
    {
      question: "Can I upload my own logos and designs?",
      answer:
        "Yes! You can upload your team logo, sponsor logos, and custom graphics. We accept PNG, JPG, and SVG files. Our design team can also help optimize your images for the best print quality.",
    },
    {
      question: "What materials are used for the jerseys?",
      answer:
        "We use premium quality moisture-wicking polyester fabric that's lightweight, breathable, and durable. All materials are sport-specific and designed for optimal performance and comfort.",
    },
    {
      question: "Do you offer size charts and fitting guides?",
      answer:
        "Absolutely! Each sport has detailed size charts available during the design process. We offer sizes from XS to 3XL, and you can also request custom sizing for specific requirements.",
    },
    {
      question: "Can I see a physical sample before placing a bulk order?",
      answer:
        "Yes, we offer sample jerseys for bulk orders (20+ pieces). The sample cost is deducted from your final order. This ensures you're completely satisfied with the quality and design.",
    },
    {
      question: "What if I need to make changes to my design after ordering?",
      answer:
        "Minor changes can be made within 24 hours of placing your order at no extra cost. Major design changes may incur additional fees and extend production time.",
    },
    {
      question: "Do you offer team discounts and bulk pricing?",
      answer:
        "Yes! We offer progressive discounts based on quantity: 10% off for 10+ jerseys, 15% off for 20+ jerseys, and custom pricing for orders over 50 pieces. Contact us for enterprise pricing.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our custom sports jersey
              services
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
