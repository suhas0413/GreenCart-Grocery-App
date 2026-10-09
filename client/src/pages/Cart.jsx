import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../lib/api';
import { useAppContext } from '../context/AppContest';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    Products,
    addToCart,
    updateCartItem,
    currency,
    user,
    setshowUserLogin,
    clearCart,
    navigate,
  } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const entries = Object.entries(cartItems)
    .map(([id, quantity]) => ({
      product: Products.find((item) => item._id === id),
      quantity,
    }))
    .filter((entry) => entry.product);
  const subtotal = entries.reduce((sum, { product, quantity }) => sum + product.offerPrice * quantity, 0);
  const itemCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const formatPrice = (value) => `${currency || '$'}${value.toFixed(2)}`;

  const placeOrder = async () => {
    if (!user) {
      setshowUserLogin(true);
      toast('Sign in to place your order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { order } = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: entries.map(({ product, quantity }) => ({
            productId: product._id,
            quantity,
          })),
        }),
      });
      clearCart();
      toast.success(`Order placed: ${order._id.slice(-6).toUpperCase()}`);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <p className="cart-eyebrow">GREEN CART / YOUR SELECTION</p>
          <h1>Your basket</h1>
          <p className="cart-count">{itemCount} {itemCount === 1 ? 'item' : 'items'} selected</p>
        </div>
        <button className="cart-continue" type="button" onClick={() => navigate('/')}>
          <span aria-hidden="true">&larr;</span> Continue shopping
        </button>
      </div>

      {entries.length === 0 ? (
        <section className="cart-empty" aria-live="polite">
          <span className="cart-empty-mark" aria-hidden="true">+</span>
          <h2>Your basket is taking a break.</h2>
          <p>Pick out something fresh and it will be waiting here.</p>
          <button type="button" onClick={() => navigate('/')}>Explore the market</button>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Items in your basket">
            <div className="cart-list-head">
              <span>Product</span>
              <span>Quantity</span>
              <span>Line total</span>
            </div>
            {entries.map(({ product, quantity }) => (
              <article className="cart-item" key={product._id}>
                <img className="cart-item-image" src={product.image[0]} alt={product.name} />
                <div className="cart-item-details">
                  <span className="cart-item-category">{product.category}</span>
                  <h2>{product.name}</h2>
                  <p>{formatPrice(product.offerPrice)} <del>{formatPrice(product.price)}</del></p>
                  <button
                    className="cart-remove"
                    type="button"
                    onClick={() => updateCartItem(product._id, 0)}
                    aria-label={`Remove ${product.name} from basket`}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-quantity" aria-label={`Quantity of ${product.name}`}>
                  <button
                    type="button"
                    onClick={() => updateCartItem(product._id, quantity - 1)}
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    &minus;
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(product._id)}
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    +
                  </button>
                </div>
                <strong className="cart-line-total">{formatPrice(product.offerPrice * quantity)}</strong>
              </article>
            ))}
          </section>

          <aside className="cart-summary" aria-label="Order summary">
            <p className="cart-eyebrow">ORDER SUMMARY</p>
            <h2>Almost yours.</h2>
            <div className="cart-summary-row">
              <span>Subtotal <span className="cart-summary-count">({itemCount} items)</span></span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <p className="cart-summary-note">Delivery and any applicable fees are confirmed with your order.</p>
            <button
              className="cart-checkout"
              type="button"
              onClick={placeOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing order...' : 'Place order'}
              <span aria-hidden="true">&rarr;</span>
            </button>
            <p className="cart-secure-note">Your order total is calculated from current product prices.</p>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;