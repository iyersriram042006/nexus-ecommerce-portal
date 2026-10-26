import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const CartPage = () => {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    discountAmount,
    appliedPromo,
    gstAmount,
    shippingFee,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput.trim());
      setPromoInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-20 px-4">
        <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-5">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
            Looks like you haven&apos;t added any items yet. Explore our curated collections to find premium products tailored for you.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#223049]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            You have <strong className="text-blue-400">{cartCount}</strong> item{cartCount > 1 ? 's' : ''} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear entire cart</span>
        </button>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl bg-[#111A2C] border border-[#223049] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:border-slate-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Link
                  to={`/product/${item.id}`}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-[#0E1626] border border-[#223049] shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Link
                    to={`/product/${item.id}`}
                    className="block text-sm font-semibold text-slate-100 hover:text-blue-400 transition-colors line-clamp-1 max-w-md"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[11px] font-mono text-slate-400">
                    SKU: {item.sku}
                  </p>
                  <p className="text-xs font-bold text-slate-300">
                    Unit: {formatINR(item.price)}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Price & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#223049]">
                {/* Stepper */}
                <div className="flex items-center bg-[#0B1220] border border-[#223049] rounded-lg">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for line item */}
                <div className="text-right">
                  <span className="text-sm font-bold text-white block">
                    {formatINR(item.price * item.quantity)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Incl. GST</span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-5 shadow-2xl">
            <h2 className="text-base font-bold text-white tracking-tight pb-3 border-b border-[#223049]">
              Order Summary
            </h2>

            {/* Voucher Promo Input */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. NEXUS10)"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#1A263D] hover:bg-[#223049] text-slate-200 text-xs font-semibold rounded-xl border border-[#223049] transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {appliedPromo.label} ({appliedPromo.code})
                  </span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Calculation Lines */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-[#223049]">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-slate-200">{formatINR(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promotional Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-400">Surface Express Shipping</span>
                <span className="font-semibold text-slate-200">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-1 text-[11px] text-slate-400">
                Includes GST of Rs {gstAmount.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#223049] flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Total Payable
                </span>
                <span className="text-[10px] text-slate-500">Includes GST of Rs {gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                {formatINR(totalAmount)}
              </span>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted & Verified Safe Payment Rails</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
