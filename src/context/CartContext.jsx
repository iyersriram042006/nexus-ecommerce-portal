import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'nexus_ecommerce_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'NEXUS10', discountRate: 0.1 }
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min((existing.quantity || 1) + quantity, product.stock || 99);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          sku: product.sku || `SKU-${product.id.slice(0, 8)}`,
          stock: product.stock || 50,
          quantity: Math.min(quantity, product.stock || 99),
        },
      ];
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} (x${quantity}) was added to your cart.`,
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const clamped = Math.min(newQuantity, item.stock || 99);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((i) => i.id === productId);
      if (itemToRemove) {
        addToast({
          type: 'info',
          title: 'Removed from Cart',
          message: `${itemToRemove.name} was removed.`,
        });
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const cleanCode = code?.trim().toUpperCase();
    if (cleanCode === 'NEXUS10') {
      setAppliedPromo({ code: 'NEXUS10', rate: 0.1, label: '10% Discount' });
      addToast({
        type: 'success',
        title: 'Promo Applied',
        message: '10% discount applied to your order!',
      });
      return { success: true };
    }
    if (cleanCode === 'NEXUS18') {
      setAppliedPromo({ code: 'NEXUS18', rate: 0.18, label: '18% GST Offset Discount' });
      addToast({
        type: 'success',
        title: 'Promo Applied',
        message: '18% discount applied to your order!',
      });
      return { success: true };
    }
    addToast({
      type: 'error',
      title: 'Invalid Promo Code',
      message: 'Try code NEXUS10 or NEXUS18',
    });
    return { success: false, error: 'Invalid coupon code' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast({
      type: 'info',
      title: 'Promo Removed',
      message: 'Discount has been removed.',
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discountAmount = appliedPromo ? Math.round(cartSubtotal * appliedPromo.rate) : 0;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const gstAmount = Math.round(taxableAmount * 0.18);
  const shippingFee = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const totalAmount = taxableAmount + gstAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        discountAmount,
        appliedPromo,
        gstAmount,
        shippingFee,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
