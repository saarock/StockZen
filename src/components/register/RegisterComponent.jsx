import React from "react";
import Button from "../button/Button";
import Input from "../input/Input";
import EntryComponent from "../entryComponent";
import "./registerComponent.css";

const RegisterComponent = ({
  register,
  onChangeFullName,
  onChangeUserName,
  onChangeEmail,
  onChangeConfrimPassword,
  onChangePassword,
  onChangePhoneNumber,
  goToBackPage
}) => {

  return (
    <>
     <div className="register-div">
      <form className="register-form" onSubmit={register}>
        <div className="register-title">Create a New Account</div>

        <Input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required={true}
          onChange={onChangeFullName}
        />
        <Input
          type="text"
          name="userName"
          placeholder="Username"
          required={true}
          onChange={onChangeUserName}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required={true}
          onChange={onChangeEmail}
        />
        <Input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          required={true}
          onChange={onChangePhoneNumber}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required={true}
          onChange={onChangeConfrimPassword}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required={true}
          onChange={onChangePassword}
        />

        <Button type="submit" className="register-button" text={"Register"} />
      </form>

      <EntryComponent />


    </div>
          <Button text={"Back"} onClick={goToBackPage} />
    </>
   
  );
};

export default RegisterComponent;
