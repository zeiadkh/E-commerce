import mongoose, { Types, model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, min: 1 },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        afterDiscount: { type: Number, required: true },
      },
    ],
    invoice: { 
      _id: false,
      url: {type: String, },
      id: {type: String, }
      },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    coupon: {
      name: { type: String, },
      id: { type: Types.ObjectId, ref: "Coupon", },
      discount: { type: Number, min: 1, max: 100,  },
    },
    status: {
      type: String,
      enum: ["placed", "shipped", "delivered", "canceled", "refunded", "paid", "paid failed"],
      default: "placed",
    },
    payment: { type: String, enum: ["cash", "visa"], default: "cash" },
  },
  { timestamps: true, toObject: {virtuals: true}, toObject: {virtuals: true} }
);

orderSchema.virtual("finalPrice").get(function(){
  return this.price - ((this.coupon?.discount || 0) / 100 )* this.price
})
export const Order = mongoose.models.Order || model("Order", orderSchema);
export default Order;
