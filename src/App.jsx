import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
// import CataloguePage from "./pages/CataloguePage"; // Create this page too

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/catalogue" element={<CataloguePage />} /> */}
        <Route path="/cart" element={<CartPage />} />

      </Routes>
    </Router>
  );
}

export default App;
