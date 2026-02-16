# Enterprise Classifieds Platform - Complete File Structure
## Stack: Next.js 15 (App Router), React 19, PostgreSQL, Prisma, TypeScript

```
classifieds-platform/
├── 📱 apps/
│   ├── web/                                    # User-facing application
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reset-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── verify-email/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── two-factor/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (main)/
│   │   │   │   ├── page.tsx                   # Homepage with featured listings
│   │   │   │   ├── layout.tsx                 # Main layout with navbar/footer
│   │   │   │   │
│   │   │   │   ├── listings/
│   │   │   │   │   ├── page.tsx              # Browse all listings (with filters)
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   ├── page.tsx          # Individual listing detail
│   │   │   │   │   │   └── loading.tsx
│   │   │   │   │   ├── search/
│   │   │   │   │   │   └── page.tsx          # Advanced search
│   │   │   │   │   └── create/
│   │   │   │   │       └── page.tsx          # Create new listing
│   │   │   │   │
│   │   │   │   ├── categories/
│   │   │   │   │   ├── page.tsx              # All categories
│   │   │   │   │   └── [slug]/
│   │   │   │   │       ├── page.tsx          # Category listings
│   │   │   │   │       └── [subcategory]/
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   ├── sellers/
│   │   │   │   │   └── [username]/
│   │   │   │   │       ├── page.tsx          # Seller profile (public)
│   │   │   │   │       ├── reviews/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       └── listings/
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   ├── messages/
│   │   │   │   │   ├── page.tsx              # Inbox
│   │   │   │   │   └── [conversationId]/
│   │   │   │   │       └── page.tsx          # Conversation thread
│   │   │   │   │
│   │   │   │   ├── favorites/
│   │   │   │   │   └── page.tsx              # Saved/favorited listings
│   │   │   │   │
│   │   │   │   ├── my-listings/
│   │   │   │   │   ├── page.tsx              # User's own listings
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── edit/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── analytics/
│   │   │   │   │   │       └── page.tsx      # Views, favorites, etc.
│   │   │   │   │   ├── drafts/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── sold/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── profile/
│   │   │   │   │   ├── page.tsx              # User settings
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── verification/
│   │   │   │   │   │   └── page.tsx          # ID verification process
│   │   │   │   │   ├── security/
│   │   │   │   │   │   └── page.tsx          # Password, 2FA
│   │   │   │   │   ├── notifications/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── payment-methods/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx              # Purchase history
│   │   │   │   │   └── [orderId]/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── reviews/
│   │   │   │   │   ├── give/
│   │   │   │   │   │   └── [orderId]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   └── received/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── help/
│   │   │   │   │   ├── page.tsx              # Help center
│   │   │   │   │   ├── contact/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx          # Help articles
│   │   │   │   │
│   │   │   │   ├── legal/
│   │   │   │   │   ├── terms/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── privacy/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── cookies/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── community-guidelines/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   └── reports/
│   │   │   │       └── [listingId]/
│   │   │   │           └── page.tsx          # Report listing/user
│   │   │   │
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── [...nextauth]/
│   │   │   │   │   │   └── route.ts          # NextAuth configuration
│   │   │   │   │   ├── register/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── verify-email/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── reset-password/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   ├── listings/
│   │   │   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── route.ts          # GET, PATCH, DELETE
│   │   │   │   │   │   ├── favorite/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   ├── views/
│   │   │   │   │   │   │   └── route.ts      # Track view count
│   │   │   │   │   │   ├── promote/
│   │   │   │   │   │   │   └── route.ts      # Feature/promote listing
│   │   │   │   │   │   └── report/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   ├── search/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── drafts/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   ├── categories/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   ├── messages/
│   │   │   │   │   ├── route.ts              # GET conversations
│   │   │   │   │   ├── [conversationId]/
│   │   │   │   │   │   ├── route.ts          # GET messages, POST new
│   │   │   │   │   │   ├── mark-read/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── block/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── unread-count/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   ├── users/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   │   ├── verification/
│   │   │   │   │   │   │   └── route.ts      # Submit verification docs
│   │   │   │   │   │   ├── reviews/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── block/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── me/
│   │   │   │   │       └── route.ts          # Current user profile
│   │   │   │   │
│   │   │   │   ├── reviews/
│   │   │   │   │   ├── route.ts              # POST create review
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts          # GET, PATCH, DELETE
│   │   │   │   │       └── helpful/
│   │   │   │   │           └── route.ts      # Mark review helpful
│   │   │   │   │
│   │   │   │   ├── orders/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts
│   │   │   │   │       └── status/
│   │   │   │   │           └── route.ts
│   │   │   │   │
│   │   │   │   ├── payments/
│   │   │   │   │   ├── create-intent/
│   │   │   │   │   │   └── route.ts          # Stripe payment intent
│   │   │   │   │   ├── webhook/
│   │   │   │   │   │   └── route.ts          # Stripe webhook
│   │   │   │   │   └── methods/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   ├── notifications/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── read/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── mark-all-read/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   ├── upload/
│   │   │   │   │   ├── image/
│   │   │   │   │   │   └── route.ts          # Upload to S3/Cloudinary
│   │   │   │   │   └── document/
│   │   │   │   │       └── route.ts          # Verification docs
│   │   │   │   │
│   │   │   │   ├── reports/
│   │   │   │   │   └── route.ts
│   │   │   │   │
│   │   │   │   ├── favorites/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [listingId]/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── listing/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── user/
│   │   │   │   │       └── route.ts
│   │   │   │   │
│   │   │   │   └── webhooks/
│   │   │   │       ├── stripe/
│   │   │   │       │   └── route.ts
│   │   │   │       └── sendgrid/
│   │   │   │           └── route.ts
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   ├── SocialLogin.tsx
│   │   │   │   │   ├── TwoFactorInput.tsx
│   │   │   │   │   └── ProtectedRoute.tsx
│   │   │   │   │
│   │   │   │   ├── listings/
│   │   │   │   │   ├── ListingCard.tsx
│   │   │   │   │   ├── ListingGrid.tsx
│   │   │   │   │   ├── ListingDetail.tsx
│   │   │   │   │   ├── ListingForm/
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   ├── BasicInfoStep.tsx
│   │   │   │   │   │   ├── DetailsStep.tsx
│   │   │   │   │   │   ├── PricingStep.tsx
│   │   │   │   │   │   ├── ImagesStep.tsx
│   │   │   │   │   │   └── ReviewStep.tsx
│   │   │   │   │   ├── ListingFilters.tsx
│   │   │   │   │   ├── ListingSort.tsx
│   │   │   │   │   ├── FeaturedListings.tsx
│   │   │   │   │   ├── SimilarListings.tsx
│   │   │   │   │   ├── ListingStats.tsx
│   │   │   │   │   └── PriceHistory.tsx
│   │   │   │   │
│   │   │   │   ├── messaging/
│   │   │   │   │   ├── ChatWindow.tsx
│   │   │   │   │   ├── ConversationList.tsx
│   │   │   │   │   ├── MessageBubble.tsx
│   │   │   │   │   ├── MessageInput.tsx
│   │   │   │   │   ├── TypingIndicator.tsx
│   │   │   │   │   └── UnreadBadge.tsx
│   │   │   │   │
│   │   │   │   ├── search/
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── AdvancedFilters.tsx
│   │   │   │   │   ├── LocationSearch.tsx
│   │   │   │   │   ├── PriceRangeSlider.tsx
│   │   │   │   │   └── SavedSearches.tsx
│   │   │   │   │
│   │   │   │   ├── user/
│   │   │   │   │   ├── UserCard.tsx
│   │   │   │   │   ├── UserProfile.tsx
│   │   │   │   │   ├── UserAvatar.tsx
│   │   │   │   │   ├── UserBadges.tsx
│   │   │   │   │   ├── VerificationBadge.tsx
│   │   │   │   │   └── UserStats.tsx
│   │   │   │   │
│   │   │   │   ├── reviews/
│   │   │   │   │   ├── ReviewCard.tsx
│   │   │   │   │   ├── ReviewForm.tsx
│   │   │   │   │   ├── ReviewList.tsx
│   │   │   │   │   ├── RatingStars.tsx
│   │   │   │   │   └── ReviewStats.tsx
│   │   │   │   │
│   │   │   │   ├── common/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Select.tsx
│   │   │   │   │   ├── Checkbox.tsx
│   │   │   │   │   ├── Radio.tsx
│   │   │   │   │   ├── Textarea.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Dropdown.tsx
│   │   │   │   │   ├── Tabs.tsx
│   │   │   │   │   ├── Accordion.tsx
│   │   │   │   │   ├── Toast.tsx
│   │   │   │   │   ├── Spinner.tsx
│   │   │   │   │   ├── Skeleton.tsx
│   │   │   │   │   ├── Pagination.tsx
│   │   │   │   │   ├── Breadcrumbs.tsx
│   │   │   │   │   ├── Badge.tsx
│   │   │   │   │   ├── Chip.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Alert.tsx
│   │   │   │   │   ├── ImageUpload.tsx
│   │   │   │   │   ├── ImageGallery.tsx
│   │   │   │   │   ├── Carousel.tsx
│   │   │   │   │   └── EmptyState.tsx
│   │   │   │   │
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── MobileMenu.tsx
│   │   │   │   │   ├── Container.tsx
│   │   │   │   │   └── Section.tsx
│   │   │   │   │
│   │   │   │   ├── notifications/
│   │   │   │   │   ├── NotificationBell.tsx
│   │   │   │   │   ├── NotificationList.tsx
│   │   │   │   │   ├── NotificationItem.tsx
│   │   │   │   │   └── NotificationSettings.tsx
│   │   │   │   │
│   │   │   │   └── payment/
│   │   │   │       ├── PaymentForm.tsx
│   │   │   │       ├── CardElement.tsx
│   │   │   │       ├── PaymentMethods.tsx
│   │   │   │       └── PricingPlans.tsx
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── prisma.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── session.ts
│   │   │   │   ├── stripe.ts
│   │   │   │   ├── email.ts
│   │   │   │   ├── upload.ts
│   │   │   │   ├── redis.ts                  # Caching, sessions
│   │   │   │   ├── pusher.ts                 # Real-time messaging
│   │   │   │   ├── analytics.ts
│   │   │   │   ├── seo.ts
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useUser.ts
│   │   │   │   ├── useListings.ts
│   │   │   │   ├── useMessages.ts
│   │   │   │   ├── useNotifications.ts
│   │   │   │   ├── useFavorites.ts
│   │   │   │   ├── useDebounce.ts
│   │   │   │   ├── useInfiniteScroll.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   ├── useMediaQuery.ts
│   │   │   │   └── useToast.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── validators.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── helpers.ts
│   │   │   │   ├── image.ts
│   │   │   │   ├── encryption.ts
│   │   │   │   ├── sanitize.ts
│   │   │   │   ├── slug.ts
│   │   │   │   └── date.ts
│   │   │   │
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   └── themes.css
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── api.ts
│   │   │   │   ├── models.ts
│   │   │   │   └── next-auth.d.ts
│   │   │   │
│   │   │   ├── middleware.ts                  # Auth, rate limiting
│   │   │   ├── next.config.js
│   │   │   ├── tailwind.config.ts
│   │   │   ├── tsconfig.json
│   │   │   ├── package.json
│   │   │   └── .env.local
│   │   │
│   │   └── public/
│   │       ├── images/
│   │       ├── icons/
│   │       └── fonts/
│   │
│   └── admin/                                  # Admin Dashboard (Separate App)
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   └── layout.tsx
│       │   │
│       │   ├── (dashboard)/
│       │   │   ├── page.tsx                   # Dashboard overview
│       │   │   ├── layout.tsx                 # Admin layout with sidebar
│       │   │   │
│       │   │   ├── listings/
│       │   │   │   ├── page.tsx              # All listings (pending, approved, rejected)
│       │   │   │   ├── pending/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── [id]/
│       │   │   │   │   ├── page.tsx          # Review listing detail
│       │   │   │   │   └── edit/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── reported/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── featured/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── users/
│       │   │   │   ├── page.tsx              # All users
│       │   │   │   ├── [id]/
│       │   │   │   │   ├── page.tsx          # User detail
│       │   │   │   │   ├── edit/
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   └── activity/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── verification/
│       │   │   │   │   ├── page.tsx          # Pending verifications
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── banned/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── suspicious/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── categories/
│       │   │   │   ├── page.tsx              # Manage categories
│       │   │   │   ├── create/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── [id]/
│       │   │   │       └── edit/
│       │   │   │           └── page.tsx
│       │   │   │
│       │   │   ├── reports/
│       │   │   │   ├── page.tsx              # All reports
│       │   │   │   ├── listings/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── users/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── reviews/
│       │   │   │   ├── page.tsx              # Moderate reviews
│       │   │   │   ├── flagged/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── orders/
│       │   │   │   ├── page.tsx              # All transactions
│       │   │   │   ├── [id]/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── disputes/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── payments/
│       │   │   │   ├── page.tsx              # Payment history
│       │   │   │   ├── verification-fees/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── promotion-fees/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── refunds/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── analytics/
│       │   │   │   ├── page.tsx              # Overall analytics
│       │   │   │   ├── users/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── listings/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── revenue/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── traffic/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── content/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── page.tsx          # Manage static pages
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── edit/
│       │   │   │   │           └── page.tsx
│       │   │   │   ├── help-articles/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── announcements/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── settings/
│       │   │   │   ├── page.tsx              # General settings
│       │   │   │   ├── site/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── email/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── payment/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── security/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── features/
│       │   │   │   │   └── page.tsx          # Feature flags
│       │   │   │   └── api-keys/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── moderation/
│       │   │   │   ├── queue/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── automated-rules/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── blocked-words/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── admins/
│       │   │   │   ├── page.tsx              # Admin user management
│       │   │   │   ├── roles/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── activity-log/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   └── notifications/
│       │   │       ├── page.tsx              # System notifications
│       │   │       └── templates/
│       │   │           └── page.tsx
│       │   │
│       │   ├── api/
│       │   │   ├── auth/
│       │   │   │   └── [...nextauth]/
│       │   │   │       └── route.ts
│       │   │   │
│       │   │   ├── listings/
│       │   │   │   ├── route.ts
│       │   │   │   ├── [id]/
│       │   │   │   │   ├── approve/
│       │   │   │   │   │   └── route.ts
│       │   │   │   │   ├── reject/
│       │   │   │   │   │   └── route.ts
│       │   │   │   │   └── feature/
│       │   │   │   │       └── route.ts
│       │   │   │   └── bulk-actions/
│       │   │   │       └── route.ts
│       │   │   │
│       │   │   ├── users/
│       │   │   │   ├── [id]/
│       │   │   │   │   ├── ban/
│       │   │   │   │   │   └── route.ts
│       │   │   │   │   ├── verify/
│       │   │   │   │   │   └── route.ts
│       │   │   │   │   └── impersonate/
│       │   │   │   │       └── route.ts
│       │   │   │   └── verification/
│       │   │   │       ├── route.ts
│       │   │   │       └── [id]/
│       │   │   │           ├── approve/
│       │   │   │           │   └── route.ts
│       │   │   │           └── reject/
│       │   │   │               └── route.ts
│       │   │   │
│       │   │   ├── reports/
│       │   │   │   ├── [id]/
│       │   │   │   │   ├── resolve/
│       │   │   │   │   │   └── route.ts
│       │   │   │   │   └── dismiss/
│       │   │   │   │       └── route.ts
│       │   │   │   └── bulk-resolve/
│       │   │   │       └── route.ts
│       │   │   │
│       │   │   ├── analytics/
│       │   │   │   ├── dashboard/
│       │   │   │   │   └── route.ts
│       │   │   │   ├── users/
│       │   │   │   │   └── route.ts
│       │   │   │   └── revenue/
│       │   │   │       └── route.ts
│       │   │   │
│       │   │   └── settings/
│       │   │       └── route.ts
│       │   │
│       │   ├── components/
│       │   │   ├── dashboard/
│       │   │   │   ├── Sidebar.tsx
│       │   │   │   ├── Header.tsx
│       │   │   │   ├── StatsCard.tsx
│       │   │   │   ├── RecentActivity.tsx
│       │   │   │   └── QuickActions.tsx
│       │   │   │
│       │   │   ├── listings/
│       │   │   │   ├── ListingReviewCard.tsx
│       │   │   │   ├── ListingApprovalForm.tsx
│       │   │   │   ├── ListingTable.tsx
│       │   │   │   └── BulkActions.tsx
│       │   │   │
│       │   │   ├── users/
│       │   │   │   ├── UserTable.tsx
│       │   │   │   ├── UserDetailCard.tsx
│       │   │   │   ├── VerificationReview.tsx
│       │   │   │   └── BanModal.tsx
│       │   │   │
│       │   │   ├── reports/
│       │   │   │   ├── ReportCard.tsx
│       │   │   │   ├── ReportTable.tsx
│       │   │   │   └── ReportActions.tsx
│       │   │   │
│       │   │   ├── analytics/
│       │   │   │   ├── LineChart.tsx
│       │   │   │   ├── BarChart.tsx
│       │   │   │   ├── PieChart.tsx
│       │   │   │   └── MetricCard.tsx
│       │   │   │
│       │   │   └── common/
│       │   │       ├── DataTable.tsx
│       │   │       ├── FilterBar.tsx
│       │   │       ├── DateRangePicker.tsx
│       │   │       └── ExportButton.tsx
│       │   │
│       │   ├── lib/
│       │   ├── hooks/
│       │   ├── utils/
│       │   ├── types/
│       │   ├── middleware.ts
│       │   └── next.config.js
│       │
│       └── package.json
│
├── 📦 packages/
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                                     # Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   └── index.ts
│   │   │   ├── styles/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                                 # Shared configs
│   │   ├── eslint-config/
│   │   ├── typescript-config/
│   │   └── tailwind-config/
│   │
│   ├── validators/                             # Shared Zod schemas
│   │   ├── src/
│   │   │   ├── listing.ts
│   │   │   ├── user.ts
│   │   │   ├── message.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── utils/                                  # Shared utilities
│       ├── src/
│       │   ├── formatters.ts
│       │   ├── validators.ts
│       │   └── index.ts
│       └── package.json
│
├── 🔧 services/
│   ├── email/                                  # Email service (SendGrid/Resend)
│   │   ├── templates/
│   │   │   ├── welcome.tsx
│   │   │   ├── verification.tsx
│   │   │   ├── listing-approved.tsx
│   │   │   ├── listing-rejected.tsx
│   │   │   ├── new-message.tsx
│   │   │   ├── password-reset.tsx
│   │   │   └── order-confirmation.tsx
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── send.ts
│   │   └── package.json
│   │
│   ├── notifications/                          # Push notifications
│   │   ├── src/
│   │   │   ├── push.ts
│   │   │   ├── in-app.ts
│   │   │   └── email.ts
│   │   └── package.json
│   │
│   ├── storage/                                # File storage (S3/Cloudinary)
│   │   ├── src/
│   │   │   ├── upload.ts
│   │   │   ├── delete.ts
│   │   │   └── transform.ts
│   │   └── package.json
│   │
│   └── search/                                 # Search service (Algolia/MeiliSearch)
│       ├── src/
│       │   ├── index.ts
│       │   ├── sync.ts
│       │   └── queries.ts
│       └── package.json
│
├── 🤖 workers/                                 # Background jobs (BullMQ/Inngest)
│   ├── email-worker/
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── image-processor/
│   │   ├── src/
│   │   │   └── index.ts                       # Resize, optimize, watermark
│   │   └── package.json
│   │
│   ├── analytics-worker/
│   │   ├── src/
│   │   │   └── index.ts                       # Process analytics events
│   │   └── package.json
│   │
│   └── notification-worker/
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── 📱 mobile/                                  # Future: React Native app
│   └── .gitkeep
│
├── 🧪 tests/
│   ├── e2e/                                    # Playwright tests
│   │   ├── auth.spec.ts
│   │   ├── listings.spec.ts
│   │   ├── messaging.spec.ts
│   │   └── checkout.spec.ts
│   │
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   │
│   └── unit/
│       ├── utils/
│       └── components/
│
├── 📚 docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── SECURITY.md
│
├── 🔒 .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .gitignore
├── .env.example
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Complete Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USERS & AUTH ====================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     DateTime?
  hashedPassword    String?
  name              String?
  username          String    @unique
  phone             String?
  phoneVerified     Boolean   @default(false)
  avatar            String?
  bio               String?
  
  // Verification
  isVerified        Boolean   @default(false)
  verificationStatus VerificationStatus @default(UNVERIFIED)
  verifiedAt        DateTime?
  
  // Account status
  isBanned          Boolean   @default(false)
  bannedAt          DateTime?
  bannedReason      String?
  isSuspended       Boolean   @default(false)
  suspendedUntil    DateTime?
  
  // Security
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?
  
  // Stats
  rating            Float     @default(0)
  totalRatings      Int       @default(0)
  totalSales        Int       @default(0)
  totalPurchases    Int       @default(0)
  joinedAt          DateTime  @default(now())
  lastActive        DateTime  @default(now())
  
  // Location
  city              String?
  state             String?
  country           String?
  latitude          Float?
  longitude         Float?
  
  // Preferences
  language          String    @default("en")
  currency          String    @default("USD")
  timezone          String    @default("UTC")
  
  // Notifications
  emailNotifications Boolean  @default(true)
  pushNotifications Boolean   @default(true)
  smsNotifications  Boolean   @default(false)
  
  // Relations
  accounts          Account[]
  sessions          Session[]
  listings          Listing[]
  favorites         Favorite[]
  reviews           Review[]       @relation("ReviewsGiven")
  reviewsReceived   Review[]       @relation("ReviewsReceived")
  sentMessages      Message[]      @relation("SentMessages")
  receivedMessages  Message[]      @relation("ReceivedMessages")
  conversations     ConversationParticipant[]
  orders            Order[]        @relation("BuyerOrders")
  sales             Order[]        @relation("SellerOrders")
  reports           Report[]
  reportedBy        Report[]       @relation("Reporter")
  verificationDocs  VerificationDocument[]
  notifications     Notification[]
  blockedUsers      BlockedUser[]  @relation("BlockingUser")
  blockedByUsers    BlockedUser[]  @relation("BlockedUser")
  savedSearches     SavedSearch[]
  viewHistory       ListingView[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([email])
  @@index([username])
  @@index([verificationStatus])
  @@index([isVerified])
}

enum VerificationStatus {
  UNVERIFIED
  PENDING
  APPROVED
  REJECTED
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

model VerificationDocument {
  id          String   @id @default(cuid())
  userId      String
  type        DocumentType
  frontImage  String
  backImage   String?
  status      VerificationStatus @default(PENDING)
  reviewedBy  String?
  reviewedAt  DateTime?
  rejectReason String?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
}

enum DocumentType {
  PASSPORT
  DRIVERS_LICENSE
  NATIONAL_ID
  UTILITY_BILL
}

// ==================== LISTINGS ====================

model Listing {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String
  price           Float
  originalPrice   Float?
  currency        String   @default("USD")
  condition       Condition
  status          ListingStatus @default(DRAFT)
  
  // Category
  categoryId      String
  subcategoryId   String?
  
  // Location
  city            String
  state           String?
  country         String
  zipCode         String?
  latitude        Float?
  longitude       Float?
  meetupLocations String[]
  
  // Media
  images          String[]
  videoUrl        String?
  
  // Features
  isFeatured      Boolean  @default(false)
  featuredUntil   DateTime?
  isPremium       Boolean  @default(false)
  premiumUntil    DateTime?
  
  // Stats
  viewCount       Int      @default(0)
  favoriteCount   Int      @default(0)
  shareCount      Int      @default(0)
  inquiryCount    Int      @default(0)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  
  // Owner
  userId          String
  
  // Moderation
  moderationStatus ModerationStatus @default(PENDING)
  moderatedAt     DateTime?
  moderatedBy     String?
  rejectionReason String?
  
  // Delivery/Shipping
  shippingAvailable Boolean @default(false)
  localPickupOnly   Boolean @default(true)
  shippingCost      Float?
  
  // Negotiation
  negotiable      Boolean  @default(true)
  minPrice        Float?
  
  // Expiry
  expiresAt       DateTime?
  renewCount      Int      @default(0)
  lastRenewedAt   DateTime?
  
  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category        Category @relation(fields: [categoryId], references: [id])
  favorites       Favorite[]
  reviews         Review[]
  reports         Report[]
  attributes      ListingAttribute[]
  views           ListingView[]
  conversations   Conversation[]
  orders          Order[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  publishedAt     DateTime?
  soldAt          DateTime?
  
  @@index([userId])
  @@index([categoryId])
  @@index([status])
  @@index([moderationStatus])
  @@index([slug])
  @@index([isFeatured])
  @@index([createdAt])
  @@fulltext([title, description])
}

enum Condition {
  NEW
  LIKE_NEW
  EXCELLENT
  GOOD
  FAIR
  POOR
}

enum ListingStatus {
  DRAFT
  ACTIVE
  PENDING
  SOLD
  EXPIRED
  REMOVED
}

enum ModerationStatus {
  PENDING
  APPROVED
  REJECTED
  FLAGGED
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  icon        String?
  image       String?
  parentId    String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  listings    Listing[]
  attributes  CategoryAttribute[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([parentId])
}

model CategoryAttribute {
  id           String   @id @default(cuid())
  categoryId   String
  name         String
  type         AttributeType
  required     Boolean  @default(false)
  options      String[]
  
  category     Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  listingValues ListingAttribute[]
  
  @@index([categoryId])
}

enum AttributeType {
  TEXT
  NUMBER
  SELECT
  MULTISELECT
  BOOLEAN
  DATE
}

model ListingAttribute {
  id          String   @id @default(cuid())
  listingId   String
  attributeId String
  value       String
  
  listing     Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  attribute   CategoryAttribute @relation(fields: [attributeId], references: [id], onDelete: Cascade)
  
  @@unique([listingId, attributeId])
  @@index([listingId])
}

model ListingView {
  id        String   @id @default(cuid())
  listingId String
  userId    String?
  ipAddress String?
  userAgent String?
  
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  viewedAt  DateTime @default(now())
  
  @@index([listingId])
  @@index([userId])
  @@index([viewedAt])
}

// ==================== FAVORITES ====================

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  listingId String
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, listingId])
  @@index([userId])
  @@index([listingId])
}

// ==================== MESSAGING ====================

model Conversation {
  id          String   @id @default(cuid())
  listingId   String?
  lastMessageAt DateTime @default(now())
  
  listing     Listing? @relation(fields: [listingId], references: [id], onDelete: SetNull)
  participants ConversationParticipant[]
  messages    Message[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([listingId])
  @@index([lastMessageAt])
}

model ConversationParticipant {
  id             String   @id @default(cuid())
  conversationId String
  userId         String
  lastReadAt     DateTime?
  isBlocked      Boolean  @default(false)
  
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  joinedAt       DateTime @default(now())
  
  @@unique([conversationId, userId])
  @@index([userId])
  @@index([conversationId])
}

model Message {
  id             String   @id @default(cuid())
  conversationId String
  senderId       String
  recipientId    String
  content        String
  attachments    String[]
  isRead         Boolean  @default(false)
  readAt         DateTime?
  isDeleted      Boolean  @default(false)
  
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  recipient      User     @relation("ReceivedMessages", fields: [recipientId], references: [id], onDelete: Cascade)
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@index([conversationId])
  @@index([senderId])
  @@index([recipientId])
  @@index([createdAt])
}

// ==================== REVIEWS ====================

model Review {
  id          String   @id @default(cuid())
  listingId   String?
  reviewerId  String
  reviewedId  String
  rating      Int
  comment     String?
  response    String?
  respondedAt DateTime?
  isPublic    Boolean  @default(true)
  isVerified  Boolean  @default(false)
  helpfulCount Int     @default(0)
  
  listing     Listing? @relation(fields: [listingId], references: [id], onDelete: SetNull)
  reviewer    User     @relation("ReviewsGiven", fields: [reviewerId], references: [id], onDelete: Cascade)
  reviewed    User     @relation("ReviewsReceived", fields: [reviewedId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([listingId])
  @@index([reviewerId])
  @@index([reviewedId])
  @@index([rating])
}

// ==================== ORDERS ====================

model Order {
  id          String   @id @default(cuid())
  orderNumber String   @unique
  listingId   String
  buyerId     String
  sellerId    String
  
  // Pricing
  itemPrice   Float
  shippingCost Float   @default(0)
  serviceFee  Float    @default(0)
  totalAmount Float
  currency    String   @default("USD")
  
  // Status
  status      OrderStatus @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)
  
  // Delivery
  deliveryMethod DeliveryMethod
  trackingNumber String?
  shippingAddress Json?
  
  // Dates
  paidAt      DateTime?
  shippedAt   DateTime?
  deliveredAt DateTime?
  cancelledAt DateTime?
  
  // Relations
  listing     Listing  @relation(fields: [listingId], references: [id])
  buyer       User     @relation("BuyerOrders", fields: [buyerId], references: [id])
  seller      User     @relation("SellerOrders", fields: [sellerId], references: [id])
  payments    Payment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([buyerId])
  @@index([sellerId])
  @@index([listingId])
  @@index([status])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
  DISPUTED
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

enum DeliveryMethod {
  LOCAL_PICKUP
  SHIPPING
  DIGITAL
}

model Payment {
  id              String   @id @default(cuid())
  orderId         String
  amount          Float
  currency        String
  status          PaymentStatus
  paymentMethod   PaymentMethod
  stripePaymentId String?
  
  order           Order    @relation(fields: [orderId], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([orderId])
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PAYPAL
  BANK_TRANSFER
  CASH
}

// ==================== REPORTS ====================

model Report {
  id          String   @id @default(cuid())
  reporterId  String
  reportedUserId String?
  listingId   String?
  reason      ReportReason
  description String?
  status      ReportStatus @default(PENDING)
  reviewedBy  String?
  reviewedAt  DateTime?
  resolution  String?
  
  reporter    User     @relation(fields: [reporterId], references: [id], onDelete: Cascade)
  reportedUser User?   @relation("Reporter", fields: [reportedUserId], references: [id], onDelete: SetNull)
  listing     Listing? @relation(fields: [listingId], references: [id], onDelete: SetNull)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([reporterId])
  @@index([reportedUserId])
  @@index([listingId])
  @@index([status])
}

enum ReportReason {
  SPAM
  FRAUD
  INAPPROPRIATE_CONTENT
  PROHIBITED_ITEM
  HARASSMENT
  FAKE_LISTING
  COUNTERFEIT
  PRICE_GOUGING
  OTHER
}

enum ReportStatus {
  PENDING
  REVIEWING
  RESOLVED
  DISMISSED
}

// ==================== NOTIFICATIONS ====================

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  link      String?
  isRead    Boolean  @default(false)
  readAt    DateTime?
  data      Json?
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
}

enum NotificationType {
  MESSAGE
  LISTING_APPROVED
  LISTING_REJECTED
  LISTING_SOLD
  NEW_REVIEW
  FAVORITE
  PRICE_DROP
  VERIFICATION_APPROVED
  VERIFICATION_REJECTED
  ORDER_PLACED
  ORDER_SHIPPED
  PAYMENT_RECEIVED
  SYSTEM
}

// ==================== MISC ====================

model BlockedUser {
  id          String   @id @default(cuid())
  blockerId   String
  blockedId   String
  
  blocker     User     @relation("BlockingUser", fields: [blockerId], references: [id], onDelete: Cascade)
  blocked     User     @relation("BlockedUser", fields: [blockedId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  
  @@unique([blockerId, blockedId])
  @@index([blockerId])
  @@index([blockedId])
}

model SavedSearch {
  id          String   @id @default(cuid())
  userId      String
  name        String
  query       Json
  frequency   NotificationFrequency @default(INSTANT)
  isActive    Boolean  @default(true)
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
}

enum NotificationFrequency {
  INSTANT
  DAILY
  WEEKLY
  NEVER
}

model AdminLog {
  id          String   @id @default(cuid())
  adminId     String
  action      String
  entity      String
  entityId    String
  details     Json?
  ipAddress   String?
  
  createdAt   DateTime @default(now())
  
  @@index([adminId])
  @@index([createdAt])
  @@index([entity, entityId])
}
```

---

## Tech Stack Details

### Frontend (User & Admin)
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI / shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: Zustand / Jotai
- **Data Fetching**: TanStack Query (React Query)
- **Real-time**: Pusher / Ably / Socket.io
- **Analytics**: Vercel Analytics / PostHog
- **Monitoring**: Sentry

### Backend
- **API**: Next.js API Routes / tRPC
- **Database**: PostgreSQL (Supabase / Neon / Railway)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (Auth.js)
- **File Upload**: AWS S3 / Cloudinary / UploadThing
- **Payments**: Stripe
- **Email**: Resend / SendGrid / AWS SES
- **Search**: Algolia / MeiliSearch / Typesense
- **Cache**: Redis (Upstash)
- **Queue**: BullMQ / Inngest

### DevOps
- **Hosting**: Vercel / Railway / Fly.io
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry / LogRocket
- **Analytics**: PostHog / Mixpanel

---

## Key Features Implementation

### 1. **Authentication & Authorization**
- Email/password with email verification
- Social login (Google, Facebook, Apple)
- Two-factor authentication (TOTP)
- Session management
- Role-based access control (RBAC)
- Admin-only routes protection

### 2. **User Verification System**
- ID document upload (passport, driver's license)
- Manual admin review
- Verification badge display
- Fee payment for verification ($5-10)

### 3. **Listing Management**
- Multi-step listing creation
- Image upload (up to 10 images)
- Auto-moderation (AI content filtering)
- Manual admin approval workflow
- Featured/Premium listings (paid)
- Auto-expiry and renewal
- Draft saving

### 4. **Search & Discovery**
- Full-text search
- Faceted filters (category, price, location, condition)
- Geolocation-based results
- Saved searches with alerts
- Recently viewed
- Recommendations

### 5. **Messaging System**
- Real-time chat (Pusher/WebSocket)
- Image attachments
- Unread count
- Block users
- Conversation archiving

### 6. **Reviews & Ratings**
- 5-star rating system
- Verified purchase badges
- Seller response option
- Helpful votes
- Report reviews

### 7. **Admin Dashboard**
- Approve/reject listings
- User verification review
- Ban/suspend users
- Content moderation
- Analytics & reports
- Revenue tracking (verification fees, featured listings)
- Bulk actions

### 8. **Payment Integration**
- Stripe checkout
- Verification fee payment
- Featured listing fees
- Premium placement fees
- Payout management

### 9. **Notifications**
- Email notifications
- In-app notifications
- Push notifications (PWA)
- SMS alerts (optional)
- Customizable preferences

### 10. **Security Features**
- Rate limiting
- CSRF protection
- XSS prevention
- SQL injection protection
- Image upload validation
- Content sanitization
- IP blocking
- Suspicious activity detection

---

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Storage
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_BUCKET_NAME=""
# OR
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Payment
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Email
RESEND_API_KEY=""
# OR
SENDGRID_API_KEY=""
EMAIL_FROM="noreply@yoursite.com"

# Search
ALGOLIA_APP_ID=""
ALGOLIA_API_KEY=""
ALGOLIA_SEARCH_KEY=""

# Real-time
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER="us2"

# Redis
REDIS_URL=""

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST=""

# Monitoring
SENTRY_DSN=""

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
```

---

This is your complete foundation. Let me know if you need detailed implementation for any specific part!