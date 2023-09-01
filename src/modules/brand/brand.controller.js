import Brand from "../../../DB/models/brand.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const create = async (req, res, next) => {
  const { name } = req.body;
  const createdBy = req.user.id;
  
  if (!req.file) return next(new Error("file required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER}/Brand` }
  );
  const brand = await Brand.create({
    name,
    createdBy,
    img: { id: public_id, url: secure_url },
  });
  // console.log(brand.slug)
  return res.json({ sucess: true, results: brand,  });
};

export const update = async (req, res, next) => {
  const brand = await Brand.findOne({ _id: req.params.brandId });
  if (!brand) return next(new Error("Brand not found"));
  if (brand.createdBy === req.user.id)
    return next(new Error("not authorized", { cause: 401 }));
  brand.name = req.body.name ? req.body.name : brand.name;
  await brand.save();
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: brand.img.id,
    });
    brand.img.url = secure_url;
    await brand.save();
  }
  res.json({ sucess: true, result: brand });
};

export const deleteBrand = async (req, res, next) => {
  const id = req.params.brandId;
  const brand = await Brand.findById(id);
  if(!brand) return next(new Error('Brand not found'))
  cloudinary.uploader.destroy(brand.img.id);

  await Brand.findOneAndDelete({ _id: id });
  res.json({ sucess: true, message: "Category deleted" });
};

export const get = async (req, res, next) => {
  const brands = await Brand.find({})
  if (brands.length == 0) return next(new Error("No SubCategories yet"));
  res.json({ sucess: true, results: brands });
};
