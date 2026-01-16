import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Bill.css";
import {
  deleteAllFromCart,
  deleteFromCart,
} from "../../features/product/productSlice";
import productService from "../../services/productService";
import { toast } from "react-toastify";
import protectedApi from "../../instance/axiosProtectedInstance";

const Bill = ({ handelRefresh }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get logged in user
  const products = useSelector((state) => state.products) || []; // Get cart products from Redux (note: 'products' matches store.js)

  // Calculate total price
  const totalPrice = products.reduce((sum, p) => sum + (p.totalPrice || 0), 0).toFixed(2);

  // Handle delete product from cart
  const handleDelete = (productId) => {
    dispatch(deleteFromCart({ productId }));
    toast.success("Product removed from cart");
  };

  const proceedToCheckOut = async () => {
    try {
      // Ensure products have userId, or fallback to logged in user.
      const orderList = products.map(p => ({
        ...p,
        userId: p.userId || user._id
      }));

      const res = await protectedApi.post("/initiate-esewa", orderList); // Send list of products

      console.log(res.data);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = res.data.esewa_payment_url;

      Object.keys(res.data).forEach((key) => {
        if (key !== "esewa_payment_url") {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = res.data[key];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };


  const proceedToCheckOutWithCash = async () => {

    console.log(products)

    try {
      const data = await productService.buyProducts(products);
      handelRefresh();
      dispatch(deleteAllFromCart());
      toast.success(data.message);

      console.log(data);
    } catch (error) {
      toast.error(error.message)
    }
  }




  return (
    <div className="bill-container">
      <h2 className="bill-title">Your Cart</h2>
      {products?.length > 0 ? (
        <>
          <div className="product-list-container">
            <div className="product-list">
              {products?.map((product) => (
                <div key={product.productId} className="product-card">
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h3 className="product-name">{product.productName}</h3>
                    <p className="product-info">
                      <strong>Items:</strong> {product.totalItem}
                    </p>
                    <p className="product-info">
                      <strong>Price:</strong> RS:{" "}
                      {product.totalPrice?.toFixed(2)}
                    </p>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product.productId)}
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bill-summary">
            <p className="total-price">
              <strong>Total:</strong> RS: {totalPrice}
            </p>
            <div className="flex flex-col gap-2">
              <button
                className="border border-green-700 hover:text-green-700 p-2 rounded-2xl cursor-pointer flex justify-center items-center"
                onClick={proceedToCheckOut}
              >
                ✓ Proceed to Checkout via eSewa
                <img
                  src="https://p7.hiclipart.com/preview/261/608/1001/esewa-zone-office-bayalbas-google-play-iphone-iphone.jpg"
                  alt="esewa"
                  width={30}
                  height={30}
                />
              </button>
              <button
                className="border border-green-700 hover:text-green-700 p-2 rounded-2xl cursor-pointer flex justify-center items-center"
                onClick={proceedToCheckOutWithCash}
              >
                ✓ Proceed to Checkout as Cash
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-cart-message" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          <p>Your cart is empty</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Add products to see them here</p>
        </div>
      )}
    </div>
  );
};

export default Bill;
