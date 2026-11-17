import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  Star,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminProducts,
  deleteAdminProduct,
  duplicateAdminProduct,
  toggleAdminFeatured,
  getCategories,
} from '../../services/api.js';
import { Product, Category } from '../../types/index.js';
import { formatPrice, formatCondition } from '../../utils/formatters.js';
import { Button } from '../../components/common/Button.js';
import { ProductFormModal } from '../../components/admin/ProductFormModal.js';

export const AdminProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    }).catch(() => {});

    // Check if URL has ?action=new
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      setProductToEdit(null);
    }
  }, [searchParams]);

  const loadProducts = () => {
    setIsLoading(true);
    getAdminProducts({
      search,
      category: selectedCategory,
      availability: selectedStatus,
      page,
      limit: 15,
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
  };

  useEffect(() => {
    loadProducts();
  }, [page, selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenNew = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await duplicateAdminProduct(id);
      if (res.success) {
        showToast('Product duplicated successfully as Draft!');
        loadProducts();
      }
    } catch (err: any) {
      alert(err.message || 'Duplicate failed');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await toggleAdminFeatured(id);
      if (res.success) {
        showToast(res.message);
        loadProducts();
      }
    } catch (err: any) {
      alert(err.message || 'Toggle featured failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteAdminProduct(id);
      if (res.success) {
        showToast('Product removed from active inventory');
        setDeleteConfirmId(null);
        loadProducts();
      }
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Product Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Total {totalProducts} inventory records across all categories
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenNew} icon={<Plus className="w-4 h-4" />}>
          Add New Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, brand..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="SOLD">Sold Out</option>
            <option value="RESERVED">Reserved</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">SKU / Category</th>
                <th className="py-3.5 px-4">Cost Price (Admin)</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading inventory records...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products found. Click "Add New Product" to populate your inventory.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed';
                  const conditionInfo = formatCondition(product.condition);

                  // Calculate profit margin
                  const cost = Number(product.internalCostPrice) || 0;
                  const sell = Number(product.sellingPrice) || 0;
                  const margin = sell > cost ? sell - cost : 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 overflow-hidden">
                            <img src={primaryImage} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block max-w-xs truncate">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {product.brand} • {conditionInfo.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Category */}
                      <td className="py-3 px-4 font-mono">
                        <div className="font-semibold text-slate-800">{product.sku}</div>
                        <div className="text-[10px] text-blue-600 font-sans font-medium">
                          {product.category?.name}
                        </div>
                      </td>

                      {/* Cost Price */}
                      <td className="py-3 px-4 font-mono font-medium text-amber-900">
                        {cost > 0 ? formatPrice(cost) : '—'}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-heading">
                          {formatPrice(sell)}
                        </div>
                        {margin > 0 && (
                          <div className="text-[10px] text-emerald-600 font-medium">
                            +{formatPrice(margin)} margin
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 font-bold font-mono">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            product.stockQuantity > 0
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            product.availabilityStatus === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : product.availabilityStatus === 'SOLD'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {product.availabilityStatus}
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            product.isFeatured
                              ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                              : 'text-slate-300 hover:text-slate-400'
                          }`}
                          title={product.isFeatured ? 'Featured on homepage' : 'Not featured'}
                        >
                          <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                            title="Preview on website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Archive Product?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The product will be unpublished and marked as sold out. Existing customer enquiry history will remain intact.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" size="md" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        categories={categories}
        onSuccess={(msg) => {
          showToast(msg);
          loadProducts();
        }}
      />
    </div>
  );
};
