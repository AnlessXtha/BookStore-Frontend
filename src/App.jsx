import React, { useContext } from "react";
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
import { AdminDashboard } from "./pages/Admin/AdminPanel";
import { BooksPage } from "./pages/Admin/BooksManagement";
import { UsersPage } from "./pages/Admin/UserManagement";
import { StaffManagement } from "./pages/Admin/StaffManagement";
import AddBookForm from "./pages/AddBookForm";
import EditBookForm from "./pages/EditBookForm";
import BookCatalog from "./pages/BookCatalog";
import OrdersPage from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import BookDetails from "./pages/BookDetails";
import { AuthContext } from "./context/AuthContext";
// import CataloguePage from "./pages/CataloguePage"; // Create this page too

function App() {
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser, "currentUser");

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
            <Route path="/catalog" element={<BookCatalog />} />
            <Route path="/bookdetails/:id" element={<BookDetails />} />
            <Route path="/addBook" element={<AddBookForm />} />
            <Route path="/editBook/:id" element={<EditBookForm />} />
            <Route path="/myorders" element={<OrdersPage />} />
            <Route path="/orderdetails/:id" element={<OrderDetails />} />
          </Route>

          {/* Routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<BooksPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/add-book" element={<AddBookForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
