import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { setError } from "../../features/auth/authSlice";
import { handleResponse } from "../../utils";
import { Auth } from "../../services";
import useTopLoader from "../../hooks/useTopLoader";
import useUser from "../../hooks/useUser";

// Import icons
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaSignOutAlt,
  FaPaintRoller,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logoutFromClientSide from "../../utils/logOut";

const Header = () => {
  const auth = useSelector((state) => state.auth);
  const { user } = useUser();
  const dispatch = useDispatch();
  const { topLoaderNumber } = useTopLoader();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const nav = [
    { id: "home", name: "Home", slug: "/", icon: <FaHome />, userActive: true },
    {
      id: "login",
      name: "Login",
      slug: "/login",
      icon: <FaSignInAlt />,
      userActive: !auth.isAuthenticated,
    },
    {
      id: "register",
      name: "Register",
      slug: "/register",
      icon: <FaUserPlus />,
      userActive: !auth.isAuthenticated,
    },
    {
      id: "products",
      name: "Products",
      slug: `/products`,
      icon: <FaPaintRoller />,
      userActive: auth.isAuthenticated,
    },
    {
      id: "dashboard",
      name: "Dashboard",
      slug: `${
        user?.role === "admin"
          ? "/admin/dashboard/add-product"
          : "/user/dashboard/profile"
      }`,
      icon: <FaTachometerAlt />,
      userActive: auth.isAuthenticated,
    },
    {
      id: "logout",
      name: "Logout",
      slug: "/logout",
      icon: <FaSignOutAlt />,
      userActive: auth.isAuthenticated,
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await handleResponse(
        Auth.logout({ user: localStorage.getItem("userData") })
      );
      if (response.error) logoutFromClientSide();
      logoutFromClientSide();
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prevState) => !prevState);
  };

  return (
    <>
      {/* Top Loader */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r z-50 transition-all duration-300 shadow-lg shadow-green-500/50"
        style={{ width: `${topLoaderNumber}%`, backgroundColor: "#1a1f5a" }}
      />

      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {/* <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#101540] to-blue-600 opacity-0 group-hover:opacity-100 blur transition duration-300" />
                <img
                  src="./images/org_logo.png"
                  alt="logo"
                  className="relative h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-[#101540] to-blue-600 bg-clip-text text-transparent">
                Inventory System
              </span> */}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {nav.map(
                (link) =>
                  link.userActive &&
                  (link.id === "logout" ? (
                    <button
                      key={link.id}
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#101540] transition-all duration-200 hover:bg-gray-100 rounded-lg group"
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {link.icon}
                      </span>
                      {link.name}
                    </button>
                  ) : (
                    <NavLink
                      key={link.id}
                      to={link.slug}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                          isActive
                            ? "bg-[#101540] text-white shadow-lg shadow-[#101540]/30"
                            : "text-gray-700 hover:text-[#101540] hover:bg-gray-100"
                        }`
                      }
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {link.icon}
                      </span>
                      {link.name}
                    </NavLink>
                  ))
              )}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileNav}
              className="md:hidden relative z-50 p-2 text-gray-700 hover:text-[#101540] hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl z-40 transition-all duration-300 ${
            isMobileNavOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {nav.map(
              (link) =>
                link.userActive &&
                (link.id === "logout" ? (
                  <button
                    key={link.id}
                    onClick={() => {
                      handleLogout();
                      setIsMobileNavOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-[#101540] transition-all duration-200 hover:bg-gray-100 rounded-lg group"
                  >
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      {link.icon}
                    </span>
                    {link.name}
                  </button>
                ) : (
                  <NavLink
                    key={link.id}
                    to={link.slug}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg group ${
                        isActive
                          ? "bg-[#101540] text-white shadow-lg shadow-[#101540]/30"
                          : "text-gray-700 hover:text-[#101540] hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      {link.icon}
                    </span>
                    {link.name}
                  </NavLink>
                ))
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
