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

import { MainLayout, RequireAuth } from "./components/MainLayout";
import { BooksPage } from "./pages/Admin/BooksManagement";
import { UsersPage } from "./pages/Admin/UserManagement";
import { StaffManagement } from "./pages/Admin/StaffManagement";

import { Toaster } from "react-hot-toast";
import RedirectBasedOnRole from "./pages/RedirectBasedOnRole";
import StaffDashboard from "./pages/Staff/StaffDashBoard";
import UserOrderDetails from "./pages/Staff/UserOrderDetails";
import UserProfile from "./pages/UserProfile";
import { AuthContext } from "./context/AuthContext";

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
      { path: "staff", element: <StaffManagement /> },
      { path: "add-book", element: <AddBookForm /> },
      { path: "edit-book/:id", element: <EditBookForm /> },
    ],
  },

  {
    path: "/staff",
    element: <RequireAuth allowedRoles={["Staff"]} />,
    children: [
      { path: "", element: <StaffDashboard /> },
      { path: "users", element: <UsersPage /> },
      { path: "user-order-details", element: <UserOrderDetails /> },
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
