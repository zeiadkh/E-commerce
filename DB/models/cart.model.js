import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", unique: true, required: true },
  products: [{
    productId: {type: Types.ObjectId, ref: "Product", unique: true, required: true},
    quantity: {type: Number, default: 1, required: true}
  }],

}, {timestamps: true});

const Cart = mongoose.models.Cart || model("Cart", cartSchema)
export default Cart;