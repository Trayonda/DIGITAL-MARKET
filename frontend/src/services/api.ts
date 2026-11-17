import axios from 'axios';
import {
  Product,
  Category,
  StoreSettings,
  Enquiry,
  AdminUser,
} from '../types/index.js';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// -----------------------------------------------------------------------------
// PUBLIC APIS
// -----------------------------------------------------------------------------

export interface ProductsQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: string;
  isFeatured?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export const getProducts = async (params: ProductsQueryParams = {}) => {
  const { data } = await api.get<{
    success: boolean;
    data: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasMore: boolean;
    };
  }>('/products', { params });
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const { data } = await api.get<{
    success: boolean;
    data: Product;
    related: Product[];
  }>(`/products/${slug}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get<{
    success: boolean;
    data: Category[];
  }>('/categories');
  return data;
};

export const getStoreSettings = async () => {
  const { data } = await api.get<{
    success: boolean;
    data: StoreSettings;
  }>('/store-settings');
  return data;
};

export interface SubmitEnquiryPayload {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerMessage?: string;
  items: { productId: string; quantity: number }[];
}

export const submitEnquiry = async (payload: SubmitEnquiryPayload) => {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: {
      enquiryRef: string;
      customerName: string;
      subtotal: number;
      estimatedTotal: number;
      itemsCount: number;
      whatsappUrl: string;
      messageText: string;
      businessWhatsApp: string;
    };
  }>('/enquiries', payload);
  return data;
};

// -----------------------------------------------------------------------------
// ADMIN AUTH APIS
// -----------------------------------------------------------------------------

export const loginAdmin = async (credentials: { email: string; password: string }) => {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    admin: AdminUser;
    token?: string;
  }>('/admin/login', credentials);
  return data;
};

export const logoutAdmin = async () => {
  const { data } = await api.post<{ success: boolean; message: string }>('/admin/logout');
  return data;
};

export const getAdminProfile = async () => {
  const { data } = await api.get<{ success: boolean; admin: AdminUser }>('/admin/me');
  return data;
};

export const changeAdminPassword = async (payload: { currentPassword: string; newPassword: string }) => {
  const { data } = await api.put<{ success: boolean; message: string }>('/admin/change-password', payload);
  return data;
};

// -----------------------------------------------------------------------------
// ADMIN DASHBOARD & PRODUCT APIS
// -----------------------------------------------------------------------------

export const getAdminDashboardMetrics = async () => {
  const { data } = await api.get<{
    success: boolean;
    data: {
      products: { total: number; available: number; sold: number; unpublished: number };
      enquiries: { total: number; new: number; totalPipelineValue: number };
      recentEnquiries: Enquiry[];
      recentProducts: Product[];
      categories: { id: string; name: string; slug: string; productCount: number }[];
    };
  }>('/admin/dashboard');
  return data;
};

export const getAdminProducts = async (params: any = {}) => {
  const { data } = await api.get<{
    success: boolean;
    data: Product[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>('/admin/products', { params });
  return data;
};

export const getAdminProductById = async (id: string) => {
  const { data } = await api.get<{ success: boolean; data: Product }>(`/admin/products/${id}`);
  return data;
};

export const createAdminProduct = async (payload: any) => {
  const { data } = await api.post<{ success: boolean; message: string; data: Product }>(
    '/admin/products',
    payload
  );
  return data;
};

export const updateAdminProduct = async (id: string, payload: any) => {
  const { data } = await api.put<{ success: boolean; message: string; data: Product }>(
    `/admin/products/${id}`,
    payload
  );
  return data;
};

export const deleteAdminProduct = async (id: string) => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/admin/products/${id}`);
  return data;
};

export const duplicateAdminProduct = async (id: string) => {
  const { data } = await api.post<{ success: boolean; message: string; data: Product }>(
    `/admin/products/${id}/duplicate`
  );
  return data;
};

export const toggleAdminFeatured = async (id: string) => {
  const { data } = await api.patch<{ success: boolean; message: string; isFeatured: boolean }>(
    `/admin/products/${id}/toggle-featured`
  );
  return data;
};

// -----------------------------------------------------------------------------
// ADMIN ENQUIRIES APIS
// -----------------------------------------------------------------------------

export const getAdminEnquiries = async (params: any = {}) => {
  const { data } = await api.get<{
    success: boolean;
    data: Enquiry[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>('/admin/enquiries', { params });
  return data;
};

export const getAdminEnquiryById = async (id: string) => {
  const { data } = await api.get<{ success: boolean; data: Enquiry }>(`/admin/enquiries/${id}`);
  return data;
};

export const updateAdminEnquiry = async (id: string, payload: { status?: string; internalNotes?: string }) => {
  const { data } = await api.put<{ success: boolean; message: string; data: Enquiry }>(
    `/admin/enquiries/${id}`,
    payload
  );
  return data;
};

// -----------------------------------------------------------------------------
// ADMIN CATEGORIES APIS
// -----------------------------------------------------------------------------

export const getAdminCategories = async () => {
  const { data } = await api.get<{ success: boolean; data: (Category & { productCount: number })[] }>(
    '/admin/categories'
  );
  return data;
};

export const createAdminCategory = async (payload: any) => {
  const { data } = await api.post<{ success: boolean; message: string; data: Category }>(
    '/admin/categories',
    payload
  );
  return data;
};

export const updateAdminCategory = async (id: string, payload: any) => {
  const { data } = await api.put<{ success: boolean; message: string; data: Category }>(
    `/admin/categories/${id}`,
    payload
  );
  return data;
};

export const deleteAdminCategory = async (id: string) => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/admin/categories/${id}`);
  return data;
};

// -----------------------------------------------------------------------------
// ADMIN SETTINGS APIS
// -----------------------------------------------------------------------------

export const getAdminSettings = async () => {
  const { data } = await api.get<{ success: boolean; data: StoreSettings }>('/admin/settings');
  return data;
};

export const updateAdminSettings = async (payload: any) => {
  const { data } = await api.put<{ success: boolean; message: string; data: StoreSettings }>(
    '/admin/settings',
    payload
  );
  return data;
};

// -----------------------------------------------------------------------------
// ADMIN UPLOADS
// -----------------------------------------------------------------------------

export const uploadProductImages = async (formData: FormData) => {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: { url: string; publicId: string | null; filename: string }[];
  }>('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
