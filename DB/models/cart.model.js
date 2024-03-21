import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", unique: true, required: true },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true }}
);

const Cart = mongoose.models.Cart || model("Cart", cartSchema);
export default Cart;
