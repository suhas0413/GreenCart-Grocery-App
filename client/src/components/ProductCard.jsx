import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContest";

const ProductQuickViewModal = ({ product, onClose, addToCart, cartItems }) => {
    const modalRef = useRef();

    // Close on Esc
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Close on click outside
    useEffect(() => {
        const handleClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    if (!product) return null;
    const rating = product.rating || 4;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fadeIn">
                <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-2xl font-bold">&times;</button>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <img src={product.image[0]} alt={product.name} className="w-40 h-40 object-contain rounded-xl bg-gray-50" />
                    <div className="flex-1">
                        <p className="text-green-600 font-bold text-sm mb-1">{product.category}</p>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{product.name}</h2>
                        <div className="flex items-center gap-1 mb-2">
                            {Array(5).fill('').map((_, i) => (
                                <img key={i} className="w-4" src={i < rating ? assets.star_icon : assets.star_dull_icon} alt="rating" />
                            ))}
                            <span className="ml-1 text-xs text-gray-500">({rating})</span>
                        </div>
                        <div className="flex items-end gap-2 mb-3">
                            <span className="text-xl font-bold text-green-600">${product.offerPrice}</span>
                            <span className="text-gray-400 line-through">${product.price}</span>
                        </div>
                        {product.description && <p className="text-gray-600 text-sm mb-4">{product.description}</p>}
                        <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold px-6 py-2 rounded-full shadow transition"
                            onClick={() => addToCart(product._id)}
                            disabled={cartItems[product._id]}
                        >
                            {cartItems[product._id] ? "Added" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems } = useAppContext();
    const [showQuickView, setShowQuickView] = useState(false);
    const rating = product.rating || 4;

    return product && (
        <>
        <div className="border border-gray-200 rounded-2xl px-4 py-3 bg-white min-w-56 max-w-56 w-full shadow hover:shadow-lg transition-all group relative">
            {/* Quick View Button */}
            <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-green-100 p-2 rounded-full shadow-md z-10"
                onClick={() => setShowQuickView(true)}
                aria-label="Quick view"
            >
                <img src={assets.search_icon} alt="Quick view" className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center px-2 cursor-pointer" onClick={() => setShowQuickView(true)}>
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm mt-2">
                <p>{product.category}</p>
                <p className="text-gray-700 font-semibold text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5 mt-1">
                    {Array(5).fill('').map((_, i) => (
                        <img key={i} className="md:w-4 w-3" src={i < rating ? assets.star_icon : assets.star_dull_icon} alt="rating" />
                    ))}
                    <p className="ml-1 text-xs">({rating})</p>
                </div>
                <div className="flex items-end justify-between mt-4">
                    <p className="md:text-xl text-base font-bold text-green-600">
                        {currency}${product.offerPrice} {" "}
                        <span className="text-gray-400 md:text-sm text-xs line-through font-normal">${product.price}</span>
                    </p>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-green-500">
                        {!cartItems[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold md:w-[80px] w-[64px] h-[36px] rounded-full shadow transition"
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart_icon" className="w-5" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[36px] bg-green-500/25 rounded-full select-none">
                                <button onClick={() => {removeFromCart(product._id)}} className="cursor-pointer text-md px-2 h-full">-</button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => {addToCart(product._id)}} className="cursor-pointer text-md px-2 h-full">+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        {showQuickView && (
            <ProductQuickViewModal 
                product={product} 
                onClose={() => setShowQuickView(false)} 
                addToCart={addToCart}
                cartItems={cartItems}
            />
        )}
        </>
    );
};

export default ProductCard;
