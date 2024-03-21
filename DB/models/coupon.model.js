import mongoose, {Schema, Types, model} from "mongoose";

const couponSchema = new Schema({
    name: {type: String, length: 5,required: true},
    discount: {type: Number, min: 1, max: 100,required: true},
    expireAt: {type: Number, required: true},
    createdBy: {type: Types.ObjectId, ref: "User", required: true}
})

const Coupon = mongoose.models.Coupon || model("Coupon", couponSchema)
export default Coupon