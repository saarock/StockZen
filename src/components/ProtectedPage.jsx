import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { Auth } from "../services";
import { login, setError, setLoading } from "../features/auth/authSlice";
import { ACCESS_TOKEN_COOKIE_NAME } from "../constant";
import LoadingComponent from "./loading/LoadingComponent";
import LocalStorage from "../utils/localStorage";
import { handleResponse } from "../utils";
import Cookie from "../utils/cookie";

const PUBLIC_ROUTES = ["/", "/login", "/register"]; // Define all public routes

const ProtectedPage = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Loading and Error states from auth slice
  const { loading, error } = auth;

  /**
   * run every time when the page mount;
   */

  const isPublicPage = PUBLIC_ROUTES.includes(location.pathname);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        dispatch(setLoading(true)); // Set loading state to true before the async operation
        const response = await handleResponse(Auth.verify());
        if (response.data?.userData) {
          const userStateResponseData = response.data.userData;
          LocalStorage.setItem("userData", userStateResponseData);
          const dupUserStateResponseData = {
            token: Cookie.get(ACCESS_TOKEN_COOKIE_NAME),
            ...userStateResponseData,
          };
          if (!auth.isAuthenticated) {
            dispatch(login(dupUserStateResponseData));
            /**
             * removed all the errors at the last
             */
            dispatch(setError(""));
            return;
          }
        }

        if (response.error) {
          dispatch(setError(response.error));
          throw new Error(response.error);
        }

        const userStateObj = {
          token: Cookie.get(ACCESS_TOKEN_COOKIE_NAME),
          ...LocalStorage.getItem("userData"),
        };

        if (!auth.isAuthenticated) {
          dispatch(login(userStateObj)); // Login user if not already authenticated
        }

        /**
         * removed all the errors at the last
         */
        dispatch(setError(""));
      } catch (error) {
        dispatch(setError(error.message)); // Handle error if caught
      } finally {
        dispatch(setLoading(false)); // Set loading state to false when the operation finishes
      }
    };

    verifyToken();
  }, [dispatch, auth.isAuthenticated]); // Only re-run effect if authentication state changes

  // Redirect if already authenticated and trying to access the login page
  useEffect(() => {
    if (auth.isAuthenticated && location.pathname === "/login") {
      if (auth?.user?.role === "admin") {
        navigate("/admin/dashboard/add-product");
      } else {
        navigate("/user/dashboard/profile");
      }
    }
  }, [auth, location]);

  useEffect(() => {
    if (
      auth?.user?.role === "admin" &&
      location.pathname.includes("/user/dashboard")
    ) {
      navigate("/");
    } else if (
      auth?.user?.role === "user" &&
      location.pathname.includes("/admin/dashboard")
    ) {
      alert("you are not admin");
      navigate("/");
    }
  }, [auth, location.pathname]);

  if (loading) {
    return <LoadingComponent />; // Show loading indicator
  }

  if (error && !isPublicPage) {
    return <div>Error: {error}</div>; // Display error message if error exists
  }

  return <>{children}</>; // Render children when everything is fine
};

export default ProtectedPage;
