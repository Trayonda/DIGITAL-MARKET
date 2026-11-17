export interface WhatsAppProductItem {
  name: string;
  sku: string;
  specsSummary?: string;
  quantity: number;
  unitPrice: number;
}

export interface WhatsAppEnquiryData {
  enquiryRef: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerMessage?: string | null;
  items: WhatsAppProductItem[];
  estimatedTotal: number;
  businessWhatsApp: string;
  businessName?: string;
}

export const generateWhatsAppMessage = (data: WhatsAppEnquiryData): string => {
  const storeName = data.businessName || 'DIGITAL MARKET';
  const cleanPhone = data.customerPhone.trim();
  const totalFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(data.estimatedTotal);

  let message = `🛒 *NEW ENQUIRY - ${storeName}*\n`;
  message += `🔖 *Reference ID:* #${data.enquiryRef}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Customer:* ${data.customerName}\n`;
  message += `📱 *Phone:* ${cleanPhone}\n`;
  message += `📍 *City:* ${data.customerCity}\n`;
  if (data.customerMessage && data.customerMessage.trim()) {
    message += `💬 *Note:* ${data.customerMessage.trim()}\n`;
  }
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📦 *ITEMS REQUESTED (${data.items.length} ${data.items.length === 1 ? 'item' : 'items'}):*\n\n`;

  // If large cart (>4 items), create a compact format to prevent URL truncation
  const isCompact = data.items.length > 4;

  data.items.forEach((item, index) => {
    const itemTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(item.unitPrice * item.quantity);

    const priceEach = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(item.unitPrice);

    if (isCompact) {
      message += `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - ${itemTotal}\n`;
    } else {
      message += `${index + 1}. *${item.name}*\n`;
      if (item.specsSummary) {
        message += `   • ${item.specsSummary}\n`;
      }
      message += `   • Qty: ${item.quantity} × ${priceEach} = ${itemTotal}\n`;
      message += `   • SKU: ${item.sku}\n\n`;
    }
  });

  if (isCompact) {
    message += `\n_(Full product specification details recorded under Ref #${data.enquiryRef})_\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *ESTIMATED TOTAL: ${totalFormatted}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `_Sent via ${storeName} Online Platform_`;

  return message;
};

export const createWhatsAppUrl = (whatsappNumber: string, messageText: string): string => {
  // Strip non-digit characters from the business WhatsApp number
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(messageText);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};
