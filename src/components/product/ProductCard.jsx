import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const incrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < (product.stock || 50)) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-[#111A2C] border border-[#223049] hover:border-blue-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-[#0E1626] overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Stock pill & discount badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.stock <= 10 ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/90 text-white shadow">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-slate-950 shadow">
              In Stock ({product.stock})
            </span>
          )}

          {discountPercent && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white w-fit shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all shadow-md z-10 ${
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-[#111A2C]/80 border border-[#223049] text-slate-300 hover:text-white hover:border-slate-400'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* SKU tag overlay */}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-mono text-slate-300">
          SKU: {product.sku || `NX-${product.category.slice(0, 2).toUpperCase()}-${product.id.slice(-4)}`}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="uppercase font-semibold tracking-wider text-blue-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-slate-500">({product.ratingCount || 120})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block group-hover:text-blue-400 transition-colors">
            <h3 className="font-semibold text-sm text-slate-100 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Specs tags */}
          {product.specs && product.specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.specs.slice(0, 2).map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#0E1626] border border-[#223049] text-slate-400 truncate max-w-[150px]"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Controls */}
        <div className="pt-3 border-t border-[#223049]/70 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Incl. 18% GST</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-[#0E1626] border border-[#223049] rounded-lg">
              <button
                type="button"
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-semibold text-slate-200">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                disabled={quantity >= (product.stock || 50)}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
