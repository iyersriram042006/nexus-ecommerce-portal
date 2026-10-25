import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Star,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [pincode, setPincode] = useState('400001');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const item = await fetchProductById(id);
        if (item) {
          setProduct(item);
          setActiveImage(item.image);
          // Load related products from same category
          const all = await fetchProducts();
          const related = all
            .filter((p) => p.id !== item.id && p.category === item.category)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#111A2C] border border-[#223049] text-center">
        <h2 className="text-lg font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The requested product could not be located in our catalog.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const gstAmount = Math.round((product.price * 18) / 118);
  const basePrice = product.price - gstAmount;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Product link copied to clipboard.',
      });
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus({
        available: true,
        date: 'Tomorrow, by 2:00 PM',
        city: pincode.startsWith('4') ? 'Mumbai / West Zone' : 'Express Delivery Zone',
      });
    } else {
      setPincodeStatus({
        available: false,
        message: 'Please enter a valid 6-digit PIN code',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/catalog?cat=${encodeURIComponent(product.category)}`}
          className="hover:text-blue-400 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl bg-[#0E1626] border border-[#223049] overflow-hidden group shadow-2xl">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {product.stock <= 10 ? (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/90 text-white shadow">
                  Only {product.stock} Left
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-slate-950 shadow">
                  In Stock ({product.stock} Units)
                </span>
              )}
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/90 text-white shadow">
                Verified Authentic
              </span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[#111A2C]/80 backdrop-blur-md border border-[#223049] text-slate-300 hover:text-white hover:border-slate-400 transition-colors shadow-lg"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-lg ${
                  isFavorited
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-[#111A2C]/80 border-[#223049] text-slate-300 hover:text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#111A2C] border border-[#223049] text-center">
              <ShieldCheck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-200">100% Genuine</p>
              <p className="text-[9px] text-slate-400">Direct OEM Sourced</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111A2C] border border-[#223049] text-center">
              <Truck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-200">Express Delivery</p>
              <p className="text-[9px] text-slate-400">Pan-India 24-48h</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111A2C] border border-[#223049] text-center">
              <RotateCcw className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-200">7-Day Return</p>
              <p className="text-[9px] text-slate-400">Hassle-Free Policy</p>
            </div>
          </div>
        </div>

        {/* Right Details & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                MODEL SKU: {product.sku || `NX-${product.id}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1626] border border-[#223049] text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-slate-400">
                ({product.ratingCount || 140} verified consumer reviews)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Certified Stock
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#111A2C] border border-[#223049] space-y-3 shadow-xl">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Special Offer</span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {formatINR(product.price)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatINR(product.mrp)}
                    </span>
                  )}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                GST Tax Paid
              </span>
            </div>

            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-[#223049]">
              <span>Inclusive of 18% GST ({formatINR(gstAmount)})</span>
              <span className="text-slate-600">•</span>
              <span>Base Price: {formatINR(basePrice)}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Zero Convenience Fee</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Key Specification Badges */}
          {product.specs && product.specs.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key Highlights
              </p>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#0E1626] border border-[#223049] flex items-center gap-2 text-xs text-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pincode Delivery Checker */}
          <div className="p-4 rounded-xl bg-[#0E1626] border border-[#223049] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                Check Delivery Availability & Speed
              </span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 px-3 py-2 bg-[#111A2C] border border-[#223049] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A263D] hover:bg-[#223049] text-xs font-semibold text-slate-200 rounded-xl transition-colors border border-[#223049]"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <div className="text-xs">
                {pincodeStatus.available ? (
                  <p className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Express Delivery by <strong>{pincodeStatus.date}</strong> to{' '}
                    {pincodeStatus.city}
                  </p>
                ) : (
                  <p className="text-rose-400">{pincodeStatus.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Quantity and Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-[#111A2C] border border-[#223049] rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-100">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 50, q + 1))}
                  disabled={quantity >= (product.stock || 50)}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart ({formatINR(product.price * quantity)})</span>
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-6">
        <div className="flex border-b border-[#223049] gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'specs' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Specifications
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'reviews' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer Reviews ({product.ratingCount || 140})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
            )}
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-[#223049]/60">
                <span className="text-slate-400">Product Model</span>
                <span className="font-semibold text-slate-200">{product.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#223049]/60">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold text-slate-200">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#223049]/60">
                <span className="text-slate-400">SKU Identification</span>
                <span className="font-mono text-slate-200">{product.sku}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-[#223049]/60">
                <span className="text-slate-400">Inventory Status</span>
                <span className={product.stock <= 10 ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                  {product.stock <= 10 ? `Low Stock (${product.stock} units left)` : `${product.stock} units available`}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#223049]/60">
                <span className="text-slate-400">Warranty SLA</span>
                <span className="text-slate-200 font-semibold">1 Year Comprehensive Manufacturer Warranty</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#223049]/60">
                <span className="text-slate-400">Tax Invoice</span>
                <span className="text-slate-200 font-semibold">Statutory 18% GST Compliant Invoice</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0E1626] border border-[#223049] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Arjun Deshmukh</span>
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Remarkable quality and arrived in Mumbai within 24 hours. The packaging was pristine with full invoice included.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1626] border border-[#223049] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Sneha Nambiar</span>
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Matches the exact specifications listed. Nexus customer support was also very helpful answering questions before purchase.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Related in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
