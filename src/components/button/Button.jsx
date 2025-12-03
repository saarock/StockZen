import React from 'react';
import "./button.css";


const Button = ({
    className,
    text,
    onClick
}) => {
  return (
    <button onClick={onClick} className={`${className} button`}>{text}</button>
  )
};




export default Button;