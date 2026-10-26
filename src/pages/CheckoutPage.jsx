import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/orderService';
import { formatINR } from '../utils/formatters';

export const CheckoutPage = () => {
  const { user, userProfile } = useAuth();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    discountAmount,
    appliedPromo,
    shippingFee: defaultShippingFee,
    clearCart,
  } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Steps: 1: Address, 2: Delivery Speed, 3: Payment
  const [deliverySpeed, setDeliverySpeed] = useState('standard'); // 'standard' (free) | 'expedited' (149)
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'

  // Address form fields
  const [addressForm, setAddressForm] = useState({
    fullName: userProfile?.displayName || '',
    email: user?.email || '',
    phone: '',
    addressLine: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  });

  // Card details state
  const [cardForm, setCardForm] = useState({
    cardNumber: '4532 •••• •••• 8892',
    cardName: userProfile?.displayName || 'Cardholder Name',
    expiry: '12/28',
    cvv: '884',
  });

  // UPI details
  const [upiId, setUpiId] = useState('customer@okhdfcbank');

  const [formErrors, setFormErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const selectedShippingFee = deliverySpeed === 'expedited' ? 149 : defaultShippingFee;
  const netAmount = Math.max(0, cartSubtotal - discountAmount);
  // Product prices are GST-inclusive. Included GST = amount * 18 / 118
  const calculatedGst = Math.round((netAmount * 18) / 118);
  // total = sum of the inclusive item prices - discount + shipping (stop adding GST on top)
  const grandTotal = netAmount + selectedShippingFee;

  const validateAddress = () => {
    const errors = {};
    if (!addressForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!addressForm.email.trim() || !/\S+@\S+\.\S+/.test(addressForm.email)) {
      errors.email = 'Valid email is required';
    }
    if (!addressForm.phone.trim() || addressForm.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Valid 10-digit phone number is required';
    }
    if (!addressForm.addressLine.trim()) errors.addressLine = 'Street address is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.state.trim()) errors.state = 'State is required';
    if (!addressForm.pincode.trim() || addressForm.pincode.length !== 6) {
      errors.pincode = '6-digit PIN code required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateAddress()) {
      addToast({
        type: 'error',
        title: 'Form Validation Error',
        message: 'Please review and complete all required shipping fields.',
      });
      return;
    }

    if (cartItems.length === 0) {
      addToast({
        type: 'error',
        title: 'Empty Cart',
        message: 'Your cart is empty. Please add items before checking out.',
      });
      navigate('/catalog');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData = {
        userId: user?.uid || 'guest-user',
        customerName: addressForm.fullName,
        customerEmail: addressForm.email,
        customerPhone: addressForm.phone,
        shippingAddress: {
          addressLine: addressForm.addressLine,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode,
        },
        deliverySpeed: deliverySpeed === 'expedited' ? 'Expedited Air (24-48h)' : 'Standard Surface (3-5 days)',
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiId})`
            : paymentMethod === 'card'
            ? `Card (•••• ${cardForm.cardNumber.slice(-4)})`
            : 'Cash on Delivery',
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          sku: item.sku,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          lineTotal: item.price * item.quantity,
        })),
        subtotal: cartSubtotal,
        discount: discountAmount,
        promoCode: appliedPromo?.code || null,
        gst: calculatedGst,
        shippingCost: selectedShippingFee,
        total: grandTotal,
      };

      const savedOrder = await createOrder(orderData);

      clearCart();
      addToast({
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Order #${savedOrder.trackingNumber || savedOrder.id} has been confirmed.`,
      });

      navigate(`/order-success/${savedOrder.id}`, { state: { order: savedOrder } });
    } catch (err) {
      console.error('Error placing order:', err);
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: 'Could not complete order. Please try again.',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Stepper Header */}
      <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Checkout & Settlement
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure 256-Bit SSL Encrypted Order Finalization
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[11px]">
                1
              </span>
              <span>Address</span>
            </div>
            <span className="text-slate-600">———</span>
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[11px]">
                2
              </span>
              <span>Delivery</span>
            </div>
            <span className="text-slate-600">———</span>
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[11px]">
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Sections */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Shipping Address */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#223049]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Shipping Consignee Address
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="e.g. Rajesh Varma"
                  className={`w-full px-3 py-2 bg-[#0B1220] border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
                    formErrors.fullName ? 'border-rose-500' : 'border-[#223049]'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[10px] text-rose-400 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  value={addressForm.email}
                  onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                  placeholder="rajesh@company.com"
                  className={`w-full px-3 py-2 bg-[#0B1220] border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
                    formErrors.email ? 'border-rose-500' : 'border-[#223049]'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[10px] text-rose-400 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3 py-2 bg-[#0B1220] border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
                    formErrors.phone ? 'border-rose-500' : 'border-[#223049]'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[10px] text-rose-400 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">PIN Code (6 digits) *</label>
                <input
                  type="text"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      pincode: e.target.value.replace(/\D/g, '').slice(0, 6),
                    })
                  }
                  placeholder="400001"
                  className={`w-full px-3 py-2 bg-[#0B1220] border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
                    formErrors.pincode ? 'border-rose-500' : 'border-[#223049]'
                  }`}
                />
                {formErrors.pincode && (
                  <p className="text-[10px] text-rose-400 mt-1">{formErrors.pincode}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  Street Address, Apartment / Flat / Suite *
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                  placeholder="e.g. Flat 402, Lotus Tower, MG Road, Bandra West"
                  className={`w-full px-3 py-2 bg-[#0B1220] border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
                    formErrors.addressLine ? 'border-rose-500' : 'border-[#223049]'
                  }`}
                />
                {formErrors.addressLine && (
                  <p className="text-[10px] text-rose-400 mt-1">{formErrors.addressLine}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="Mumbai"
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">State *</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="Maharashtra"
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Speed Option */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#223049]">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Transit Logistics & Delivery SLA
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setDeliverySpeed('standard')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  deliverySpeed === 'standard'
                    ? 'bg-blue-600/10 border-blue-500 shadow-md'
                    : 'bg-[#0B1220] border-[#223049] hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-xs text-white">Standard Surface Freight</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {defaultShippingFee === 0 ? 'FREE' : '₹99'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Reliable door-to-door ground logistics. Estimated delivery in 3–5 business days.
                </p>
              </label>

              <label
                onClick={() => setDeliverySpeed('expedited')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  deliverySpeed === 'expedited'
                    ? 'bg-blue-600/10 border-blue-500 shadow-md'
                    : 'bg-[#0B1220] border-[#223049] hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs text-white">Expedited Air Cargo</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200">₹149</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Priority express air routing. Guaranteed delivery in 24–48 hours nationwide.
                </p>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Options */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#223049]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Payment Protocol & Gateway
                </h2>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <Lock className="w-3 h-3" />
                256-Bit Escrow Vault
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 p-1 bg-[#0B1220] border border-[#223049] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI 2.0</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'cod'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* UPI Option Body */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-[#0B1220] border border-[#223049] flex flex-col sm:flex-row items-center gap-5">
                {/* Simulated QR Code SVG */}
                <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-md">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="40" y="10" width="10" height="20" />
                    <rect x="50" y="30" width="20" height="10" />
                    <rect x="40" y="60" width="30" height="10" />
                    <rect x="70" y="70" width="20" height="20" />
                    <rect x="50" y="80" width="10" height="10" />
                  </svg>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">Scan & Authorize via UPI 2.0</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      Zero Surcharge
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Supports Google Pay, PhonePe, Paytm, BHIM, or your bank UPI app. Or enter Virtual Payment Address below:
                  </p>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3 py-2 bg-[#111A2C] border border-[#223049] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Card Option Body */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-[#0B1220] border border-[#223049] space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111A2C] border border-[#223049] rounded-xl text-slate-100 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111A2C] border border-[#223049] rounded-xl text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111A2C] border border-[#223049] rounded-xl text-slate-100 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  Card details are encrypted with TLS 1.3. Simulated sandbox demo checkout.
                </p>
              </div>
            )}

            {/* COD Option Body */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-[#0B1220] border border-[#223049] text-xs space-y-2">
                <p className="font-semibold text-slate-200 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  Pay upon Safe Delivery
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cash or UPI on delivery is accepted by our courier representative. Please keep exact cash or UPI app handy upon delivery.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#223049]">
              <h2 className="text-base font-bold text-white">Order Summary</h2>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400">
                {cartCount} Items
              </span>
            </div>

            {/* Items list preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#0E1626] border border-[#223049] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Qty: {item.quantity} × {formatINR(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-100 shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-[#223049]">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-semibold text-slate-200">{formatINR(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promotional Discount ({appliedPromo?.code})</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-400">Shipping & Handling</span>
                <span className="font-semibold text-slate-200">
                  {selectedShippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    formatINR(selectedShippingFee)
                  )}
                </span>
              </div>

              <div className="pt-1 text-[11px] text-slate-400">
                Includes GST of Rs {calculatedGst.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Total Payable */}
            <div className="pt-4 border-t border-[#223049] flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Total Payable Amount
                </span>
                <span className="text-[10px] text-slate-500">Includes GST of Rs {calculatedGst.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                {formatINR(grandTotal)}
              </span>
            </div>

            {/* Place Order CTA */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || cartItems.length === 0}
              className="w-full py-4 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging Order & Generating Invoice...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order ({formatINR(grandTotal)})</span>
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statutory GST Invoice will be generated upon completion.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
