import React, { useState } from "react";
import { RegisterComponent, VerifyMailComponent } from "../../components";
import { Auth } from "../../services";
import { handleResponse } from "../../utils";
import { useDispatch } from "react-redux";
import { setError } from "../../features/auth/authSlice";
import "./registerPage.css";
import EntryComponent from "../../components/entryComponent";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { registerSchema } from "../../schemas/authSchema"; // Import Zod schema

const RegisterPage = () => {
  const [loadingRegsiter, setLoadingRegister] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "", // Ensure this is in initial state
    password: "",
    confirmPassword: "",
  });

  const [otpFormData, setOtpFormData] = useState({
    otp: "",
    email: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [cacheEmail, setCacheEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkStrength = (pass) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 7) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const handleInputChange = (name, value) => {
    if (name === 'password') {
      setPasswordStrength(checkStrength(value));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendMail = async (email) => {
    try {
      const response = await handleResponse(Auth.sendMail(email));
      if (response.success) {
        setCacheEmail(email);
        setIsOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        dispatch(setError(response.error));
        toast.error(response.error);
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
    }
  };

  // Initial Registration Step (Validate & Send OTP)
  const register = async (e) => {
    e.preventDefault();
    setLoadingRegister(true);

    try {
      // 1. Validate Form Data with Zod
      console.log("Validating FormData:", formData);
      const result = registerSchema.safeParse(formData);
      console.log("Validation Result:", result);

      if (!result.success) {
        // Safe access to errors (support z.ZodError structure)
        const errors = result.error?.errors || result.error?.issues || [];

        if (errors.length > 0) {
          const errorMessages = errors.map(err => err.message).join("\n");
          toast.error(errorMessages);
          dispatch(setError(errors[0].message));
        } else {
          // Fallback for unknown validation structure
          toast.error("Validation failed. Please check your data.");
        }
        return;
      }

      console.log("Form Data Validated:", formData);

      // 2. If valid, send OTP
      await sendMail(formData.email);

    } catch (error) {
      console.error("Registration Error:", error);
      dispatch(setError(error.message));
      toast.error(`Error: ${error.message || "An unexpected error occurred."}`);
    } finally {
      setLoadingRegister(false);
    }
  };

  const handelOtpInputChange = async (value) => {
    setOtpFormData((prevData) => ({
      ...prevData,
      otp: value,
      email: cacheEmail,
    }));
  };

  // Final Registration Step (Verify OTP & Create User)
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoadingOTP(true);

    try {
      // Step 1: Verify OTP
      const otpResponse = await handleResponse(Auth.verifyMail(otpFormData));

      if (!otpResponse.success) {
        toast.error(otpResponse.error || "Invalid OTP");
        return;
      }

      // Step 2: Register the user account (Backend will create user)
      // Note: We send the original formData which contains the user details
      const registerResponse = await handleResponse(Auth.register(formData));

      if (!registerResponse.success) {
        toast.error(registerResponse.error || "Registration failed");
        // If registration fails but OTP was correct, we might want to stay on OTP page or go back?
        // Usually, if OTP is correct but register fails (e.g. email taken race condition), we should go back.
        // But let's keep it simple.
        setIsOtpSent(false); // Go back to fix form if needed
        return;
      }

      // Registration successful
      toast.success("Registration successful! Please login.");
      navigate("/login");

    } catch (error) {
      toast.error(error.message);
      dispatch(setError(error.message));
    } finally {
      setLoadingOTP(false);
    }
  };

  const goToPrevPage = () => {
    setIsOtpSent(false);
  };

  const goToBackPage = () => {
    // This seems to refer to going back from Register to Login or similar, 
    // but in RegisterComponent it might be used to navigate away.
    // Based on original code, it set isOtpSent which is confusing. 
    // I will assume it means "Cancel" or "Go to Login"
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center wrap">
          {/* Left Panel - Form Section */}
          <div className="order-2 lg:order-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              {isOtpSent ? (
                <VerifyMailComponent
                  onChangeOtp={(e) => handelOtpInputChange(e.target.value)}
                  onSubmitOtp={sendOtp}
                  goToPrevPage={goToPrevPage}
                  loading={loadingOTP}
                />
              ) : (
                <RegisterComponent
                  register={register}
                  onChangeFullName={(e) => handleInputChange("fullName", e.target.value)}
                  onChangeUserName={(e) => handleInputChange("userName", e.target.value)}
                  onChangeEmail={(e) => handleInputChange("email", e.target.value)}
                  onChangePhoneNumber={(e) => handleInputChange("phoneNumber", e.target.value)}
                  goToBackPage={goToBackPage}
                  onChangeConfrimPassword={(e) => handleInputChange("confirmPassword", e.target.value)}
                  onChangePassword={(e) => handleInputChange("password", e.target.value)}
                  loading={loadingRegsiter}
                  passwordStrength={passwordStrength}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Entry Component */}
          <div className="order">
            <EntryComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
