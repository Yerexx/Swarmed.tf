import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      setIsAuthed(Boolean(localStorage.getItem('token')));
    } catch {
      setIsAuthed(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthed(false);
    } catch {
      setIsAuthed(false);
    }
  };

  return (
    <header style={{ borderBottom: '1px solid #e5e5e5' }}>
      <nav style={{ maxWidth: 960, margin: '0 auto', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/">Swarmed.tf</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/seller/dashboard">Seller</Link>
          <Link href="/admin/dashboard">Admin</Link>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isAuthed ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
