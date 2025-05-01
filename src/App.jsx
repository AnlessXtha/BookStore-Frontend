import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
// import CataloguePage from "./pages/CataloguePage"; // Create this page too

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/catalogue" element={<CataloguePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
