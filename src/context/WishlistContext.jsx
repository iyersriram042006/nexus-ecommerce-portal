import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

const WISHLIST_STORAGE_KEY = 'nexus_ecommerce_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      addToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: `${product.name} removed from your wishlist.`,
      });
    } else {
      setWishlistItems((prev) => [...prev, product]);
      addToast({
        type: 'success',
        title: 'Added to Wishlist',
        message: `${product.name} saved to your wishlist.`,
      });
    }
  };

  const removeFromWishlist = (productId) => {
    const item = wishlistItems.find((p) => p.id === productId);
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
    if (item) {
      addToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: `${item.name} removed from your wishlist.`,
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
