import mongoose, { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema({
    content: {type: String, required: true},
    user: {type: Types.ObjectId, ref:"User", required: true},
})

export const Review = mongoose.models.Review || model("Review", reviewSchema);
export default Review;

