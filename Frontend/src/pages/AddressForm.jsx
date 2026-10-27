import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  deleteAddress,
  setAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const {
    cart,
    addresses = [],
    selectedAddress,
  } = useSelector((store) => store.product);

  const [showForm, setShowForm] = useState(addresses.length === 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(setAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  // const handlePayment = async () => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   try {
  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_URL}/api/order/create-order`,
  //       {
  //         products:cart?.items?.map((item) => ({
  //           productId: item.productId._id,
  //           quantity: item.quantity,
  //         })),
  //         tax,
  //         shipping,
  //         amount: total,
  //         currency: "INR",
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       },
  //     );
  //     if (!data.success) return toast.error("Something went wrong");

  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: data.order.amount,
  //       currency: data.order.currency,
  //       order_id: data.order.id, // order ID from backend
  //       name: "Ekart",
  //       description: "Order Payment",

  //       handler: async function (response) {
  //         try {
  //           const verifyes = await axios.post(
  //             `${import.meta.env.VITE_URL}/api/order/verify-payment`,
  //             response,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${accessToken}`,
  //               },
  //             },
  //           );
  //           if (verifyes.data.success) {
  //             toast.success("Payment Successful");
  //             dispatch(setCart({ items: [], totalPrice: 0 }));
  //             navigate("/order-success");
  //           } else {
  //             toast.error("❌ Payment verification failed");
  //           }
  //         } catch (error) {
  //            console.error(
  //           "Verification error:",
  //           error.response?.data || error.message
  //         );
  //           toast.error("Error Verifying Payment");
  //         }
  //       },
  //       modal: {
  //         ondismiss: async function () {
  //           //Handle user closing the popup
  //           await axios.post(
  //             `${import.meta.env.VITE_URL}/api/order/verify-payment`,
  //             {
  //               razorpay_order_id: data.order.id,
  //               paymentFailed: true,
  //             },
  //             {
  //               headers: { Authorization: `Bearer ${accessToken}` },
  //             },
  //           );
  //           toast.error("Payment cancelled or failed");
  //         },
  //       },
  //       prefill: {
  //         name: formData.fullName,
  //         email: formData.email,
  //         contact: formData.phone,
  //       },
  //       theme: { color: "#F472B6" },
  //     };

  //     const rzp = new window.Razorpay(options);

  //     rzp.on("payment.failed", async function (response) {
  //       try {
  //         await axios.post(
  //           `${import.meta.env.VITE_URL}/api/order/verify-payment`,
  //           {
  //             razorpay_order_id: data.order.id,
  //             paymentFailed: true,
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //             },
  //           },
  //         );

  //         toast.error("Payment failed. Please try again.");
  //       } catch (error) {
  //         console.error("Failed to update order status:", error);
  //         toast.error("Unable to update payment status");
  //       }
  //     });

  //     rzp.open();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong whilw processing payment");
  //   }
  // };

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/order/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!data.success) {
        return toast.error("Unable to create order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Ekart",
        description: "Order Payment",

        handler: async function (response) {
          try {
            const { data: verifyData } = await axios.post(
              `${import.meta.env.VITE_URL}/api/order/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (verifyData.success) {
              toast.success("Payment successful");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error(
              "Verification error:",
              error.response?.data || error.message,
            );
            toast.error(
              "Payment verification failed. Please check your order status.",
            );
          }
        },

        modal: {
          ondismiss: function () {
            // Closing the modal does not prove payment failure.
            toast.info("Payment window closed");
          },
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#F472B6",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment failure:", response.error?.description);

        toast.error(
          response.error?.description || "Payment failed. Please try again.",
        );

        // Do not call verify-payment with paymentFailed: true.
        // Check the actual payment status with Razorpay on the backend
        // before marking an order as Failed.
      });

      rzp.open();
    } catch (error) {
      console.error(
        "Create order error:",
        error.response?.data || error.message,
      );
      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <div className="space-y-4 p-6 bg-white rounded-lg">
          {showForm ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 Street Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Kolkata"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="West Bengal"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="700001"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button onClick={handleSave} type="submit" className="w-full">
                Save & Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>

              {addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => dispatch(setSelectedAddress(index))}
                  className={`border p-4 rounded-md cursor-pointer relative ${
                    selectedAddress === index
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-300"
                  }`}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>
                  <p>
                    {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                    {addr.country}
                  </p>

                  <button
                    type="button"
                    onClick={() => dispatch(deleteAddress(index))}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="w-full"
              >
                + Add New Address
              </Button>
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full bg-pink-600"
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>
        {/* Right side order summary */}

        <div>
          <Card className="w-100">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>SubTotal ({cart.items.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className="text-sm text-muted-foreground pt-4">
                <p>* Free Shipping on orders over 299</p>
                <p>* 30 days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
