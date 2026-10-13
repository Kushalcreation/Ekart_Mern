const Product = require("../models/productModel.js");
const cloudinary = require("../services/cloudinary.js");
const getDataUri = require("../utils/dataUri");

const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(500).json({
        success: false,
        message: "All filds required",
      });
    }

    //Handle multiple image uplaod
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    //create a product in db
    const newProduct = await Product.create({
      userId,
      productName,
      productPrice,
      productDesc,
      category,
      brand,
      productImg,
    });

    return res.status(200).json({
      success: true,
      message: "Product added Successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No products available",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAllProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    // Delete image from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }
    //delete img from MongoDb
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      exisitingImages,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [];

    // Keep selected existing images
    if (exisitingImages) {
      const keepIds = JSON.parse(exisitingImages);

      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );

      // Delete removed images from Cloudinary
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );

      for (const img of removedImages) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    } else {
      // Keep all existing images if field is not sent
      updatedImages = [...product.productImg];
    }

    // Upload new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "ekart_products",
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // Update product fields
    if (productName !== undefined) {
      product.productName = productName;
    }

    if (productDesc !== undefined) {
      product.productDesc = productDesc;
    }

    if (productPrice !== undefined && productPrice !== "") {
      product.productPrice = Number(productPrice);
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (brand !== undefined) {
      product.brand = brand;
    }

    product.productImg = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProduct,
  deleteAllProduct,
  updateProduct,
};
