export const generateSKU = (categorySlug: string, brand: string, model: string): string => {
  const cat = (categorySlug || 'GEN').substring(0, 3).toUpperCase();
  const b = (brand || 'BRD').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  const m = (model || 'MOD').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DM-${cat}-${b}-${m}-${rand}`;
};

export const generateEnquiryRef = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ENQ-${year}${month}-${rand}`;
};

export const generateSlug = (name: string): string => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const rand = Math.floor(100 + Math.random() * 900);
  return `${base}-${rand}`;
};
