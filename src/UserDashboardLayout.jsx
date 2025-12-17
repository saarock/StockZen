import React from "react";
import { Outlet } from "react-router-dom";
import UserDashBoardNav from "./components/userDashBoardNav/UserDashBoardNav";
import Header from "./components/header/header";
import Footer from "./components/footer/footer.jsx";
import { ToastContainer } from "react-toastify";

const UserDashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Header />
      <ToastContainer />
      <div className="adminDashContainer flex relative">
       <div className="sticky top-0 z-50">
        <UserDashBoardNav />
        </div> 
        <div className="dashboard-content w-full">
          <Outlet />{" "}
          {/* This will render the specific dashboard page content */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboardLayout;
