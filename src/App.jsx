import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import Login from "./pages/Login";
import Register from './pages/Register';
import { Whitelist } from "./pages/Whitelist";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { MainLayout, RequireAuth } from "./components/MainLayout";
import { BooksPage } from "./pages/Admin/BooksManagement";
import { UsersPage } from "./pages/Admin/UserManagement";
import { MembersPage } from "./pages/Staff/MembersManagement";
import AddBookForm from "./pages/Admin/AddBookForm";
import BookCatalog from "./pages/BookCatalog";
import OrdersPage from "./pages/MyOrders";
import BookDetails from "./pages/BookDetails";
import OrderDetails from "./pages/Staff/UserOrderDetails";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import EditBookForm from "./pages/Admin/EditBookForm";
import UserProfile from "./pages/UserProfile";
import OrderNotifications from "./pages/OrderNotifications";
import RedirectBasedOnRole from "./pages/RedirectBasedOnRole";
// import CataloguePage from "./pages/CataloguePage"; // Create this page too

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <RedirectBasedOnRole /> },
      { path: "home", element: <HomePage /> },
      { path: "catalog", element: <BookCatalog /> },
      { path: "bookdetails/:id", element: <BookDetails /> },

      {
        element: <RequireAuth allowedRoles={["Member"]} />,
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "whitelist", element: <Whitelist /> },
          { path: "myorders", element: <OrdersPage /> },
          { path: "orderdetails/:id", element: <OrderDetails /> },
          { path: "user-profile", element: <UserProfile /> },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <RequireAuth allowedRoles={["Admin"]} />,
    children: [
      { path: "", element: <BooksPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "add-book", element: <AddBookForm /> },
      { path: "edit-book/:id", element: <EditBookForm /> },
    ],
  },

  {
    path: "/staff",
    element: <RequireAuth allowedRoles={["Staff"]} />,
    children: [
      { path: "", element: <MembersPage /> },
      { path: "user-order-details", element: <OrderDetails /> },
    ],
  },
]);

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
};

export default App;