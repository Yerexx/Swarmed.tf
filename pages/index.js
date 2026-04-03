import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
        <h1>Swarmed.tf</h1>
        <p>Marketplace website</p>

        {user ? (
          <p>
            Signed in as <strong>{user.name || user.email || 'User'}</strong>
          </p>
        ) : (
          <p>
            <Link href="/auth/login">Login</Link> or <Link href="/auth/signup">Create an account</Link>
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          <Link href="/cart">Go to Cart</Link>
          <Link href="/seller/dashboard">Seller Dashboard</Link>
          <Link href="/admin/dashboard">Admin Dashboard</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
