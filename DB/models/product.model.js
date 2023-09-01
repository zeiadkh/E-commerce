import mongoose,{model, Schema, Types} from 'mongoose'
import slugify from 'slugify'

export const productSchema = new Schema({
  name: { type: String, required: true, unique: true, minlenght: 3 },
  description: { type: String, required: true, minlenght: 10 },
  price: { type: Number, required: true, min: 1 },
  defaultImg: {
    url: { type: String, required: true },
    id: { type: String, required: true },
  },
  imgs: [
    {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
  ],
  category: { type: Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: Types.ObjectId, ref: "Subcategory", required: true },
  brand: { type: Types.ObjectId, ref: "Brand", required: true },
  discount: { type: Number, default: 0, max: 100 },
  availableItems: { type: Number, min: 1, required: true },
  soldItems: { type: Number, default: 0 },
  createdBy: { type: Types.ObjectId, ref: "User" },
  imgsFolder: String,
},{timestamps: true, strictQuery: true});

productSchema.virtual('slug').get(function (){
    return slugify(this.name)
})
productSchema.virtual('finalPrice').get(function (){
    return this.price - (this.price * (this.discount/100))
})

productSchema.query.paginate = function (page){
    page = !page || page<1 || isNaN(page)? 1 : page
    const limit = 2;
    return this.skip(limit * (page - 1)).limit(limit);
}

productSchema.query.selection = function (feilds){
  if(!feilds) return this
  const modelKeys = Object.keys(productSchema.paths)
  const feildsArray = feilds.split(' ')
  feilds = feildsArray.filter(feild => modelKeys.includes(feild) || modelKeys.includes(feild.split('-')[1]))
  return this.select(feilds)

}

const Product = mongoose.models.Product || model('Product', productSchema)

export default Product