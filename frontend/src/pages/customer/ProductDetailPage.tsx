import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Check,
  Truck,
  RotateCcw,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Keyboard,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { getProductBySlug } from '../../services/api.js';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { formatPrice, formatCondition, formatAvailability } from '../../utils/formatters.js';
import { Button } from '../../components/common/Button.js';
import { ProductCard } from '../../components/customer/ProductCard.js';
import { ImageWithFallback } from '../../components/common/ImageWithFallback.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setIsLoading(true);
    setSelectedImageIndex(0);
    setQuantity(1);

    getProductBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setProduct(res.data);
          setRelatedProducts(res.related || []);
          // Set browser title for SEO
          document.title = `${res.data.name} | DIGITAL MARKET`;
        }
      })
      .catch((err) => console.error('Failed to load product details:', err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto" />
        <div className="h-96 bg-slate-200 rounded-3xl max-w-4xl mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Product Not Available</h2>
        <p className="text-slate-500 text-sm">
          The requested product may have been sold or unpublished from the catalog.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">Browse Other Laptops & PCs</Button>
        </Link>
      </div>
    );
  }

  const conditionInfo = formatCondition(product.condition);
  const availabilityInfo = formatAvailability(product.availabilityStatus, product.stockQuantity);
  const inCart = isInCart(product.id);
  const inCartQty = getItemQuantity(product.id);

  let discountPercent = 0;
  if (product.originalPrice && product.originalPrice > product.sellingPrice) {
    discountPercent = Math.round(
      ((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', isPrimary: true, sortOrder: 0 }];

  const currentImage = images[selectedImageIndex]?.url || images[0].url;

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    showToast(res.message);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Digital Market, I am interested in purchasing:\n*${product.name}*\nSKU: ${product.sku}\nPrice: ₹${product.sellingPrice}\nIs this still available for immediate dispatch?`
    );
    window.open(`https://wa.me/919650624535?text=${text}`, '_blank');
  };

  const specs = product.specifications || {};

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12 overflow-x-hidden w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category?.slug}`} className="hover:text-blue-600">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left: Multi-Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="relative bg-white border border-surface-border rounded-3xl p-4 sm:p-6 aspect-square sm:aspect-[4/3] flex items-center justify-center overflow-hidden shadow-sm">
            {/* Condition Badge */}
            <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
              <span className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border shadow-2xs backdrop-blur-md ${conditionInfo.bgClass} ${conditionInfo.colorClass}`}>
                {conditionInfo.label}
              </span>
              {discountPercent > 0 && (
                <span className="text-[11px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <ImageWithFallback
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain max-h-[340px] sm:max-h-[420px]"
            />
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-slate-50 border-2 overflow-hidden shrink-0 transition-all p-1 ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Brand */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>{product.brand} • {product.model}</span>
              <span className="font-mono text-slate-400">SKU: {product.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {product.name}
            </h1>
          </div>

          {/* Price & Stock */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                {formatPrice(product.sellingPrice)}
              </span>
              {product.originalPrice && product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save {formatPrice(product.originalPrice - product.sellingPrice)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${availabilityInfo.bgClass} ${availabilityInfo.colorClass}`}>
                {availabilityInfo.label}
              </span>
              <span className="text-xs text-slate-500">
                GST Invoice Included
              </span>
            </div>
          </div>

          {/* Warranty & Assurance Box */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Warranty</span>
                <span className="text-slate-500 text-[11px]">{product.warranty || '30 Days Testing Guarantee'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Pickup & Shipping</span>
                <span className="text-slate-500 text-[11px]">Store pickup or courier available</span>
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          {availabilityInfo.isAvailable && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-slate-800 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  (Max available: {product.stockQuantity})
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full"
                  icon={inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                >
                  {inCart ? `Add More (${inCartQty} in cart)` : 'Add to Shopping Cart'}
                </Button>

                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={handleDirectWhatsApp}
                  className="w-full"
                  icon={<MessageCircle className="w-5 h-5" />}
                >
                  Enquire on WhatsApp
                </Button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 font-heading">
              Product Overview
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Specifications Table Section */}
      <section className="pt-8 border-t border-slate-200">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 font-heading">
          Technical Specifications
        </h2>

        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                {Object.entries(specs).map(([key, value]) => {
                  if (!value || typeof value === 'object') return null;
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase());

                  return (
                    <tr key={key} className="hover:bg-slate-50/50">
                      <td className="w-2/5 sm:w-1/3 py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 text-[11px] sm:text-xs">
                        {formattedKey}
                      </td>
                      <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-slate-900 font-medium break-words">
                        {String(value)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="w-2/5 sm:w-1/3 py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 text-[11px] sm:text-xs">
                    Condition Grade
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-slate-900 font-medium break-words">
                    {conditionInfo.label}
                  </td>
                </tr>
                <tr>
                  <td className="w-2/5 sm:w-1/3 py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 text-[11px] sm:text-xs">
                    Warranty Coverage
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-slate-900 font-medium break-words">
                    {product.warranty || '30 Days Testing Guarantee + 6 Months Service Warranty'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              Similar Products in {product.category?.name}
            </h2>
            <Link
              to={`/products?category=${product.category?.slug}`}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Category &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} onAddToCartToast={showToast} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
