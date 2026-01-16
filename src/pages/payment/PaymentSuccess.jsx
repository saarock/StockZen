import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import protectedApi from "../../instance/axiosProtectedInstance";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteAllFromCart } from "../../features/product/productSlice";

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const query = new URLSearchParams(location.search);
    const data = query.get("data");

    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!data) {
                toast.error("No payment data found.");
                setVerifying(false);
                return;
            }

            try {
                const res = await protectedApi.get(`/verify-esewa?data=${data}`);

                // Clear the cart
                dispatch(deleteAllFromCart());

                // Show alert message
                alert('🎉 Payment Successful! Your order has been completed.');
                toast.success(res.data.message || "Payment verified successfully!");

                // Redirect to orders page after 2 seconds
                setTimeout(() => {
                    navigate('/orders');
                }, 2000);
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Payment verification failed.");
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [data]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            {verifying ? (
                <div className="text-2xl font-bold animate-pulse">Verifying Payment...</div>
            ) : (
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="flex justify-center mb-4">
                        <span className="text-6xl text-green-500">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
                    <p className="text-gray-400 mb-6">Your order has been confirmed.</p>

                    <button
                        onClick={() => navigate("/products")}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all w-full mb-3"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => navigate("/manage-booked-product?id=me")} // Assuming this route exists and 'id=me' works or we get user id from state
                        className="border border-green-600 text-green-400 hover:bg-green-900 px-6 py-2 rounded-full transition-all w-full"
                    >
                        View Orders
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;
