import mongoose, { model, Schema, Types } from "mongoose";
import slugify from "slugify";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
    },
    img: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", requird: true },
  },
  { timeseries: true }
);

brandSchema.virtual("slug").get(() => slugify(this.name))



const Brand = mongoose.models.Brand || model("Brand", brandSchema);
export default Brand;
