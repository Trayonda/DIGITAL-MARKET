import { Request } from 'express';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}
