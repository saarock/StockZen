import React, { useEffect, useState } from 'react'
import LoginComponent from '../../components/login/LoginComponent'
import { Cookie, handleResponse, LocalStorage } from '../../utils';
import Auth from '../../services/Auth';
import { useDispatch, useSelector } from "react-redux";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../../constant';
import { login } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [userLoginFormData, setUserLoginFormData] = useState({
    email: "",
    userName: "",
    password: "",
  });

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();


  // useEffect(() => {
  //   ; (() => {
  //     if (auth.isAuthenticated) {
  //       navigate("/dash");
  //     }
  //   })();
  // }, [auth]);



  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,

    }))
  }

  const signIn = async (e) => {
    e.preventDefault();
    console.log(userLoginFormData);

    try {
      const response = await handleResponse(Auth.login(userLoginFormData));
      if (response.error) {
        toast.error(response.error)
        return;
      }

      const { refreshToken, accessToken, userWithoutSensativeData } = response.data;


      Cookie.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, 1);
      Cookie.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, 10);
      LocalStorage.setItem("userData", userWithoutSensativeData);


      const user = { token: accessToken, ...userWithoutSensativeData };
      dispatch(login(user));
      if (user.role === "admin") {
        navigate("admin/dashboard/add-product");
      } else {
   
        navigate("/products");
      }


    } catch (error) {
      toast.error(error.message);

    }

  }
  return (
    <div className='login-container'>
      <LoginComponent onSubmit={signIn} onChange={onInputChange} />
    </div>
  )
}



export default LoginPage