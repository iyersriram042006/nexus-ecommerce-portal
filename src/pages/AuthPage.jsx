import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  FileText,
  LockKeyhole,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { BRAND } from '../data/brand';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // If already logged in, show quick welcome back card
  if (user && !isSubmitting) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#111A2C] border border-[#223049] rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Session Active</h2>
          <p className="text-xs text-slate-400 mb-6">
            You are currently signed in as <span className="text-slate-200 font-medium">{user.email}</span>.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate(from)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/orders"
              className="block w-full py-2.5 px-4 bg-[#0B1220] border border-[#223049] hover:border-slate-500 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signup(email, password, displayName);
        addToast({
          type: 'success',
          title: 'Account Created',
          message: `Welcome to ${BRAND.name}, ${displayName || 'shopper'}!`,
        });
      } else {
        await login(email, password);
        addToast({
          type: 'success',
          title: 'Welcome Back',
          message: 'Signed in successfully.',
        });
      }
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
      let msg = err.message || 'An authentication error occurred.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please verify and try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('customer@nexus.store');
    setPassword('Customer@123456');
    setDisplayName('Aarav Patel');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Brand & Value Highlights */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Consumer Commerce</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Curated Excellence for Modern Lifestyle & Tech
            </h1>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Join thousands of discerning shoppers accessing certified electronics, handcrafted fashion, and premium home goods with fast Pan-India shipping.
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  100% Authentic & Warranty Backed
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every product is sourced directly from certified original equipment manufacturers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Pan-India 24–48h Priority Express
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time GPS tracking from regional fulfillment centers to your doorstep.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Automated 18% Statutory GST Invoicing
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Detailed tax invoice generated with every order for seamless personal and business accounting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <LockKeyhole className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  256-Bit Bank-Grade Secure Payment Rails
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant UPI 2.0, RuPay, Visa, Mastercard, and Cash on Delivery options.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="p-4 rounded-xl bg-[#111A2C]/80 border border-[#223049] text-xs text-slate-400">
            <p className="italic text-slate-300 mb-2">
              “{BRAND.name} sets the gold standard for e-commerce: pristine packaging, verified authentic products, and hassle-free returns.”
            </p>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-200">Kavita Iyer • Verified Buyer</span>
              <span className="text-emerald-400 font-mono">★★★★★ 5.0 Rating</span>
            </div>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            {/* Segmented Tab */}
            <div className="grid grid-cols-2 p-1 bg-[#0B1220] rounded-xl border border-[#223049] mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  !isSignUp
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  isSignUp
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">
                {isSignUp ? 'Create your Account' : 'Welcome to Nexus'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp
                  ? 'Sign up to track orders, save wishlist items, and manage addresses.'
                  : 'Enter your credentials to access your orders and account.'}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#0B1220] border border-[#223049] rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0B1220] border border-[#223049] rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0B1220] border border-[#223049] rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-200 absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#0B1220] border border-[#223049] rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-[#223049] bg-[#0B1220] text-blue-600 focus:ring-0"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      addToast({
                        type: 'info',
                        title: 'Password Reset',
                        message: 'Contact support@nexus.store or use demo credentials.',
                      })
                    }
                    className="text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Nexus Account' : 'Sign In to Nexus'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Autofill */}
            <div className="mt-6 pt-5 border-t border-[#223049]">
              <p className="text-[11px] text-slate-400 font-medium text-center mb-2.5 uppercase tracking-wider">
                Instant Demo Quick-Fill
              </p>
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-2 px-2.5 rounded-lg bg-[#0B1220] border border-[#223049] hover:border-blue-500 text-[11px] text-slate-300 transition-colors font-medium text-center"
              >
                Fill Demo Customer
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-5 leading-normal">
              By proceeding, you agree to {BRAND.name}&apos;s Terms of Service and Privacy Policy. All accounts are secured with Firebase Auth & 256-bit SSL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
