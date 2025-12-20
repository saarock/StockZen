import React, { useEffect, useState } from 'react';
import './Product.css';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaToggleOn, FaToggleOff, FaEdit } from 'react-icons/fa';
import { X, Tag, AlertTriangle } from 'lucide-react';
import { categoryOptions } from '../../constant';

const Product = ({ product, handleDeleteProduct, handleToggleAvailability, user, handleFormSubmit, addToCart, setTotalItem }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    lowStockThreshold: product.lowStockThreshold || 5,
    id: product._id
  });

  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };


  useEffect(() => {
    setProductDetails({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      lowStockThreshold: product.lowStockThreshold || 5,
      id: product._id,
    })
  }, [product]);

  const handleForm = (e) => {
    setEditModalOpen(false);
    handleFormSubmit(productDetails);
  };

  const handleProductClick = () => {
    setDetailModalOpen(true);  // Open the product detail modal
  };

  return (
    <>
      <tr className="product-row" onClick={handleProductClick}>
        <td>
          <img
            className="product-image"
            src={product?.imageUrl || 'https://via.placeholder.com/80'}
            alt={product.name || 'Product image'}
            loading="lazy"
          />
        </td>
        <td className="product-name">{product.name}</td>
        <td className="product-availability">
          {product.isAvailable ? (
            <FaCheckCircle
              className="availability-icon available"
              title="Available"
              aria-label="Product is available"
            />
          ) : (
            <FaTimesCircle
              className="availability-icon not-available"
              title="Not Available"
              aria-label="Product is not available"
            />
          )}
        </td>
        <td className="product-description">
          {product.description || 'No description available'}
        </td>
        <td className="product-price">RS {product.price.toFixed(2)}</td>
        <td className="product-stock">{product.stock}</td>
        {user?.role === 'admin' ? (
          <td className="product-actions flex items-center">
            <button
              className={`toggle-availability-button ${product.isAvailable ? 'unavailable' : 'available'}`}
              onClick={() => handleToggleAvailability(product._id)}
              aria-label={product.isAvailable ? 'Make product unavailable' : 'Make product available'}
            >
              {product.isAvailable ? (
                <>
                  <FaToggleOff className='size-4' /> Make Un-Available
                </>
              ) : (
                <>
                  <FaToggleOn className='size-4' /> Make Available
                </>
              )}
            </button>

            <button
              className="delete-button"
              onClick={() => handleDeleteProduct(product._id)}
              aria-label={`Delete ${product.name}`}
            >
              <FaTrashAlt className='size-3' /> Delete
            </button>

            <button
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation();
                setEditModalOpen(true)
              }}
              aria-label={`Edit ${product.name}`}
            >
              <FaEdit className='size-4' /> Edit Product
            </button>
          </td>
        ) : (
          <td>
            <form onSubmit={(e) => addToCart(e, user._id, product._id, product.name, product.price, product.imageUrl)} className="cart-form">
              <div className="input-container">
                <input
                  type="number"
                  name="totalItem"
                  id="totalItem"
                  min={0}
                  max={product.stock}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setTotalItem(e.target.value)}
                  className="input-field"
                  placeholder="Quantity"
                />
              </div>
              <button type="submit" className="add-to-cart-button" onClick={(e) => e.stopPropagation()}>
                Add to Cart
              </button>
            </form>
          </td>

        )}
      </tr>

      {/* Modal for Editing Product */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a2250] to-[#2a3570] px-6 py-5 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Edit Product Details</h2>
              <p className="text-white/80 text-sm mt-1">Update your product information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleForm} className="p-6 space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={productDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a2250] focus:ring-2 focus:ring-[#1a2250]/20 outline-none transition-all duration-200"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Product Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                  Product Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={productDetails.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a2250] focus:ring-2 focus:ring-[#1a2250]/20 outline-none transition-all duration-200 bg-white"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                  Product Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={productDetails.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a2250] focus:ring-2 focus:ring-[#1a2250]/20 outline-none transition-all duration-200 resize-none"
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              {/* Price and Stock - Grid on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
                    Price (RS)
                  </label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={productDetails.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a2250] focus:ring-2 focus:ring-[#1a2250]/20 outline-none transition-all duration-200"
                    placeholder="Enter product price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label htmlFor="stock" className="block text-sm font-semibold text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    value={productDetails.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a2250] focus:ring-2 focus:ring-[#1a2250]/20 outline-none transition-all duration-200"
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Low Stock Threshold */}
              <div className="space-y-2">
                <label htmlFor="lowStockThreshold" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Low Stock Alert Threshold
                </label>
                <input
                  id="lowStockThreshold"
                  type="number"
                  name="lowStockThreshold"
                  value={productDetails.lowStockThreshold}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a2250] focus:ring-2 focus:ring-[#1a2250]/20 outline-none transition-all duration-200"
                  placeholder="Alert threshold"
                  min="0"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1a2250] to-[#2a3570] hover:from-[#2a3570] hover:to-[#1a2250] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Product Detail View */}
      {isDetailModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDetailModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#1a2250] to-[#2a3470] text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    className="w-full md:w-64 h-64 object-cover rounded-lg shadow-md"
                    src={product?.imageUrl || "https://via.placeholder.com/200"}
                    alt={product.name || "Product image"}
                    loading="lazy"
                  />
                </div>

                {/* Product Information */}
                <div className="flex-1 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Description</p>
                    <p className="text-gray-800">{product.description || "No description available"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Category</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {categoryOptions.find(opt => opt.value === product.category)?.label || product.category || "N/A"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Price</p>
                      <p className="text-2xl font-bold text-[#1a2250]">RS: {product.price.toFixed(2)}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Stock</p>
                      <p className="text-2xl font-bold text-gray-800">{product.stock}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Low Stock Alert</p>
                      <p className="text-2xl font-bold text-yellow-600">{product.lowStockThreshold || 5}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Availability</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${product.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {product.isAvailable ? "✓ Available" : "✗ Not Available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
