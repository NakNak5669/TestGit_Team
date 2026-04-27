import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },

      // ✅ protect checkout (must login)
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      { path: "/profile", element: <Profile /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;