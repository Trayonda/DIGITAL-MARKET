import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { formatPrice, formatCondition, formatAvailability } from '../../utils/formatters.js';
import { ImageWithFallback } from '../common/ImageWithFallback.js';

interface ProductCardProps {
  product: Product;
  onAddToCartToast?: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCartToast }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const conditionInfo = formatCondition(product.condition);
  const availabilityInfo = formatAvailability(product.availabilityStatus, product.stockQuantity);
  const inCart = isInCart(product.id);
  const currentQuantity = getItemQuantity(product.id);

  // Extract key specs for pills
  const specs = product.specifications || {};
  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;

  // Calculate discount percent
  let discountPercent = 0;
  if (product.originalPrice && product.originalPrice > product.sellingPrice) {
    discountPercent = Math.round(
      ((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (onAddToCartToast) {
      onAddToCartToast(res.message);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-surface-border hover:border-blue-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Media Container */}
      <Link to={`/products/${product.slug}`} className="block relative bg-slate-50/60 p-3 sm:p-4 aspect-[4/3] overflow-hidden">
        {/* Badges on Image */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 sm:gap-1.5 items-start pointer-events-none">
          <span
            className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border shadow-2xs backdrop-blur-md ${conditionInfo.bgClass} ${conditionInfo.colorClass}`}
          >
            {conditionInfo.label}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
              Save {discountPercent}%
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 pointer-events-none">
          <span
            className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full border ${availabilityInfo.bgClass} ${availabilityInfo.colorClass}`}
          >
            {availabilityInfo.label}
          </span>
        </div>

        {/* Product Image */}
        <ImageWithFallback
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content Container */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <span className="text-[10px] sm:text-[11px] text-blue-600 font-medium lowercase">
              {product.category?.name}
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.slug}`}
            className="text-xs sm:text-sm md:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug font-heading"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Specification Pills */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
            {specs.processor && (
              <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[150px]">
                {specs.processor}
              </span>
            )}
            {specs.ram && (
              <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md">
                {specs.ram}
              </span>
            )}
            {specs.storageCapacity && (
              <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md">
                {specs.storageCapacity} {specs.storageType || 'SSD'}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2.5 sm:mb-3">
            <span className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 font-heading">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.sellingPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <Link
              to={`/products/${product.slug}`}
              className="flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-semibold transition-all text-center truncate"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Specs</span>
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={!availabilityInfo.isAvailable}
              className={`flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-sm truncate ${
                !availabilityInfo.isAvailable
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : inCart
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow'
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span className="truncate">In Cart ({currentQuantity})</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
