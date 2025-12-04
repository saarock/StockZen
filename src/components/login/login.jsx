import React, { useState } from 'react';
import Input from '../input/Input';
import Button from '../button/Button';

import EntryComponent from '../entryComponent';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const LoginComponent = ({ onChange, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className='login-div'>
      <form onSubmit={onSubmit} className='login-div-form'>
        <div className='login-title'>Login to your Account</div>

        <Input type="email" name="email" placeholder="Email" onChange={onChange} />

        {/* Password input with eye icon inside a relative wrapper */}
        <div className="password-wrapper">
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={onChange}
          />
          <span className="eye-icon" onClick={togglePassword}>
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </span>
        </div>

        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <Button text="Login" />
      </form>

      <EntryComponent />
    </div>
  );
};

export default LoginComponent;
