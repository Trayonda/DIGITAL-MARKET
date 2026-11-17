import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Cpu,
  Monitor,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Tag,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ProductCard } from '../../components/customer/ProductCard.js';
import { Button } from '../../components/common/Button.js';
import { getProducts, getCategories } from '../../services/api.js';
import { Product, Category } from '../../types/index.js';
import { formatPrice } from '../../utils/formatters.js';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-rotating Deal of the Week Carousel State
  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const [isDealPaused, setIsDealPaused] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getProducts({ isFeatured: true, limit: 6 }),
      getProducts({ sortBy: 'newest', limit: 8 }),
      getCategories(),
    ])
      .then(([featuredRes, latestRes, catRes]) => {
        if (featuredRes.success) setFeaturedProducts(featuredRes.data);
        if (latestRes.success) setLatestProducts(latestRes.data);
        if (catRes.success) setCategories(catRes.data);
      })
      .catch((err) => console.error('Failed to load homepage data:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Determine deals list (use featured products if available; fallback to latest products)
  const dealsList = featuredProducts.length > 0 ? featuredProducts : latestProducts;

  // Auto-switch Deal of the Week every 4.5 seconds unless user hovers
  useEffect(() => {
    if (dealsList.length <= 1 || isDealPaused) return;

    const timer = setInterval(() => {
      setActiveDealIndex((prev) => (prev + 1) % dealsList.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [dealsList.length, isDealPaused]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrevDeal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDealIndex((prev) => (prev - 1 + dealsList.length) % dealsList.length);
  };

  const handleNextDeal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDealIndex((prev) => (prev + 1) % dealsList.length);
  };

  const activeDeal: Product | undefined = dealsList[activeDealIndex];
  const activeDealSpecs = activeDeal?.specifications || {};
  const activeDealImg =
    activeDeal?.images?.find((img) => img.isPrimary)?.url ||
    activeDeal?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80';

  const activeDealDiscount =
    activeDeal && activeDeal.originalPrice && activeDeal.originalPrice > activeDeal.sellingPrice
      ? Math.round(((activeDeal.originalPrice - activeDeal.sellingPrice) / activeDeal.originalPrice) * 100)
      : null;

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 sm:pb-20 w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-12 sm:py-20 lg:py-24">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> India's Premier Used & Refurbished Computer Hub
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight break-words">
                Enterprise Laptops & PCs. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                  Unbeatable Value.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Upgrade your workstation with genuine commercial Dell, Lenovo ThinkPad, HP EliteBook, and Apple systems. 100% tested by certified technicians with genuine warranty and immediate WhatsApp enquiry.
              </p>

              {/* CTAs with Crystal Clear Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link to="/products" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-blue-600/30" icon={<Zap className="w-5 h-5" />}>
                    Explore All Products
                  </Button>
                </Link>

                <Link to="/products?category=laptops" className="w-full sm:w-auto">
                  <Button
                    variant="glass"
                    size="lg"
                    className="w-full sm:w-auto text-white border-white/40 hover:bg-white/20 hover:border-white/60 font-bold"
                  >
                    Refurbished Laptops &rarr;
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-800 text-center lg:text-left">
                <div className="p-2 sm:p-0">
                  <div className="text-base sm:text-xl md:text-2xl font-black text-white font-heading">30 Days</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">Testing Warranty</div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-base sm:text-xl md:text-2xl font-black text-emerald-400 font-heading">32-Point</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">Stress Inspection</div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-base sm:text-xl md:text-2xl font-black text-sky-400 font-heading">Up to 70%</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">Retail Savings</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: AUTO-ROTATING DEAL OF THE WEEK */}
            <div className="lg:col-span-5 relative flex justify-center w-full">
              <div
                className="relative w-full max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/95 rounded-3xl p-5 sm:p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all group"
                onMouseEnter={() => setIsDealPaused(true)}
                onMouseLeave={() => setIsDealPaused(false)}
              >
                {/* Header with Navigation Controls */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                      <Flame className="w-4 h-4 animate-pulse" />
                    </span>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                      Deal of the Week
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrevDeal}
                      className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                      title="Previous deal"
                      aria-label="Previous deal"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextDeal}
                      className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                      title="Next deal"
                      aria-label="Next deal"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {activeDeal ? (
                  <div className="transition-opacity duration-300">
                    {/* Deal Image with Status Badges */}
                    <div className="py-4 sm:py-5 flex justify-center relative">
                      <div className="w-full h-44 sm:h-52 rounded-2xl bg-slate-950/40 border border-slate-800/80 p-3 flex items-center justify-center relative overflow-hidden">
                        {activeDealDiscount && (
                          <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold shadow-md">
                            Save {activeDealDiscount}%
                          </div>
                        )}
                        <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          Ready to Dispatch
                        </span>
                        <img
                          src={activeDealImg}
                          alt={activeDeal.name}
                          className="max-h-full max-w-full object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Deal Specs & Price */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-blue-400">
                        <span>{activeDeal.brand}</span>
                        <span className="text-slate-400 font-mono">SKU: {activeDeal.sku}</span>
                      </div>

                      <Link
                        to={`/products/${activeDeal.slug}`}
                        className="text-base sm:text-lg font-bold text-white hover:text-blue-300 transition-colors font-heading line-clamp-1 block"
                      >
                        {activeDeal.name}
                      </Link>

                      <p className="text-xs text-slate-300 line-clamp-1">
                        {activeDealSpecs.processor || 'Intel / AMD Workstation'}
                        {activeDealSpecs.ram ? ` • ${activeDealSpecs.ram}` : ''}
                        {activeDealSpecs.storageCapacity ? ` • ${activeDealSpecs.storageCapacity} ${activeDealSpecs.storageType || 'SSD'}` : ''}
                        {activeDealSpecs.displaySize ? ` • ${activeDealSpecs.displaySize}` : ''}
                      </p>

                      <div className="flex items-baseline gap-2.5 pt-2">
                        <span className="text-2xl sm:text-3xl font-black text-white font-heading">
                          {formatPrice(activeDeal.sellingPrice)}
                        </span>
                        {activeDeal.originalPrice && activeDeal.originalPrice > activeDeal.sellingPrice && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatPrice(activeDeal.originalPrice)}
                          </span>
                        )}
                        <span className="text-xs text-emerald-400 font-bold ml-auto">
                          100% Tested
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp CTA & View Link */}
                    <div className="pt-4 mt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2">
                      <Link to={`/products/${activeDeal.slug}`} className="w-full">
                        <Button variant="glass" size="md" className="w-full text-xs">
                          Full Specs
                        </Button>
                      </Link>
                      <a
                        href={`https://wa.me/919650624535?text=${encodeURIComponent(
                          `Hello Digital Market, I want to purchase Deal of the Week: ${activeDeal.name} (SKU: ${activeDeal.sku}, Price: ₹${activeDeal.sellingPrice}). Please confirm availability.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="whatsapp" size="md" className="w-full text-xs px-2" icon={<MessageCircle className="w-3.5 h-3.5" />}>
                          WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Deal Rotation Dot Indicators */}
                {dealsList.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-4">
                    {dealsList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveDealIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeDealIndex === idx
                            ? 'w-6 bg-blue-400'
                            : 'w-2 bg-slate-600 hover:bg-slate-500'
                        }`}
                        aria-label={`Jump to deal ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              Explore Our Inventory
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-heading">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group p-4 sm:p-5 rounded-2xl bg-white border border-surface-border hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-2.5 sm:gap-3"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                <Laptop className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-xs sm:text-sm md:text-base font-heading truncate">
                  {cat.name}
                </h3>
                {cat.productCount !== undefined && (
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    {cat.productCount} {cat.productCount === 1 ? 'Unit' : 'Units'}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Top Hand-Picked Deals
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-heading">
                Featured Workstations & Laptops
              </h2>
            </div>
            <Link
              to="/products?isFeatured=true"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              See More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCartToast={showToast} />
            ))}
          </div>
        </section>
      )}

      {/* 4. LATEST ARRIVALS GRID */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              Just Added To Stock
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-heading">
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/products?sortBy=newest"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            Browse Full Inventory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-surface-border h-80 animate-pulse p-4 space-y-4">
                <div className="bg-slate-100 rounded-xl h-40 w-full" />
                <div className="bg-slate-100 h-4 rounded w-3/4" />
                <div className="bg-slate-100 h-4 rounded w-1/2" />
                <div className="bg-slate-100 h-8 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCartToast={showToast} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE DIGITAL MARKET SECTION */}
      <section className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              The Digital Market Standard
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading">
              Why Smart Buyers Choose Certified Refurbished
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
              We eliminate the uncertainty from buying used electronics with rigorous bench testing, authentic OEM components, and clear guarantee terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading">Commercial Grade Durability</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Enterprise devices (ThinkPad, EliteBook, Latitude) are built from magnesium-alloy and carbon-fiber with spill-resistant keyboards designed to last 7+ years.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading">Certified 32-Point Testing</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Every laptop battery health, display panel pixels, motherboard temperatures, keyboard keys, and ports are verified under sustained stress tests.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading">Transparent WhatsApp Deals</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                No hidden checkout costs or gateway surcharges. Review your items in your shopping cart and submit a direct bulk enquiry to negotiate or arrange pickup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIRECT ENQUIRY CTA SECTION */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading">
              Looking for a Specific Configuration?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed">
              Tell our technical specialists what software or specs you require. We configure RAM, SSD, and operating systems to your exact business needs.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/products" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-950 text-white font-bold">
                Browse Products
              </Button>
            </Link>
            <a
              href="https://wa.me/919650624535?text=Hello%20Digital%20Market,%20I%20am%20looking%20for%20a%20laptop%20configuration."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm shadow-md transition-all w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
