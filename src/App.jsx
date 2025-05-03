import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import Login from "./pages/Login";
import Register from './pages/Register';
import { Whitelist } from "./pages/Whitelist";
import { Toaster } from "react-hot-toast";
// import CataloguePage from "./pages/CataloguePage"; // Create this page too

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/catalogue" element={<CataloguePage />} /> */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/whitelist" element={<Whitelist />} />
      </Routes>
    </Router>
  );
}

export default App;
