import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-red-500/30">
                <div className="flex justify-center mb-4">
                    <span className="text-6xl text-red-500">✕</span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-red-400">Payment Failed</h2>
                <p className="text-gray-400 mb-6">Something went wrong with your transaction. Please try again.</p>

                <button
                    onClick={() => navigate("/products")}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all w-full"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;
