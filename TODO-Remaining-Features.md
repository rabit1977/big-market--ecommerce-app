# Remaining Features to Complete the Project

This document tracks the final "Premium" features needed to make the classifieds platform a 100% complete, production-ready startup. Many of these features already have their corresponding tables defined in the Convex database schema.

## 1. User Identity Verification (KYC + Blue Checkmarks) 🛡️
**Status:** ❌ Cancelled
**Description:** Allow users to upload a photo of their ID or register as a legitimate registered company. The admin can approve them. Once approved, the user gets a "Verified" Blue Checkmark next to their name on all listings.
**Components to Build:**
- [ ] User Dashboard UI: "Get Verified" section for users to upload documentation (`idDocument`).
- [ ] Convex Mutations/Queries: Submit verification request, fetch pending requests.
- [ ] Admin Panel UI: `/admin/verifications` page for admins to review, approve, or reject requests.
- [ ] Global UI Update: Display a blue checkmark (`Verified` badge) next to the seller's name on public listing pages and user profiles.

## 2. Moderation Queue (User Reports System) 🚩
**Status:** Not Started
**Description:** A "Report Listing" button on every public listing page. If a buyer sees a scam or inappropriate content, they click report, choose a reason (e.g., "Scam", "Duplicate"), and it goes to the Admin.
**Components to Build:**
- [ ] Frontend Dialog: A `ReportListingModal` on the single listing page allowing users to select a report reason and add a description.
- [ ] Convex Mutations/Queries: Submit a report, fetch reports.
- [ ] Admin Panel UI: `/admin/reports` page showing a queue of reported listings/users.
- [ ] Admin Actions: Buttons in the admin panel to "Dismiss Report", "Take Down Listing", or "Suspend User" based on the report.

## 3. Saved Searches & Auto-Email Alerts 🔔
**Status:** Not Started
**Description:** A user searches for specific criteria (e.g., "Honda Civic 2018 in Skopje"). They click a "Save Search" button. An automated Cron service checks for new matching listings and emails the user.
**Components to Build:**
- [ ] Frontend UI: "Save this Search" button on the search results page.
- [ ] User Dashboard UI: A "Saved Searches" tab in the user dashboard to view, edit, or delete their saved searches.
- [ ] Convex Mutations/Queries: Save search parameters (`query`, `filters`).
- [ ] Convex Cron Job: A scheduled function (e.g., daily) that runs all saved searches against recent listings and triggers email alerts.
- [ ] Email Integration: React Email / Resend template for "New listings matching your search".

## 4. Seller Reviews & Ratings (5-Star System) ⭐
**Status:** Not Started
**Description:** After a user interacts with a seller, they can leave a 1-to-5 star rating and comment. The average rating is displayed on the seller's profile.
**Components to Build:**
- [ ] Public Profile UI: A dedicated page or section showing a seller's past reviews and average star rating.
- [ ] Review Submission Form: A modal for buyers to leave a star rating and text review.
- [ ] Convex Mutations/Queries: Insert review (`rating`, `comment`), calculate average rating.
- [ ] Admin Panel UI: `/admin/reviews` (optional, for moderation of abusive reviews).

## 5. Public Q&A on Listings 💬
**Status:** Not Started
**Description:** At the bottom of a listing, a buyer can ask a public question. The seller replies publicly. Every other buyer can read it, saving the seller time.
**Components to Build:**
- [ ] Listing Page UI: A "Questions & Answers" section below the description.
- [ ] Submission UI: form for buyers to post a question, and a form for the listing owner to reply.
- [ ] Convex Mutations/Queries: Submit question, submit answer, fetch Q&A thread for a listing.

## 6. i18n Multi-Language Support 🌍
**Status:** Not Started
**Description:** A dropdown in the header to switch the website language (e.g., English, Macedonian, Albanian).
**Components to Build:**
- [ ] Next-Intl / i18next Setup: Configure internationalization in the Next.js approuter.
- [ ] Translation Dictionaries: JSON files containing translations for static text.
- [ ] UI Component: A locale switcher in the navbar.
- [ ] Route Updating: Implement logic for `/[locale]/listings` or cookie-based locale resolution.
