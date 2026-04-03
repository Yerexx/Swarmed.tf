import React from 'react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #e5e5e5', marginTop: 24 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, fontSize: 14, color: '#666' }}>
        © {new Date().getFullYear()} Swarmed.tf
      </div>
    </footer>
  );
}
