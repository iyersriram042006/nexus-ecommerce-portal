import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/product/ProductCard';
import { useToast } from '../context/ToastContext';

export const WishlistPage = () => {
  const { wishlistItems, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item, 1);
    });
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `All ${wishlistCount} wishlist items moved to your cart!`,
    });
  };

  if (wishlistCount === 0) {
    return (
      <div className="max-w-xl mx-auto my-20 px-4">
        <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-5">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
            Save items you love to your wishlist while browsing. Revisit anytime and add them straight to your cart.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            <span>Discover Products</span>
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Saved Wishlist</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            You have saved <strong className="text-rose-400">{wishlistCount}</strong> item{wishlistCount > 1 ? 's' : ''} for later
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddAllToCart}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add All to Cart</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="pt-4">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Browsing Catalog</span>
        </Link>
      </div>
    </div>
  );
};
