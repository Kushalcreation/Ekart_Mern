import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { setProducts } from "@/redux/productSlice";
import { toast } from "sonner";
import axios from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline">Show Dialog</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  let filteredProducts = products.filter((product) => {
    return (
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (sortOrder === "lowTOHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.productPrice - b.productPrice,
    );
  }

  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.productPrice - a.productPrice,
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    // Add exisiting images public_ids

    const exisitingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("exisitingImages", JSON.stringify(exisitingImages));

    // Add new files
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });
    try {
      const res = await axios.put(
        `http://localhost:3000/api/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product updated successfully");
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updateProducts));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remaningProducts = products.filter(
        (product) => product._id !== productId,
      );
      const res = await axios.delete(
        `http://localhost:3000/api/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setProducts(remaningProducts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-10">
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="search Product..."
            className="w-[400px] items-center"
          />
          <Search className="absolute right-3 top-1 text-gray-300" />
        </div>
        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Sort By Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowTOHigh">Price: Low to High</SelectItem>
            <SelectItem value="highToLow">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredProducts.map((product, index) => {
        return (
          <Card key={index} className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <img
                  src={product.productImg[0].url}
                  alt=""
                  className="w-25 h-25 "
                />
                <h1 className="font-bold w-96 text-gray-700">
                  {product.productName}
                </h1>
              </div>
              <h1 className="font-semibold text-gray-800">
                ₹{product.productPrice}
              </h1>
              <div className="flex gap-3">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                    <Edit
                      onClick={() => {
                        (setOpen(true), setEditProduct(product));
                      }}
                      className="text-green-500 cursor-pointer"
                    />
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[625px] max-h-[740] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit product</DialogTitle>
                      <DialogDescription>
                        Make changes to your product here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                      <div className="grid gap-2">
                        <Label>Product Name</Label>
                        <Input
                          name="productName"
                          placeholder="EX-Iphone"
                          required
                          type="text"
                          value={editProduct?.productName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label>Price</Label>
                        <Input
                          name="productPrice"
                          required
                          value={editProduct?.productPrice}
                          onChange={handleChange}
                          type="number"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Brand</Label>
                          <Input
                            name="brand"
                            placeholder="EX-Apple"
                            required
                            type="text"
                            value={editProduct?.brand}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Input
                            name="category"
                            placeholder="EX-Mobile"
                            required
                            type="text"
                            value={editProduct?.category}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label>Description</Label>
                          <Textarea
                            name="productDesc"
                            placeholder="Enter brief description of product"
                            value={editProduct?.productDesc}
                            onChange={handleChange}
                          />
                        </div>
                        <ImageUpload
                          productData={editProduct}
                          setProductData={setEditProduct}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose
                        render={<Button variant="outline">Cancel</Button>}
                      />
                      <Button type="submit" onClick={handleSave}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger render={<Button variant="outline" />}>
                    <Trash2 className="text-red-500 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminProduct;
