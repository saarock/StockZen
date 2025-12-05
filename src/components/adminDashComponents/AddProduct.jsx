import React, { useState } from 'react';
import './AdminComp.css';
import productService from '../../services/productService';
import { handleResponse } from '../../utils';
import { toast } from 'react-toastify';
import { categoryOptions } from '../../constant';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    expiryDate: '',
    category: '',
    product_image: null,
    stock: '',
    description: '', // Updated description to be editable
    userId: JSON.parse(localStorage.getItem("userData"))?._id || '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      product_image: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.product_image) newErrors.product_image = 'Product image is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required'; // New validation for description
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const validationErrors = validateForm();

    if (formData.userId === null || !formData.userId) {
      toast.warning("Please login first");
      setLoading(false);
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('expiryDate', formData.expiryDate);
    submitData.append('category', formData.category);
    submitData.append('stock', formData.stock);
    submitData.append('description', formData.description); // Add description to FormData
    submitData.append('userId', formData.userId);

    if (formData.product_image) {
      submitData.append('product_image', formData.product_image); // Add image file to FormData
    }

    try {
      // Send the form data using your product service
      const response = await handleResponse(productService.addProduct(submitData));

      toast.success(response.data || "Product added successfully");

      // Reset form after successful submission
      setFormData({
        name: '',
        price: '',
        expiryDate: '',
        category: '',
        product_image: null,
        stock: '',
        description: '',
        userId: JSON.parse(localStorage.getItem("userData"))?._id || '',
      });
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-wrapper">
      <div className="add-menu-container">
        <h2 className="form-title">Add Products</h2>
        <form onSubmit={handleSubmit} className="add-menu-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter product price"
                min="0"
                step="0.01"
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={errors.expiryDate ? 'input-error' : ''}
              />
              {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'input-error' : ''}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter product stock"
                min="0"
                className={errors.stock ? 'input-error' : ''}
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="product_image">Product Image</label>
              <input
                type="file"
                id="product_image"
                name="product_image"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.product_image ? 'input-error' : ''}
              />
              {errors.product_image && <span className="error-message">{errors.product_image}</span>}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Menu Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
