import OrderCard from "@/components/OrderCard";
import axios from "axios";
import { useEffect, useState } from "react";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  const getUserOrders = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_URL}/api/order/myorder`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log("MY ORDERS RESPONSE:", res.data);
    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
  };
  useEffect(() => {
    getUserOrders();
  }, []);
  return <OrderCard userOrder={userOrder} />;
};

export default MyOrder;
