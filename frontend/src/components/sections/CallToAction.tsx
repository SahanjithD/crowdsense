import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="relative py-16 bg-gradient-to-r from-blue-700 to-blue-800 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-blue-600 text-white border-blue-500">
            🌟 Join the Movement
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Join thousands of community members who are already making their public spaces better. 
            Your feedback matters and creates real change.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full sm:w-auto px-8 py-4 text-lg bg-white text-blue-700 hover:bg-gray-100"
              asChild
            >
              <Link href="/feedback">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Reporting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full sm:w-auto px-8 py-4 text-lg bg-white text-blue-700 hover:bg-gray-100"
              asChild
            >
              <Link href="/explore">
                <MapPin className="mr-2 h-5 w-5" />
                Explore Spaces
              </Link>
            </Button>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-6 backdrop-blur-sm border border-blue-400/20">
            <h3 className="text-2xl font-semibold mb-4">Quick Start Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Find a Location</h4>
                  <p className="text-blue-100 text-sm">
                    Use our map or let us detect your current location automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Report an Issue</h4>
                  <p className="text-blue-100 text-sm">
                    One-click feedback for cleanliness, safety, or crowding issues.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">See Impact</h4>
                  <p className="text-blue-100 text-sm">
                    Watch your community improve with real-time updates and solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
