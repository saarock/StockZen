import React, { useEffect, useState } from 'react';
import './Product.css';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaToggleOn, FaToggleOff, FaEdit } from 'react-icons/fa';

const Product = ({ product, handleDeleteProduct, handleToggleAvailability, user, handleFormSubmit, addToCart, setTotalItem }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
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
        <td className="product-price">RS: {product.price.toFixed(2)}</td>
        <td className="product-stock">{product.stock}</td>
        {user?.role === 'admin' ? (
          <td className="product-actions">
            <button
              className={`toggle-availability-button ${product.isAvailable ? 'unavailable' : 'available'}`}
              onClick={() => handleToggleAvailability(product._id)}
              aria-label={product.isAvailable ? 'Make product unavailable' : 'Make product available'}
            >
              {product.isAvailable ? (
                <>
                  <FaToggleOff /> Make Un-Available
                </>
              ) : (
                <>
                  <FaToggleOn /> Make Available
                </>
              )}
            </button>

            <button
              className="delete-button"
              onClick={() => handleDeleteProduct(product._id)}
              aria-label={`Delete ${product.name}`}
            >
              <FaTrashAlt /> Delete
            </button>

            <button
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation();
                setEditModalOpen(true)
              }}
              aria-label={`Edit ${product.name}`}
            >
              <FaEdit /> Edit Product
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
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Edit Product Details</h2>
            <form onSubmit={handleForm}>
              <div className="input-group">
                <label htmlFor="name" className="input-label">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={productDetails.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter product name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="description" className="input-label">
                  Product Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={productDetails.description}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              <div className="input-group">
                <label htmlFor="price" className="input-label">
                  Price (RS)
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={productDetails.price}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter product price"
                />
              </div>

              <div className="input-group">
                <label htmlFor="stock" className="input-label">
                  Stock Quantity
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={productDetails.stock}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
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
        <div className="modal-overlay" onClick={() => setDetailModalOpen(false)}>
          <div className="modal-container product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setDetailModalOpen(false)}>
              X
            </button>
            <h2 className="modal-title">{product.name}</h2>
            <div className="product-detail">
              <img
                className="product-detail-image"
                src={product?.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name || 'Product image'}
                loading="lazy"
              />
              <div className="product-detail-info">
                <p><strong>Description:</strong> {product.description || 'No description available'}</p>
                <p><strong>Price:</strong> RS: {product.price.toFixed(2)}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Availability:</strong> {product.isAvailable ? 'Available' : 'Not Available'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
