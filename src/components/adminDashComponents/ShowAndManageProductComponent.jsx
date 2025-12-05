import React, { useEffect, useState } from 'react';
import './AdminComp.css';
import productService from '../../services/productService';
import Product from '../Product/Product';
import { useDispatch, useSelector } from 'react-redux';
import useUser from '../../hooks/useUser';
import { toast } from "react-toastify"
import { addToCart  } from '../../features/product/productSlice';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {categoryOptions} from "../../constant.js";


const ShowAndManageProductComponent = ({ adminWant = '1', refresh }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("2");
  const [availabilityFilter, setAvailabilityFilter] = useState("2");
  const [totalItem, setTotalItem] = useState(1);
  const productsPerPage = 7;
  const { user } = useUser();
  const dispatch = useDispatch();


  // 0 => false 
  // 1 => true 
  // 2 => all
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
  
     
        const data = await productService.getProducts(currentPage, productsPerPage, searchQuery, categoryFilter, availabilityFilter, adminWant);
    

        setProducts(data.data.products);
        setTotalPages(data.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, categoryFilter, availabilityFilter, adminWant, refresh]);


 const handelPaginationWorks = async () => {
    const data = await productService.getProducts(currentPage, productsPerPage, searchQuery, categoryFilter, availabilityFilter, adminWant);
    setProducts(data.data.products);
    setTotalPages(data.data.totalPages);
    setLoading(false);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      await productService.deleteProduct(productId);
      handelPaginationWorks()
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (productId) => {
    try {
      setLoading(true);

      await productService.toggleProductAvailability(productId); // Assumes a service method exists
      handelPaginationWorks()

    } catch (error) {
      toast.error(error.message);

    } finally {
      setLoading(false);

    }
  };


  const handleFormSubmit = async (productDetails) => {
    try {

      setLoading(true);
      await productService.editProduct(productDetails); // Assumes a service method exists
      handelPaginationWorks();


    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }


  const addToCartBtn = (event, userId, productId,name,price, imageUrl) => {

    event.preventDefault();
    toast.success("Product added to cart successfully!");
    const product = {
      userId,
      productId,
      totalItem,
      totalPrice: price * totalItem,
      imageUrl,
      productName: name
  }
  console.log(product);
  
  dispatch(addToCart(product));



  }







  return (
    <div className="product-manage-page">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {/* Search bar and filter options */}
          <div className="search-filter-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="filter-container">
              {/* Category Filter */}
              <div className="filter-item">
                <span className="filter-label">Category</span>
                <select
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="2">All Categories</option>
                 {
                   categoryOptions?.length > 0 ? 
                   categoryOptions.map((ca) => <option label={`${ca.label}`}>{ca.value}</option>) : "No category available"
                 }
                </select>
              </div>

              {/* Availability Filter */}
              <div className="filter-item">
                <span className="filter-label">Availability</span>
                <select
                  className="filter-select"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="2">All</option>
                  <option value="1">Available</option>
                  <option value="0">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          <div className="product-table-container">
            {products.length > 0 ? (
              <table className="product-table">
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Availability</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <Product
                      key={product._id}
                      product={product}
                      handleDeleteProduct={handleDeleteProduct}
                      handleToggleAvailability={handleToggleAvailability}
                      user={user}
                      handleFormSubmit={handleFormSubmit}
                      addToCart={addToCartBtn}
                      setTotalItem={setTotalItem}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products available.</p>
            )}
          </div>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAndManageProductComponent;
