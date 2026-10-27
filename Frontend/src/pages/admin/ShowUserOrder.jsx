import OrderCard from "@/components/OrderCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowUserOrder = () => {
  const params = useParams();
  const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await axios.get(
      `${import.meta.env.VITE_URL}/api/order/user-order/${params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="pl-[350px] py-20">
      <OrderCard userOrder={userOrder} />
    </div>
  );
};

export default ShowUserOrder;
