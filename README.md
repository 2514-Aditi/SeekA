# SeekA – Ethical & Transparent Banking Assistant

SeekA is a full-stack web application designed to bring transparency and fairness to AI-driven banking decisions. It provides tools for customers to understand loan decisions, for regulators to audit processes, and for admins to monitor system health and bias.

## Core Features

- **AI Explanation Generator**: Customers can input their financial details to receive a clear, human-readable explanation of the factors influencing a loan decision.
- **AI Mirror**: Provides customers with a view of the data points the AI has inferred about them, with the ability to correct and update this information.
- **Consent Management**: A user-centric panel allowing customers to control how their data is used for various purposes like marketing, fraud detection, and credit scoring.
- **Regulatory Audit Trail**: A comprehensive logging system that records all significant actions taken by users and the system, providing a transparent audit trail for regulators.
- **Bias & Fairness Analysis**: Tools for regulators and admins to analyze historical decisions for bias. This includes visualizations and statistical metrics to ensure fairness across different demographics.
- **Role-Based Access Control**: Secure authentication system with distinct roles (Customer, Regulator, Admin), each with a dedicated dashboard and permissions.
- **Guest Mode**: Allows prospective users to explore the features of the customer dashboard using session-based data without needing to register.

## Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Recharts for charts
- **AI/Backend Logic**: Genkit for AI flows, simulated via Next.js Server Actions and in-memory state management.
- **State Management**: React Context API to simulate a real-time, in-memory database.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd seka-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Genkit/Google AI credentials if necessary.
    ```
    # Example for Google AI
    GOOGLE_API_KEY=your_google_ai_api_key
    ```
    
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002).

## Project Structure

- `src/app/`: Contains all the pages and layouts using Next.js App Router.
- `src/components/`: Reusable React components, organized by feature (auth, dashboard, etc.).
- `src/contexts/`: Contains the core `AppContext` for global state management.
- `src/lib/`: Shared utilities, types, and constants.
- `src/ai/`: Pre-configured Genkit AI flows for generating explanations and updating the AI mirror.
