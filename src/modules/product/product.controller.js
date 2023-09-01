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
  if ((!req.files.defaultImg) || (!req.files.imgs))
    return next(
      new Error("You must provide an image to the product", { cause: 400 })
    );
  const imgs = [];
  for (const file of req.files.imgs) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.cloud_folder}/product/${imgsFolder}`,
      }
    );
    imgs.push({ url: secure_url, id: public_id });
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
  const {feilds, page, sortBy } = req.query;
  const keyWord = req.query.keyWord || /[a-zA-Z0-9]/;
  const products = await Product.find({
    $or: [
      { name: { $regex: keyWord, $options: "i" } },
      { description: { $regex: keyWord, $options: "i" } },
    ],
  })
    .paginate(page)
    .selection(feilds)
    .sort(sortBy);
  if (!products || products.length <= 0) return next(new Error("Product not found", { cause: 404 }));
  return res.json({ success: true, message: products });
};

export const getSingleProduct = async (req, res, next) => {
  const id = req.params.pId
  const product = await Product.findById(id)
  if(!product) return next(new Error("Product not found", { cause: 404 }));
  return res.json({ success: true, message: product});
}

export const getProductsOfCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.catId);
  if(!category) return next(new Error("Category not found", {cause: 404}));
  const product = await Product.find({ category: req.params.catId})
  if(!product) return next(new Error("No Products in This Category", { cause: 404}));
  return res.json({ success: true, message: product});
}