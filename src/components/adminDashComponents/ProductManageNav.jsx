import React from 'react';
import "./AdminComp.css";

const ProductManageNav = ({ setWhatUserWant, userWant }) => {
    return (
        <nav className="pdtM-product-manage-nav">
            <ul className="pdtM-nav-list">
                <li
                    className={`pdtM-nav-item ${userWant === "2" ? "active" : ""}`}
                    onClick={() => setWhatUserWant("2")}
                >
                    <span className="pdtM-nav-text">Show All Products</span>
                </li>
                <li
                    className={`pdtM-nav-item ${userWant === "0" ? "active" : ""}`}
                    onClick={() => setWhatUserWant("0")}
                >
                    <span className="pdtM-nav-text">Show Disabled Products</span>
                </li>
                <li
                    className={`pdtM-nav-item ${userWant === "1" ? "active" : ""}`}
                    onClick={() => setWhatUserWant("1")}
                >
                    <span className="pdtM-nav-text">Show Available Products</span>
                </li>
            </ul>
        </nav>
    );
};

export default ProductManageNav;
