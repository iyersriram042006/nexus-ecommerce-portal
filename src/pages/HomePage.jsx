import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Laptop,
  Shirt,
  UtensilsCrossed,
  BookOpen,
  Dumbbell,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { CATEGORIES } from '../data/seedProducts';
import { fetchProducts } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/product/ProductSkeleton';
import { formatINR } from '../utils/formatters';

const CATEGORY_ICONS = {
  Electronics: Laptop,
  Fashion: Shirt,
  'Home & Kitchen': UtensilsCrossed,
  Books: BookOpen,
  Beauty: Sparkles,
  Sports: Dumbbell,
};

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Top Rated');
  const navigate = useNavigate();

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 13 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter products by tab
  const getTabProducts = () => {
    if (activeTab === 'Top Rated') {
      return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
    }
    if (activeTab === 'New Arrivals') {
      return [...products].slice(8, 16);
    }
    if (activeTab === 'Trending Deals') {
      return [...products].filter((p) => p.mrp && p.mrp > p.price).slice(0, 8);
    }
    return products.slice(0, 8);
  };

  const flashDealProducts = products.filter((p) => p.isFeatured).slice(0, 3);
  const heroPrimaryProduct = products.find((p) => p.id === 'prod-el-02') || products[1] || products[0];
  const heroSecondaryProduct = products.find((p) => p.id === 'prod-sp-01') || products[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Top Flash Event Strip */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-[#223049] py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase tracking-wider animate-pulse flex items-center gap-1">
              <Flame className="w-3 h-3" />
              FLASH EVENT
            </span>
            <span className="text-slate-200">
              Festive Season Sale: Up to 40% off across Premium Electronics & Lifestyle | Use code:{' '}
              <strong className="text-blue-400 font-mono">NEXUS18</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Closes in:</span>
            <span className="bg-[#111A2C] px-1.5 py-0.5 rounded border border-[#223049] font-bold">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            :
            <span className="bg-[#111A2C] px-1.5 py-0.5 rounded border border-[#223049] font-bold">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            :
            <span className="bg-[#111A2C] px-1.5 py-0.5 rounded border border-[#223049] font-bold">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Large Showcase Card */}
          <div className="lg:col-span-8 bg-[#111A2C] border border-[#223049] rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
            {/* Background gradient blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all"></div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  FLAGSHIP SHOWCASE
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  READY TO SHIP
                </span>
              </div>

              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                PREMIUM COMPUTING
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 mb-3 max-w-xl leading-tight">
                {heroPrimaryProduct?.name || 'Next-Gen UltraWorkstation Series Pro'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed mb-6">
                {heroPrimaryProduct?.description ||
                  'Engineered for parallel workflow, high-density performance, and brilliant creative execution with zero thermal throttling.'}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-w-lg">
                <div className="bg-[#0B1220] border border-[#223049] p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">CHIPSET</p>
                  <p className="text-xs font-bold text-slate-100">Apple M3 8-Core</p>
                </div>
                <div className="bg-[#0B1220] border border-[#223049] p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">MEMORY</p>
                  <p className="text-xs font-bold text-slate-100">16GB Unified</p>
                </div>
                <div className="bg-[#0B1220] border border-[#223049] p-2.5 rounded-xl col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">DISPLAY</p>
                  <p className="text-xs font-bold text-slate-100">15.3&quot; Liquid Retina</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#223049] flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Special Direct Price (Incl. 18% GST)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {formatINR(heroPrimaryProduct?.price || 134900)}
                  </span>
                  {heroPrimaryProduct?.mrp && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatINR(heroPrimaryProduct.mrp)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    SAVE 7%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(heroPrimaryProduct?.id ? `/product/${heroPrimaryProduct.id}` : '/catalog')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>Shop Flagship Deal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/catalog"
                  className="px-4 py-3 rounded-xl bg-[#0B1220] hover:bg-[#1A263D] border border-[#223049] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  View Catalog
                </Link>
              </div>
            </div>
          </div>

          {/* Right Highlight Card */}
          <div className="lg:col-span-4 bg-[#111A2C] border border-[#223049] rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  ACTIVE WEAR & TECH
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Trending
                </span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {heroSecondaryProduct?.name || 'Garmin Fenix 7 Pro Multi-Sport GPS'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {heroSecondaryProduct?.description || 'Ultimate multisport GPS smartwatch with solar charging and rugged titanium frame.'}
              </p>

              <div className="my-5 rounded-xl overflow-hidden aspect-[16/10] bg-[#0E1626] border border-[#223049]">
                <img
                  src={heroSecondaryProduct?.image}
                  alt={heroSecondaryProduct?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#223049] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">PRICE</p>
                <p className="text-lg font-bold text-white">
                  {formatINR(heroSecondaryProduct?.price || 79990)}
                </p>
              </div>
              <Link
                to={heroSecondaryProduct?.id ? `/product/${heroSecondaryProduct.id}` : '/catalog'}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CATEGORIES HORIZONTAL GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Curated Categories
              </h2>
              <p className="text-xs text-slate-400">
                Explore 40+ premier products cataloged across 6 core lifestyle domains
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>View full catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category] || Sparkles;
              const count = products.filter((p) => p.category === category).length || 6;
              return (
                <Link
                  key={category}
                  to={`/catalog?cat=${encodeURIComponent(category)}`}
                  className="group p-4 rounded-xl bg-[#111A2C] border border-[#223049] hover:border-blue-500/50 hover:bg-[#142036] transition-all flex flex-col items-start justify-between min-h-[110px]"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-slate-100 group-hover:text-blue-400 transition-colors">
                      {category}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {count} Products
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ACTIVE FLASH DEALS WINDOW */}
        {flashDealProducts.length > 0 && (
          <section className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#223049] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Active Flash Procurement Window</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase">
                      LIMITED STOCK
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    High-demand inventory with instant dispatch guarantee
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 font-sans">TIME REMAINING:</span>
                <span className="px-2 py-1 rounded bg-[#0B1220] border border-[#223049] text-slate-200 font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="px-2 py-1 rounded bg-[#0B1220] border border-[#223049] text-slate-200 font-bold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="px-2 py-1 rounded bg-[#0B1220] border border-[#223049] text-slate-200 font-bold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flashDealProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* VALUE PROPOSITION GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#111A2C] border border-[#223049] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-100">100% Genuine Guarantee</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct authorized OEM distribution. Every SKU undergoes rigorous authenticity verification.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#111A2C] border border-[#223049] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-100">Pan-India Express 24-48h</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Fast air logistics with live GPS waypoint tracking right from regional fulfillment depots.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#111A2C] border border-[#223049] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-100">7-Day Easy Returns</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Effortless door-step returns and instant refunds with zero restocking or hidden charges.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#111A2C] border border-[#223049] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-100">24/7 Priority Support</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dedicated customer assistance and product specialists ready to resolve inquiries around the clock.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED REGISTRY & PRODUCTS GRID */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
                CURATED SELECTION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                Featured Product Registry
              </h2>
            </div>

            {/* Segmented Filter Tabs */}
            <div className="flex items-center p-1 bg-[#111A2C] border border-[#223049] rounded-xl text-xs font-semibold">
              {['Top Rated', 'New Arrivals', 'Trending Deals'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {getTabProducts().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="pt-8 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#111A2C] hover:bg-[#152238] border border-[#223049] hover:border-blue-500 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-lg"
            >
              <span>Browse Full Catalog (40+ Items)</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
