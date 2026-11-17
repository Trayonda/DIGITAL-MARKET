import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, CheckCircle, SearchX } from 'lucide-react';
import { ProductCard } from '../../components/customer/ProductCard.js';
import { FilterSidebar } from '../../components/customer/FilterSidebar.js';
import { Button } from '../../components/common/Button.js';
import { getProducts, getCategories } from '../../services/api.js';
import { Product, Category } from '../../types/index.js';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read filter params from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const condition = searchParams.get('condition') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const availability = searchParams.get('availability') || '';
  const sortBy = (searchParams.get('sortBy') as any) || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getProducts({
      search,
      category,
      brand,
      condition,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      availability,
      sortBy,
      page,
      limit: 12,
    })
      .then((res) => {
        if (res.success) {
          setProducts(res.data);
          setTotalProducts(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setIsLoading(false));
  }, [search, category, brand, condition, minPrice, maxPrice, availability, sortBy, page]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset page to 1 on filter change
    setSearchParams(next);
  };

  const handlePriceChange = (min: string, max: string) => {
    const next = new URLSearchParams(searchParams);
    if (min) next.set('minPrice', min); else next.delete('minPrice');
    if (max) next.set('maxPrice', max); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find active category label
  const activeCategoryObj = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 overflow-x-hidden w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb / Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-heading break-words">
            {search
              ? `Search Results for "${search}"`
              : activeCategoryObj
              ? activeCategoryObj.name
              : 'All Certified Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {totalProducts} verified units
          </p>
        </div>

        {/* Sorting & Mobile Filter Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value="newest">Latest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="flex items-start gap-6 lg:gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          selectedCategory={category}
          onSelectCategory={(slug) => updateParam('category', slug)}
          selectedBrand={brand}
          onSelectBrand={(b) => updateParam('brand', b)}
          selectedCondition={condition}
          onSelectCondition={(c) => updateParam('condition', c)}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          inStockOnly={availability === 'AVAILABLE'}
          onToggleInStock={(val) => updateParam('availability', val ? 'AVAILABLE' : '')}
          onReset={handleResetFilters}
          isMobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Products Grid Area */}
        <div className="flex-1 w-full space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-surface-border h-96 animate-pulse p-4 space-y-4">
                  <div className="bg-slate-100 rounded-xl h-48 w-full" />
                  <div className="bg-slate-100 h-4 rounded w-3/4" />
                  <div className="bg-slate-100 h-4 rounded w-1/2" />
                  <div className="bg-slate-100 h-10 rounded w-full mt-6" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-surface-border p-8 sm:p-12 text-center space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-heading">
                No Products Match Your Criteria
              </h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Try adjusting your filters, clearing price bounds, or search for another brand or model.
              </p>
              <Button variant="primary" size="sm" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCartToast={showToast} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateParam('page', String(page - 1))}
                  >
                    &larr; Previous
                  </Button>

                  <span className="text-xs text-slate-600 px-3 font-semibold">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => updateParam('page', String(page + 1))}
                  >
                    Next &rarr;
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
