"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I report an issue with a public space?",
      answer: "Simply navigate to the 'Report Issue' page, allow location access or manually select a location on the map, choose the type of issue (cleanliness, crowding, safety), and submit your feedback. No account required for basic reporting."
    },
    {
      question: "Is my personal information safe when I report issues?",
      answer: "Yes, absolutely. CrowdSense prioritizes user privacy. You can report issues anonymously, and we only collect location data necessary for the feedback system. Personal information is never shared with third parties."
    },
    {
      question: "How does the color-coded map system work?",
      answer: "Our interactive map uses a simple color system: Green pins indicate good conditions, Yellow pins show mixed feedback, and Red pins highlight areas with reported issues. This helps you quickly identify the best public spaces in your area."
    },
    {
      question: "Can I track if my reported issues are being addressed?",
      answer: "Yes! Create an account to track your contributions and see updates on reported issues. You'll also earn contribution points and can view your impact on community improvements."
    },
    {
      question: "What types of public spaces can I report on?",
      answer: "You can report on various public spaces including public toilets, parks, bus stops, train stations, libraries, community centers, and other municipal facilities. Our system covers all spaces that serve the community."
    },
    {
      question: "How often is the map data updated?",
      answer: "Our map updates in real-time as community members submit feedback. You'll see the most current information about public spaces, ensuring you always have access to fresh, relevant data from fellow community members."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about CrowdSense and how it works.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200 overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900">
                    <span className="text-left pr-4">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                {openIndex === index && (
                  <CardContent className="border-t border-gray-100 bg-white">
                    <p className="text-gray-600 leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We&apos;re here to help!
            </p>
            <a 
              href="mailto:support@crowdsense.com" 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
