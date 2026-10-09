import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import { apiRequest } from "../lib/api";

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.VITE_CURRENCY;


    const navigate = useNavigate();

    const [user, setUser] = useState(null)
    const [isSeller, setisSeller] = useState(false)
    const [showUserLogin, setshowUserLogin] = useState(false)
    const [Products, setProducts] = useState(dummyProducts)
    const [cartItems, setcartItems] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem('greencart_cart') || '{}')
        } catch {
            return {}
        }
    })

    const fetchProducts = async ()=>{
        try {
            const { products } = await apiRequest('/products')
            if (products.length === 0) {
                setProducts(dummyProducts)
                return
            }

            const localImages = new Map(dummyProducts.flatMap((product) =>
                product.image.map((image) => [image.split('/').pop().split('?')[0], image])
            ))
            setProducts(products.map((product) => ({
                ...product,
                image: product.image.map((image) => localImages.get(image.split('/').pop()) || image),
            })))
        } catch {
            setProducts(dummyProducts)
        }
    }
// Add Product to Cart
const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
        cartData[itemId] += 1;
    } else {
        cartData[itemId] = 1;
    }
    setcartItems(cartData);
    toast.success("Added to Cart");
};


    //update cart item quality
    const updateCartItem = (itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setcartItems(cartData)
        toast.success("Cart Updated")
    }

    const clearCart = () => setcartItems({})

    // remove product from cart

    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setcartItems(cartData)
    }


        useEffect(()=>{
            sessionStorage.setItem('greencart_cart', JSON.stringify(cartItems))
        }, [cartItems])

        useEffect(()=>{
            fetchProducts()
            const token = sessionStorage.getItem('greencart_token')
            if (token) {
                apiRequest('/auth/me')
                    .then(({ user }) => setUser(user))
                    .catch(() => sessionStorage.removeItem('greencart_token'))
            }
        },[])

    const value = {navigate, user, setUser, setisSeller ,isSeller,showUserLogin ,setshowUserLogin, Products, currency, addToCart, updateCartItem, removeFromCart, clearCart, cartItems}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext =()=>{
    return useContext(AppContext)
}