import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        { items: cart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push(`/checkout/${response.data.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Checkout failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link href="/products">
              <button>Continue Shopping</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Total: ${total.toFixed(2)}</h2>
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}