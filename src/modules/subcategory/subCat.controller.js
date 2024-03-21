import Subcategory from "../../../DB/models/subcategory.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const create = async (req, res, next) => {
  const { name } = req.body;
  const createdBy = req.user.id;
  
  if (!req.file) return next(new Error("image required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER}/subCategoryImg` }
  );
  const subCategory = await Subcategory.create({
    name,
    createdBy,
    img: { id: public_id, url: secure_url },
    category: req.params.catId
  });
  return res.json({ sucess: true, results: subCategory,  });
};

export const update = async (req, res, next) => {
  const subCat = await Subcategory.findOne({ _id: req.params.subCatId });
  if (!subCat) return next(new Error("Category not found"));
  if (subCat.createdBy.toString() === req.user._id.toString())
    return next(new Error("not authorized", { cause: 401 }));
  subCat.name = req.body.name ? req.body.name : subCat.name;
  subCat.category = req.params.catId ? req.params.catId : req.body.catId ? req.body.catId: subCat.category;
  await subCat.save();
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subCat.img.id,
    });
    subCat.img.url = secure_url;
    await subCat.save();
  }
  res.json({ sucess: true, result: subCat });
};

export const deleteSubCat = async (req, res, next) => {
  const id = req.params.subCatId;
  const subCat = await Subcategory.findById(id);
  if(!subCat) return next(new Error('Subcategory not found'))
  cloudinary.uploader.destroy(subCat.img.id);

  await Subcategory.findOneAndDelete({ _id: id });
  res.json({ sucess: true, message: "Category deleted" });
};

export const get = async (req, res, next) => {
  const subCats = await Subcategory.find({}).populate({ path: 'category', select: 'name -_id',populate: 'createdBy' });
  if (subCats.length == 0) return next(new Error("No SubCategories yet"));
  res.json({ sucess: true, results: subCats });
};
