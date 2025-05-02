import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import Login from "./pages/Login";
import Register from './pages/Register';
// import CataloguePage from "./pages/CataloguePage"; // Create this page too

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/catalogue" element={<CataloguePage />} /> */}
        <Route path="/cart" element={<CartPage />} />

      </Routes>
    </Router>
  );
}

export default App;
