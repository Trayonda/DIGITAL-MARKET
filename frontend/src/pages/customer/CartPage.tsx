import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { formatPrice, formatCondition } from '../../utils/formatters.js';
import { Button } from '../../components/common/Button.js';
import { EnquiryModal } from '../../components/customer/EnquiryModal.js';
import { ImageWithFallback } from '../../components/common/ImageWithFallback.js';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 sm:py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Your Cart is Empty
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto">
            You haven't added any refurbished laptops or components yet. Browse our verified inventory to find the best deals!
          </p>
        </div>
        <Link to="/products">
          <Button variant="primary" size="lg" icon={<ShoppingCart className="w-5 h-5" />}>
            Start Shopping &rarr;
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-heading">
            Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected products and send a combined bulk enquiry via WhatsApp.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {cart.map(({ product, quantity }) => {
            const primaryImage = product.images?.[0]?.url;
            const conditionInfo = formatCondition(product.condition);
            const itemTotal = Number(product.sellingPrice) * quantity;
            const specs = product.specifications || {};

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-surface-border p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between"
              >
                {/* Media & Details */}
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <Link
                    to={`/products/${product.slug}`}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl bg-slate-50 p-2 shrink-0 border border-slate-200 overflow-hidden block"
                  >
                    <ImageWithFallback
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {product.brand}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${conditionInfo.bgClass} ${conditionInfo.colorClass}`}>
                        {conditionInfo.label}
                      </span>
                    </div>

                    <Link
                      to={`/products/${product.slug}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 font-heading block"
                    >
                      {product.name}
                    </Link>

                    <div className="text-[11px] text-slate-500 font-mono">
                      SKU: {product.sku}
                    </div>

                    {specs.processor && (
                      <div className="text-[10px] sm:text-[11px] text-slate-600 line-clamp-1">
                        {specs.processor} • {specs.ram}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2.5 sm:px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-800 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                      className="px-2.5 sm:px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-slate-900 font-heading">
                      {formatPrice(itemTotal)}
                    </div>
                    {quantity > 1 && (
                      <div className="text-[10px] sm:text-[11px] text-slate-400">
                        {formatPrice(product.sellingPrice)} each
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              &larr; Continue Browsing Products
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Enquiry Summary
            </h3>

            <div className="space-y-3 text-sm text-slate-600 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Testing Warranty</span>
                <span className="font-semibold">Included Free</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Store Pickup / Dispatch</span>
                <span>Available</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-900 font-heading">
                Estimated Total
              </span>
              <span className="text-2xl font-black text-blue-600 font-heading">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Button
              variant="whatsapp"
              size="lg"
              className="w-full"
              onClick={() => setIsEnquiryModalOpen(true)}
              icon={<MessageCircle className="w-5 h-5" />}
            >
              Send Bulk Enquiry on WhatsApp
            </Button>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                How Bulk Enquiry Works:
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Clicking the button lets you enter your name and city, saves your enquiry in our database with a reference number, and opens WhatsApp with your itemized quotation ready to send.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
};
