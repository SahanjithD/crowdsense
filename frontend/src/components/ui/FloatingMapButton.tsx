"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingMapButton() {
  const [opacity, setOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Start fading after scrolling 20% of viewport height
      const fadeStart = windowHeight * 0.2;
      // Complete fade at 80% of viewport height
      const fadeEnd = windowHeight * 0.8;
      
      if (scrollY <= fadeStart) {
        setOpacity(1);
        setIsVisible(true);
      } else if (scrollY >= fadeEnd) {
        setOpacity(0);
        // Hide completely after fade to improve performance
        setTimeout(() => setIsVisible(false), 300);
      } else {
        // Calculate opacity between fadeStart and fadeEnd
        const fadeRange = fadeEnd - fadeStart;
        const fadeProgress = (scrollY - fadeStart) / fadeRange;
        const newOpacity = Math.max(0, 1 - fadeProgress);
        setOpacity(newOpacity);
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Call once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href="/explore"
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
      style={{ opacity }}
      aria-label="Open Map"
    >
      <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
    </Link>
  );
}
