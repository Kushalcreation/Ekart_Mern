import axios from "axios";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin" ? true : false;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        localStorage.removeItem("accessToken");
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-pink-50 fixed w-full z-20 border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/* Logo Section */}
        <div>
          <img className="w-[100px]" src="/Ekart.png" alt="" />
        </div>
        {/* nav section */}
        <nav className="flex gap-10 justify-between items-center">
          <ul className="flex gap-7 items-center font-semibold text-xl">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/products"}>
              <li>Products</li>
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`}>
                <li> Hello,{user.firstName}</li>
              </Link>
            )}
            {admin && (
              <Link to={`/dashboard/sales`}>
                <li>DashBoard</li>
              </Link>
            )}
          </ul>
          <Link to={"/cart"} className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute -top-3 -right-5 px-2 text-white">
              {cart?.items?.length}
            </span>
          </Link>
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-pink-600 cursor-pointer text-white"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-gardient-to-tl from-blue-600 to bg-purple-600  cursor-pointer text-white"
            >
              LogIn
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
