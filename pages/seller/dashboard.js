import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SellerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.userType !== 'seller') {
      router.push('/auth/login');
      return;
    }

    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/seller/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '' });
      setShowForm(false);
      fetchSellerProducts();
    } catch (error) {
      console.error('Error publishing product:', error);
      alert('Failed to publish product');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSellerProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="seller-dashboard">
        <h1>Seller Dashboard</h1>

        <button className="publish-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Publish New Item'}
        </button>

        {showForm && (
          <form onSubmit={handlePublish} className="publish-form">
            <h2>Publish New Product</h2>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
            </select>
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              required
            />
            <button type="submit">Publish Product</button>
          </form>
        )}

        <div className="products-list">
          <h2>Your Products</h2>
          {products.length === 0 ? (
            <p>No products published yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>
                    <td>
                      <button onClick={() => handleDelete(product.id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}