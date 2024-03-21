import { nanoid } from "nanoid";
import Product from "../../../DB/models/product.model.js";
import Category from "../../../DB/models/category.model.js";
import Subcategory from "../../../DB/models/subcategory.model.js";
import Brand from "../../../DB/models/brand.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const create = async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("Invalid category"));
  const subCategory = await Subcategory.findById(req.body.subCategory);
  if (!subCategory) return next(new Error("Invalid subcategory"));
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("Invalid brand"));
  const createdBy = req.user.id;
  const imgsFolder = nanoid();
  if (!req.files.defaultImg)
    return next(
      new Error("You must provide an image to the product", { cause: 400 })
    );
  const imgs = [];
  if (req.files.imgs) {
    for (const file of req.files.imgs) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.cloud_folder}/product/${imgsFolder}`,
        }
      );
      imgs.push({ url: secure_url, id: public_id });
    }
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImg[0].path,
    { folder: `${process.env.cloud_folder}/product/${imgsFolder}/default` }
  );
  const product = await Product.create({
    ...req.body,
    imgs,
    defaultImg: { url: secure_url, id: public_id },
    createdBy,
    imgsFolder,
  });

  return res.status(201).json({ sucess: true, results: product });
};

export const update = async (req, res, next) => {
  const product = await Product.findById(req.params.pId);
  if (!product) return next(new Error("Product not found"));
  // console.log(req.params);

  const {
    category,
    subCategory,
    brand,
    price,
    name,
    description,
    availableItems,
    soldItems,
    discount,
  } = req.body;
  product.category = category ? category : product.category;
  product.subCategory = subCategory ? subCategory : product.subCategory;
  product.brand = brand ? brand : product.brand;
  product.price = price ? price : product.price;
  product.name = name ? name : product.name;
  product.description = description ? description : product.description;
  product.dicount = discount ? discount : product.discount;
  product.availableItems = availableItems
    ? availableItems
    : product.availableItems;
  product.soldItems = soldItems ? soldItems : product.soldItems;

// console.log(req.files, "from 76 line ")
// if(!req.files) {console.log("555555"); return res.json({message: "from 75 if "})}
  if (req.files) {
    // console.log(req.files.defaultImg)
    if (req.files.defaultImg) {
      const { secure_url } = await cloudinary.uploader
        .upload(req.files.defaultImg[0].path, {
          public_id: product.defaultImg.id,
        })
        .catch((err) => console.log(err));
      product.defaultImg.url = secure_url;
      await product.save();
    } else if (req.files.imgs) {
      const images = req.files.imgs;
      for (let i = 0; i < images.length; i++) {
        const { secure_url, public_id } = await cloudinary.uploader
          .upload(images[i].path, {
            public_id: product?.imgs[i]?.id,
          })
          .catch((err) => console.log(err));
        if (product?.imgs[i]?.url != public_id)
          product.imgs.push({ id: public_id, url: secure_url });
      }
    } 
  }
  await product.save();
  return res
    .status(200)
    .json({ sucess: true, message: "product updated", results: product });
};

export const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.pId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));
  const imgsId = [product.defaultImg.id];
  product.imgs.forEach((img) => imgsId.push(img.id));
  await cloudinary.api.delete_resources(imgsId);
  await cloudinary.api.delete_folder(
    `${process.env.cloud_folder}/product/${product.imgsFolder}`
  );
  await Product.findByIdAndDelete(req.params.pId);

  return res.json({ success: true, message: "product deleted successfully" });
};

export const get = async (req, res, next) => {
  const { feilds, page, limit, sortBy } = req.query;
  const keyword = req.query.keyword || /[a-zA-Z0-9]/;
  const products = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  })
    .paginate(page, limit)
    .selection(feilds)
    .sort(sortBy);
  if (!products || products.length <= 0)
    return next(new Error("Product not found", { cause: 404 }));
  return res.json({ success: true, message: products });
};

export const getSingleProduct = async (req, res, next) => {
  const id = req.params.pId;
  const product = await Product.findById(id);
  if (!product) return next(new Error("Product not found", { cause: 404 }));
  return res.json({ success: true, message: product });
};

export const getProductsOfCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.catId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));
  const product = await Product.find({ category: req.params.catId });
  if (!product)
    return next(new Error("No Products in This Category", { cause: 404 }));
  return res.json({ success: true, message: product });
};
