import React, { useEffect, useState } from "react";
import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector((store) => store.product);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const product =
    products.find((item) => item._id === productId) ||
    (fetchedProduct?._id === productId ? fetchedProduct : null);

  useEffect(() => {
    if (products.some((item) => item._id === productId)) {
      setFetchedProduct(null);
      setError("");
      setLoading(false);
      return;
    }

    let isCurrentRequest = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          "http://localhost:3000/api/product/getallproducts",
        );
        if (!isCurrentRequest) return;

        const matchingProduct = res.data.products?.find(
          (item) => item._id === productId,
        );

        if (!matchingProduct) {
          setError("Product not found.");
          return;
        }
        setFetchedProduct(matchingProduct);
      } catch (error) {
        if (isCurrentRequest) {
          toast.error(
            error.response?.data?.message || "Unable to fetch product",
          );
          setError("Unable to load this product.");
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isCurrentRequest = false;
    };
  }, [products, productId]);

  return (
    <div className="pt-20 py-10 max-w-7xl mx-auto">
      {product ? (
        <>
          <Breadcrums product={product} />
          <div className="mt-10 grid grid-cols-2 items-center">
            <ProductImg images={product.productImg || []} />
            <ProductDesc product={product} />
          </div>
        </>
      ) : (
        <p>{loading ? "Loading product..." : error || "Product not found."}</p>
      )}
    </div>
  );
};

export default SingleProduct;
