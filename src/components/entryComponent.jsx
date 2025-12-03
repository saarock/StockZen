import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import './entry.css';


const EntryComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.pathname === '/login'); // Set initial state based on URL

    // Update the state whenever the location changes (page navigation)
    useEffect(() => {
        setIsLogin(location.pathname === '/login');
    }, [location]);

    // Handle navigation based on the current form state (Login or Signup)
    const handleNavigation = () => {
        if (isLogin) {
            navigate('/register'); // Navigate to the signup page if the user is on login page
        } else {
            navigate('/login'); // Navigate to the login page if the user is on signup page
        }
    };

    return (
        <div className="entry-container">
            <div className="entry-title">{isLogin ? "New here?" : "Already a member?"}</div>
            <div className="entry-subtitle">
                {isLogin
                    ? "Signup and discover a great amount of new opportunities."
                    : "Login and continue where you left off."}
            </div>
            <div className="entry-toggle" onClick={handleNavigation}>
                {isLogin ? "Register" : "Login"}
            </div>
            <div className="invertory-image">
                <img src = {`./images/in.png`} alt="Inventory" className="entry-image" width={500} height={500}/>
            </div>
        </div>
    );
};

export default EntryComponent;
