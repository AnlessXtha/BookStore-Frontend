// App.jsx
import React, { useContext } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Whitelist } from "./pages/Whitelist";
import { CartPage } from "./pages/CartPage";
import OrdersPage from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import BookDetails from "./pages/BookDetails";
import BookCatalog from "./pages/BookCatalog";
import AddBookForm from "./pages/AddBookForm";
import EditBookForm from "./pages/EditBookForm";

import MainLayout from "./components/MainLayout";
import { AdminDashboard } from "./pages/Admin/AdminPanel";
import { BooksPage } from "./pages/Admin/BooksManagement";
import { UsersPage } from "./pages/Admin/UserManagement";
import { StaffManagement } from "./pages/Admin/StaffManagement";

import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.roles?.includes("Admin");
  const isMember = currentUser?.roles?.includes("Member");

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
          path: "myorders",
          element: withAuth(
            <OrdersPage />,
            isMember,
            "Login as a member to view your orders."
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
          path: "users",
          element: withAuth(<UsersPage />, isAdmin, "Admin access only."),
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
};

export default App;
