import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContest';

const CartDrawer = ({ onClose }) => {
  const { cartItems, Products, addToCart, removeFromCart, currency } = useAppContext();
  const drawerRef = useRef();

  // Close on Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const cartProductList = Object.keys(cartItems || {})
    .map(id => Products.find(p => p._id === id))
    .filter(Boolean);

  const subtotal = cartProductList.reduce((sum, p) => sum + (p.offerPrice * cartItems[p._id]), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div ref={drawerRef} className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-slideInRight relative">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-extrabold text-green-700 mb-6">Your Cart</h2>
        {cartProductList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {cartProductList.map(product => (
              <div key={product._id} className="flex items-center gap-4 py-4 border-b border-gray-100">
                <img src={product.image[0]} alt={product.name} className="w-16 h-16 object-contain rounded bg-gray-50" />
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{product.name}</p>
                  <p className="text-green-600 font-semibold">{currency}${product.offerPrice}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => removeFromCart(product._id)} className="px-2 py-1 bg-green-100 rounded-full">-</button>
                    <span className="w-6 text-center">{cartItems[product._id]}</span>
                    <button onClick={() => addToCart(product._id)} className="px-2 py-1 bg-green-100 rounded-full">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(product._id)} className="text-red-500 hover:underline ml-2">Remove</button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Subtotal</span>
            <span>{currency}${subtotal.toFixed(2)}</span>
          </div>
          <button className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold px-6 py-3 rounded-full shadow transition">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer; 