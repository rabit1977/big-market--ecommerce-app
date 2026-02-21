export interface User {
  id: string;
  _id: string;
  name?: string;
  nameLower?: string;
  email?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  bio?: string;
  createdAt: Date | number;
  updatedAt: Date | number;
  externalId: string;
  emailVerified?: Date | number | null;
  isVerified?: boolean;
  accountStatus?: string;
  verificationStatus?: string;
  membershipStatus?: string;
  registrationComplete?: boolean;
}

export interface Review {
  id: string;
  _id: string;
  userId: string;
  listingId: string;
  rating: number;
  comment: string;
  createdAt: Date | number;
}

export interface Order {
  id: string;
  _id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date | number;
}

export * from './listing';
// export * from './product'; // Removed non-existent file export

export type ReviewWithUser = Review & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type UserWithRelations = User & {
  orders?: Order[];
  reviews?: Review[];
};

export const AddressType = {
  SHIPPING: 'SHIPPING',
  BILLING: 'BILLING',
  BOTH: 'BOTH',
} as const;

export type AddressType = keyof typeof AddressType;

export interface Address {
  id: string;
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  label?: string;
  type: AddressType;
  deliveryInstructions?: string;
  createdAt: Date | number;
  updatedAt: Date | number;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export const NotificationTypes = {
  ORDER_UPDATE: 'ORDER_UPDATE',
  PRICE_DROP: 'PRICE_DROP',
  BACK_IN_STOCK: 'BACK_IN_STOCK',
  PROMOTION: 'PROMOTION',
  REVIEW_REPLY: 'REVIEW_REPLY',
  SHIPMENT_UPDATE: 'SHIPMENT_UPDATE',
  ACCOUNT_ALERT: 'ACCOUNT_ALERT',
  WISHLIST_SALE: 'WISHLIST_SALE',
  SYSTEM: 'SYSTEM',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INQUIRY: 'INQUIRY',
} as const;

export type NotificationType = keyof typeof NotificationTypes;

export interface NotificationWithMeta {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  readAt: Date | null;
  metadata?: unknown;
  createdAt: Date;
}

export interface GetNotificationsOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export interface GetNotificationsResult {
  notifications: NotificationWithMeta[];
  totalCount: number;
  unreadCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}