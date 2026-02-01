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
export * from './product';

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