import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = true;
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
            {user && <Link to={"/profile"}>Hello User</Link>}
          </ul>
          <Link to={"/cart"} className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute -top-3 -right-5 px-2 text-white">
              0
            </span>
          </Link>
          {user ? (
            <Button className="bg-pink-600 cursor-pointer text-white">
              Logout
            </Button>
          ) : (
            <Button className="bg-gardient-to-tl from-blue-600 to bg-purple-600  cursor-pointer text-white">
              LogIn
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
