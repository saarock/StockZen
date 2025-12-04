import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "./Layout";
import RegisterPage from "./pages/register/RegisterPage";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Main Layout */}
          <Route path="" element={<Layout />}>
            <Route path="/" index element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
