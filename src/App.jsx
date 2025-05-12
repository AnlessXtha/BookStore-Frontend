import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import Login from "./pages/Login";
import Register from './pages/Register';
import { Whitelist } from "./pages/Whitelist";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import MainLayout from "./components/MainLayout";
import { AdminDashboard } from "./pages/Admin/AdminPanel";
import { BooksPage } from "./pages/Admin/BooksManagement";
import { UsersPage } from "./pages/Admin/UserManagement";
import { StaffManagement } from "./pages/Admin/StaffManagement";
import { AddBookForm } from "./pages/Admin/AddBookForm";
import BookCatalog from "./pages/BookCatalog";
import OrdersPage from "./pages/MyOrders";
import BookDetails from "./pages/BookDetails";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import OrderDetails from "./pages/Staff/UserOrderDetails";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import EditBookForm from "./pages/EditBookForm";
import UserProfile from "./pages/UserProfile";
import OrderNotifications from "./pages/OrderNotifications";
// import CataloguePage from "./pages/CataloguePage"; // Create this page too

function App() {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.roles?.includes("Admin");
  const isMember = currentUser?.roles?.includes("Member");
  const isStaff = currentUser?.roles?.includes("Staff");

  const withAuth = (element, isAllowed, errorMessage) => (
    <ProtectedRoute isAllowed={isAllowed} errorMessage={errorMessage}>
      {element}
    </ProtectedRoute>
  );

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
        { path: "", element: <HomePage /> },
        { path: "catalog", element: <BookCatalog /> },
        { path: "bookdetails/:id", element: <BookDetails /> },

        {
          path: "cart",
          element: withAuth(
            <CartPage />,
            isMember,
            "Login as a member to access your cart."
          ),
        },
        {
          path: "whitelist",
          element: withAuth(
            <Whitelist />,
            isMember,
            "Login as a member to access whitelist."
          ),
        },
        {
          path: "user-profile",
          element: withAuth(
            <UserProfile user={currentUser} />,
            isMember,
            "Login as a member to access profile."
          ),
        },
        {
          path: "myorders",
          element: withAuth(
            <OrdersPage />,
            isMember,
            "Login as a member to view your orders."
          ),
        },
         {
          path: "notifications",
          element: withAuth(
            <OrderNotifications />,
            isMember,
            "Login as a member to view your notifications."
          ),
        },
        {
          path: "orderdetails/:id",
          element: withAuth(
            <OrderDetails />,
            isMember,
            "Login as a member to view order details."
          ),
        },
        // {
        //   path: "addBook",
        //   element: withAuth(
        //     <AddBookForm />,
        //     isMember,
        //     "Only members can add books."
        //   ),
        // },
        // {
        //   path: "editBook/:id",
        //   element: withAuth(
        //     <EditBookForm />,
        //     isMember,
        //     "Only members can edit books."
        //   ),
        // },
      ],
    },
    {
      path: "/admin",
      children: [
        {
          path: "",
          element: withAuth(<AdminDashboard />, isAdmin, "Admin access only."),
        },
        {
          path: "books",
          element: withAuth(<BooksPage />, isAdmin, "Admin access only."),
        },
        {
          path: "staff",
          element: withAuth(<StaffManagement />, isAdmin, "Admin access only."),
        },
        {
          path: "add-book",
          element: withAuth(<AddBookForm />, isAdmin, "Admin access only."),
        },
        {
          path: "edit-book/:id",
          element: withAuth(<EditBookForm />, isAdmin, "Admin access only."),
        },
      ],
    },
    {
      path: "/staff",
      children: [
        {
          path: "",
          element: withAuth(<StaffDashboard />, isStaff, "Staff access only."),
        },
        {
          path: "users",
          element: withAuth(<UsersPage />, isStaff, "Staff access only."),
        },
        {
          path: "user-order-details",
          element: withAuth(<OrderDetails />, isStaff, "Staff access only."),
        },]
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
