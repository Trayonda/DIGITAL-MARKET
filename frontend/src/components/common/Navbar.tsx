import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  Laptop,
  Monitor,
  Cpu,
  Keyboard,
  Mouse,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { getStoreSettings, getCategories } from '../../services/api.js';
import { StoreSettings, Category } from '../../types/index.js';

export const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'laptops':
        return <Laptop className="w-4 h-4" />;
      case 'desktop-pcs':
        return <Cpu className="w-4 h-4" />;
      case 'monitors':
        return <Monitor className="w-4 h-4" />;
      case 'keyboards':
        return <Keyboard className="w-4 h-4" />;
      case 'mouse':
        return <Mouse className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const businessName = settings?.businessName || 'DIGITAL MARKET';
  const whatsappNum = settings?.whatsappNumber || '919650624535';
  const cleanPhone = settings?.contactPhone || '+91 96506 24535';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-surface-border shadow-md">
      {/* Top Bar for Trust & Quick Contacts */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] sm:text-xs truncate">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Certified Refurbished <span className="hidden xs:inline">with Warranty</span></span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400 text-xs">
              Tested by Engineers & 100% Functional
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-[11px] sm:text-xs">
            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-green-400 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="hidden sm:inline">WhatsApp:</span> {cleanPhone}
            </a>
            <span className="text-slate-600">|</span>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4 py-2 sm:py-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors shrink-0">
              <Laptop className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 block leading-none font-heading">
                {businessName.split(' ')[0]} <span className="text-blue-600">{businessName.split(' ').slice(1).join(' ') || 'MARKET'}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mt-0.5 truncate max-w-[150px] sm:max-w-none">
                Certified Refurbished & Used Tech
              </span>
            </div>
          </Link>

          {/* Search Form (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg items-center relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laptops, desktops, RAM, SSD, monitors..."
              className="w-full h-11 pl-11 pr-24 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Right Action Icons: Cart & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-800 transition-all group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm animate-in zoom-in-50">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold hidden min-[400px]:inline text-slate-700 group-hover:text-blue-600">
                Cart
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laptops, desktops, parts..."
              className="w-full h-10 pl-10 pr-16 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 text-sm scrollbar-none">
            <Link
              to="/products"
              className={`px-3.5 py-1.5 rounded-lg font-medium text-xs uppercase tracking-wider transition-colors shrink-0 ${
                location.pathname === '/products' && !location.search
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              All Categories
            </Link>

            {categories.map((cat) => {
              const isActive = location.search.includes(`category=${cat.slug}`);
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {getCategoryIcon(cat.slug)}
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 text-sm font-semibold flex items-center gap-2"
            >
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>All Products</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 text-sm font-semibold flex items-center gap-2"
              >
                {getCategoryIcon(cat.slug)}
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${cleanPhone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-sm text-slate-700 py-1"
            >
              <Phone className="w-4 h-4 text-blue-600" /> Call: {cleanPhone}
            </a>
            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-emerald-700 py-1 font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
