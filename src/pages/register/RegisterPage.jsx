import React, { useState } from "react";
import { RegisterComponent, VerifyMailComponent } from "../../components";
import { Auth } from "../../services";
import { handleResponse } from "../../utils";
import { useDispatch } from "react-redux";
import { setError } from "../../features/auth/authSlice";
import "./registerPage.css";

const RegisterPage = () => {
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
    email: ""
  })

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

    if (isOtpSent) {
      await handleResponse(Auth.register(formData));
      navigator("/login")
      return;
    }


    e.preventDefault();
    console.log("Form Data:", formData);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    await sendMail(formData.email);

  } catch(error) {
    dispatch(setError(error.message));
  }
    
  };


  // function to handel the input change of hte otpInput
  const handelOtpInputChange = async (value) => {
    setOtpFormData((prevData) => ({
      ...prevData,
      otp: value,
      email: cacheEmail
    }));
  }


  // function sends the otp and email to get verified
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await handleResponse(Auth.verifyMail(otpFormData));      
      if (response.success) {
        register();
      } else {
        dispatch(setError(response.error));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }


  const goToPrevPage = () => {
    setIsOtpSent(false);
  }

  const goToBackPage = () =>{
    setIsOtpSent(true);
  }

  return (
    <div className="register-page">
      {isOtpSent ? (
        <VerifyMailComponent
         onChangeOtp={(e) => handelOtpInputChange(e.target.value)}
          onSubmitOtp={sendOtp}
          goToPrevPage={goToPrevPage}
           />
      ) : (
        <RegisterComponent
          register={register}
          onChangeFullName={(e) => handleInputChange("fullName", e.target.value)}
          onChangeUserName={(e) => handleInputChange("userName", e.target.value)}
          onChangeEmail={(e) => handleInputChange("email", e.target.value)}
          onChangePhoneNumber={(e) => handleInputChange("phoneNumber", e.target.value)}
          goToBackPage={goToBackPage}
          onChangeConfrimPassword={(e) =>
            handleInputChange("confirmPassword", e.target.value)
          }
          onChangePassword={(e) => handleInputChange("password", e.target.value)}
        />
      )}
    </div>
  );
};

export default RegisterPage;
