import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrowdSense - Community-Driven Public Space Feedback",
  description: "Report issues, discover the best spots, and help your community thrive. Real-time feedback for parks, toilets, stations, and more.",
  keywords: "public spaces, community feedback, civic engagement, crowd reporting, public facilities",
  authors: [{ name: "CrowdSense Team" }],
  openGraph: {
    title: "CrowdSense - Your Voice Shapes Public Spaces",
    description: "Join thousands of community members making public spaces better through real-time feedback and reporting.",
    url: "https://crowdsense.com",
    siteName: "CrowdSense",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdSense - Community-Driven Public Space Feedback",
    description: "Report issues, discover the best spots, and help your community thrive.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
