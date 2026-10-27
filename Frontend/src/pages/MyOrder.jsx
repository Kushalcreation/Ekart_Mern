import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  // const getUserOrders = async () => {
  //   const res = await axios.get(
  //     `${import.meta.env.VITE_URL}/api/order/myorder`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     },
  //   );
  //   console.log("MY ORDERS RESPONSE:", res.data);
  //   if (res.data.success) {
  //     setUserOrder(res.data.orders);
  //   }
  // };

  const getUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/order/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("MY ORDERS RESPONSE:", res.data);
      setUserOrder(res.data.orders ?? []);
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("SERVER RESPONSE:", error.response?.data);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);
  return (
    <div className="pr-20 flex flex-col gap-3">
      <div className="w-full p-6">
        <div className="flex items-center  gap-4 mb-6">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />{" "}
          </Button>
          <h1 className="text-2xl fi=ont-bold">Orders</h1>
        </div>
        {userOrder?.length === 0 ? (
          <p className="text-gray-800 space-y-6 text-2xl">
            No Orders found for this user
          </p>
        ) : (
          <div className="space-y-6 w-full">
            {userOrder.map((order) => (
              <div
                key={order._id}
                className="shadow-lg rounded-2xl p-5 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Order ID: <span className="text-gray-600">{order._id}</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Amount:{" "}
                    <span className="font-bold">
                      {order.currency} {order.amount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
