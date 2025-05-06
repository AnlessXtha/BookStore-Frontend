import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Whitelist } from "./pages/Whitelist";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/MainLayout";
import BookCatalog from "./pages/BookCatalog";
import BookDetails from "./pages/BookDetails";
import AddBookForm from "./pages/AddBookForm";

function App() {
  return (
    <>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/whitelist" element={<Whitelist />} />
            <Route path="/catalogue" element={<BookCatalog />} />
            <Route path="/bookdetails/:id" element={<BookDetails />} />
            <Route path="/addBook" element={<AddBookForm />} />
          </Route>

          {/* Routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
