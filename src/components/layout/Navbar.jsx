import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  MapPin,
  ChevronDown,
  LogOut,
  ShieldAlert,
  PackageCheck,
  Menu,
  X,
  Sparkles,
  Check,
} from 'lucide-react';
import { BRAND } from '../../data/brand';
import { CATEGORIES } from '../../data/seedProducts';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Mumbai 400001');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState('');

  const accountRef = useRef(null);
  const categoryRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'All Categories') params.set('cat', selectedCategory);
    navigate(`/catalog?${params.toString()}`);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setIsCategoryOpen(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (cat !== 'All Categories') params.set('cat', cat);
    navigate(`/catalog?${params.toString()}`);
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (newLocationInput.trim()) {
      setDeliveryLocation(newLocationInput.trim());
      setIsLocationModalOpen(false);
      setNewLocationInput('');
    }
  };

  const navLinks = [
    { name: 'Discover / Home', path: '/' },
    { name: 'Catalog & Browse', path: '/catalog' },
    { name: 'Orders & Tracking', path: '/orders' },
    ...(isAdmin ? [{ name: 'Merchant Admin', path: '/admin', badge: 'Admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1220]/95 backdrop-blur border-b border-[#223049]">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-950/80 to-blue-900/60 border-b border-[#223049]/60 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500 text-white uppercase tracking-wider">
              FLASH OFFER
            </span>
            <span>
              Flat 18% Off sitewide with coupon{' '}
              <strong className="text-blue-400 font-mono">NEXUS18</strong> • Free Express Shipping on ₹999+
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Store Online & Shipping Nationwide
            </span>
            <span>24/7 Priority Support: 1800-419-8800</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                {BRAND.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-1 uppercase">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Search with Category Dropdown */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-2xl bg-[#111A2C] border border-[#223049] rounded-xl focus-within:border-blue-500 transition-all overflow-visible relative"
          >
            {/* Category Dropdown Button */}
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="h-10 px-3 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 border-r border-[#223049] bg-[#0E1626] rounded-l-xl transition-colors whitespace-nowrap"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-[#111A2C] border border-[#223049] rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All Categories')}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === 'All Categories'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-[#1A263D]'
                    }`}
                  >
                    <span>All Categories</span>
                    {selectedCategory === 'All Categories' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-[#1A263D]'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input field */}
            <div className="flex-1 flex items-center px-3 relative">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium products, electronics, fashion, books..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <span className="hidden lg:inline-block text-[11px] font-mono text-slate-500 bg-[#1A263D] px-1.5 py-0.5 rounded border border-[#223049]">
                ⌘K
              </span>
            </div>

            <button
              type="submit"
              className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-r-xl transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Delivery Location */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111A2C] border border-[#223049] text-xs hover:border-slate-500 transition-colors text-left"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 leading-tight">Deliver to</span>
                <span className="font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
                  {deliveryLocation}
                </span>
              </div>
            </button>

            {/* INR Pill */}
            <div className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg bg-[#111A2C] border border-[#223049] text-xs font-semibold text-slate-300">
              INR ₹
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl bg-[#111A2C] border border-[#223049] text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B1220]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="bg-white text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                {cartCount}
              </span>
            </Link>

            {/* Account / User Menu */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#111A2C] border border-[#223049] text-xs font-medium text-slate-200 hover:border-slate-500 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                    {userProfile?.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111A2C] border border-[#223049] hover:border-blue-500 text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Account Dropdown */}
              {user && isAccountOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#111A2C] border border-[#223049] rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-[#223049]">
                    <p className="font-semibold text-slate-100 truncate">
                      {userProfile?.displayName || 'Valued Customer'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Current Role:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isAdmin
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {userProfile?.role || 'customer'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-slate-300 hover:bg-[#1A263D] hover:text-white transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-blue-400" />
                      <span>My Orders & Tracking</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-slate-300 hover:bg-[#1A263D] hover:text-white transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-amber-300 hover:bg-[#1A263D] transition-colors font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Merchant Admin Panel</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#223049]">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsAccountOpen(false);
                        await logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[#111A2C] border border-[#223049] text-slate-300 hover:text-white md:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 bg-[#111A2C] border border-[#223049] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Sub Navigation Bar (Desktop) */}
      <div className="hidden md:block bg-[#0D1524] border-t border-[#223049]/70 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium">
          <nav className="flex items-center gap-1 sm:gap-2 py-2">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#1A263D]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              All Systems Operational
            </span>
            <span className="text-slate-600">|</span>
            <span>Pan-India 24-48h Logistics</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0E1626] border-t border-[#223049] px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1A263D] hover:text-white"
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div className="pt-2 border-t border-[#223049] flex items-center justify-between text-xs text-slate-400">
            <span>Location: {deliveryLocation}</span>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLocationModalOpen(true);
              }}
              className="text-blue-400 font-medium"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Change Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Set Delivery Location</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your city or 6-digit postal pincode to see accurate delivery speed and stock.
            </p>
            <form onSubmit={handleSaveLocation} className="space-y-4">
              <input
                type="text"
                value={newLocationInput}
                onChange={(e) => setNewLocationInput(e.target.value)}
                placeholder="e.g. Bengaluru 560001, Delhi 110001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1220] border border-[#223049] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-[#1A263D] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
