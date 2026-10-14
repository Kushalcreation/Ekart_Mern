import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import UserLogo from "../../assets/no_user.png";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await axios.get("http://localhost:3000/api/user/all-user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="pl-[350px] py-20 pr-20 mx-auto px-4">
      <h1 className="text-center font-bold text-2xl">USER MANAGER</h1>
      <p>View and manage registered Users</p>
      <div className="flex relative w-[300px] mt-6">
        <Search className="absolute left-2 top-1 text-gray-600 w-5" />
        <Input className="pl-10" placeholder="Search Users" />
      </div>
      <div className="grid grid-cols-3 gap-7 mt-7">
        {users.map((user, index) => {
          return (
            <div key={index} className="bg-pink-100 p-5 rounded-lg ">
              <div className="flex items-center gap-2">
                <img
                  src={user?.profilePic || UserLogo}
                  alt=""
                  className="rounded-full w-16 aspect-square object-cover border border-pink-600"
                />
                <div>
                  <h1 className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <h3>{user?.email}</h3>
                </div>
              </div>
              <div className="mt-3 gap-3 flex">
                <Button>
                  <Edit />
                  Edit
                </Button>
                <Button>
                  <Eye />
                  Show Order
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
