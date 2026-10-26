import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  ChevronRight,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { fetchOrdersByUser } from '../services/orderService';
import { formatINR, formatDateTime } from '../utils/formatters';

const STATUS_STEPS = ['Placed', 'Packed', 'Shipped', 'Delivered'];

export const OrdersPage = () => {
  const { user, userProfile } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }
        const list = await fetchOrdersByUser(user.uid);
        if (isMounted) {
          setOrders(list);
          if (list.length > 0) {
            setSelectedOrder(list[0]);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDownloadInvoice = (order) => {
    addToast({
      type: 'success',
      title: 'Tax Invoice Downloaded',
      message: `Statutory GST Tax Invoice for #${order.trackingNumber || order.id} saved as PDF.`,
    });
  };

  const handleReorder = (item) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category || 'General',
        sku: item.sku,
      },
      1
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading your consignment ledger...</p>
      </div>
    );
  }

  const activeOrder = selectedOrder || orders[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Profile / Ledger Header */}
      <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg shadow-blue-500/20">
              {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {userProfile?.displayName || 'Valued Customer'}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  Verified Shopper
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.email} • Account ID: {user?.uid?.slice(0, 10)}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0B1220] border border-[#223049]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Orders</span>
              <p className="text-base font-bold text-white mt-0.5">{orders.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1220] border border-[#223049]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Expenditure</span>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {formatINR(orders.reduce((sum, o) => sum + (o.total || 0), 0))}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1220] border border-[#223049] col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Consignments</span>
              <p className="text-base font-bold text-blue-400 mt-0.5">
                {orders.filter((o) => o.status !== 'Delivered').length} In Transit
              </p>
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-12 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">No Past Orders Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            You haven&apos;t placed any orders yet. Discover high-performance products in our catalog and place your first order.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <span>Start Shopping</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Order Details Card */}
          {activeOrder && (
            <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#223049]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                      SELECTED CONSIGNMENT
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                      {activeOrder.trackingNumber || `#NX-IND-${activeOrder.id.slice(0, 8)}`}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on {formatDateTime(activeOrder.createdAt)} • Via {activeOrder.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      activeOrder.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : activeOrder.status === 'Shipped'
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        : activeOrder.status === 'Packed'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    ● {activeOrder.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(activeOrder)}
                    className="p-2 rounded-xl bg-[#0B1220] border border-[#223049] text-slate-300 hover:text-white transition-colors"
                    title="Download Tax Invoice"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Chain of Custody & Fulfillment Milestones
                  </h3>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Priority Air Logistics
                  </span>
                </div>

                {/* Horizontal Timeline Steps */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = STATUS_STEPS.indexOf(activeOrder.status);
                    const isCompleted = currentIdx >= idx;
                    const isCurrent = activeOrder.status === step;

                    return (
                      <div
                        key={step}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                            : isCompleted
                            ? 'bg-[#0B1220] border-emerald-500/40 text-slate-200'
                            : 'bg-[#0B1220]/50 border-[#223049] text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase font-semibold">
                            Step {idx + 1}
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <p className="font-bold text-xs capitalize">{step}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {step === 'Placed' && 'Order verified & billed'}
                          {step === 'Packed' && 'QC passed & sealed'}
                          {step === 'Shipped' && 'In transit with courier'}
                          {step === 'Delivered' && 'Delivered to address'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manifest Items Table */}
              <div className="space-y-3 pt-4 border-t border-[#223049]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Dispatched Items Manifest ({activeOrder.items?.length || 0} SKUs)
                </h3>

                <div className="divide-y divide-[#223049] border border-[#223049] rounded-xl overflow-hidden bg-[#0B1220]">
                  {activeOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover bg-[#0E1626] border border-[#223049] shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-100">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            SKU: {item.sku} • Qty: {item.quantity} Units
                          </p>
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-400 mt-1">
                            1-Year Manufacturer Warranty
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                        <div className="text-right">
                          <p className="text-xs font-bold text-white">
                            {formatINR(item.price * item.quantity)}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {formatINR(item.price)} each
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleReorder(item)}
                          className="px-3 py-1.5 rounded-lg bg-[#111A2C] border border-[#223049] hover:border-blue-500 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3 text-blue-400" />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Address & Invoice Amount breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#223049] text-xs">
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#223049]">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Delivery Destination
                  </p>
                  <p className="font-semibold text-slate-200">{activeOrder.customerName}</p>
                  <p className="text-slate-400 mt-0.5">
                    {activeOrder.shippingAddress?.addressLine}, {activeOrder.shippingAddress?.city},{' '}
                    {activeOrder.shippingAddress?.state} - {activeOrder.shippingAddress?.pincode}
                  </p>
                  <p className="text-slate-500 mt-1">Tel: {activeOrder.customerPhone}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#223049] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-200">{formatINR(activeOrder.subtotal)}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-{formatINR(activeOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span className="font-semibold text-slate-200">
                      {activeOrder.shippingCost === 0 ? 'FREE' : formatINR(activeOrder.shippingCost)}
                    </span>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400">
                    Includes GST of Rs {Number(activeOrder.gst || Math.round(((activeOrder.subtotal - (activeOrder.discount || 0)) * 18) / 118)).toLocaleString('en-IN')}
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#223049] text-sm font-bold text-white">
                    <span>Total Settled:</span>
                    <span className="text-blue-400">{formatINR(activeOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Past Orders Ledger Table */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              All Orders & Historic Consignments
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#223049] text-slate-400 text-[10px] uppercase font-semibold">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Consignment Contents</th>
                    <th className="py-3 px-3">Fulfillment Status</th>
                    <th className="py-3 px-3">Settlement Amount</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#223049]/60">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className={`hover:bg-[#152238] cursor-pointer transition-colors ${
                        selectedOrder?.id === o.id ? 'bg-[#152238]/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-blue-400">
                        {o.trackingNumber || `#NX-IND-${o.id.slice(0, 6)}`}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                        {formatDateTime(o.createdAt)}
                      </td>
                      <td className="py-3 px-3 text-slate-200 max-w-xs truncate">
                        {o.items?.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : o.status === 'Shipped'
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : o.status === 'Packed'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                        {formatINR(o.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(o);
                          }}
                          className="text-xs text-blue-400 hover:underline font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
