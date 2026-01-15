import CryptoJS from "crypto-js";

export const createSignature = (message) => {
  const secret = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q"; // Use env or default test secret
  const hmac = CryptoJS.HmacSHA256(message, secret);
  return CryptoJS.enc.Base64.stringify(hmac);
};

export const getEsewaConfig = () => {
  return {
    merchantId: process.env.ESEWA_MERCHANT_ID || "EPAYTEST",
    successUrl: process.env.SUCCESS_URL || "http://localhost:5173/payment-success",
    failureUrl: process.env.FAILURE_URL || "http://localhost:5173/payment-failure",
    esewaPaymentUrl: process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  };
};
