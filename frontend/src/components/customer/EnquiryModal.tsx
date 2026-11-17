import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, Copy, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { useCart } from '../../context/CartContext.js';
import { submitEnquiry } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const { cart, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state after enquiry is saved in DB
  const [successData, setSuccessData] = useState<{
    enquiryRef: string;
    whatsappUrl: string;
    messageText: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!customerName.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)');
      return;
    }

    if (!customerCity.trim()) {
      setError('Please enter your city');
      return;
    }

    if (cart.length === 0) {
      setError('Your shopping cart is empty');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerCity: customerCity.trim(),
        customerMessage: customerMessage.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await submitEnquiry(payload);

      if (response.success && response.data) {
        setSuccessData({
          enquiryRef: response.data.enquiryRef,
          whatsappUrl: response.data.whatsappUrl,
          messageText: response.data.messageText,
        });

        // Clear local cart now that enquiry is securely logged in database
        clearCart();

        // Attempt to open WhatsApp window automatically
        try {
          window.open(response.data.whatsappUrl, '_blank');
        } catch {
          // If popup is blocked by browser, user can click the manual button on the success screen
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (successData?.messageText) {
      navigator.clipboard.writeText(successData.messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={successData ? 'Enquiry Placed Successfully!' : 'Send Bulk Enquiry on WhatsApp'}
      subtitle={
        successData
          ? `Reference ID: #${successData.enquiryRef}`
          : `Review your ${cart.length} item(s) and enter contact details`
      }
      maxWidth="md"
    >
      {successData ? (
        /* SUCCESS SCREEN */
        <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 font-heading">
              Enquiry Recorded in Database!
            </h4>
            <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
              Your bulk enquiry has been saved under Reference{' '}
              <span className="font-mono font-bold text-blue-600">
                #{successData.enquiryRef}
              </span>
              . Our sales team is ready to assist you.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
            <span className="text-xs font-bold text-slate-700 block mb-1">
              WhatsApp Message Preview:
            </span>
            <pre className="text-[11px] text-slate-600 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto bg-white p-2.5 rounded-lg border border-slate-200">
              {successData.messageText}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={successData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5" /> Open in WhatsApp Again <ExternalLink className="w-4 h-4" />
            </a>

            <Button
              variant="outline"
              size="md"
              onClick={handleCopyMessage}
              icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Message Copied to Clipboard!' : 'Copy Formatted Message'}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleClose}>
              Done & Return to Store
            </Button>
          </div>
        </div>
      ) : (
        /* INPUT FORM SCREEN */
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Snapshot Summary */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600">Total Items in Cart:</span>
              <span className="font-bold text-slate-900 ml-1.5">{cart.length} item(s)</span>
            </div>
            <div>
              <span className="text-slate-600">Estimated Total:</span>
              <span className="font-extrabold text-blue-700 text-sm ml-1.5 font-heading">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp / Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-11 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City / Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optional Message or Inquiries
            </label>
            <textarea
              rows={2}
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="e.g. Please check if laptop bag and power cable are included."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white resize-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="whatsapp"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              icon={<MessageCircle className="w-5 h-5" />}
            >
              Send Enquiry on WhatsApp
            </Button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              🔒 No payment required now. You will chat directly with our store team.
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
};
