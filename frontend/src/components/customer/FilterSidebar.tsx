import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Category } from '../../types/index.js';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedCondition: string;
  onSelectCondition: (condition: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const BRANDS = ['Dell', 'Lenovo', 'HP', 'Apple', 'Logitech', 'Redragon', 'Samsung', 'Kingston'];
const CONDITIONS = [
  { value: 'BRAND_NEW', label: 'Brand New' },
  { value: 'OPEN_BOX', label: 'Open Box (Like New)' },
  { value: 'EXCELLENT_REFURBISHED', label: 'Refurbished (Grade A+)' },
  { value: 'VERY_GOOD', label: 'Certified Pre-Owned' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  selectedCondition,
  onSelectCondition,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  onReset,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base font-heading">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* In Stock Only Checkbox */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-emerald-900">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>Show Available In-Stock Only</span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-heading">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              !selectedCategory
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? '' : cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name}</span>
                {cat.productCount !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-heading">
          Popular Brands
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map((brand) => {
            const isSelected = selectedBrand === brand;
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
              >
                <input
                  type="radio"
                  name="brand_filter"
                  checked={isSelected}
                  onChange={() => onSelectBrand(isSelected ? '' : brand)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-heading">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onPriceChange(e.target.value, maxPrice)}
              placeholder="₹ 1,000"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, e.target.value)}
              placeholder="₹ 90,000"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-heading">
          Device Condition
        </h4>
        <div className="space-y-1">
          {CONDITIONS.map((cond) => {
            const isSelected = selectedCondition === cond.value;
            return (
              <label
                key={cond.value}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
              >
                <input
                  type="radio"
                  name="condition_filter"
                  checked={isSelected}
                  onChange={() => onSelectCondition(isSelected ? '' : cond.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{cond.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm self-start sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white p-5 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-base">Filter Products</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
