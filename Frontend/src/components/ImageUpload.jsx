import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const ImageUpload = ({ productData, setProductData }) => {
  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files || []);
    setProductData((prev) => ({
      ...prev,
      productImg: [...prev.productImg, ...selectedImages],
    }));
    event.target.value = "";
  };

  return (
    <div className="grid gap-2">
      <Label>Product Image</Label>
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      <Button type="button" variant="outline">
        <label htmlFor="file-upload" className="cursor-pointer">
          Uplaod Images
        </label>
      </Button>

      {productData.productImg.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {productData.productImg.map((file, idx) => {
            let preview;
            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card key={idx} className="relative group overflow-hidden">
                <CardContent>
                  <img
                    src={preview}
                    alt={`Product image ${idx + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  {/* remove button  */}
                  <button className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover: opacity-100 transaction">
                    <X sixe={14} />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
