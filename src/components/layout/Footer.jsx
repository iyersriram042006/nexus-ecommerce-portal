import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';
import { BRAND } from '../../data/brand';
import { CATEGORIES } from '../../data/seedProducts';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-[#080D18] border-t border-[#223049] text-slate-400 text-xs mt-auto">
      {/* Trust Badges Bar */}
      <div className="border-b border-[#223049]/60 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111A2C]/60 border border-[#223049]/60">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-xs">Free Express Shipping</p>
              <p className="text-[11px] text-slate-400">On all prepaid orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111A2C]/60 border border-[#223049]/60">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-xs">100% Genuine Products</p>
              <p className="text-[11px] text-slate-400">Directly sourced & certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111A2C]/60 border border-[#223049]/60">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-xs">7-Day Easy Returns</p>
              <p className="text-[11px] text-slate-400">No questions asked return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111A2C]/60 border border-[#223049]/60">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-xs">24/7 Priority Support</p>
              <p className="text-[11px] text-slate-400">Toll-Free 1800-419-8800</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">{BRAND.name}</span>
                <span className="text-xs text-blue-400 ml-2 font-mono">STORE</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {BRAND.tagline} Discover premium curated electronics, tailored fashion, gourmet kitchenware, best-selling literature, luxury beauty, and high-performance athletic equipment.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111A2C] border border-[#223049] text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Verified Safe & Encrypted Checkout
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Shop Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/catalog?cat=${encodeURIComponent(cat)}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="hover:text-blue-400 transition-colors">
                  Orders & Tracking
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <span className="hover:text-slate-300 transition-colors cursor-pointer">
                  Shipping & Delivery FAQs
                </span>
              </li>
              <li>
                <span className="hover:text-slate-300 transition-colors cursor-pointer">
                  Returns & Replacements
                </span>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Legal & Compliance
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-slate-300 transition-colors cursor-pointer">
                  18% Statutory GST Invoicing
                </span>
              </li>
              <li>
                <span className="hover:text-slate-300 transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-slate-300 transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-slate-300 transition-colors cursor-pointer">
                  Security Architecture
                </span>
              </li>
              <li>
                <Link to="/admin" className="text-slate-500 hover:text-amber-400 transition-colors">
                  Merchant Portal Access
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Clearance Rail & Copyright */}
      <div className="border-t border-[#223049] bg-[#060A13] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
            <span className="font-semibold text-slate-300 mr-1">Accepted Payment Rails:</span>
            <span className="px-2 py-0.5 rounded bg-[#111A2C] border border-[#223049] font-mono text-slate-300">
              UPI 2.0
            </span>
            <span className="px-2 py-0.5 rounded bg-[#111A2C] border border-[#223049] font-mono text-slate-300">
              RuPay
            </span>
            <span className="px-2 py-0.5 rounded bg-[#111A2C] border border-[#223049] font-mono text-slate-300">
              Visa
            </span>
            <span className="px-2 py-0.5 rounded bg-[#111A2C] border border-[#223049] font-mono text-slate-300">
              Mastercard
            </span>
            <span className="px-2 py-0.5 rounded bg-[#111A2C] border border-[#223049] font-mono text-slate-300">
              NetBanking
            </span>
            <span className="px-2 py-0.5 rounded bg-[#111A2C] border border-[#223049] font-mono text-slate-300">
              Cash on Delivery
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            © {CURRENT_YEAR} {BRAND.name} Commerce Ltd. All prices quoted in Indian Rupees (₹).
          </div>
        </div>
      </div>
    </footer>
  );
};
