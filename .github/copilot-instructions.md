# CrowdSense Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
CrowdSense is a community-driven platform for real-time feedback on public spaces. Users can report issues in public spaces like toilets, parks, stations, and bus stops through an intuitive web interface.

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand (lightweight alternative to Redux)
- **Maps**: Mapbox GL JS for interactive maps
- **Charts**: Recharts for data visualizations
- **Geolocation**: Browser Geolocation API
- **PWA**: Next.js built-in PWA support

## Key Features
- Mobile-first responsive design
- Real-time feedback collection
- Interactive map with color-coded pins
- Admin dashboard for feedback management
- User profiles with contribution tracking
- Gamification system (future feature)

## Code Guidelines
- Use TypeScript for all components and utilities
- Follow Next.js App Router patterns (app directory structure)
- Use shadcn/ui components for consistent UI
- Implement proper error handling and loading states
- Use Tailwind CSS for styling with mobile-first approach
- Maintain accessibility standards (WCAG 2.1 AA)
- Use semantic HTML elements
- Implement proper SEO practices with Next.js metadata API

## Component Structure
- Create reusable components in `src/components/`
- Use the `src/app/` directory for pages and layouts
- Implement proper TypeScript interfaces for props
- Use React Server Components where appropriate
- Implement client components only when necessary (interactivity, browser APIs)

## Styling Conventions
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design principles
- Use shadcn/ui components for form elements and common UI patterns
- Implement consistent color scheme based on feedback status (green/yellow/red)
- Ensure proper contrast ratios for accessibility
