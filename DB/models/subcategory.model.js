import mongoose, { model, Schema, Types } from "mongoose";
import slugify from "slugify";

const subcatSchema = new Schema(
  {
    
    name: { type: String, required: true, unique: true, minlength: 3 },
    img: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", requird: true },
    category: {type: Types.ObjectId, ref: "Category", requird: true}
  },
  { timeseries: true}
);

subcatSchema.virtual("slug").get(function (){return slugify(this.name)})



const Subcategory = mongoose.models.Subcategory || model("Subcategory", subcatSchema);
export default Subcategory;
