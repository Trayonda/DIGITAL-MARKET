import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Save,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { getAdminEnquiries, getAdminEnquiryById, updateAdminEnquiry } from '../../services/api.js';
import { Enquiry, EnquiryStatus } from '../../types/index.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';

const STATUS_OPTIONS: { value: EnquiryStatus; label: string; color: string }[] = [
  { value: 'NEW', label: 'New / Unread', color: 'bg-blue-100 text-blue-700' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-amber-100 text-amber-800' },
  { value: 'NEGOTIATION', label: 'In Negotiation', color: 'bg-purple-100 text-purple-700' },
  { value: 'CONVERTED', label: 'Deal Closed / Sold', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'CLOSED', label: 'Archived / Lost', color: 'bg-slate-100 text-slate-700' },
];

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Enquiry Detail Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [newStatus, setNewStatus] = useState<EnquiryStatus>('NEW');
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadEnquiries = () => {
    setIsLoading(true);
    getAdminEnquiries({
      status: statusFilter || undefined,
      search: search || undefined,
      page,
      limit: 15,
    })
      .then((res) => {
        if (res.success) {
          setEnquiries(res.data);
          setTotal(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      })
      .catch((err) => console.error('Failed to load enquiries:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadEnquiries();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadEnquiries();
  };

  const handleOpenDetail = async (id: string) => {
    try {
      const res = await getAdminEnquiryById(id);
      if (res.success && res.data) {
        setSelectedEnquiry(res.data);
        setNewStatus(res.data.status);
        setInternalNotes(res.data.internalNotes || '');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load details');
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedEnquiry) return;
    try {
      setIsUpdating(true);
      const res = await updateAdminEnquiry(selectedEnquiry.id, {
        status: newStatus,
        internalNotes,
      });

      if (res.success) {
        setToastMessage('Enquiry status updated successfully');
        setTimeout(() => setToastMessage(null), 3000);
        setSelectedEnquiry(res.data);
        loadEnquiries();
      }
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Customer WhatsApp Enquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Total {total} enquiries recorded from shopping cart submissions
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, ref ID..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => {
              setStatusFilter('');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !statusFilter ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === opt.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ref ID / Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Items Requested</th>
                <th className="py-3.5 px-4">Est. Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading enquiries...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => {
                  const statusObj =
                    STATUS_OPTIONS.find((s) => s.value === enq.status) || STATUS_OPTIONS[0];

                  return (
                    <tr key={enq.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Ref ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">
                          #{enq.enquiryRef}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(enq.createdAt)}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{enq.customerName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          +91 {enq.customerPhone}
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {enq.customerCity}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">
                          {enq.items?.length || 0} item(s)
                        </span>
                      </td>

                      {/* Estimated Total */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">
                        {formatPrice(enq.estimatedTotal)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusObj.color}`}>
                          {statusObj.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/91${enq.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20regarding%20your%20enquiry%20Ref%20%23${enq.enquiryRef}%20at%20Digital%20Market:`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(enq.id)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Detailed Enquiry Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry #${selectedEnquiry.enquiryRef}`}
          subtitle={`Submitted on ${formatDate(selectedEnquiry.createdAt)}`}
          maxWidth="xl"
        >
          <div className="space-y-6 text-xs">
            {/* Customer Details Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Customer</span>
                <span className="text-sm font-bold text-slate-900">{selectedEnquiry.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Mobile Phone</span>
                <a
                  href={`tel:${selectedEnquiry.customerPhone}`}
                  className="text-sm font-bold text-blue-600 hover:underline font-mono"
                >
                  +91 {selectedEnquiry.customerPhone}
                </a>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">City</span>
                <span className="text-sm font-bold text-slate-900">{selectedEnquiry.customerCity}</span>
              </div>
            </div>

            {selectedEnquiry.customerMessage && (
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-slate-800">
                <span className="font-bold block text-[11px] text-amber-900 mb-0.5">
                  Customer Message:
                </span>
                <p className="text-xs italic">"{selectedEnquiry.customerMessage}"</p>
              </div>
            )}

            {/* Requested Items Snapshot Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-heading">
                Requested Items Snapshot ({selectedEnquiry.items.length})
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2.5">Product & SKU</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Price at Enquiry</th>
                      <th className="p-2.5 text-right">Item Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedEnquiry.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5">
                          <span className="font-bold text-slate-900 block">{item.productName}</span>
                          <span className="font-mono text-[10px] text-slate-400">SKU: {item.productSku}</span>
                        </td>
                        <td className="p-2.5 font-bold">{item.quantity}</td>
                        <td className="p-2.5 font-medium">{formatPrice(item.unitPrice)}</td>
                        <td className="p-2.5 text-right font-bold font-heading">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right uppercase text-slate-600">
                        Total Value:
                      </td>
                      <td className="p-2.5 text-right text-sm font-extrabold text-blue-600 font-heading">
                        {formatPrice(selectedEnquiry.estimatedTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Direct WhatsApp Action Link */}
            <div className="pt-2">
              <a
                href={`https://wa.me/91${selectedEnquiry.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.customerName)},%20this%20is%20regarding%20your%20enquiry%20Ref%20%23${selectedEnquiry.enquiryRef}%20at%20Digital%20Market:`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Open Direct WhatsApp Chat with Customer <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Status & Internal Notes Editor */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Update Enquiry Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Spoke to customer on phone. Offered ₹500 discount if picked up today from Nehru Place shop."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleSaveStatus}
                isLoading={isUpdating}
                className="w-full"
                icon={<Save className="w-4 h-4" />}
              >
                Save Status & Notes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
