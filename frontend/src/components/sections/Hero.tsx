"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Users, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      <Header />
      
      {/* Main Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 text-sm font-medium px-4 py-2">
            🚀 Making Public Spaces Better Together
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Voice Shapes{" "}
            <span className="text-blue-600">Public Spaces</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Report issues, discover the best spots, and help your community thrive. 
            Real-time feedback for parks, toilets, stations, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search nearby public spaces..."
                className="pl-11 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg" asChild>
              <Link href="/feedback">
                <MapPin className="mr-2 h-5 w-5" />
                Report an Issue
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg" asChild>
              <Link href="/explore">
                Explore Map
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
              <div className="flex items-center text-2xl font-bold text-blue-600 mb-1">
                <Users className="mr-2 h-6 w-6" />
                2.5K+
              </div>
              <p className="text-gray-600 text-sm">Active Contributors</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
              <div className="flex items-center text-2xl font-bold text-green-600 mb-1">
                <Star className="mr-2 h-6 w-6" />
                12K+
              </div>
              <p className="text-gray-600 text-sm">Feedback Reports</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
              <div className="flex items-center text-2xl font-bold text-purple-600 mb-1">
                <TrendingUp className="mr-2 h-6 w-6" />
                850+
              </div>
              <p className="text-gray-600 text-sm">Issues Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      {/* <div className="absolute bottom-20 left-0 w-full overflow-hidden z-0">
        <img 
          src="/DecorativeLine.svg" 
          alt="Decorative line" 
          className="w-full h-auto object-cover"
        />
      </div> */}

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-blue-100 opacity-20"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-green-100 opacity-20"></div>
      </div>
    </section>
  );
}
