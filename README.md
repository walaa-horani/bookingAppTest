Live Demo: [https://booking-app-test-hm09snwne-walaa-horanis-projects.vercel.app](https://booking-app-test-hm09snwne-walaa-horanis-projects.vercel.app)


# Booking App

A simple 1:1 session booking platform built with Next.js 13 App Router, Clerk for authentication, Drizzle ORM, and Neon for PostgreSQL.

## Getting Started

1. Clone the repo and install dependencies

```bash
git clone https://github.com/walaa-horani/bookingAppTest.git

npm install

2. Initialize Shadcn components

npx shadcn@latest init 
npx shadcn@latest add sonner
npx shadcn@latest add button


3. Add environment variables

# === Clerk (Auth) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Optional (recommended for custom routes)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/booking
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/booking

# === Database (Neon Postgres) ===
# IMPORTANT: Never expose your DB URL as NEXT_PUBLIC_*
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB_NAME?sslmode=require


4. Database Setup

npx drizzle-kit push
npx drizzle-kit studio


6. API Documentation


GET /api/sessions?date=2025-09-05

Response:
{
  "date": "2025-09-05",
  "slots": [
    { "id": 1, "time": "10:00", "duration": 60 },
    { "id": 2, "time": "11:00", "duration": 60 }
  ]
}

POST /api/bookings

Request:
{
  "sessionId": 2
}

Response:
{
  "success": true,
  "booking": {
    "id": 12,
    "bookedAt": "2025-09-05T18:30:00.000Z",
    "session": {
      "id": 2,
      "date": "2025-09-05",
      "startTime": "11:00"
    }
  }
}





