import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Users, Smartphone, Shield, Award } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Interactive Map",
      description: "Visual representation of public spaces with live updates and color-coded status indicators."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Real-Time Feedback",
      description: "Instant reporting and updates on public space conditions with immediate community visibility."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-purple-600" />,
      title: "Mobile-First Design",
      description: "Easy access on smartphones with responsive design optimized for on-the-go reporting."
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Community-Driven",
      description: "Powered by local community contributions to create a comprehensive feedback network."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Privacy Focused",
      description: "Anonymous reporting options with secure data handling and user privacy protection."
    },
    {
      icon: <Award className="h-8 w-8 text-indigo-600" />,
      title: "Gamification",
      description: "Engage with the community through contribution rewards and recognition system (coming soon)."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CrowdSense?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make CrowdSense the most effective platform 
            for community-driven public space improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 border-gray-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
