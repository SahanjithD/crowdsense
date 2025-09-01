'use client';

import { Card } from "@/components/ui/card";
import { MapPin, Users, MessageSquare, Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <span className="font-bold text-3xl">
            <span className="text-gray-900">Crowd</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sense</span>
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Empowering Communities Through Collective Feedback
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          CrowdSense is a platform that enables citizens to contribute to the improvement of public spaces
          through real-time feedback and community engagement.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in the power of community feedback to transform public spaces. By providing an
            accessible platform for citizens to share their experiences and concerns, we aim to bridge
            the gap between communities and local authorities, leading to more responsive and
            user-centered public space management.
          </p>
        </Card>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Submit Feedback</h3>
                <p className="text-gray-600">
                  Share your experiences and observations about public spaces in your community. Whether
                  it&apos;s about maintenance, safety, or accessibility, your input matters.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Community Insights</h3>
                <p className="text-gray-600">
                  View aggregated feedback from your community to understand common concerns and track
                  improvements in your local public spaces.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Location-Based Data</h3>
                <p className="text-gray-600">
                  Explore feedback specific to different locations and public spaces in your area,
                  helping you make informed decisions about where to go.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Lightbulb className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Drive Change</h3>
                <p className="text-gray-600">
                  Your feedback contributes to data-driven decision making, helping authorities
                  prioritize improvements and maintain public spaces effectively.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="text-center">
        <Card className="p-8 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Be part of the movement to improve public spaces in your community. Your voice matters in
            making our shared spaces better for everyone.
          </p>
          <div className="flex justify-center space-x-4">
            {!session && (
              <a
                href="/signup"
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Sign Up Now
              </a>
            )}
            <a
              href="/feedback"
              className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200"
            >
              Submit Feedback
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
