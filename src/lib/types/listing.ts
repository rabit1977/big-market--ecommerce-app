export interface Listing {
  id?: string;
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory: string | null;
  thumbnail: string | null;
  city: string;
  status: string; // 'ACTIVE', 'SOLD', etc.
  userId: string;
  createdAt: number | Date;
  updatedAt: Date;
  viewCount: number;
  contactPhone?: string;
  contactEmail?: string | null;
  showPhonePublic?: boolean;
  specifications?: any;
  tags?: string[];
  features?: string[];
  // Professional Market Fields
  userType?: string;
  adType?: string;
  condition?: string;
  isTradePossible?: boolean;
  hasShipping?: boolean;
  isVatIncluded?: boolean;
  isAffordable?: boolean;
  // Promotion Fields
  isPromoted?: boolean;
  promotionTier?: string;
  priority?: number;
}

export interface ListingImage {
  id: string;
  url: string;
  position: number;
  listingId: string;
}

export type ListingWithRelations = Listing & {
  images: { url: string }[];
  user: {
     id: string;
     name: string | null;
     image: string | null;
     city: string | null;
     membershipTier?: string;
     isVerified?: boolean;
  };
};

export type ListingSortKey = 'newest' | 'price-asc' | 'price-desc' | 'oldest';

export interface ListingGridProps {
  title?: string;
  subtitle?: string;
  listings: ListingWithRelations[];
  totalCount: number;
  currentPage: number;
  currentCategory?: string;
  currentSort?: ListingSortKey;
  pageSize?: number;
  searchQuery?: string;
}
