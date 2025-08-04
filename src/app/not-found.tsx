"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Simple Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl">
            <span className="text-gray-900">Crowd</span>
            <span className="text-blue-600">Sense</span>
          </span>
        </div>

        {/* Simple Message */}
        <div className="text-6xl mb-6">🗺️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! You're Lost
        </h1>
        <p className="text-gray-600 mb-8">
          This page doesn't exist. Let's get you back on track.
        </p>

        {/* Simple Action */}
        <Button size="lg" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
