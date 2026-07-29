# EcoDrop Web

EcoDrop is a Next.js web application that helps people identify electronic waste, find recycling information, and track their recycling activity.

## Features

- Account registration, login, password reset, and profile management
- Dashboard for submitting and reviewing electronic-item reports
- AI-assisted electronic-item identification (optional Gemini integration)
- Educational recycling content, impact statistics, and recycling-centre pages
- Admin user-management area
- Playwright end-to-end tests for key user journeys

## Prerequisites

- Node.js 20 or later
- npm
- The EcoDrop API running locally (default: `http://localhost:8089`)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and set values appropriate to your local setup:

   ```bash
   Copy-Item .env.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run the Playwright test suite |
| `npm run test:report` | Open the latest Playwright HTML report |

## Testing

The Playwright configuration starts the local development server automatically. Ensure the API is available and any required test accounts are configured before running:

```bash
npm run test:e2e
```

## Environment variables

See `.env.example` for the variables used by the application. Never commit `.env.local` or real API keys.
