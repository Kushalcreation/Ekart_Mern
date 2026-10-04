import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCart } from "./redux/productSlice";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUserOrder from "./pages/admin/ShowUserOrder";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/verify",
    element: (
      <>
        <Verify />
      </>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <>
        <VerifyEmail />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <>
        <ProtectedRoute />
        <Navbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products />
      </>
    ),
  },

  {
    path: "/products/:id",
    element: (
      <>
        <Navbar />
        <SingleProduct />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <>
        <ProtectedRoute>
          <Navbar />
          <Cart />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "sales",
        element: <AdminSales />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users/orders/:userId",
        element: <ShowUserOrder />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "users/:id",
        element: <UserInfo />,
      },
    ],
  },
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const cartRes = await axios.get("http://localhost:3000/api/cart", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (cartRes.data.success) {
            dispatch(setCart(cartRes.data.cart));
          }
        } catch (error) {
          console.log("Cart fetch error:", error);
        }
      }
    };

    fetchCart();
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
