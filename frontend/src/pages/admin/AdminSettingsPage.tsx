import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, MessageCircle, Globe, Shield, Phone } from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '../../services/api.js';
import { Button } from '../../components/common/Button.js';

export const AdminSettingsPage: React.FC = () => {
  const [businessName, setBusinessName] = useState('DIGITAL MARKET');
  const [businessTagline, setBusinessTagline] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('919650624535');
  const [contactPhone, setContactPhone] = useState('+91 96506 24535');
  const [contactEmail, setContactEmail] = useState('contact@digitalmarket.in');
  const [address, setAddress] = useState('');
  const [defaultWarrantyText, setDefaultWarrantyText] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getAdminSettings()
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setBusinessName(d.businessName || 'DIGITAL MARKET');
          setBusinessTagline(d.businessTagline || '');
          setWhatsappNumber(d.whatsappNumber || '919876543210');
          setContactPhone(d.contactPhone || '');
          setContactEmail(d.contactEmail || '');
          setAddress(d.address || '');
          setDefaultWarrantyText(d.defaultWarrantyText || '');
          setSeoTitle(d.seoTitle || '');
          setSeoDescription(d.seoDescription || '');
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate WhatsApp number
    const cleanWA = whatsappNumber.replace(/\D/g, '');
    if (cleanWA.length < 10) {
      setError('WhatsApp number must have at least 10 digits (including country code)');
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateAdminSettings({
        businessName,
        businessTagline,
        whatsappNumber: cleanWA,
        contactPhone,
        contactEmail,
        address,
        defaultWarrantyText,
        seoTitle,
        seoDescription,
      });

      if (res.success) {
        setToastMessage('Store settings saved successfully!');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Store & WhatsApp Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure business identity, WhatsApp enquiry recipient, and SEO parameters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. WhatsApp Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2 font-heading">
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span>WhatsApp Enquiry System</span>
          </div>

          <div className="bg-green-50/60 border border-green-200/80 rounded-2xl p-4 space-y-2">
            <label className="block text-xs font-bold text-green-950">
              Business WhatsApp Number (Target for Customer Inquiries) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 919876543210 (include country code 91)"
                className="w-full px-3.5 py-2.5 text-sm font-mono font-bold border border-green-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            <p className="text-[11px] text-green-800 leading-relaxed">
              ⭐ Crucial: When customers click "Send Bulk Enquiry on WhatsApp" in their cart, the pre-formatted itemized order message will open directly to this WhatsApp number. Format: Country code followed by 10-digit number (e.g. <code>919876543210</code>).
            </p>
          </div>
        </div>

        {/* 2. Business Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2 font-heading">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Business Contact Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={businessTagline}
                onChange={(e) => setBusinessTagline(e.target.value)}
                placeholder="Premium Refurbished Laptops & PCs"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Display Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Email Address
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@digitalmarket.in"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Store Physical Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop 12, Ground Floor, Nehru Place, New Delhi..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* 3. Warranty Terms */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2 font-heading">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Default Warranty Statement</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Warranty Text (Shown on Product Detail and Cards)
            </label>
            <input
              type="text"
              value={defaultWarrantyText}
              onChange={(e) => setDefaultWarrantyText(e.target.value)}
              placeholder="30 Days Testing Guarantee + 6 Months Hardware Service"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 4. SEO & Meta Tags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2 font-heading">
            <Globe className="w-4 h-4 text-sky-600" />
            <span>Search Engine Optimization (SEO)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Website Meta Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="DIGITAL MARKET | Premium Refurbished Laptops & Desktop PCs"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Website Meta Description
            </label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Buy certified second-hand & refurbished laptops, desktops..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            icon={<Save className="w-4 h-4" />}
          >
            Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
