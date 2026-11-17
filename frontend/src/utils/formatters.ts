export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatCondition = (condition: string): { label: string; colorClass: string; bgClass: string } => {
  switch (condition) {
    case 'BRAND_NEW':
      return { label: 'Brand New', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-200' };
    case 'OPEN_BOX':
      return { label: 'Open Box - Like New', colorClass: 'text-sky-700', bgClass: 'bg-sky-50 border-sky-200' };
    case 'EXCELLENT_REFURBISHED':
      return { label: 'Refurbished (Grade A+)', colorClass: 'text-blue-700', bgClass: 'bg-blue-50 border-blue-200' };
    case 'VERY_GOOD':
      return { label: 'Certified Pre-Owned', colorClass: 'text-amber-700', bgClass: 'bg-amber-50 border-amber-200' };
    case 'GOOD':
      return { label: 'Value Pre-Owned', colorClass: 'text-slate-700', bgClass: 'bg-slate-100 border-slate-200' };
    default:
      return { label: 'Refurbished', colorClass: 'text-blue-700', bgClass: 'bg-blue-50 border-blue-200' };
  }
};

export const formatAvailability = (status: string, stock: number) => {
  if (status === 'SOLD' || stock <= 0) {
    return { label: 'Sold Out', colorClass: 'text-red-700', bgClass: 'bg-red-50 border-red-200', isAvailable: false };
  }
  if (status === 'OUT_OF_STOCK') {
    return { label: 'Out of Stock', colorClass: 'text-red-700', bgClass: 'bg-red-50 border-red-200', isAvailable: false };
  }
  if (status === 'RESERVED') {
    return { label: 'Reserved', colorClass: 'text-purple-700', bgClass: 'bg-purple-50 border-purple-200', isAvailable: false };
  }
  if (stock === 1) {
    return { label: 'Only 1 Unit Left!', colorClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-300 font-semibold', isAvailable: true };
  }
  return { label: 'In Stock', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-200', isAvailable: true };
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};
