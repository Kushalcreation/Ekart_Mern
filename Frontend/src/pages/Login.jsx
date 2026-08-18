import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/Home");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login your account</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Jhon"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div> */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="w-5 h-5 cursor-pointer text-gray-600 absolute right-5 bottom-2"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="w-5 h-5 cursor-pointer text-gray-600 absolute right-5 bottom-2"
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Log In"
            )}
          </Button>
          <p>
            Not have an account ?{" "}
            <Link
              to={"/Signup"}
              className="hover:underline cursor-pointer text-pink-500"
            >
              Signup
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
