import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./components/Footer";

const router = createBrowserRouter([
  {
    path: "/Home",
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
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
