✅ CrowdSense

Frontend Structure
=================


CrowdSense is a community-driven platform for real-time feedback on public spaces. The frontend structure is designed to be intuitive and user-friendly, allowing citizens to easily report issues and access information about their surroundings.

## Key Features
- **User-Friendly Interface**: Simple navigation for all age groups.
- **Mobile-Friendly Design**: Easy access on smartphones.
- **Real-Time Feedback**: Instant reporting of public space conditions.
- **Interactive Map**: Visual representation of public spaces with live updates.
- **Gamification**: Future plans for user engagement through rewards.

## Proposed Frontend Structure

The frontend will consist of the following main components:

🔹 **Home / Landing Page**: Introduction to CrowdSense, quick access to search nearby spots, optional testimonials and stats.

🔹 **Public Space Feedback Page**: QR code/NFC tag access for reporting issues in public spaces with one-click feedback options.

🔹 **Map/Explore Page**: Interactive map to view spots based on live community feedback with filters and color-coded pins.

🔹 **Admin Dashboard**: Real-time feedback management, sorting, and exporting options.

🔹 **Gamification & Reward Page**: Future upgrade for user engagement with ranks and reward points.

🔹 **404 / Error Page**: Friendly fallback page for invalid routes.

🔹 **Login Page**: A simple login interface to differentiate between user and admin roles.

🔹 **Sign Up Page**: A registration form for new users to create an account.

🔹 **User Profile Page**: Displays user contributions (in charts), feedback history, and rewards (future feature).


## Detailed Component Breakdown

🔹 **Home / Landing Page**

This page serves as the entry point for users, providing an overview of CrowdSense and its purpose. It includes:

- A brief introduction to what CrowdSense is and why it matters.
- Quick access to search for nearby public spaces.
- Optional sections for testimonials from users and statistics (e.g., total reports today).
- A FAQ section to address common questions.
- A prominent call-to-action button to report an issue or explore the map.
- A footer with links to social media, contact information, and legal disclaimers.
- A search bar for quick access to nearby public spaces.


🔹 **2. Public Space Feedback Page**
This page allows users to report issues in public spaces quickly and efficiently. It includes:
- Automatic geolocation detection to pinpoint the user's current location.
- Manual location adjustment via interactive map for precise reporting.
- One-click feedback options for common issues (e.g., cleanliness, crowding, safety).
- An optional comment box for additional details.
- A dropdown menu to select the type of public space (e.g., toilet, park, station, bus stop).
- A prominent button to submit feedback.
- A confirmation message upon successful submission.
- A link to return to the home page or explore the map.

- **Mission of Feedback**: Clearly state the purpose of collecting feedback.
- **Optional Comment Box**: For users to provide additional details about the issue.
- **No Login Required**: Initially, to keep the process simple and encourage immediate feedback.
- **Confirmation Message**: Displayed after successful submission of feedback.

(No login required initially to keep it simple.)

🔹 **3. Map/Explore Page**
This page provides an interactive map where users can view public spaces based on live community feedback. It includes:
- An interactive map with geolocation capabilities to center on user's current position.
- "Near Me" button to quickly find and assess nearby public spaces.
- View spots based on live community feedback.
- Filters:

  - Cleanest nearby toilets
  - Least crowded parks
  - Recently flagged unsafe areas

- Color-coded pins to indicate the status of each location:
  - Green for good conditions
  - Yellow for mixed conditions
  - Red for problematic conditions
- A search bar to find specific locations by name or address.
- Option to view feedback details by clicking on a pin.
- A legend explaining the color codes and filters.
- Distance radius adjustment to refine search area.

🔹 **4. Login Page**
This page allows users to log in to their accounts. It includes:
- A simple login form with fields for username and password.
- A "Forgot Password?" link for password recovery.
- A "Sign Up" link for new users to create an account.
- A button to log in.

🔹 **5. Sign Up Page**
This page allows new users to create an account. It includes:
- A registration form with fields for username, email, and password.
- A confirmation password field to ensure accuracy.
- A checkbox for agreeing to terms and conditions.
- Login with social media accounts/Google or Apple (optional).
- A "Sign In" link for existing users to log in.

🔹 **6. Admin Dashboard**

This page allows admins to manage user feedback and reports. It includes:
- A real-time feed of all user feedback submissions.
- Tools to filter and sort feedback by location, severity, or time.
- Options to respond to user reports or escalate issues.
- Analytics and reporting features to track feedback trends.
- Export functionality to download feedback data in CSV or JSON format.

🔹 **User Profile Page**
This page displays user contributions and feedback history. It includes:
- A summary of user contributions (e.g., number of reports submitted).
- Visualizations (e.g., charts) to represent feedback trends over time.

🔹 **5. Gamification & Reward Page (Future Upgrade)**

This page will enhance user engagement through gamification. It includes:

- User ranks based on contributions (e.g., Top Contributors).
- Reward point system (e.g., 10 feedbacks = 1 discount coupon).
- Integration idea: Local business sponsorships.

🔹 **Settings Page**
This page allows users to manage their account settings, such as changing passwords or updating email addresses.

🔹 **6. 404 / Error Page**
Friendly fallback page for invalid routes.


## Technology Stack
### Frontend
- **Framework**: React.js with Next.js (for SSR and better SEO)
- **UI Library**: Tailwind CSS + shadcn/ui components for consistency
- **Maps**: Mapbox GL JS (better performance than Google Maps for real-time updates)
- **Geolocation**: Browser Geolocation API with fallback mechanisms
- **State Management**: Zustand (lightweight) or Redux Toolkit
- **PWA**: Next.js built-in PWA support
- **Charts**: Recharts for user contribution visualizations