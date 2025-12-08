import React from 'react';
import { Outlet } from 'react-router-dom';
import UserDashBoardNav from './components/userDashBoardNav/UserDashBoardNav';
import Header from './components/header/header';
import Footer from './components/footer/footer';


const UserDashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="userDashContainer flex justify-center items-center">
      <UserDashBoardNav/>
      <div className=" w-full">
        <Outlet /> {/* This will render the specific dashboard page content */}
      </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserDashboardLayout;
