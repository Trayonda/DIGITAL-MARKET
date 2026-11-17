export type ProductCondition =
  | 'BRAND_NEW'
  | 'OPEN_BOX'
  | 'EXCELLENT_REFURBISHED'
  | 'VERY_GOOD'
  | 'GOOD';

export type AvailabilityStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'SOLD' | 'RESERVED';
export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'NEGOTIATION' | 'CONVERTED' | 'CLOSED';

export interface ProductImage {
  id: string;
  url: string;
  publicId?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  productCount?: number;
}

export interface ProductSpecifications {
  processor?: string;
  generation?: string;
  ram?: string;
  ramType?: string;
  storageType?: string;
  storageCapacity?: string;
  displaySize?: string;
  resolution?: string;
  graphics?: string;
  operatingSystem?: string;
  batteryHealth?: string;
  keyboard?: string;
  ports?: string;
  weight?: string;
  formFactor?: string;
  connectivity?: string;
  sensor?: string;
  switchType?: string;
  outputPower?: string;
  interface?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  condition: ProductCondition;
  description: string;
  specifications: ProductSpecifications;
  internalCostPrice?: number; // Only present in admin endpoints
  sellingPrice: number;
  originalPrice?: number | null;
  warranty?: string | null;
  stockQuantity: number;
  availabilityStatus: AvailabilityStatus;
  publishStatus?: PublishStatus;
  isFeatured: boolean;
  viewsCount: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface EnquiryItem {
  id: string;
  productId?: string | null;
  productSku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  specSnapshot: string | ProductSpecifications;
  product?: {
    id: string;
    slug: string;
    images?: ProductImage[];
  };
}

export interface Enquiry {
  id: string;
  enquiryRef: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerMessage?: string | null;
  status: EnquiryStatus;
  internalNotes?: string | null;
  subtotal: number;
  estimatedTotal: number;
  createdAt: string;
  updatedAt: string;
  items: EnquiryItem[];
}

export interface StoreSettings {
  businessName: string;
  businessTagline?: string | null;
  logoUrl?: string | null;
  whatsappNumber: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  currencySymbol: string;
  defaultWarrantyText?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    [key: string]: any;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}
