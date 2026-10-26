import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Truck,
  Download,
  Loader2,
} from 'lucide-react';
import { fetchOrderById } from '../services/orderService';
import { formatINR } from '../utils/formatters';
import { BRAND } from '../data/brand';
import { useToast } from '../context/ToastContext';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const { addToast } = useToast();

  useEffect(() => {
    if (!order && orderId) {
      const load = async () => {
        setLoading(true);
        try {
          const fetched = await fetchOrderById(orderId);
          setOrder(fetched);
        } catch (err) {
          console.error('Error fetching order for success page:', err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderId, order]);

  const handleDownloadInvoice = () => {
    addToast({
      type: 'success',
      title: 'Tax Invoice Downloaded',
      message: `Statutory GST Tax Invoice for #${order?.trackingNumber || orderId} saved.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Finalizing order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Celebration Header Card */}
      <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          PAYMENT VERIFIED & ORDER CONFIRMED
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3 mb-2">
          Thank you for choosing {BRAND.name}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Your order has been routed to our Mumbai Regional Distribution Depot for immediate quality inspection and priority courier dispatch.
        </p>

        {/* Order Reference Number Pill */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-xl bg-[#0B1220] border border-[#223049] text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block">CONSIGNMENT TRACKING #</span>
            <span className="text-base font-bold text-blue-400">
              {order?.trackingNumber || `#NX-IND-${orderId?.slice(0, 8)}`}
            </span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-500 text-[10px] block">ESTIMATED DELIVERY</span>
            <span className="text-slate-200 font-bold">2–4 Business Days</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-500 text-[10px] block">PAYMENT SETTLEMENT</span>
            <span className="text-emerald-400 font-bold">{order?.paymentMethod || 'UPI 2.0'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            to="/orders"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="px-5 py-3 rounded-xl bg-[#0B1220] hover:bg-[#1A263D] border border-[#223049] text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Download GST Tax Invoice</span>
          </button>
          <Link
            to="/catalog"
            className="px-5 py-3 rounded-xl bg-[#0B1220] hover:bg-[#1A263D] border border-[#223049] text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Manifest & Shipping Details */}
      {order && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Manifest Items */}
          <div className="md:col-span-7 bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-[#223049]">
              Dispatched Consignment Items ({order.items?.length || 0})
            </h2>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0B1220] border border-[#223049]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-[#0E1626] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      SKU: {item.sku} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Billing Summary */}
          <div className="md:col-span-5 bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-[#223049]">
              Consignee & Tax Summary
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Consignee Recipient</p>
                <p className="font-bold text-slate-200 mt-0.5">{order.customerName}</p>
                <p className="text-slate-400">{order.customerEmail}</p>
                <p className="text-slate-400">{order.customerPhone}</p>
              </div>

              <div className="pt-2 border-t border-[#223049]">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Delivery Destination</p>
                <p className="text-slate-300 mt-0.5">
                  {order.shippingAddress?.addressLine}, {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
              </div>

              <div className="pt-2 border-t border-[#223049] space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">{formatINR(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatINR(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-200">
                    {order.shippingCost === 0 ? 'FREE' : formatINR(order.shippingCost)}
                  </span>
                </div>
                <div className="pt-1 text-[11px] text-slate-400">
                  Includes GST of Rs {Number(order.gst || Math.round(((order.subtotal - (order.discount || 0)) * 18) / 118)).toLocaleString('en-IN')}
                </div>
                <div className="flex justify-between pt-2 border-t border-[#223049] text-sm font-bold text-white">
                  <span>Total Amount Paid</span>
                  <span className="text-blue-400">{formatINR(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
