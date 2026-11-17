import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { getStoreSettings, getCategories } from '../../services/api.js';
import { StoreSettings, Category } from '../../types/index.js';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getStoreSettings().then((res) => {
      if (res.success) setSettings(res.data);
    }).catch(() => {});

    getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    }).catch(() => {});
  }, []);

  const businessName = settings?.businessName || 'DIGITAL MARKET';
  const whatsappNum = settings?.whatsappNumber || '919650624535';
  const cleanPhone = settings?.contactPhone || '+91 96506 24535';
  const email = settings?.contactEmail || 'contact@digitalmarket.in';
  const address = settings?.address || 'Shop 12, Ground Floor, Electronics Commercial Hub, Nehru Place, New Delhi - 110019';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Testing Warranty</h4>
              <p className="text-slate-400 text-xs mt-0.5">30-day testing guarantee + hardware support</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Inspected</h4>
              <p className="text-slate-400 text-xs mt-0.5">32-point hardware stress test passed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Instant WhatsApp Deal</h4>
              <p className="text-slate-400 text-xs mt-0.5">Send your cart list directly to our team</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Best Market Prices</h4>
              <p className="text-slate-400 text-xs mt-0.5">Save up to 70% off original retail price</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Laptop className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight font-heading">
                {businessName.split(' ')[0]} <span className="text-blue-500">{businessName.split(' ').slice(1).join(' ') || 'MARKET'}</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your trusted destination for certified refurbished commercial laptops, desktop workstations, monitors, and authentic computer components. Hand-tested and backed by real warranty.
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-xs tracking-wide shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Chat With Us on WhatsApp
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-heading">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/products" className="text-blue-400 font-medium hover:underline">
                  Browse All Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Why Refurbished & Guarantees */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-heading">
              Why Refurbished?
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Enterprise Build Quality</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Upgraded RAM & High-speed SSD</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Genuine Windows Pre-installed</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Quick Dispatch & Local Pickup</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-heading">
              Visit & Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${cleanPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {cleanPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Admin link */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600">Secure Bulk WhatsApp Ordering Platform</span>
            <Link to="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
