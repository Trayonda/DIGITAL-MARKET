import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { getAdminDashboardMetrics } from '../../services/api.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import { Button } from '../../components/common/Button.js';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAdminDashboardMetrics()
      .then((res) => {
        if (res.success) setMetrics(res.data);
      })
      .catch((err) => console.error('Failed to load metrics:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { products, enquiries, recentEnquiries, recentProducts } = metrics;

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Store Performance Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time inventory metrics, customer enquiries, and system status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products?action=new">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
          <Link to="/admin/enquiries">
            <Button variant="outline" size="sm">
              View All Enquiries
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {products.total}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              {products.available} Available In-Stock
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Enquiries
            </span>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {enquiries.total}
            </div>
            <div className="text-[11px] text-blue-600 font-semibold">
              {enquiries.new} New Unhandled
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pipeline Value
            </span>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {formatPrice(enquiries.totalPipelineValue)}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">
              Total Enquiry Value
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Sold Products */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sold Out / Inactive
            </span>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {products.sold}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold">
              {products.unpublished} Draft / Unpublished
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Enquiries & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Recent Enquiries
            </h2>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              All Enquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No customer enquiries received yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{enq.customerName}</span>
                      <span className="font-mono text-[10px] text-slate-400">#{enq.enquiryRef}</span>
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {enq.customerCity} • {enq.items?.length || 0} item(s)
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatPrice(enq.estimatedTotal)}</div>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                        enq.status === 'NEW'
                          ? 'bg-blue-100 text-blue-700'
                          : enq.status === 'CONVERTED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Products Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" /> Recently Added Inventory
            </h2>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No products found in catalogue.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentProducts.map((p: any) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">
                        {p.name}
                      </div>
                      <div className="text-slate-500 font-mono text-[10px]">
                        SKU: {p.sku} • Stock: {p.stockQuantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatPrice(p.sellingPrice)}</div>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                        p.availabilityStatus === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.availabilityStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
