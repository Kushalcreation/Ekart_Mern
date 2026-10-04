import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";

const ProductDesc = ({ product }) => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product added to Cart Successfully");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl text-gray-800">
        {product.productName}
      </h1>
      <p className="text-gray-800">
        {product.category} | {product.brand}
      </p>
      <h2 className="text-pinl-500 font-bold text-2xl">
        {" "}
        ₹{product.productPrice}
      </h2>
      <p className="line-clamp-12 text-muted-foreground">
        {product.productDesc}
      </p>
      <div className="flex gap-2 items-center w-[300px]">
        <p className="text-gray-800 font-semibold">Quantity:</p>
        <input type="number" className="w-8" defaultValue={1} />
      </div>
      <Button
        onClick={() => addToCart(product._id)}
        className="bg-pink-600 w-max"
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductDesc;
