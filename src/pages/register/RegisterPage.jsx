
import React, { useState } from "react";
import { RegisterComponent, VerifyMailComponent } from "../../components";
import { Auth } from "../../services";
import { handleResponse } from "../../utils";
import { useDispatch } from "react-redux";
import { setError, setLoading } from "../../features/auth/authSlice";
import "./registerPage.css";
import EntryComponent from "../../components/entryComponent";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const RegisterPage = () => {

  const [loadingRegsiter, setLoadingRegister] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const navigate = useNavigate();


  // hooks  starts
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otpFormData, setOtpFormData] = useState({
    otp: "",
    email: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [cacheEmail, setCacheEmail] = useState("");

  // hooks ends

  // function to handel the input change of the resgister form
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // function to send the mail and get otp
  const sendMail = async (email) => {
    try {
      const response = await handleResponse(Auth.sendMail(email));
      if (response.success) {
        setCacheEmail(email);
        setIsOtpSent(true);
      } else {
        dispatch(setError(response.error));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  // function to register after all the things are successfully processed
  const register = async (e) => {
    try {
      setLoadingRegister(true)
      if (isOtpSent) {
        // alert()
        const response = await handleResponse(Auth.register(formData));
        console.log(response);

        if (response.success) {
          navigate("/login");
          return;
        } else {
          toast.error(response.error);
          goToPrevPage()
        }
      }

      e.preventDefault();
      console.log("Form Data:", formData);

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      await sendMail(formData.email);
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setLoadingRegister(false)
    }
  };

  // function to handel the input change of hte otpInput
  const handelOtpInputChange = async (value) => {
    setOtpFormData((prevData) => ({
      ...prevData,
      otp: value,
      email: cacheEmail,
    }));
  };

  // function sends the otp and email to get verified
  const sendOtp = async (e) => {
    setLoadingOTP(true);
    e.preventDefault();
    try {
      // Step 1: Verify OTP
      const otpResponse = await handleResponse(Auth.verifyMail(otpFormData));

      if (!otpResponse.success) {
        toast.error(otpResponse.error);
        dispatch(setError(otpResponse.error));
        return;
      }

      // Step 2: Register the user account
      const registerResponse = await handleResponse(Auth.register(formData));

      if (!registerResponse.success) {
        toast.error(registerResponse.error);
        goToPrevPage();
        return;
      }

      // Registration successful - navigate to login page
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
    setIsOtpSent(true);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 md:p-8">
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
                  onChangeFullName={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  onChangeUserName={(e) =>
                    handleInputChange("userName", e.target.value)
                  }
                  onChangeEmail={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  onChangePhoneNumber={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  goToBackPage={goToBackPage}
                  onChangeConfrimPassword={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  onChangePassword={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  loading={loadingRegsiter}
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
