# Biggest Market Classifieds Platform

This is a modern, high-performance classifieds marketplace built with Next.js 15, Convex, and Tailwind CSS. It is inspired by platforms like ebay, temu, aliexpress and Biggest Market, tailored for the Macedonian market.

## Features

- **Dynamic Classifieds Grid**: Browse listings with advanced filtering by category, city, price, and condition.
- **Convex Backend**: Fully reactive backend using Convex for real-time updates and efficient data fetching.
- **Smart Category Templates**: Category-specific input fields and filters (e.g., screen size for TVs, mileage for cars).
- **Messaging System**: Real-time communication between buyers and sellers.
- **Admin Dashboard**: Comprehensive management of users, listings, and platform analytics.
- **User Wallet & Memberships**: Integrated credit system and membership tiers for professional sellers.
- **Responsive & Premium UI**: Polished design with dark mode support and mobile-first navigation.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database/Backend**: Convex
- **Authentication**: Next-Auth v5 (Auth.js)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn UI & Framer Motion
- **Payments**: Stripe (Integrated for wallet top-ups)

## Getting Started

1. **Environment Setup**:
   Copy `.env.example` to `.env.local` and fill in your Convex and Next-Auth credentials.

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Start Development Server**:
   ```bash
   pnpm dev
   ```

4. **Convex Backend**:
   In a separate terminal, start the Convex dev server:
   ```bash
   npx convex dev
   ```

## Seeding Data

To seed the platform with initial categories and listings:
```bash
npx convex run seed
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Auth.js Documentation](https://authjs.dev)

## License

Private / Proprietary
