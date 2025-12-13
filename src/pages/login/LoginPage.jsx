import { useState } from "react";
import LoginComponent from "../../components/login/login";
import EntryComponent from "../../components/entryComponent";
import "./LoginPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../../constant";
import { Auth } from "../../services";
import { toast } from "react-toastify";
import { handleResponse } from "../../utils";
import Cookie from "../../utils/cookie";
import LocalStorage from "../../utils/localStorage";
import { login } from "../../features/auth/authSlice";

const LoginPage = () => {
  const [userLoginFormData, setUserLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await handleResponse(Auth.login(userLoginFormData));
      if (response.error) {
        toast.error(response.error);
        return;
      }

      const { refreshToken, accessToken, userWithoutSensativeData } =
        response.data;

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <div className="login-content">
          <div className="login-left">
            <LoginComponent onSubmit={signIn} onChange={onInputChange} loading={loading} />
          </div>
          <div className="login-right">
            <EntryComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
