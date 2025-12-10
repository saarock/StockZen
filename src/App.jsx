import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "./Layout";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedPage from "./components/ProtectedPage";
import AddProduct from "./components/adminDashComponents/AddProduct";
import AdminDashboardLayout from "./AdminDashboardLayout";
import ProductManagePage from "./pages/admin/ProductManagePage";
import { Profile } from "./components";
import UserDashboardLayout from "./UserDashboardLayout";
import Products from "./pages/products/Products";
import ManageBookedProduct from "./pages/manageBookedProduct/ManageBookedProduct";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Main Layout */}
          <Route path="" element={<Layout />}>
            <Route
              path="/"
              index
              element={
                <ProtectedPage>
                  <HomePage />
                </ProtectedPage>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedPage>
                  <RegisterPage />{" "}
                </ProtectedPage>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedPage>
                  <LoginPage />{" "}
                </ProtectedPage>
              }
            />
            {/* <Route path="/products" element={<ProtectedPage><Products /> </ProtectedPage>} /> */}
            <Route
              path="*"
              element={
                <ProtectedPage>
                  <NotFound />{" "}
                </ProtectedPage>
              }
            />

            <Route path="/products" element={<ProtectedPage><Products /> </ProtectedPage>} />


          </Route>

          {/* Admin Dashboard layout */}

          <Route path="admin/dashboard" element={<AdminDashboardLayout />}>
            <Route
              path="add-product"
              index
              element={
                <ProtectedPage>
                  <AddProduct />
                </ProtectedPage>
              }
            />
            <Route
              path="manage-product"
              index
              element={
                <ProtectedPage>
                  <ProductManagePage />
                </ProtectedPage>
              }
            />
            <Route path='manage-booked-product' index element={<ProtectedPage><ManageBookedProduct /></ProtectedPage>} />

          </Route>

          {/* User Dashboard Layout */}
          <Route path="user/dashboard" element={<UserDashboardLayout />}>
            {/* <Route path="" index element={<ProtectedPage><UserDashPage /></ProtectedPage>} /> */}
            <Route
              path="profile"
              element={
                <ProtectedPage>
                  <Profile />
                </ProtectedPage>
              }
            />
            {/* <Route path="notifications" element={<ProtectedPage><Notificatoins /></ProtectedPage>} /> */}
            {/* <Route path="stats" element={<ProtectedPage><Stats /></ProtectedPage>} /> */}
            {/* <Route path="my-product" element={<ProtectedPage><MyProduct/></ProtectedPage>} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
