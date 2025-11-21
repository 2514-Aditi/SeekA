# **App Name**: SeekA

## Core Features:

- User Registration and Authentication: Securely register and authenticate users (Customer, Regulator, Admin) with role-based access control using JWT and bcrypt.
- AI Explanation Generator: Generates explanations for loan decisions based on user-provided data (income, loan amount, credit score, etc.) using rule-based logic via API.
- AI Mirror: Displays AI inferences based on user inputs, allowing users to edit and update the inferred values which are then saved to the database.
- Consent Management: Allows users to manage consent preferences (fraud detection, marketing, credit scoring, personalization) via toggles, with real-time updates to the database.
- Audit Logging: Logs all user actions (including admin actions) with timestamps and details for regulatory compliance and monitoring. Real logs fetched from the database.
- Bias Heatmap: Displays approval bias from real stored decisions using a Chart.js visualization, computed from actual data stored in the database.
- Admin Bias Scan and Model Output: Enables admins to upload/simulate model output, run bias scans based on real data, and view real-time stats (total users, decisions, bias scans).

## Style Guidelines:

- Primary color: A desaturated teal, tending toward green (#5A9690), expressing trustworthiness and calm. This will contrast with the light and dark background shades.
- Background color: Light gray (#E0D9D9), conveying neutrality and simplicity, aligning with the need for the app to feel unbiased. Chosen for a light scheme.
- Accent color: Burgundy (#432323), for calls to action and important information; its darker tone helps it stand out without disrupting the clean, human-centered design.
- Body font: 'PT Sans' (sans-serif) for a modern, simple, and human feel.
- Headline font: 'Playfair' (serif) gives an elegant and high-end feel. Because longer text is anticipated, 'PT Sans' will be used for body text.
- Clean and minimal layout with a focus on usability. Use spacing to separate elements and guide the user's eye.
- Simple, human-like icons to represent actions and categories within the app.