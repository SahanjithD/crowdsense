"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does CrowdSense help improve public spaces?",
    answer: "CrowdSense collects real-time feedback from community members about public space conditions. This data helps local authorities and organizations identify issues quickly and prioritize improvements where they're needed most."
  },
  {
    question: "Is my location data private and secure?",
    answer: "Yes, your privacy is our top priority. Location data is anonymized and encrypted. We only use location information to categorize feedback geographically and never store personal location history or share individual user data."
  },
  {
    question: "What types of issues can I report?",
    answer: "You can report various conditions including cleanliness issues (litter, graffiti), safety concerns (poor lighting, broken infrastructure), crowding levels, accessibility problems, and maintenance needs. Our system categorizes each report automatically."
  },
  {
    question: "How quickly do authorities respond to reports?",
    answer: "Response times vary by location and issue severity. Urgent safety issues are typically addressed within 24-48 hours, while general maintenance requests may take 1-2 weeks. You'll receive updates on the status of your reports."
  },
  {
    question: "Can I see what others have reported in my area?",
    answer: "Yes! Our interactive map shows anonymized reports from your neighborhood. You can view trends, see what issues are being addressed, and discover highly-rated spaces nearby."
  },
  {
    question: "Do I need to create an account to use CrowdSense?",
    answer: "You can submit anonymous reports without an account. However, creating a free account allows you to track your submissions, receive updates on issues you've reported, and earn community impact points."
  },
  {
    question: "How does the real-time crowding feature work?",
    answer: "Our crowding data comes from aggregated, anonymous user check-ins and reports. This helps others plan visits to popular spaces and helps authorities manage capacity during peak times."
  },
  {
    question: "Can businesses and organizations use CrowdSense?",
    answer: "Absolutely! We offer specialized dashboards for businesses, municipalities, and organizations to monitor their spaces, respond to feedback, and showcase improvements. Contact us for enterprise solutions."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about CrowdSense and how it works.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {openItems.has(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openItems.has(index) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@crowdsense.com"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Contact Support
              </a>
              <a
                href="/help"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
