import { useState } from "react";
import Input from "../input/Input";
import Button from "../button/Button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./loginComponent.css";

const LoginComponent = ({ onChange, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-component">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to access your account</p>

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                onChange={onChange}
                required
              />
              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <Button text="Login" className="login-btn" />
        </form>

        <p className="login-terms">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
